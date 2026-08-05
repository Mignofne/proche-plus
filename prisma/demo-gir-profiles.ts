import type { AutonomyLevel, PrismaClient } from "@prisma/client";
import { ensurePatientExercisesForLevel } from "../src/lib/exercises/activate-for-level";
import { getProfile } from "../src/lib/patient-profiles";

/** Aidant démo historique — reçoit les 5 proches A–E. */
export const DEMO_AIDANT_EMAIL = "jean.martin@demo.fr";

/**
 * 5 proches (niveaux A–E / GIR) rattachés au même aidant démo.
 * Le niveau C réutilise Marie Martin (transmission + E2E existants).
 */
export const DEMO_GIR_PROFILES = [
  {
    code: "A",
    patientFirstName: "Léa",
    patientLastName: "Autonome",
    autonomyLevel: "autonome" as AutonomyLevel,
  },
  {
    code: "B",
    patientFirstName: "Bruno",
    patientLastName: "Semi-B",
    autonomyLevel: "semi_autonome_faible" as AutonomyLevel,
  },
  {
    code: "C",
    patientFirstName: "Marie",
    patientLastName: "Martin",
    autonomyLevel: "semi_autonome_eleve" as AutonomyLevel,
  },
  {
    code: "D",
    patientFirstName: "Dylan",
    patientLastName: "Dépendant",
    autonomyLevel: "dependant" as AutonomyLevel,
  },
  {
    code: "E",
    patientFirstName: "Émile",
    patientLastName: "Grabataire",
    autonomyLevel: "grabataire" as AutonomyLevel,
  },
] as const;

/** Anciens comptes séparés (abandonnés) — nettoyés si présents. */
const LEGACY_SEPARATE_AIDANT_EMAILS = [
  "aidant.a@procheplus.demo",
  "aidant.b@procheplus.demo",
  "aidant.c@procheplus.demo",
  "aidant.d@procheplus.demo",
  "aidant.e@procheplus.demo",
] as const;

/**
 * Idempotent — rattache 5 proches A–E à jean.martin@demo.fr et active
 * les exercices publiés palier 1 au bon niveau.
 */
export async function ensureDemoGirProfiles(prisma: PrismaClient) {
  // Nettoyage des comptes séparés créés par erreur (si déjà déployés)
  for (const email of LEGACY_SEPARATE_AIDANT_EMAILS) {
    const legacy = await prisma.user.findUnique({
      where: { email },
      include: {
        caregiver: { include: { patients: true } },
      },
    });
    if (!legacy) continue;
    if (legacy.caregiver) {
      for (const link of legacy.caregiver.patients) {
        await prisma.patient.delete({ where: { id: link.patientId } });
      }
    }
    await prisma.user.delete({ where: { id: legacy.id } });
  }

  let establishment = await prisma.establishment.findFirst({
    where: { name: { contains: "Val-de-Marne" } },
  });
  if (!establishment) {
    establishment = await prisma.establishment.findFirst({
      orderBy: { createdAt: "asc" },
    });
  }
  if (!establishment) {
    establishment = await prisma.establishment.create({
      data: {
        name: "Centre de rééducation Val-de-Marne",
        autonomyReviewIntervalDays: 15,
      },
    });
  }

  const pro = await prisma.professional.findFirst({
    where: { establishmentId: establishment.id },
    select: { id: true, userId: true },
  });

  const aidantUser = await prisma.user.findUnique({
    where: { email: DEMO_AIDANT_EMAIL },
    include: {
      caregiver: {
        include: {
          patients: { include: { patient: true } },
        },
      },
    },
  });

  if (!aidantUser?.caregiver) {
    throw new Error(
      `Aidant démo introuvable (${DEMO_AIDANT_EMAIL}) — lancez d'abord le seed principal.`
    );
  }

  const caregiverId = aidantUser.caregiver.id;
  const linked = [...aidantUser.caregiver.patients];
  const created: string[] = [];
  const updated: string[] = [];

  for (const profile of DEMO_GIR_PROFILES) {
    const girLevel =
      getProfile(profile.autonomyLevel)?.girSuggest ?? undefined;
    const now = new Date();

    const byName = linked.find(
      (l) =>
        l.patient.firstName === profile.patientFirstName &&
        l.patient.lastName === profile.patientLastName
    );
    const byLevel = linked.find(
      (l) => l.patient.autonomyLevel === profile.autonomyLevel
    );
    const existing = byName ?? byLevel;

    let patientId: string;
    if (existing) {
      patientId = existing.patientId;
      await prisma.patient.update({
        where: { id: patientId },
        data: {
          firstName: profile.patientFirstName,
          lastName: profile.patientLastName,
          autonomyLevel: profile.autonomyLevel,
          autonomyLevelStatus: "confirme",
          autonomyLevelSource: "professionnel",
          autonomyLevelSetAt: now,
          girLevel: girLevel ?? null,
          establishmentId: establishment.id,
        },
      });
      existing.patient.firstName = profile.patientFirstName;
      existing.patient.lastName = profile.patientLastName;
      existing.patient.autonomyLevel = profile.autonomyLevel;
      updated.push(`${profile.code}:${profile.patientFirstName}`);
    } else {
      const patient = await prisma.patient.create({
        data: {
          firstName: profile.patientFirstName,
          lastName: profile.patientLastName,
          autonomyLevel: profile.autonomyLevel,
          autonomyLevelStatus: "confirme",
          autonomyLevelSource: "professionnel",
          autonomyLevelSetAt: now,
          autonomyLevelReviewDueAt: new Date(
            Date.now() + 15 * 24 * 60 * 60 * 1000
          ),
          girLevel: girLevel ?? null,
          establishmentId: establishment.id,
        },
      });
      patientId = patient.id;
      const link = await prisma.patientCaregiver.create({
        data: {
          patientId,
          caregiverId,
          relationship: profile.code === "C" ? "conjoint" : "proche",
          isPrimary: profile.code === "C",
        },
        include: { patient: true },
      });
      linked.push(link);
      await prisma.autonomyLevelHistory.create({
        data: {
          patientId,
          autonomyLevel: profile.autonomyLevel,
          source: "professionnel",
          setByUserId: pro?.userId ?? null,
        },
      });
      created.push(`${profile.code}:${profile.patientFirstName}`);
    }

    await ensurePatientExercisesForLevel(
      prisma,
      patientId,
      profile.autonomyLevel
    );
  }

  return {
    establishmentId: establishment.id,
    caregiverEmail: DEMO_AIDANT_EMAIL,
    created,
    updated,
    profiles: DEMO_GIR_PROFILES.length,
  };
}
