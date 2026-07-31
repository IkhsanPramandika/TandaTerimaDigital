import { Page, Locator, expect } from "@playwright/test";

/**
 * Page Object for the login page.
 * Semua selector halaman login berada di sini.
 */
export class LoginPage {
  readonly page: Page;
  readonly usernameInput: Locator;
  readonly passwordInput: Locator;
  readonly loginButton: Locator;
  readonly appLink: Locator;
  readonly errorMessage: Locator;

  constructor(page: Page) {
    this.page = page;
    this.usernameInput = page.getByRole("textbox", { name: "User Id" });
    this.passwordInput = page.getByRole("textbox", { name: "Password" });
    this.loginButton = page.getByRole("button", { name: "Login" });
    this.appLink = page.getByRole("link", { name: "NEW MYAPPS - DEV" });
    this.errorMessage = page.locator('.alert-danger, [role="alert"]');
  }

  /** Navigate to the login page. */
  async goto(): Promise<void> {
    const loginUrl = process.env.LOGIN_URL as string;
    await this.page.goto(loginUrl);
  }

  /** Fill credentials and submit the login form. */
  async login(username: string, password: string): Promise<void> {
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
  }

  /** Click login without waiting for a specific outcome. */
  async submit(): Promise<void> {
    await this.loginButton.click();
  }

  /** Enter the "NEW MYAPPS - DEV" application from the portal after login. */
  async openApp(): Promise<void> {
    await this.appLink.click();
    await this.page.waitForLoadState("networkidle");
  }

  /** Assert that the login form is visible. */
  async expectLoaded(): Promise<void> {
    await expect(this.usernameInput).toBeVisible();
    await expect(this.passwordInput).toBeVisible();
    await expect(this.loginButton).toBeVisible();
  }
}
