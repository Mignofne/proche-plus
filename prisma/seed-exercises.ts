import { readFileSync } from "fs";
import { join } from "path";
import { parse } from "csv-parse/sync";
import type { AutonomyLevel, PrismaClient } from "@prisma/client";

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

function normalizeExerciseName(name: string): string {
  return name.trim().toLowerCase().replace(/\s+/g, " ");
}

/**
 * CSV → statut catalogue :
 * - Validé / En revue → publie
 * - À valider → a_valider
 * - Brouillon… → brouillon
 */
function statusFromCsvStatut(
  statut: string
): "brouillon" | "a_valider" | "publie" | null {
  const s = statut.trim().toLowerCase();
  if (!s || /^non pertinent/i.test(s)) return null;
  if (/^à valider|^a valider/.test(s)) return "a_valider";
  if (s.startsWith("brouillon")) return "brouillon";
  if (/validé|valide|en revue/.test(s)) return "publie";
  return "brouillon";
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
  const seen = new Set<string>();

  for (const r of rows) {
    const name = (r["Nom de l'exercice"] || "").trim();
    const statut = (r["Statut"] || "").trim();
    if (!name) continue;
    if (/^non pertinent/i.test(statut)) continue;

    const themeLabel = (r["Thème"] || "").trim();
    const slug = THEME_SLUG[themeLabel];
    const levelCode = (r["Niveau autonomie"] || "").trim();
    if (!slug || !levelCode) continue;

    const tierRaw = Number.parseInt(String(r["Palier"] || "1"), 10);
    const tier = Number.isFinite(tierRaw) && tierRaw > 0 ? tierRaw : 1;
    const mapped = statusFromCsvStatut(statut);
    if (!mapped) continue;

    const dedupeKey = `${slug}|${levelCode}|${tier}|${normalizeExerciseName(name)}`;
    if (seen.has(dedupeKey)) continue;
    seen.add(dedupeKey);

    out.push({
      themeSlug: slug,
      levelCode,
      tier,
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
  // Preview peut avoir écrit status=a_valider incompatible avec le client prod
  try {
    await prisma.$executeRawUnsafe(`
      UPDATE "Exercise"
      SET status = 'brouillon'
      WHERE status::text = 'a_valider'
    `);
  } catch {
    // ignore — SQLite / valeur absente
  }
  await ensureThemesAndScales(prisma);
  const { upserted } = await syncExercisesFromReferentiel(prisma);
  await ensureDemoPatientExercises(prisma);
  return { seeded: upserted > 0, upserted };
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
  let statusPatched = 0;
  let skippedDuplicates = 0;

  // Index DB pour anti-doublon (thème × niveau × palier × nom)
  const existingAll = await prisma.exercise.findMany({
    select: {
      id: true,
      themeId: true,
      autonomyScaleId: true,
      tier: true,
      name: true,
      status: true,
    },
  });
  const byKey = new Map(
    existingAll.map((e) => [
      `${e.themeId}|${e.autonomyScaleId}|${e.tier}|${normalizeExerciseName(e.name)}`,
      e,
    ])
  );
  const byName = new Map(
    existingAll.map((e) => [normalizeExerciseName(e.name), e])
  );

  for (const ex of catalog) {
    const theme = themeBySlug[ex.themeSlug];
    const scale = scaleByCode[ex.levelCode];
    if (!theme || !scale) continue;

    const key = `${theme.id}|${scale.id}|${ex.tier}|${normalizeExerciseName(ex.name)}`;
    const nameKey = normalizeExerciseName(ex.name);
    const existing = byKey.get(key) || byName.get(nameKey);

    if (existing) {
      // Remonter brouillon → a_valider pour les ajouts CSV « À valider »
      // sans toucher publie/archive ni les validations admin.
      if (existing.status === "brouillon" && ex.status === "a_valider") {
        await prisma.exercise.update({
          where: { id: existing.id },
          data: { status: "a_valider" },
        });
        existing.status = "a_valider";
        statusPatched += 1;
      } else {
        skippedDuplicates += 1;
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
        validatedBy: ex.status === "publie" ? "Référentiel APA (import CSV)" : null,
        validatedAt: ex.status === "publie" ? new Date() : null,
        onPartialExerciseId: null,
      },
    });
    await prisma.exercise.update({
      where: { id: created.id },
      data: { onPartialExerciseId: created.id },
    });
    byKey.set(key, {
      id: created.id,
      themeId: theme.id,
      autonomyScaleId: scale.id,
      tier: ex.tier,
      name: ex.name,
      status: ex.status,
    });
    byName.set(nameKey, byKey.get(key)!);
    upserted += 1;
  }

  return {
    upserted,
    statusPatched,
    skippedDuplicates,
    catalogCount: catalog.length,
  };
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
