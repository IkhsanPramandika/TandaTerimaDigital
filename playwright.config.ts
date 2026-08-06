import { defineConfig, devices } from "@playwright/test";
import * as dotenv from "dotenv";

// Load environment variables from .env file
dotenv.config();

const isCI = !!process.env.CI;

export default defineConfig({
  testDir: "./tests",

  // Global setup: login as requester and save storage state to auth.json
  globalSetup: require.resolve("./global-setup"),

  // Retry: 2x di CI, 1x lokal (alur E2E/SSO kadang flaky pada full-suite run)
  retries: isCI ? 2 : 1,

  // 1 worker: portal SSO membocorkan identitas bila banyak akun login paralel
  workers: 1,

  // Reporters
  reporter: [["html"], ["list"]],

  use: {
    baseURL: process.env.BASE_URL,
    // Reuse the requester session created by global-setup.
    // Tests that need a fresh/unauthenticated session override this via test.use().
    storageState: "auth.json",
    screenshot: "only-on-failure",
    video: "retain-on-failure",
    trace: "on-first-retry",
  },

  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
    {
      name: "firefox",
      use: { ...devices["Desktop Firefox"] },
    },
    {
      name: "Mobile Chrome",
      use: { ...devices["Pixel 5"] },
    },
  ],
});
