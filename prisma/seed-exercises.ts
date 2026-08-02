import { readFileSync } from "fs";
import { join } from "path";
import { parse } from "csv-parse/sync";
import type { AutonomyLevel, PrismaClient } from "@prisma/client";
import { CSV_IMPORT_VALIDATED_BY } from "../src/lib/exercises/constants";

export { CSV_IMPORT_VALIDATED_BY };

const THEMES = [
  { slug: "habillage", label: "S'habiller", icon: "🧥", displayOrder: 1 },
  { slug: "repas", label: "Manger", icon: "🍽️", displayOrder: 2 },
  { slug: "deplacement", label: "Se déplacer", icon: "🚶", displayOrder: 3 },
  { slug: "fauteuil", label: "Fauteuil", icon: "♿", displayOrder: 4 },
  { slug: "toilette", label: "Toilette / hygiène", icon: "🚿", displayOrder: 5 },
  { slug: "mobilite_lit", label: "Mobilité au lit", icon: "🛏️", displayOrder: 6 },
  { slug: "communication", label: "Communication", icon: "🗣️", displayOrder: 7 },
  { slug: "cognitif", label: "Mémoire / attention", icon: "🧠", displayOrder: 8 },
];

const SCALES: {
  code: string;
  label: string;
  patientEnum: AutonomyLevel;
  displayOrder: number;
}[] = [
  { code: "A", label: "Autonome", patientEnum: "autonome", displayOrder: 1 },
  {
    code: "B",
    label: "Semi-autonome, aide technique, risque faible à modéré",
    patientEnum: "semi_autonome_faible",
    displayOrder: 2,
  },
  {
    code: "C",
    label: "Semi-autonome, aide humaine à proximité, risque élevé",
    patientEnum: "semi_autonome_eleve",
    displayOrder: 3,
  },
  {
    code: "D",
    label: "Dépendant pour les transferts",
    patientEnum: "dependant",
    displayOrder: 4,
  },
  {
    code: "E",
    label: "Grabataire / alité",
    patientEnum: "grabataire",
    displayOrder: 5,
  },
];

const THEME_SLUG: Record<string, string> = {
  "S'habiller": "habillage",
  Manger: "repas",
  "Se déplacer": "deplacement",
  Fauteuil: "fauteuil",
  "Toilette / hygiène": "toilette",
  "Mobilité au lit": "mobilite_lit",
  Communication: "communication",
  "Mémoire / attention": "cognitif",
};

export type CatalogExercise = {
  themeSlug: string;
  levelCode: string;
  tier: number;
  name: string;
  objective: string;
  steps: string[];
  caregiverCan: string[];
  caregiverMustNot: string[];
  estimatedDuration: string | null;
  risks: string | null;
  /** Statut catalogue Prisma dérivé du CSV */
  status: "brouillon" | "a_valider" | "publie";
};

/**
 * Mappe la colonne CSV « Statut » vers l'enum Prisma.
 * - Brouillon IA / À valider / En revue → a_valider
 * - Validé → publie
 * - Brouillon (manuel) → brouillon
 * - Non pertinent → null (skip)
 */
function statusFromCsvStatut(
  statut: string
): "brouillon" | "a_valider" | "publie" | null {
  const s = statut.trim().toLowerCase();
  if (!s) return "a_valider";
  if (/^non pertinent/.test(s)) return null;
  if (/^validé|^valide\b/.test(s)) return "publie";
  if (/^à valider|^a valider|^en revue|brouillon ia/.test(s)) return "a_valider";
  if (s.startsWith("brouillon")) return "brouillon";
  return "a_valider";
}

function parseSteps(text: string): string[] {
  if (!text?.trim()) return [];
  const parts = text
    .split(/\n?\s*\d+\.\s*/)
    .map((p) => p.trim().replace(/^"|"$/g, "").trim())
    .filter(Boolean);
  return parts.length > 0 ? parts : [text.trim()];
}

function asList(text: string): string[] {
  const t = text?.trim();
  return t ? [t] : [];
}

/** Charge le référentiel CSV (source de vérité produit). */
export function loadReferentielFromCsv(
  csvPath = join(process.cwd(), "docs/referentiel/Referentiel_Exercices.csv")
): CatalogExercise[] {
  const raw = readFileSync(csvPath, "utf-8");
  const rows = parse(raw, {
    columns: true,
    skip_empty_lines: true,
    relax_quotes: true,
    relax_column_count: true,
  }) as Record<string, string>[];

  const out: CatalogExercise[] = [];
  for (const r of rows) {
    const name = (r["Nom de l'exercice"] || "").trim();
    const statut = (r["Statut"] || "").trim();
    if (!name) continue;
    const mapped = statusFromCsvStatut(statut);
    if (mapped === null) continue;

    const themeLabel = (r["Thème"] || "").trim();
    const slug = THEME_SLUG[themeLabel];
    const levelCode = (r["Niveau autonomie"] || "").trim();
    if (!slug || !levelCode) continue;

    out.push({
      themeSlug: slug,
      levelCode,
      tier: 1,
      name,
      objective: (r["Objectif de l'exercice"] || "").trim(),
      steps: parseSteps(r["Détail / étapes (guidance verbale)"] || ""),
      caregiverCan: asList(r["Ce que l'aidant peut faire"] || ""),
      caregiverMustNot: asList(r["Ce que l'aidant ne doit pas faire"] || ""),
      estimatedDuration: (r["Durée indicative"] || "").trim() || null,
      risks: (r["Risques / contre-indications"] || "").trim() || null,
      status: mapped,
    });
  }
  return out;
}

export const CATALOG_THEMES = THEMES;
export const CATALOG_SCALES = SCALES;

