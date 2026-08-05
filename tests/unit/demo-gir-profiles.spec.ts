import { test, expect } from "@playwright/test";
import {
  DEMO_AIDANT_EMAIL,
  DEMO_GIR_PROFILES,
} from "../../prisma/demo-gir-profiles";

test.describe("Profils démo GIR A–E", () => {
  test("5 proches sur l’aidant démo, un par niveau", () => {
    expect(DEMO_AIDANT_EMAIL).toBe("jean.martin@demo.fr");
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
    const c = DEMO_GIR_PROFILES.find((p) => p.code === "C");
    expect(c?.patientFirstName).toBe("Marie");
    expect(c?.patientLastName).toBe("Martin");
  });
});
