import { test, expect } from "@playwright/test";
import { DEMO_GIR_PROFILES } from "../../prisma/demo-gir-profiles";

test.describe("Profils démo GIR A–E", () => {
  test("couvre exactement les 5 niveaux d'autonomie", () => {
    expect(DEMO_GIR_PROFILES).toHaveLength(5);
    expect(DEMO_GIR_PROFILES.map((p) => p.code)).toEqual([
      "A",
      "B",
      "C",
      "D",
      "E",
    ]);
    expect(DEMO_GIR_PROFILES.map((p) => p.autonomyLevel)).toEqual([
      "autonome",
      "semi_autonome_faible",
      "semi_autonome_eleve",
      "dependant",
      "grabataire",
    ]);
    for (const p of DEMO_GIR_PROFILES) {
      expect(p.email).toMatch(/^aidant\.[a-e]@procheplus\.demo$/);
    }
  });
});
