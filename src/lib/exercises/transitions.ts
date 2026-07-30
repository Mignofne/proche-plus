/**
 * Règles de transition matrice évolutive (specs §11).
 * Pure — testable sans BDD.
 */

export type TransitionOutcome = "reussi" | "essai" | "echec";

export type TransitionExerciseRef = {
  id: string;
  autonomyScaleId: string;
  onSuccessExerciseId: string | null;
  onPartialExerciseId: string | null;
  onFailureExerciseId: string | null;
  crossesAutonomyLevel: boolean;
  alertOnFailure: boolean;
};

export type TransitionDecision =
  | { kind: "stay"; nextExerciseId: string; reason: "repeat" }
  | {
      kind: "advance";
      nextExerciseId: string;
      requiresProfessionalValidation: boolean;
    }
  | {
      kind: "fallback";
      nextExerciseId: string;
      alertProfessional: boolean;
      alertType: "regression_suspected" | null;
    }
  | {
      kind: "alert_only";
      alertType: "level_change_proposed" | "no_fallback" | "regression_suspected";
      nextExerciseId: string | null;
    };

export function decideNextExercise(
  exercise: TransitionExerciseRef,
  outcome: TransitionOutcome
): TransitionDecision {
  if (outcome === "essai") {
    const nextId = exercise.onPartialExerciseId ?? exercise.id;
    return { kind: "stay", nextExerciseId: nextId, reason: "repeat" };
  }

  if (outcome === "reussi") {
    const nextId = exercise.onSuccessExerciseId;
    if (!nextId || nextId === exercise.id) {
      return {
        kind: "stay",
        nextExerciseId: exercise.id,
        reason: "repeat",
      };
    }
    if (exercise.crossesAutonomyLevel) {
      return {
        kind: "alert_only",
        alertType: "level_change_proposed",
        nextExerciseId: nextId,
      };
    }
    return {
      kind: "advance",
      nextExerciseId: nextId,
      requiresProfessionalValidation: false,
    };
  }

  // échec
  const fallbackId = exercise.onFailureExerciseId;
  if (!fallbackId) {
    return {
      kind: "alert_only",
      alertType: "no_fallback",
      nextExerciseId: null,
    };
  }

  // échec au niveau A (alertOnFailure) : repli + signal de régression (§11.3)
  if (exercise.alertOnFailure) {
    return {
      kind: "fallback",
      nextExerciseId: fallbackId,
      alertProfessional: true,
      alertType: "regression_suspected",
    };
  }

  return {
    kind: "fallback",
    nextExerciseId: fallbackId,
    alertProfessional: false,
    alertType: null,
  };
}

export function alertMessageFor(
  type: "level_change_proposed" | "no_fallback" | "regression_suspected",
  exerciseName: string
): string {
  switch (type) {
    case "level_change_proposed":
      return `Objectif atteint — changement de niveau à valider (après « ${exerciseName} »).`;
    case "no_fallback":
      return `Échec sans palier de repli — réévaluer la situation (exercice « ${exerciseName} »).`;
    case "regression_suspected":
      return `Possible régression à surveiller (échec sur « ${exerciseName} »).`;
  }
}
