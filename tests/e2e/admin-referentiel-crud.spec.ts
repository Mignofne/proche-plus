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

  test("peut changer le niveau patient de plusieurs exercices", async ({
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
    const nameA = `Bulk niveau A ${stamp}`;
    const nameB = `Bulk niveau B ${stamp}`;

    for (const name of [nameA, nameB]) {
      await page.goto("/admin-produit/exercices/nouveau");
      await expect(page.locator('input[name="name"]')).toBeVisible();
      await page.locator('input[name="name"]').fill(name);
      await page
        .locator('textarea[name="objective"]')
        .fill("Objectif test bulk niveau");
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

    const applyBtn = page.getByRole("button", {
      name: /Déplacer le niveau/i,
    });
    await expect(applyBtn).toBeDisabled();

    await page.getByRole("checkbox", { name: `Sélectionner ${nameA}` }).check();
    await page.getByRole("checkbox", { name: `Sélectionner ${nameB}` }).check();
    await expect(applyBtn).toBeEnabled();

    const levelSelect = page.getByLabel("Niveau patient");
    const options = levelSelect.locator("option");
    const optionCount = await options.count();
    expect(optionCount).toBeGreaterThan(0);
    // Choisir le dernier niveau pour forcer un changement visible
    const lastValue = await options.nth(optionCount - 1).getAttribute("value");
    const lastLabel = (await options.nth(optionCount - 1).textContent()) ?? "";
    await levelSelect.selectOption(lastValue!);
    await applyBtn.click();
    await expect(page.getByRole("status")).toContainText(
      new RegExp(lastLabel.split("—").pop()?.trim() || "Autonome", "i")
    );
  });

  test("peut créer un exercice pour plusieurs niveaux d’autonomie", async ({
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
    const name = `Assis multi-niveaux ${stamp}`;
    await page.goto("/admin-produit/exercices/nouveau");
    await expect(page.locator('input[name="name"]')).toBeVisible();

    const selectAll = page.getByRole("checkbox", { name: /Tous les niveaux/i });
    const levelBoxes = page
      .getByRole("group", { name: /Appropriation patient/i })
      .getByRole("checkbox");
    // Tout désélectionner puis cocher 2 niveaux
    if (await selectAll.isChecked()) {
      await selectAll.uncheck();
    }
    await expect(selectAll).not.toBeChecked();
    // index 0 = Tous, 1..n = niveaux
    await levelBoxes.nth(1).check();
    await levelBoxes.nth(2).check();

    await page.locator('input[name="name"]').fill(name);
    await page
      .locator('textarea[name="objective"]')
      .fill("Objectif assis multi-niveaux");
    await page.getByLabel(/Étapes \/ guidance/i).fill("Étape 1");
    await page.locator('select[name="status"]').selectOption("brouillon");
    await page.getByRole("button", { name: /Créer \(2 niveaux\)/i }).click();

    await expect(page).toHaveURL(/\/admin-produit\/exercices\?q=/);
    await expect(page).toHaveURL(new RegExp(String(stamp)));
    await expect(
      page.getByRole("checkbox", { name: new RegExp(`Sélectionner ${name}`) })
    ).toHaveCount(2);
  });

  test("peut associer des exercices à un niveau GIR (copie)", async ({
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
    const name = `GIR link ${stamp}`;
    await page.goto("/admin-produit/exercices/nouveau");
    await page.locator('input[name="name"]').fill(name);
    await page
      .locator('textarea[name="objective"]')
      .fill("Objectif test association GIR");
    await page.getByLabel(/Étapes \/ guidance/i).fill("Étape 1");
    await page.locator('select[name="status"]').selectOption("brouillon");
    await page.getByRole("button", { name: /^Créer$/i }).click();
    await expect(page).toHaveURL(/\/admin-produit\/exercices\/[^/]+$/);

    await page.goto("/admin-produit/exercices");
    const targetScale = page.getByLabel("Niveau GIR cible");
    const options = targetScale.locator("option");
    const optionCount = await options.count();
    expect(optionCount).toBeGreaterThan(1);
    const targetValue = await options.nth(1).getAttribute("value");
    const targetCode =
      ((await options.nth(1).textContent()) ?? "").split("—")[0]?.trim() ||
      "B";
    await targetScale.selectOption(targetValue!);

    await page.getByPlaceholder(/Rechercher un exercice/i).fill(String(stamp));
    const checkbox = page
      .getByText(name)
      .first()
      .locator("xpath=ancestor::label")
      .getByRole("checkbox");
    await expect(checkbox).toBeVisible();
    await checkbox.check();

    await page
      .getByRole("button", {
        name: new RegExp(`Associer au niveau ${targetCode}`),
      })
      .click();
    await expect(page.getByRole("status")).toContainText(/associé/i);

    await page.goto(
      `/admin-produit/exercices?q=${encodeURIComponent(String(stamp))}`
    );
    await expect(
      page.getByRole("checkbox", { name: new RegExp(`Sélectionner ${name}`) })
    ).toHaveCount(2);
  });
});
