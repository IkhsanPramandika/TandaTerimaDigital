import { test, expect } from "@playwright/test";
import { LoginPage } from "../pages/LoginPage";
import users from "../test-data/users.json";

/**
 * Login (Autentikasi) — tests/login.spec.ts
 * Feature doc: docs/features/login.md
 *
 * Login adalah fungsi portal yang sudah ada (existing) dan DI LUAR scope
 * Tanda Terima Digital, jadi cakupannya sengaja minimal: 1 positif (sanity
 * bahwa kredensial valid bisa masuk aplikasi) + 1 negatif (kredensial salah
 * ditolak). Autentikasi requester untuk test lain sudah ditangani global-setup.
 *
 * Aturan wajib:
 * - Credential dari process.env (tidak hardcoded).
 * - Setiap test minimal 1 assertion & 1 tag.
 * - Selector hanya di pages/LoginPage.ts.
 */

// Tests in this file must run against a fresh (unauthenticated) session.
test.use({ storageState: { cookies: [], origins: [] } });

test.describe("Login - Tanda Terima Digital", () => {
  test("TC-001: [Login] Login berhasil dengan kredensial requester valid @smoke @positive", async ({
    page,
  }) => {
    const loginPage = new LoginPage(page);
    const username = process.env.REQUESTER_USERNAME as string;
    const password = process.env.REQUESTER_PASSWORD as string;

    // Step 1: buka halaman login
    await loginPage.goto();
    await loginPage.expectLoaded();

    // Step 2 & 3: isi kredensial dan submit
    await loginPage.login(username, password);
    await page.waitForLoadState("networkidle");

    // Expected: keluar dari halaman /login
    await expect(page).not.toHaveURL(/\/login/);

    // Step 4: masuk ke aplikasi "NEW MYAPPS - DEV" dari portal
    await loginPage.openApp();

    // Expected: berhasil masuk ke domain aplikasi (landing di dashboard NEW MYAPPS)
    await expect(page).toHaveURL(/dev-newmyapps/i);
  });

  test("TC-002: [Login] Login gagal dengan kredensial tidak valid @regression @negative", async ({
    page,
  }) => {
    const loginPage = new LoginPage(page);

    // Step: login dengan invalidUser
    await loginPage.goto();
    await loginPage.login(
      users.invalidUser.username,
      users.invalidUser.password,
    );
    await page.waitForLoadState("networkidle");

    // Expected: tetap di halaman login & form login masih tampil (gagal masuk)
    await expect(page).toHaveURL(/\/login/);
    await expect(loginPage.loginButton).toBeVisible();
  });
});
