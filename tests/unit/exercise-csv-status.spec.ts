import { test, expect } from "@playwright/test";
import { loadReferentielFromCsv } from "../../prisma/seed-exercises";

test.describe("référentiel CSV → statut catalogue", () => {
  test("les exercices Validés sont mappés en publie (disponibles Mode visite)", () => {
    const catalog = loadReferentielFromCsv();
    expect(catalog.length).toBeGreaterThan(0);

    const aValider = catalog.filter((ex) => ex.status === "a_valider");
    const publie = catalog.filter((ex) => ex.status === "publie");
    const palier2 = catalog.filter((ex) => ex.tier === 2);

    expect(publie.length).toBeGreaterThanOrEqual(100);
    expect(aValider.length).toBe(0);
    expect(palier2.length).toBeGreaterThanOrEqual(10);

    const byTheme = new Map<string, number>();
    for (const ex of publie) {
      byTheme.set(ex.themeSlug, (byTheme.get(ex.themeSlug) ?? 0) + 1);
    }
    // Au moins un exercice publié par thème du référentiel
    expect(byTheme.size).toBeGreaterThanOrEqual(14);
    for (const [slug, count] of byTheme) {
      expect(count, slug).toBeGreaterThanOrEqual(1);
    }

    const bodyZones = catalog.filter((ex) =>
      ex.themeSlug.startsWith("zone_")
    );
    expect(bodyZones.length).toBeGreaterThanOrEqual(50);
    const byZone = new Map<string, number>();
    for (const ex of bodyZones) {
      byZone.set(ex.themeSlug, (byZone.get(ex.themeSlug) ?? 0) + 1);
    }
    for (const [slug, count] of byZone) {
      expect(count, slug).toBeGreaterThanOrEqual(5);
    }
  });
});