export async function seedExerciseCatalog(prisma: PrismaClient) {
  await prisma.exerciseAttempt.deleteMany();
  await prisma.professionalAlert.deleteMany();
  await prisma.patientExercise.deleteMany();
  await prisma.exercise.deleteMany();
  await prisma.theme.deleteMany();
  await prisma.autonomyScale.deleteMany();

  await ensureThemesAndScales(prisma);
  await syncExercisesFromReferentiel(prisma);
  return { ok: true };
}

/**
 * Remplit / met à jour le catalogue depuis le CSV — sans supprimer les patients.
 * À appeler au build Vercel et en secours côté app.
 */
export async function ensureExerciseCatalog(prisma: PrismaClient) {
  await ensureThemesAndScales(prisma);
  const { upserted, realigned } = await syncExercisesFromReferentiel(prisma);
  await ensureDemoPatientExercises(prisma);
  return { seeded: upserted > 0, upserted, realigned };
}

async function ensureThemesAndScales(prisma: PrismaClient) {
  for (const t of THEMES) {
    await prisma.theme.upsert({
      where: { slug: t.slug },
      create: t,
      // Ne pas écraser les éditions admin fondateur
      update: {},
    });
  }
  for (const s of SCALES) {
    const existing = await prisma.autonomyScale.findUnique({
      where: { code: s.code },
    });
    if (!existing) {
      await prisma.autonomyScale.create({ data: s });
    }
  }
}

async function syncExercisesFromReferentiel(prisma: PrismaClient) {
  const catalog = loadReferentielFromCsv();
  const themes = await prisma.theme.findMany();
  const scales = await prisma.autonomyScale.findMany();
  const themeBySlug = Object.fromEntries(themes.map((t) => [t.slug, t]));
  const scaleByCode = Object.fromEntries(scales.map((s) => [s.code, s]));

  let upserted = 0;
  let realigned = 0;

  for (const ex of catalog) {
    const theme = themeBySlug[ex.themeSlug];
    const scale = scaleByCode[ex.levelCode];
    if (!theme || !scale) continue;

    const existing = await prisma.exercise.findFirst({
      where: {
        themeId: theme.id,
        autonomyScaleId: scale.id,
        tier: ex.tier,
      },
      orderBy: { updatedAt: "desc" },
    });

    if (existing) {
      // Ancien import a publié les brouillons IA : les remettre en file à valider
      // sans toucher aux exercices validés par un admin produit.
      if (
        ex.status === "a_valider" &&
        existing.status !== "a_valider" &&
        existing.status !== "archive" &&
        (existing.validatedBy === CSV_IMPORT_VALIDATED_BY ||
          existing.validatedBy === null)
      ) {
        await prisma.exercise.update({
          where: { id: existing.id },
          data: {
            status: "a_valider",
            validatedBy: null,
            validatedAt: null,
          },
        });
        realigned += 1;
      }
      continue;
    }

    const created = await prisma.exercise.create({
      data: {
        themeId: theme.id,
        autonomyScaleId: scale.id,
        tier: ex.tier,
        name: ex.name,
        objective: ex.objective,
        steps: JSON.stringify(ex.steps),
        caregiverCan: JSON.stringify(ex.caregiverCan),
        caregiverMustNot: JSON.stringify(ex.caregiverMustNot),
        estimatedDuration: ex.estimatedDuration,
        risks: ex.risks,
        crossesAutonomyLevel: false,
        alertOnFailure: ex.levelCode === "A",
        status: ex.status,
        validatedBy:
          ex.status === "publie" ? CSV_IMPORT_VALIDATED_BY : null,
        validatedAt: ex.status === "publie" ? new Date() : null,
        onPartialExerciseId: null,
      },
    });
    await prisma.exercise.update({
      where: { id: created.id },
      data: { onPartialExerciseId: created.id },
    });
    upserted += 1;
  }

  return { upserted, realigned, catalogCount: catalog.length };
}

/** Active les exercices publiés (palier 1) au niveau de chaque patient suivi. */
async function ensureDemoPatientExercises(prisma: PrismaClient) {
  const patients = await prisma.patient.findMany({
    where: { caregivers: { some: {} } },
  });

  for (const patient of patients) {
    const code =
      patient.autonomyLevel === "autonome"
        ? "A"
        : patient.autonomyLevel === "semi_autonome_faible"
          ? "B"
          : patient.autonomyLevel === "semi_autonome_eleve"
            ? "C"
            : patient.autonomyLevel === "dependant"
              ? "D"
              : "E";

    const scale = await prisma.autonomyScale.findUnique({ where: { code } });
    if (!scale) continue;

    const candidates = await prisma.exercise.findMany({
      where: {
        status: "publie",
        autonomyScaleId: scale.id,
        tier: 1,
      },
    });

    const pro = await prisma.professional.findFirst({
      where: { establishmentId: patient.establishmentId },
    });

    for (const exercise of candidates) {
      const existingCurrent = await prisma.patientExercise.findFirst({
        where: {
          patientId: patient.id,
          isCurrent: true,
          exercise: { themeId: exercise.themeId },
        },
      });
      if (existingCurrent) continue;

      await prisma.patientExercise.upsert({
        where: {
          patientId_exerciseId: {
            patientId: patient.id,
            exerciseId: exercise.id,
          },
        },
        create: {
          patientId: patient.id,
          exerciseId: exercise.id,
          currentStatus: "actif",
          activatedById: pro?.id ?? null,
          activatedAt: new Date(),
          isCurrent: true,
        },
        update: {
          currentStatus: "actif",
          isCurrent: true,
          activatedAt: new Date(),
        },
      });
    }
  }
}
