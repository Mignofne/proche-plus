import { test, expect } from "@playwright/test";
import { DEMO, loginApi } from "../helpers/auth";

test.describe("API auth", () => {
  test("POST /api/auth/login — aidant happy path", async ({ request }) => {
    const res = await loginApi(
      request,
      DEMO.aidant.email,
      DEMO.aidant.password
    );
    expect(res.status()).toBe(200);
    const body = await res.json();
    expect(body.role).toBe("caregiver");
    expect(body.redirectTo).toBe("/aidant");
    expect(body.user).toMatchObject({
      firstName: expect.any(String),
      lastName: expect.any(String),
    });
    const cookies = await request.storageState();
    expect(
      cookies.cookies.some((c) => c.name === "proche_session" && c.value)
    ).toBe(true);
  });

  test("POST /api/auth/login — pro happy path", async ({ request }) => {
    const res = await loginApi(request, DEMO.pro.email, DEMO.pro.password);
    expect(res.status()).toBe(200);
    const body = await res.json();
    expect(body.role).toBe("professional");
    expect(body.redirectTo).toBe("/pro");
  });

  test("POST /api/auth/login — 400 sans credentials", async ({ request }) => {
    const res = await request.post("/api/auth/login", {
      data: { email: "", password: "" },
    });
    expect(res.status()).toBe(400);
    const body = await res.json();
    expect(body.error).toMatch(/requis/i);
  });

  test("POST /api/auth/login — 401 mauvais mot de passe", async ({
    request,
  }) => {
    const res = await loginApi(request, DEMO.aidant.email, "wrong-password");
    expect(res.status()).toBe(401);
    const body = await res.json();
    expect(body.error).toMatch(/incorrects/i);
  });

  test("POST /api/auth/logout — ok", async ({ request }) => {
    await loginApi(request, DEMO.aidant.email, DEMO.aidant.password);
    const res = await request.post("/api/auth/logout");
    expect(res.status()).toBe(200);
    expect(await res.json()).toEqual({ ok: true });
  });
});
