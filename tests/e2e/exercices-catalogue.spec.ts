import { test, expect } from "@playwright/test";
import { DEMO, loginUi } from "../helpers/auth";

test.describe("Catalogue exercices", () => {
  test("fondateur voit le catalogue et prévisualise un exercice", async ({
    page,
  }) => {
    await loginUi(
      page,
      DEMO.fondateur.email,
      DEMO.fondateur.password,
      "fondateur"
    );
    await expect(page).toHaveURL(/\/admin-produit/);
    await page.getByRole("link", { name: /Catalogue exercices/i }).click();
    await expect(page).toHaveURL(/\/admin-produit\/exercices/);
    await expect(page.getByText(/Faire un demi-tour en fauteuil/i)).toBeVisible();
    await page.getByText(/Faire un demi-tour en fauteuil/i).click();
    await expect(page.getByText(/Prévisualisation aidant/i)).toBeVisible();
    await expect(
      page.getByText(/Regarde où tu veux aller/i)
    ).toBeVisible();
  });

  test("pro peut voir l'exercice activé sur la fiche patient", async ({
    page,
  }) => {
    await loginUi(page, DEMO.pro.email, DEMO.pro.password, "pro");
    await page.getByRole("link", { name: /Marie Martin/i }).first().click();
    await expect(page.getByText(/Exercices activés/i)).toBeVisible();
    await expect(page.getByText(/demi-tour/i)).toBeVisible();
  });
});
