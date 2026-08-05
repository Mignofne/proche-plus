import { test, expect } from "@playwright/test";
import {
  exerciseTutoDurationInFrames,
  splitInstructionForDisplay,
  TUTO_TYPO,
  DEFAULT_TUTO_STEP_FRAMES,
  DEFAULT_TUTO_INTRO_FRAMES,
  DEFAULT_TUTO_OUTRO_FRAMES,
} from "../../src/lib/exercises/tuto-video";
import {
  findReferentielExercise,
  exerciseTutoSlug,
} from "../../src/lib/exercises/referentiel-lookup";

test.describe("exercise tuto video", () => {
  test("typo XL — consigne min 48px", () => {
    expect(TUTO_TYPO.instruction).toBeGreaterThanOrEqual(56);
    expect(TUTO_TYPO.instructionMin).toBeGreaterThanOrEqual(48);
  });

  test("durée = intro + étapes + outro", () => {
    const d = exerciseTutoDurationInFrames({
      exerciseName: "Test",
      themeLabel: "Fauteuil",
      levelCode: "B",
      tier: 1,
      steps: [
        { instruction: "a", sceneSrc: "/a.png" },
        { instruction: "b", sceneSrc: "/b.png" },
      ],
    });
    expect(d).toBe(
      DEFAULT_TUTO_INTRO_FRAMES +
        2 * DEFAULT_TUTO_STEP_FRAMES +
        DEFAULT_TUTO_OUTRO_FRAMES
    );
  });

  test("splitInstruction coupe les longues consignes", () => {
    const lines = splitInstructionForDisplay(
      "Pose le gilet sur tes genoux l'intérieur vers toi et prends ton temps",
      28
    );
    expect(lines.length).toBe(2);
  });

  test("trouve un exercice du CSV par nom partiel", () => {
    const ex = findReferentielExercise({ name: "gilet en position assise" });
    expect(ex.name).toContain("gilet");
    expect(ex.steps.length).toBeGreaterThan(0);
    expect(exerciseTutoSlug(ex)).toMatch(/gilet/);
  });
});
