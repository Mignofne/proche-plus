import { test, expect } from "@playwright/test";
import { assertFondateurSession } from "../../src/lib/community/auth-gate";
import type { SessionPayload } from "../../src/lib/auth";

test.describe("Community auth-gate — requireFondateur", () => {
  test("accepte une session admin_produit", () => {
    const session: SessionPayload = {
      userId: "u1",
      role: "admin_produit",
    };
    expect(assertFondateurSession(session)).toEqual(session);
  });

  test("refuse une session absente", () => {
    expect(() => assertFondateurSession(null)).toThrow("Accès refusé");
  });

  test("refuse les rôles non fondateur", () => {
    const roles: SessionPayload["role"][] = [
      "caregiver",
      "professional",
      "admin_etablissement",
    ];
    for (const role of roles) {
      expect(() =>
        assertFondateurSession({ userId: "u1", role })
      ).toThrow("Accès refusé");
    }
  });
});
