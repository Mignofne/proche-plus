import { defineConfig, devices } from "@playwright/test";

const port = process.env.PLAYWRIGHT_PORT ?? "3010";
const baseURL =
  process.env.PLAYWRIGHT_BASE_URL ?? `http://127.0.0.1:${port}`;

export default defineConfig({
  testDir: "./tests",
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: 1,
  reporter: [["list"], ["html", { open: "never" }]],
  timeout: 60_000,
  expect: { timeout: 15_000 },
  use: {
    baseURL,
    trace: "on-first-retry",
    screenshot: "only-on-failure",
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
  webServer: process.env.PLAYWRIGHT_BASE_URL
    ? undefined
    : {
        // Mock + flag : E2E Studio Ours (sinon masqué sans OPENAI_API_KEY)
        command: `MASCOT_GEN_PROVIDER=mock MASCOT_GEN_STUDIO_ENABLED=true npx next dev --turbo --port ${port}`,
        url: baseURL,
        reuseExistingServer: false,
        timeout: 180_000,
        env: {
          ...process.env,
          MASCOT_GEN_PROVIDER: "mock",
          MASCOT_GEN_STUDIO_ENABLED: "true",
        },
      },
});
