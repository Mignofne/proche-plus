import { test, expect } from "@playwright/test";
import { decideNextExercise } from "../../src/lib/exercises/transitions";

const base = {
  id: "c1",
  autonomyScaleId: "scale-c",
  onSuccessExerciseId: "c2",
  onPartialExerciseId: "c1",
  onFailureExerciseId: "d2",
  crossesAutonomyLevel: false,
  alertOnFailure: false,
};

test.describe("Matrice évolutive — transitions", () => {
  test("réussi sans changement de niveau → avance automatique", () => {
    const d = decideNextExercise(base, "reussi");
    expect(d).toEqual({
      kind: "advance",
      nextExerciseId: "c2",
      requiresProfessionalValidation: false,
    });
  });

  test("réussi qui franchit un niveau → alerte pro uniquement", () => {
    const d = decideNextExercise(
      { ...base, crossesAutonomyLevel: true, onSuccessExerciseId: "b1" },
      "reussi"
    );
    expect(d).toEqual({
      kind: "alert_only",
      alertType: "level_change_proposed",
      nextExerciseId: "b1",
    });
  });

  test("essai → répéter le même exercice", () => {
    const d = decideNextExercise(base, "essai");
    expect(d).toEqual({
      kind: "stay",
      nextExerciseId: "c1",
      reason: "repeat",
    });
  });

  test("échec avec repli → fallback automatique", () => {
    const d = decideNextExercise(base, "echec");
    expect(d).toEqual({
      kind: "fallback",
      nextExerciseId: "d2",
      alertProfessional: false,
      alertType: null,
    });
  });

  test("échec sans repli → alerte no_fallback", () => {
    const d = decideNextExercise(
      { ...base, onFailureExerciseId: null },
      "echec"
    );
    expect(d).toEqual({
      kind: "alert_only",
      alertType: "no_fallback",
      nextExerciseId: null,
    });
  });

  test("échec niveau A (alertOnFailure) → fallback + alerte régression", () => {
    const d = decideNextExercise(
      {
        ...base,
        id: "a1",
        onFailureExerciseId: "b2",
        alertOnFailure: true,
      },
      "echec"
    );
    expect(d).toEqual({
      kind: "fallback",
      nextExerciseId: "b2",
      alertProfessional: true,
      alertType: "regression_suspected",
    });
  });
});
