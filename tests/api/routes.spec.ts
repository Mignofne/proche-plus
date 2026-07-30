import { test, expect } from "@playwright/test";
import { DEMO, loginApi } from "../helpers/auth";

test.describe("API routes critiques", () => {
  test("GET /api/me — 401 sans session", async ({ request }) => {
    const res = await request.get("/api/me");
    expect(res.status()).toBe(401);
  });

  test("GET /api/me — aidant authentifié", async ({ request }) => {
    await loginApi(request, DEMO.aidant.email, DEMO.aidant.password);
    const res = await request.get("/api/me");
    expect(res.status()).toBe(200);
    const body = await res.json();
    expect(body.role).toBe("caregiver");
    expect(body.caregiver).toBeTruthy();
  });

  test("GET /api/me — pro authentifié", async ({ request }) => {
    await loginApi(request, DEMO.pro.email, DEMO.pro.password);
    const res = await request.get("/api/me");
    expect(res.status()).toBe(200);
    const body = await res.json();
    expect(body.role).toBe("professional");
    expect(body.professional).toBeTruthy();
  });

  test("GET /api/aidant — 403 sans rôle caregiver", async ({ request }) => {
    await loginApi(request, DEMO.pro.email, DEMO.pro.password);
    const res = await request.get("/api/aidant");
    expect(res.status()).toBe(403);
  });

  test("GET /api/aidant — happy path", async ({ request }) => {
    await loginApi(request, DEMO.aidant.email, DEMO.aidant.password);
    const res = await request.get("/api/aidant");
    expect(res.status()).toBe(200);
    const body = await res.json();
    expect(body.caregiver).toBeTruthy();
    expect(Array.isArray(body.transmissions)).toBe(true);
  });

  test("POST /api/aidant — action inconnue → 400", async ({ request }) => {
    await loginApi(request, DEMO.aidant.email, DEMO.aidant.password);
    const res = await request.post("/api/aidant", {
      data: { action: "not_a_real_action" },
    });
    expect(res.status()).toBe(400);
    const body = await res.json();
    expect(body.error).toMatch(/inconnue/i);
  });

  test("GET /api/pro — 403 sans rôle pro", async ({ request }) => {
    await loginApi(request, DEMO.aidant.email, DEMO.aidant.password);
    const res = await request.get("/api/pro");
    expect(res.status()).toBe(403);
  });

  test("GET /api/pro — happy path patients", async ({ request }) => {
    await loginApi(request, DEMO.pro.email, DEMO.pro.password);
    const res = await request.get("/api/pro");
    expect(res.status()).toBe(200);
    const body = await res.json();
    expect(body.establishment).toBeTruthy();
    expect(Array.isArray(body.patients)).toBe(true);
    expect(body.stats).toMatchObject({
      patients: expect.any(Number),
      activeCaregivers: expect.any(Number),
    });
  });

  test("POST /api/pro — action inconnue → 400", async ({ request }) => {
    await loginApi(request, DEMO.pro.email, DEMO.pro.password);
    const res = await request.post("/api/pro", {
      data: { action: "not_a_real_action" },
    });
    expect(res.status()).toBe(400);
  });

  test("GET /api/resources — liste publique", async ({ request }) => {
    const res = await request.get("/api/resources");
    expect(res.status()).toBe(200);
    const body = await res.json();
    expect(Array.isArray(body.resources)).toBe(true);
  });
});
