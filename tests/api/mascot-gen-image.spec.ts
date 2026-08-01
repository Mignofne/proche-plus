import { test, expect } from "@playwright/test";
import { mkdir, writeFile } from "fs/promises";
import { join } from "path";
import { DEMO, loginApi } from "../helpers/auth";

test.describe("API Studio Ours — image générée", () => {
  test("GET sans session → 401", async ({ request }) => {
    const res = await request.get(
      "/api/community/mascot-gen/image/studio-test.png"
    );
    expect(res.status()).toBe(401);
    const body = await res.json();
    expect(body.error).toMatch(/autorisé/i);
  });

  test("GET avec session aidant → 401", async ({ request }) => {
    const login = await loginApi(
      request,
      DEMO.aidant.email,
      DEMO.aidant.password
    );
    expect(login.status()).toBe(200);

    const res = await request.get(
      "/api/community/mascot-gen/image/studio-test.png"
    );
    expect(res.status()).toBe(401);
  });

  test("GET fondateur — nom invalide → 400", async ({ request }) => {
    const login = await loginApi(
      request,
      DEMO.fondateur.email,
      DEMO.fondateur.password
    );
    expect(login.status()).toBe(200);

    // Caractères hors whitelist (le routeur Next normalise les `../`)
    const res = await request.get(
      "/api/community/mascot-gen/image/studio@evil.png"
    );
    expect(res.status()).toBe(400);
    const body = await res.json();
    expect(body.error).toMatch(/invalide/i);
  });

  test("GET fondateur — extension invalide → 400", async ({ request }) => {
    const login = await loginApi(
      request,
      DEMO.fondateur.email,
      DEMO.fondateur.password
    );
    expect(login.status()).toBe(200);

    const res = await request.get(
      "/api/community/mascot-gen/image/studio-test.exe"
    );
    expect(res.status()).toBe(400);
    const body = await res.json();
    expect(body.error).toMatch(/extension/i);
  });

  test("GET fondateur — image absente → 404", async ({ request }) => {
    const login = await loginApi(
      request,
      DEMO.fondateur.email,
      DEMO.fondateur.password
    );
    expect(login.status()).toBe(200);

    const res = await request.get(
      "/api/community/mascot-gen/image/does-not-exist-xyz.png"
    );
    expect(res.status()).toBe(404);
  });

  test("GET fondateur — image présente → 200 image/*", async ({ request }) => {
    const login = await loginApi(
      request,
      DEMO.fondateur.email,
      DEMO.fondateur.password
    );
    expect(login.status()).toBe(200);

    const sceneId = `e2e-${Date.now()}`;
    const dir = join(process.cwd(), ".data", "mascot-gen", "images");
    await mkdir(dir, { recursive: true });
    // PNG 1×1 minimal
    const png = Buffer.from(
      "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==",
      "base64"
    );
    await writeFile(join(dir, `${sceneId}.png`), png);

    const res = await request.get(
      `/api/community/mascot-gen/image/${sceneId}.png`
    );
    expect(res.status()).toBe(200);
    expect(res.headers()["content-type"]).toMatch(/image\//);
    const buf = Buffer.from(await res.body());
    expect(buf.byteLength).toBeGreaterThan(10);
  });
});
