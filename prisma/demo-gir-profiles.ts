import bcrypt from "bcryptjs";
import type { AutonomyLevel, PrismaClient } from "@prisma/client";
import { ensurePatientExercisesForLevel } from "../src/lib/exercises/activate-for-level";
import { getProfile } from "../src/lib/patient-profiles";

/** Comptes aidant démo — un par niveau A–E (GIR simplifié) pour tests prod / local. */
export const DEMO_GIR_PROFILES = [
  {
    code: "A",
    email: "aidant.a@procheplus.demo",
    caregiverFirstName: "Test",
    caregiverLastName: "Aidant A",
    patientFirstName: "Léa",
    patientLastName: "Autonome",
    autonomyLevel: "autonome" as AutonomyLevel,
  },
  {
    code: "B",
    email: "aidant.b@procheplus.demo",
    caregiverFirstName: "Test",
    caregiverLastName: "Aidant B",
    patientFirstName: "Bruno",
    patientLastName: "Semi-B",
    autonomyLevel: "semi_autonome_faible" as AutonomyLevel,
  },
  {
    code: "C",
    email: "aidant.c@procheplus.demo",
    caregiverFirstName: "Test",
    caregiverLastName: "Aidant C",
    patientFirstName: "Chloé",
    patientLastName: "Semi-C",
    autonomyLevel: "semi_autonome_eleve" as AutonomyLevel,
  },
  {
    code: "D",
    email: "aidant.d@procheplus.demo",
    caregiverFirstName: "Test",
    caregiverLastName: "Aidant D",
    patientFirstName: "Dylan",
    patientLastName: "Dépendant",
    autonomyLevel: "dependant" as AutonomyLevel,
  },
  {
    code: "E",
    email: "aidant.e@procheplus.demo",
    caregiverFirstName: "Test",
    caregiverLastName: "Aidant E",
    patientFirstName: "Émile",
    patientLastName: "Grabataire",
    autonomyLevel: "grabataire" as AutonomyLevel,
  },
] as const;

export const DEMO_GIR_PASSWORD = "demo1234";

/**
 * Idempotent — crée / aligne 5 aidants + proches (niveaux A–E) et active
 * les exercices publiés palier 1 au bon niveau.
 */
export async function ensureDemoGirProfiles(prisma: PrismaClient) {
  const passwordHash = await bcrypt.hash(DEMO_GIR_PASSWORD, 8);

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

  const created: string[] = [];
  const updated: string[] = [];

  for (const profile of DEMO_GIR_PROFILES) {
    const girLevel =
      getProfile(profile.autonomyLevel)?.girSuggest ?? undefined;
    const now = new Date();

    let user = await prisma.user.findUnique({
      where: { email: profile.email },
      include: {
        caregiver: {
          include: {
            patients: { include: { patient: true } },
          },
        },
      },
    });

    if (!user) {
      user = await prisma.user.create({
        data: {
          email: profile.email,
          firstName: profile.caregiverFirstName,
          lastName: profile.caregiverLastName,
          passwordHash,
          onboardingDone: true,
          caregiver: { create: { status: "actif" } },
        },
        include: {
          caregiver: {
            include: {
              patients: { include: { patient: true } },
            },
          },
        },
      });
      created.push(profile.email);
    } else {
      await prisma.user.update({
        where: { id: user.id },
        data: {
          firstName: profile.caregiverFirstName,
          lastName: profile.caregiverLastName,
          passwordHash,
          onboardingDone: true,
        },
      });
      if (!user.caregiver) {
        await prisma.caregiver.create({
          data: { userId: user.id, status: "actif" },
        });
        user = await prisma.user.findUniqueOrThrow({
          where: { id: user.id },
          include: {
            caregiver: {
              include: {
                patients: { include: { patient: true } },
              },
            },
          },
        });
      }
      updated.push(profile.email);
    }

    const caregiverId = user.caregiver!.id;
    const existingLink = user.caregiver!.patients[0];

    let patientId: string;
    if (existingLink) {
      patientId = existingLink.patientId;
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
      await prisma.patientCaregiver.create({
        data: {
          patientId,
          caregiverId,
          relationship: "proche",
          isPrimary: true,
        },
      });
      await prisma.autonomyLevelHistory.create({
        data: {
          patientId,
          autonomyLevel: profile.autonomyLevel,
          source: "professionnel",
          setByUserId: pro?.userId ?? null,
        },
      });
    }

    await ensurePatientExercisesForLevel(
      prisma,
      patientId,
      profile.autonomyLevel
    );
  }

  return {
    establishmentId: establishment.id,
    created,
    updated,
    profiles: DEMO_GIR_PROFILES.length,
  };
}
