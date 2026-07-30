import type {
  AutonomyLevel,
  ExerciseAttemptOutcome,
  Prisma,
} from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { AUTONOMY_ENUM_TO_CODE } from "./mapping";
import {
  alertMessageFor,
  decideNextExercise,
  type TransitionOutcome,
} from "./transitions";

const exerciseInclude = {
  theme: true,
  autonomyScale: true,
} satisfies Prisma.ExerciseInclude;

export type ExerciseWithRelations = Prisma.ExerciseGetPayload<{
  include: typeof exerciseInclude;
}>;

export async function listActiveThemesWithPublishedExercises() {
  return prisma.theme.findMany({
    where: {
      active: true,
      exercises: { some: { status: "publie" } },
    },
    orderBy: { displayOrder: "asc" },
  });
}

export async function listPublishedExercisesForTheme(themeId: string) {
  return prisma.exercise.findMany({
    where: { themeId, status: "publie" },
    include: exerciseInclude,
    orderBy: [
      { autonomyScale: { displayOrder: "asc" } },
      { tier: "asc" },
    ],
  });
}

export async function getCurrentPatientExercises(patientId: string) {
  return prisma.patientExercise.findMany({
    where: { patientId, isCurrent: true },
    include: {
      exercise: { include: exerciseInclude },
    },
  });
}

export async function getThemesAvailableForCaregiver(patientId: string) {
  const current = await getCurrentPatientExercises(patientId);
  const themeIds = new Set(current.map((pe) => pe.exercise.themeId));
  if (themeIds.size === 0) return [];
  return prisma.theme.findMany({
    where: { id: { in: [...themeIds] }, active: true },
    orderBy: { displayOrder: "asc" },
  });
}

export async function getCurrentExerciseForTheme(
  patientId: string,
  themeId: string
) {
  return prisma.patientExercise.findFirst({
    where: {
      patientId,
      isCurrent: true,
      exercise: { themeId, status: "publie" },
    },
    include: {
      exercise: { include: exerciseInclude },
    },
  });
}

/** Active un exercice publié pour un patient (rend le thème visible côté aidant). */
export async function activateExerciseForPatient(input: {
  patientId: string;
  exerciseId: string;
  professionalId: string;
  makeCurrent?: boolean;
}) {
  const exercise = await prisma.exercise.findFirst({
    where: { id: input.exerciseId, status: "publie" },
    include: { theme: true },
  });
  if (!exercise) throw new Error("Exercice introuvable ou non publié");

  const makeCurrent = input.makeCurrent ?? true;

  return prisma.$transaction(async (tx) => {
    if (makeCurrent) {
      const others = await tx.patientExercise.findMany({
        where: {
          patientId: input.patientId,
          isCurrent: true,
          exercise: { themeId: exercise.themeId },
        },
      });
      for (const pe of others) {
        await tx.patientExercise.update({
          where: { id: pe.id },
          data: { isCurrent: false },
        });
      }
    }

    return tx.patientExercise.upsert({
      where: {
        patientId_exerciseId: {
          patientId: input.patientId,
          exerciseId: input.exerciseId,
        },
      },
      create: {
        patientId: input.patientId,
        exerciseId: input.exerciseId,
        currentStatus: "actif",
        activatedById: input.professionalId,
        activatedAt: new Date(),
        isCurrent: makeCurrent,
      },
      update: {
        currentStatus: "actif",
        activatedById: input.professionalId,
        activatedAt: new Date(),
        isCurrent: makeCurrent,
      },
      include: { exercise: { include: exerciseInclude } },
    });
  });
}

