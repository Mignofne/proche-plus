import { test, expect } from "@playwright/test";
import { loadReferentielFromCsv } from "../../prisma/seed-exercises";

test.describe("référentiel CSV → statut catalogue", () => {
  test("les brouillons IA sont mappés en a_valider, jamais publie", () => {
    const catalog = loadReferentielFromCsv();
    expect(catalog.length).toBeGreaterThan(0);

    const aValider = catalog.filter((ex) => ex.status === "a_valider");
    const publie = catalog.filter((ex) => ex.status === "publie");
    const palier2 = catalog.filter((ex) => ex.tier === 2);

    expect(aValider.length).toBeGreaterThanOrEqual(70);
    expect(publie.length).toBe(0);
    expect(palier2.length).toBeGreaterThanOrEqual(10);

    const bodyZones = catalog.filter((ex) =>
      ex.themeSlug.startsWith("zone_")
    );
    expect(bodyZones.length).toBeGreaterThanOrEqual(30);
  });
});
