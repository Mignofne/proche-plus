import { test, expect } from "@playwright/test";
import { DEMO, loginUi } from "../helpers/auth";

test.describe("Admin fondateur — CRUD référentiel", () => {
  test("peut créer un thème et ouvrir la création d'exercice", async ({
    page,
  }) => {
    await loginUi(
      page,
      DEMO.fondateur.email,
      DEMO.fondateur.password,
      "fondateur"
    );
    await expect(page).toHaveURL(/\/admin-produit/);
    await page.goto("/admin-produit/exercices");
    await expect(
      page.getByRole("heading", { name: /Référentiel exercices/i })
    ).toBeVisible();

    await page.getByRole("button", { name: /Ajouter un thème/i }).click();
    await page.locator('form input[name="label"]').fill("Sorties test");
    await page.locator('form input[name="icon"]').fill("🌳");
    await page.getByRole("button", { name: /^Enregistrer$/i }).click();
    await expect(page.getByText(/Sorties test/i).first()).toBeVisible();

    await page.getByRole("link", { name: /Nouvel exercice/i }).first().click();
    await expect(page).toHaveURL(/\/admin-produit\/exercices\/nouveau/);
  });

  test("peut modifier un exercice existant", async ({ page }) => {
    await loginUi(
      page,
      DEMO.fondateur.email,
      DEMO.fondateur.password,
      "fondateur"
    );
    await expect(page).toHaveURL(/\/admin-produit/);
    await page.goto("/admin-produit/exercices");
    await page.getByText(/Faire un demi-tour en fauteuil/i).click();
    await expect(page.getByText(/Prévisualisation aidant/i)).toBeVisible();
    await expect(page.getByRole("button", { name: /Enregistrer/i })).toBeVisible();
    await expect(
      page.getByRole("button", { name: /Supprimer \(archiver\)/i })
    ).toBeVisible();
  });
});
