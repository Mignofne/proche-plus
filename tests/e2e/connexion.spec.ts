import { test, expect } from "@playwright/test";
import { DEMO, loginUi } from "../helpers/auth";

test.describe("UI connexion", () => {
  test("affiche le formulaire de connexion", async ({ page }) => {
    await page.goto("/connexion");
    await expect(
      page.getByRole("heading", { name: "Connexion" })
    ).toBeVisible();
    await expect(page.getByLabel("Email")).toBeVisible();
    await expect(page.getByLabel("Mot de passe")).toBeVisible();
    await expect(
      page.getByRole("button", { name: /Se connecter/i })
    ).toBeVisible();
  });

  test("erreur visible si identifiants incorrects", async ({ page }) => {
    await loginUi(page, DEMO.aidant.email, "mauvais-mdp");
    await expect(page.getByText(/Identifiants incorrects/i)).toBeVisible();
    await expect(page).toHaveURL(/\/connexion/);
  });
});
