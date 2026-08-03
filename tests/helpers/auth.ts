import { APIRequestContext, Page } from "@playwright/test";

export const DEMO = {
  aidant: {
    email: "jean.martin@demo.fr",
    password: "demo1234",
    home: "/aidant",
  },
  /** Un compte par niveau A–E (GIR simplifié) — utiles pour Mode visite. */
  aidantByLevel: {
    A: { email: "aidant.a@procheplus.demo", password: "demo1234" },
    B: { email: "aidant.b@procheplus.demo", password: "demo1234" },
    C: { email: "aidant.c@procheplus.demo", password: "demo1234" },
    D: { email: "aidant.d@procheplus.demo", password: "demo1234" },
    E: { email: "aidant.e@procheplus.demo", password: "demo1234" },
  },
  pro: {
    email: "pro@procheplus.demo",
    password: "demo1234",
    home: "/pro",
  },
  fondateur: {
    email: "fondateur@procheplus.demo",
    password: "demo1234",
    home: "/admin-produit",
  },
} as const;

export async function loginApi(
  request: APIRequestContext,
  email: string,
  password: string
) {
  const res = await request.post("/api/auth/login", {
    data: { email, password },
  });
  return res;
}

export async function loginUi(
  page: Page,
  email: string,
  password: string,
  roleQuery?: string
) {
  const path = roleQuery ? `/connexion?role=${roleQuery}` : "/connexion";
  await page.goto(path);
  await page.getByLabel("Email").fill(email);
  await page.getByLabel("Mot de passe").fill(password);
  await page.getByRole("button", { name: /Se connecter/i }).click();
}
