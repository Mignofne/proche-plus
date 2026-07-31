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
      page.getByRole("listitem").filter({ hasText: /Regarde où tu veux aller/i })
    ).toBeVisible();
  });

  test("pro peut voir l'exercice activé sur la fiche patient", async ({
    page,
  }) => {
    await loginUi(page, DEMO.pro.email, DEMO.pro.password, "pro");
    await expect(page).toHaveURL(/\/pro/);
    const res = await page.request.get("/api/pro");
    expect(res.ok()).toBeTruthy();
    const body = (await res.json()) as {
      patients: { id: string; firstName: string; lastName: string }[];
    };
    const marie = body.patients.find(
      (p) => p.firstName === "Marie" && p.lastName === "Martin"
    );
    expect(marie).toBeTruthy();
    await page.goto(`/pro/patient/${marie!.id}`);
    await expect(page.getByText(/Exercices activés/i)).toBeVisible();
    await expect(
      page.locator("li").filter({ hasText: /demi-tour/i })
    ).toBeVisible();
  });
});
