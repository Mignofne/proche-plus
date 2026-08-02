import type { AutonomyLevel, PrismaClient } from "@prisma/client";
import { AUTONOMY_ENUM_TO_CODE } from "@/lib/exercises/mapping";

/**
 * Pour chaque thème ayant un exercice publié au niveau du patient (palier 1) :
 * - active l'exercice s'il n'y a pas encore de courant ;
 * - remplace un courant qui pointe vers un exercice non publié (ex. ancien a_valider).
 * Idempotent — Mode visite + démo.
 */
export async function ensurePatientExercisesForLevel(
  prisma: PrismaClient,
  patientId: string,
  autonomyLevel: AutonomyLevel
) {
  const code = AUTONOMY_ENUM_TO_CODE[autonomyLevel];
  const scale = await prisma.autonomyScale.findUnique({ where: { code } });
  if (!scale) return { activated: 0, repaired: 0 };

  const candidates = await prisma.exercise.findMany({
    where: {
      status: "publie",
      autonomyScaleId: scale.id,
      tier: 1,
      theme: { active: true },
    },
    include: { theme: true },
    orderBy: [{ theme: { displayOrder: "asc" } }, { name: "asc" }],
  });

  if (candidates.length === 0) return { activated: 0, repaired: 0 };

  const pro = await prisma.professional.findFirst({
    where: {
      establishment: { patients: { some: { id: patientId } } },
    },
  });

  // Un candidat par thème (premier publié palier 1 au niveau)
  const byTheme = new Map<string, (typeof candidates)[number]>();
  for (const exercise of candidates) {
    if (!byTheme.has(exercise.themeId)) {
      byTheme.set(exercise.themeId, exercise);
    }
  }

  let activated = 0;
  let repaired = 0;

  for (const exercise of byTheme.values()) {
    const existingCurrent = await prisma.patientExercise.findFirst({
      where: {
        patientId,
        isCurrent: true,
        exercise: { themeId: exercise.themeId },
      },
      include: { exercise: { select: { id: true, status: true } } },
    });

    if (existingCurrent) {
      if (
        existingCurrent.exercise.status === "publie" &&
        existingCurrent.exerciseId === exercise.id
      ) {
        continue;
      }
      if (existingCurrent.exercise.status === "publie") {
        // Déjà un autre exercice publié courant pour ce thème — on conserve
        continue;
      }
      // Courant obsolète (brouillon / à valider / archive) → bascule vers le publié
      await prisma.patientExercise.update({
        where: { id: existingCurrent.id },
        data: { isCurrent: false },
      });
      repaired += 1;
    }

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

  return { activated, repaired };
}
