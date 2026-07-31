import { APIRequestContext, Page } from "@playwright/test";

export const DEMO = {
  aidant: {
    email: "jean.martin@demo.fr",
    password: "demo1234",
    home: "/aidant",
  },
  pro: {
    email: "pro@procheplus.demo",
    password: "demo1234",
    home: "/pro",
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
