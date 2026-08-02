import { test, expect } from "@playwright/test";
import { loadReferentielFromCsv } from "../../prisma/seed-exercises";

test.describe("référentiel CSV → statut catalogue", () => {
  test("les brouillons IA sont mappés en a_valider, jamais publie", () => {
    const catalog = loadReferentielFromCsv();
    expect(catalog.length).toBeGreaterThan(0);

    const aValider = catalog.filter((ex) => ex.status === "a_valider");
    const publie = catalog.filter((ex) => ex.status === "publie");

    expect(aValider.length).toBeGreaterThanOrEqual(30);
    expect(publie.length).toBe(0);
  });
});
