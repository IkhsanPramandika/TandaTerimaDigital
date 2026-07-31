import { test, expect } from "@playwright/test";
import { LoginPage } from "../pages/LoginPage";
import users from "../test-data/users.json";

/**
 * Login (Autentikasi) — tests/login.spec.ts
 * Feature doc: docs/features/login.md
 *
 * Aturan wajib:
 * - Credential dari process.env (tidak hardcoded).
 * - Setiap test minimal 1 assertion & 1 tag.
 * - Selector hanya di pages/LoginPage.ts.
 */

// Tests in this file must run against a fresh (unauthenticated) session.
test.use({ storageState: { cookies: [], origins: [] } });

test.describe("Login - Tanda Terima Digital", () => {
  // ---------------------------------------------------------------------------
  // POSITIVE
  // ---------------------------------------------------------------------------
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

    // Expected: berhasil masuk ke aplikasi Tanda Terima
    await expect(page).toHaveURL(/TandaTerima/i);
  });

  test("TC-002: [Login] Halaman login menampilkan seluruh elemen form @smoke @positive", async ({
    page,
  }) => {
    const loginPage = new LoginPage(page);

    // Step: buka halaman login
    await loginPage.goto();

    // Expected: input username, password, dan tombol submit tampil
    await loginPage.expectLoaded();
  });

  test("TC-003: [Login] Login berhasil untuk setiap approver level 1-5 @regression @approver", async ({
    page,
  }) => {
    const loginPage = new LoginPage(page);

    for (let level = 1; level <= 5; level++) {
      const username = process.env[`APPROVER${level}_USERNAME`];
      const password = process.env[`APPROVER${level}_PASSWORD`];

      // Lewati level yang kredensialnya tidak dikonfigurasi (min 2, max 5).
      test.skip(
        !username || !password,
        `Approver level ${level} tidak dikonfigurasi`,
      );

      await loginPage.goto();
      await loginPage.login(username as string, password as string);
      await page.waitForLoadState("networkidle");

      // Expected: approver berhasil login
      await expect(page).not.toHaveURL(/\/login/);
    }
  });

  // ---------------------------------------------------------------------------
  // NEGATIVE
  // ---------------------------------------------------------------------------
  test("TC-004: [Login] Login gagal dengan kredensial tidak valid @regression @negative", async ({
    page,
  }) => {
    const loginPage = new LoginPage(page);

    // Step 1-3: login dengan invalidUser
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

  test("TC-005: [Login] Login gagal saat seluruh field dikosongkan @regression @negative", async ({
    page,
  }) => {
    const loginPage = new LoginPage(page);

    // Step: submit tanpa mengisi field
    await loginPage.goto();
    await loginPage.submit();
    await page.waitForLoadState("networkidle");

    // Expected: tetap di halaman login (validasi menahan submit)
    await expect(page).toHaveURL(/\/login/);
  });

  test("TC-006: [Login] Login gagal saat password dikosongkan @regression @negative", async ({
    page,
  }) => {
    const loginPage = new LoginPage(page);
    const username = process.env.REQUESTER_USERNAME as string;

    // Step: isi username saja lalu submit
    await loginPage.goto();
    await loginPage.usernameInput.fill(username);
    await loginPage.submit();
    await page.waitForLoadState("networkidle");

    // Expected: tetap di halaman login
    await expect(page).toHaveURL(/\/login/);
  });

  test("TC-007: [Login] Login gagal saat username dikosongkan @regression @negative", async ({
    page,
  }) => {
    const loginPage = new LoginPage(page);
    const password = process.env.REQUESTER_PASSWORD as string;

    // Step: isi password saja lalu submit
    await loginPage.goto();
    await loginPage.passwordInput.fill(password);
    await loginPage.submit();
    await page.waitForLoadState("networkidle");

    // Expected: tetap di halaman login
    await expect(page).toHaveURL(/\/login/);
  });

  // ---------------------------------------------------------------------------
  // EDGE
  // ---------------------------------------------------------------------------
  test("TC-008: [Login] Login gagal saat password salah untuk user valid @regression @edge", async ({
    page,
  }) => {
    const loginPage = new LoginPage(page);
    const username = process.env.REQUESTER_USERNAME as string;

    // Step: username valid + password salah
    await loginPage.goto();
    await loginPage.login(username, "PasswordSalah!123");
    await page.waitForLoadState("networkidle");

    // Expected: autentikasi ditolak, tetap di halaman login
    await expect(page).toHaveURL(/\/login/);
  });

  test("TC-009: [Login] Input di-trim / spasi berlebih tidak lolos autentikasi @regression @edge", async ({
    page,
  }) => {
    const loginPage = new LoginPage(page);

    // Step: kredensial dengan spasi berlebih pada nilai yang salah
    await loginPage.goto();
    await loginPage.login("   wronguser   ", "   wrongpass   ");
    await page.waitForLoadState("networkidle");

    // Expected: tetap di halaman login
    await expect(page).toHaveURL(/\/login/);
  });
});
