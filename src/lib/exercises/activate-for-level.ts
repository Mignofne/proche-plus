import type { AutonomyLevel, PrismaClient } from "@prisma/client";
import { AUTONOMY_ENUM_TO_CODE } from "@/lib/exercises/mapping";

/**
 * Pour chaque thème ayant un exercice publié au niveau du patient,
 * active cet exercice (palier 1) s'il n'y a pas déjà un exercice courant
 * pour ce thème. Idempotent — utilisé pour la démo et les nouveaux patients.
 */
export async function ensurePatientExercisesForLevel(
  prisma: PrismaClient,
  patientId: string,
  autonomyLevel: AutonomyLevel
) {
  const code = AUTONOMY_ENUM_TO_CODE[autonomyLevel];
  const scale = await prisma.autonomyScale.findUnique({ where: { code } });
  if (!scale) return { activated: 0 };

  const candidates = await prisma.exercise.findMany({
    where: {
      status: "publie",
      autonomyScaleId: scale.id,
      tier: 1,
    },
    include: { theme: true },
  });

  if (candidates.length === 0) return { activated: 0 };

  const pro = await prisma.professional.findFirst({
    where: {
      establishment: { patients: { some: { id: patientId } } },
    },
  });

  let activated = 0;

  for (const exercise of candidates) {
    const existingCurrent = await prisma.patientExercise.findFirst({
      where: {
        patientId,
        isCurrent: true,
        exercise: { themeId: exercise.themeId },
      },
    });
    if (existingCurrent) continue;

    await prisma.patientExercise.upsert({
      where: {
        patientId_exerciseId: {
          patientId,
          exerciseId: exercise.id,
        },
      },
      create: {
        patientId,
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
        activatedById: pro?.id ?? null,
      },
    });
    activated += 1;
  }

  return { activated };
}
