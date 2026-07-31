import { test as base, expect, Page } from "@playwright/test";
import * as dotenv from "dotenv";
import { LoginPage } from "../pages/LoginPage";

// Load environment variables from .env file
dotenv.config();

/**
 * Fixture type exposing one authenticated Page per role.
 */
type AuthFixture = {
  requesterPage: Page;
  approver1Page: Page;
  approver2Page: Page;
  approver3Page: Page;
  approver4Page: Page;
  approver5Page: Page;
};

/**
 * Helper: creates an isolated browser context, logs in with the given
 * credentials, hands the page to the test, then tears the context down.
 */
async function loginAs(
  browser: import("@playwright/test").Browser,
  username: string | undefined,
  password: string | undefined,
  use: (page: Page) => Promise<void>,
) {
  if (!username || !password) {
    throw new Error(
      "Missing credentials in environment variables. Check your .env file.",
    );
  }

  const context = await browser.newContext();
  const page = await context.newPage();

  // Reuse the verified LoginPage selectors from codegen.
  const loginPage = new LoginPage(page);
  await loginPage.goto();
  await loginPage.login(username, password);
  await page.waitForLoadState("networkidle");
  await loginPage.openApp();

  // Ensure the authenticated page is on dev-newmyapps before handing it to
  // the test, so sidebar navigation works from the app root.
  await page.waitForURL(/dev-newmyapps/i);

  await use(page);

  await context.close();
}

export const test = base.extend<AuthFixture>({
  requesterPage: async ({ browser }, use) => {
    await loginAs(
      browser,
      process.env.REQUESTER_USERNAME,
      process.env.REQUESTER_PASSWORD,
      use,
    );
  },

  approver1Page: async ({ browser }, use) => {
    await loginAs(
      browser,
      process.env.APPROVER1_USERNAME,
      process.env.APPROVER1_PASSWORD,
      use,
    );
  },

  approver2Page: async ({ browser }, use) => {
    await loginAs(
      browser,
      process.env.APPROVER2_USERNAME,
      process.env.APPROVER2_PASSWORD,
      use,
    );
  },

  approver3Page: async ({ browser }, use) => {
    await loginAs(
      browser,
      process.env.APPROVER3_USERNAME,
      process.env.APPROVER3_PASSWORD,
      use,
    );
  },

  approver4Page: async ({ browser }, use) => {
    await loginAs(
      browser,
      process.env.APPROVER4_USERNAME,
      process.env.APPROVER4_PASSWORD,
      use,
    );
  },

  approver5Page: async ({ browser }, use) => {
    await loginAs(
      browser,
      process.env.APPROVER5_USERNAME,
      process.env.APPROVER5_PASSWORD,
      use,
    );
  },
});

export { expect };
