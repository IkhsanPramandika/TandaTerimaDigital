import { chromium, FullConfig } from "@playwright/test";
import * as dotenv from "dotenv";
import { LoginPage } from "./pages/LoginPage";

// Load environment variables from .env file
dotenv.config();

/**
 * Global setup:
 * - Launches Chromium
 * - Logs in as the requester user
 * - Persists the authenticated session to auth.json for reuse across tests
 */
async function globalSetup(config: FullConfig) {
  const loginUrl = process.env.LOGIN_URL;
  const username = process.env.REQUESTER_USERNAME;
  const password = process.env.REQUESTER_PASSWORD;

  if (!loginUrl || !username || !password) {
    throw new Error(
      "Missing required environment variables: LOGIN_URL, REQUESTER_USERNAME, or REQUESTER_PASSWORD. " +
        "Please copy .env.example to .env and fill in the values.",
    );
  }

  const browser = await chromium.launch();
  const context = await browser.newContext();
  const page = await context.newPage();

  // Reuse the verified LoginPage selectors from codegen.
  const loginPage = new LoginPage(page);
  await loginPage.goto();
  await loginPage.login(username, password);
  await page.waitForLoadState("networkidle");

  // Enter the "NEW MYAPPS - DEV" application so the app session is captured.
  await loginPage.openApp();

  // Ensure we have actually landed on dev-newmyapps before saving the session,
  // so the app-origin cookies are included in auth.json.
  await page.waitForURL(/dev-newmyapps/i);

  // Persist authenticated session
  await context.storageState({ path: "auth.json" });

  await browser.close();

  console.log(
    "✅ Global setup success: requester authenticated and session saved to auth.json",
  );
}

export default globalSetup;
