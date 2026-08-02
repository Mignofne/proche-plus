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

    await expect(
      page.getByRole("link", { name: "Mes dernières visites" })
    ).toBeVisible();
    await expect(
      page.getByRole("link", { name: "Dernière transmission" })
    ).toHaveCount(0);

    await page.getByRole("link", { name: "Mode visite" }).click();
    await expect(page).toHaveURL(/\/aidant\/mode-visite(\?patientId=|$|\?)/);
    // 1 proche démo → auto-sélection via ?patientId=
    await expect(page).toHaveURL(/patientId=/);
    // Check-in fatigue / douleur avant les thèmes
    await expect(
      page.getByRole("heading", { name: /Comment se sent/i })
    ).toBeVisible();
    await page.getByRole("group", { name: "Fatigue" }).getByRole("button", { name: "Aucune" }).click();
    await page.getByRole("group", { name: "Douleur" }).getByRole("button", { name: "Aucune" }).click();
    await page.getByRole("button", { name: "Continuer" }).click();
    // Choix de thème obligatoire (tous les thèmes du catalogue)
    await expect(
      page.getByRole("heading", {
        name: /Que souhaitez-vous travailler aujourd/i,
      })
    ).toBeVisible();
    await page.getByRole("button", { name: /Fauteuil/i }).click();
    await expect(
      page.getByRole("heading", { name: /demi-tour/i })
    ).toBeVisible();
    await expect(
      page.getByText(/aide l.équipe à adapter la prochaine visite/i)
    ).toBeVisible();
    // Référentiel complet : d'autres thèmes niveau C doivent être prêts
    await page.getByRole("button", { name: /Changer de thème/i }).click();
    await expect(
      page.getByRole("button", { name: /S'habiller/i })
    ).toContainText(/Exercice prêt/i);

    // Post-outcome : proposer un autre exercice (pas de sortie auto)
    await page.getByRole("button", { name: /Fauteuil/i }).click();
    await page.getByRole("button", { name: /^Réussi$/i }).click();
    await expect(
      page.getByText(/C'est noté — un autre exercice/i)
    ).toBeVisible();
    await expect(
      page.getByRole("button", { name: /Faire un autre exercice/i })
    ).toBeVisible();
    await expect(
      page.getByRole("button", { name: /Terminer la visite/i })
    ).toBeVisible();
    await page.getByRole("button", { name: /Faire un autre exercice/i }).click();
    await expect(
      page.getByRole("heading", {
        name: /Que souhaitez-vous travailler aujourd/i,
      })
    ).toBeVisible();

    // Terminer la visite → clôture calme → accueil
    await page.getByRole("button", { name: /Fauteuil/i }).click();
    await page.getByRole("button", { name: /^Réussi$/i }).click();
    await expect(
      page.getByRole("button", { name: /Terminer la visite/i })
    ).toBeVisible();
    await page.getByRole("button", { name: /Terminer la visite/i }).click();
    await expect(page.getByRole("banner")).toContainText(/Visite terminée/i);
    await page.getByRole("button", { name: /Retour à l'accueil/i }).click();
    await expect(page).toHaveURL(/\/aidant$/);

    await page.goto("/aidant/question");
    await expect(page).toHaveURL(/\/aidant\/question/);

    await page.goto("/aidant/ressources");
    await expect(page).toHaveURL(/\/aidant\/ressources/);

    await page.goto("/aidant/feedback");
    await expect(page).toHaveURL(/\/aidant\/feedback/);
  });
});