export async function recordExerciseOutcome(input: {
  patientExerciseId: string;
  outcome: TransitionOutcome;
  note?: string | null;
}) {
  const pe = await prisma.patientExercise.findUnique({
    where: { id: input.patientExerciseId },
    include: {
      exercise: true,
      patient: true,
    },
  });
  if (!pe) throw new Error("Exercice patient introuvable");

  const decision = decideNextExercise(
    {
      id: pe.exercise.id,
      autonomyScaleId: pe.exercise.autonomyScaleId,
      onSuccessExerciseId: pe.exercise.onSuccessExerciseId,
      onPartialExerciseId: pe.exercise.onPartialExerciseId,
      onFailureExerciseId: pe.exercise.onFailureExerciseId,
      crossesAutonomyLevel: pe.exercise.crossesAutonomyLevel,
      alertOnFailure: pe.exercise.alertOnFailure,
    },
    input.outcome
  );

  const statusMap: Record<TransitionOutcome, "reussi" | "essai" | "echec"> = {
    reussi: "reussi",
    essai: "essai",
    echec: "echec",
  };

  await prisma.$transaction(async (tx) => {
    await tx.exerciseAttempt.create({
      data: {
        patientExerciseId: pe.id,
        outcome: input.outcome as ExerciseAttemptOutcome,
        note: input.note ?? null,
      },
    });

    await tx.patientExercise.update({
      where: { id: pe.id },
      data: { currentStatus: statusMap[input.outcome] },
    });

    if (decision.kind === "alert_only") {
      await tx.professionalAlert.create({
        data: {
          type: decision.alertType,
          patientId: pe.patientId,
          exerciseId: pe.exerciseId,
          nextExerciseId: decision.nextExerciseId,
          message: alertMessageFor(decision.alertType, pe.exercise.name),
        },
      });
      // L'exercice courant reste jusqu'à validation pro
      return;
    }

    if (decision.kind === "stay") {
      await tx.patientExercise.update({
        where: { id: pe.id },
        data: { isCurrent: true, currentStatus: "actif" },
      });
      return;
    }

    // advance ou fallback
    if (
      decision.kind === "fallback" &&
      decision.alertProfessional &&
      decision.alertType
    ) {
      await tx.professionalAlert.create({
        data: {
          type: decision.alertType,
          patientId: pe.patientId,
          exerciseId: pe.exerciseId,
          nextExerciseId: decision.nextExerciseId,
          message: alertMessageFor(decision.alertType, pe.exercise.name),
        },
      });
    }

    const nextId = decision.nextExerciseId;
    await tx.patientExercise.update({
      where: { id: pe.id },
      data: { isCurrent: false },
    });

    await tx.patientExercise.upsert({
      where: {
        patientId_exerciseId: {
          patientId: pe.patientId,
          exerciseId: nextId,
        },
      },
      create: {
        patientId: pe.patientId,
        exerciseId: nextId,
        currentStatus: "actif",
        activatedById: pe.activatedById,
        activatedAt: new Date(),
        isCurrent: true,
      },
      update: {
        currentStatus: "actif",
        isCurrent: true,
      },
    });
  });

  return decision;
}

export async function suggestExerciseForPatientLevel(
  themeId: string,
  patientAutonomy: AutonomyLevel
) {
  const code = AUTONOMY_ENUM_TO_CODE[patientAutonomy];
  const scale = await prisma.autonomyScale.findUnique({ where: { code } });
  if (!scale) return null;
  return prisma.exercise.findFirst({
    where: {
      themeId,
      autonomyScaleId: scale.id,
      status: "publie",
      tier: 1,
    },
    include: exerciseInclude,
    orderBy: { tier: "asc" },
  });
}

export async function treatAlert(input: {
  alertId: string;
  professionalId: string;
  activateNext: boolean;
}) {
  const alert = await prisma.professionalAlert.findUnique({
    where: { id: input.alertId },
  });
  if (!alert || alert.status !== "ouverte") {
    throw new Error("Alerte introuvable ou déjà traitée");
  }

  await prisma.$transaction(async (tx) => {
    await tx.professionalAlert.update({
      where: { id: alert.id },
      data: {
        status: "traitee",
        treatedById: input.professionalId,
        treatedAt: new Date(),
      },
    });

    if (input.activateNext && alert.nextExerciseId) {
      const next = await tx.exercise.findUnique({
        where: { id: alert.nextExerciseId },
      });
      if (!next) return;

      const currents = await tx.patientExercise.findMany({
        where: {
          patientId: alert.patientId,
          isCurrent: true,
          exercise: { themeId: next.themeId },
        },
      });
      for (const pe of currents) {
        await tx.patientExercise.update({
          where: { id: pe.id },
          data: { isCurrent: false },
        });
      }

      await tx.patientExercise.upsert({
        where: {
          patientId_exerciseId: {
            patientId: alert.patientId,
            exerciseId: next.id,
          },
        },
        create: {
          patientId: alert.patientId,
          exerciseId: next.id,
          currentStatus: "actif",
          activatedById: input.professionalId,
          activatedAt: new Date(),
          isCurrent: true,
        },
        update: {
          currentStatus: "actif",
          activatedById: input.professionalId,
          activatedAt: new Date(),
          isCurrent: true,
        },
      });
    }
  });
}
