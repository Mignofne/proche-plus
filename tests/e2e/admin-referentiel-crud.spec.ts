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

  test("peut changer le statut de plusieurs exercices d’un coup", async ({
    page,
  }) => {
    test.setTimeout(120_000);
    await loginUi(
      page,
      DEMO.fondateur.email,
      DEMO.fondateur.password,
      "fondateur"
    );
    await expect(page).toHaveURL(/\/admin-produit/);

    const stamp = Date.now();
    const nameA = `Bulk statut A ${stamp}`;
    const nameB = `Bulk statut B ${stamp}`;

    for (const name of [nameA, nameB]) {
      await page.goto("/admin-produit/exercices/nouveau");
      await expect(page.locator('input[name="name"]')).toBeVisible();
      await page.locator('input[name="name"]').fill(name);
      await page
        .locator('textarea[name="objective"]')
        .fill("Objectif test bulk statut");
      await page.getByLabel(/Étapes \/ guidance/i).fill("Étape 1");
      await page.locator('select[name="status"]').selectOption("brouillon");
      await page.getByRole("button", { name: /^Créer$/i }).click();
      await expect(page).toHaveURL(/\/admin-produit\/exercices\/[^/]+$/);
    }

    await page.goto(
      `/admin-produit/exercices?q=${encodeURIComponent(String(stamp))}`
    );
    await expect(
      page.getByRole("heading", { name: /Référentiel exercices/i })
    ).toBeVisible();

    const applyBtn = page.getByRole("button", { name: /Appliquer le statut/i });
    await expect(applyBtn).toBeDisabled();

    await page.getByRole("checkbox", { name: `Sélectionner ${nameA}` }).check();
    await page.getByRole("checkbox", { name: `Sélectionner ${nameB}` }).check();
    await expect(applyBtn).toBeEnabled();

    await page.getByLabel("Nouveau statut").selectOption("a_valider");
    await applyBtn.click();
    await expect(page.getByRole("status")).toContainText(/À valider/i);
    await expect(page.getByText(nameA)).toBeVisible();
  });
});
