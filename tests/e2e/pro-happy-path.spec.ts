import { test, expect } from "@playwright/test";
import { DEMO, loginUi } from "../helpers/auth";

test.describe("Pro happy path", () => {
  test("login → patients", async ({ page }) => {
    await loginUi(page, DEMO.pro.email, DEMO.pro.password, "pro");
    await expect(page).toHaveURL(/\/pro/);
    await expect(
      page.getByRole("heading", { name: /Bonjour/i })
    ).toBeVisible();
    await expect(page.getByText("Mes patients")).toBeVisible();
    await expect(
      page.getByRole("link", { name: "Nouveau patient" }).first()
    ).toBeVisible();
  });
});
