import { test, expect } from "@playwright/test";
import { DEMO, loginUi } from "../helpers/auth";

async function loginFondateur(page: import("@playwright/test").Page) {
  await loginUi(
    page,
    DEMO.fondateur.email,
    DEMO.fondateur.password,
    "fondateur"
  );
  await expect(page).toHaveURL(/\/admin-produit/);
}

test.describe("Studio Ours — E2E fondateur", () => {
  test("accès refusé sans session fondateur (redirect connexion)", async ({
    page,
  }) => {
    await page.goto("/admin-produit/community/studio-ours");
    await expect(page).toHaveURL(/\/connexion/);
  });

  test("aidant ne peut pas ouvrir Studio Ours", async ({ page }) => {
    await loginUi(page, DEMO.aidant.email, DEMO.aidant.password, "aidant");
    await expect(page).toHaveURL(/\/aidant/);
    await page.goto("/admin-produit/community/studio-ours");
    await expect(page).toHaveURL(/\/connexion/);
  });

  test("fondateur voit le brief et les garde-fous", async ({ page }) => {
    await loginFondateur(page);
    await page.goto("/admin-produit/community");
    await expect(
      page.getByRole("link", { name: /Ouvrir Studio Ours/i })
    ).toBeVisible();
    await page.goto("/admin-produit/community/studio-ours");
    await expect(
      page.getByRole("heading", { name: /Studio Ours/i })
    ).toBeVisible();
    await expect(page.getByText(/Garde-fous verrouillés/i)).toBeVisible();
    await expect(page.getByText(/Brief de scène/i)).toBeVisible();
    await expect(page.getByLabel(/Situation/i)).toBeVisible();
    await expect(
      page.getByRole("button", {
        name: /Composer le prompt|Générer la scène/i,
      })
    ).toBeVisible();
  });

  test("bloque une intention qui viole les garde-fous (S1)", async ({
    page,
  }) => {
    await loginFondateur(page);
    await page.goto("/admin-produit/community/studio-ours");
    await page
      .getByLabel(/Situation/i)
      .fill("scène sexy et érotique avec lingerie");
    await page.getByRole("button", { name: /Fier/i }).click();
    await page.getByRole("button", { name: /Salon/i }).click();
    await page
      .getByRole("button", {
        name: /Composer le prompt|Générer la scène/i,
      })
      .click();
    const alert = page
      .getByRole("alert")
      .filter({ hasText: /garde-fous|family-safe|vulgaire/i });
    await expect(alert).toBeVisible();
  });

  test("génère une scène valide (mock) et affiche le résultat", async ({
    page,
  }) => {
    await loginFondateur(page);
    await page.goto("/admin-produit/community/studio-ours");
    await page
      .getByLabel(/Situation/i)
      .fill("exerce les freins du fauteuil avec fierté");
    await page.getByRole("button", { name: /Fier/i }).click();
    await page.getByRole("button", { name: /Salon/i }).click();
    await page
      .getByRole("button", {
        name: /Composer le prompt|Générer la scène/i,
      })
      .click();

    // Résultat : status banner + prompt (mock) ou illustration (remote)
    await expect(
      page.getByRole("heading", { name: /Résultat/i })
    ).toBeVisible({ timeout: 45_000 });
    await expect(page.getByRole("status")).toBeVisible();
    await expect(page.getByText(/Prompt positif/i)).toBeVisible();
    await expect(page.locator("pre").first()).toContainText(
      /exerce les freins|Situation/i
    );
  });
});
