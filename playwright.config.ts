import { defineConfig, devices } from "@playwright/test";

/**
 * End-to-end checks run against a production build:
 *   npm run build && npm run test:e2e
 * Set BASE_URL to test a deployed site instead of the local server.
 */
const PORT = 3200;
const baseURL = process.env.BASE_URL ?? `http://localhost:${PORT}`;

export default defineConfig({
  testDir: "./tests",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? "github" : "list",
  use: {
    baseURL,
    trace: "retain-on-failure",
  },
  projects: [
    { name: "desktop", use: { ...devices["Desktop Chrome"] }, grepInvert: /@mobile/ },
    { name: "mobile", use: { ...devices["Pixel 7"] }, grep: /@mobile/ },
  ],
  // Content checks need no server (CONTENT_ONLY=1, see npm run check:content).
  webServer: process.env.BASE_URL || process.env.CONTENT_ONLY
    ? undefined
    : {
        command: `npx next start -p ${PORT}`,
        url: `${baseURL}/en`,
        reuseExistingServer: !process.env.CI,
        timeout: 120_000,
      },
});
