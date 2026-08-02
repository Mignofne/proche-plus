import { test, expect } from "@playwright/test";
import { AUTONOMY_ENUM_TO_CODE } from "../../src/lib/exercises/mapping";

test.describe("activation exercices aidant", () => {
  test("chaque niveau patient mappe vers un code échelle catalogue", () => {
    expect(AUTONOMY_ENUM_TO_CODE.autonome).toBe("A");
    expect(AUTONOMY_ENUM_TO_CODE.semi_autonome_faible).toBe("B");
    expect(AUTONOMY_ENUM_TO_CODE.semi_autonome_eleve).toBe("C");
    expect(AUTONOMY_ENUM_TO_CODE.dependant).toBe("D");
    expect(AUTONOMY_ENUM_TO_CODE.grabataire).toBe("E");
  });

  test("le référentiel Validé expose au moins un palier 1 par thème pour le niveau C", async () => {
    const { loadReferentielFromCsv } = await import(
      "../../prisma/seed-exercises"
    );
    const catalog = loadReferentielFromCsv().filter(
      (ex) => ex.status === "publie" && ex.tier === 1 && ex.levelCode === "C"
    );
    const themes = new Set(catalog.map((ex) => ex.themeSlug));
    expect(themes.size).toBeGreaterThanOrEqual(14);
  });
});
