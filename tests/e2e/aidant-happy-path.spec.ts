import { test, expect } from "@playwright/test";
import { DEMO, loginUi } from "../helpers/auth";

test.describe("Aidant happy path", () => {
  test("login → accueil → pages clés", async ({ page }) => {
    await loginUi(
      page,
      DEMO.aidant.email,
      DEMO.aidant.password,
      "aidant"
    );
    await expect(page).toHaveURL(/\/aidant/);
    await expect(page.getByRole("link", { name: "Mode visite" })).toBeVisible();
    await expect(
      page.getByRole("link", { name: /question/i })
    ).toBeVisible();

    await page.getByRole("link", { name: "Mode visite" }).click();
    await expect(page).toHaveURL(/\/aidant\/mode-visite/);

    await page.goto("/aidant/question");
    await expect(page).toHaveURL(/\/aidant\/question/);

    await page.goto("/aidant/ressources");
    await expect(page).toHaveURL(/\/aidant\/ressources/);

    await page.goto("/aidant/feedback");
    await expect(page).toHaveURL(/\/aidant\/feedback/);
  });
});
