import { test, expect } from "@playwright/test";
import { Browser, Page } from "@playwright/test";
import { LoginPage } from "../pages/LoginPage";
import { TandaTerimaPage } from "../pages/TandaTerimaPage";
import tandaTerima from "../test-data/tandaterima.json";
import users from "../test-data/users.json";

/**
 * Approval Berjenjang & E2E Tanda Terima — tests/tanda-terima-approval.spec.ts
 * Feature doc: docs/features/tanda-terima.md
 * Jira: P26-1387
 *
 * Alur lengkap:
 *   CREATE (Pemberian/Peminjaman) -> APPROVE berjenjang (Atasan 1 + Mengetahui)
 *   -> UPLOAD BUKTI PENGIRIMAN (oleh requester)
 *   -> UPLOAD BUKTI PENERIMAAN via link QR (tab baru) -> SELESAI.
 *
 * PENTING: setiap peran dijalankan SECARA BERURUTAN dalam context terpisah
 * yang dibuka lalu ditutup (bukan context paralel). Portal SSO membocorkan
 * identitas antar-context bila beberapa akun login bersamaan, sehingga login
 * berurutan (open -> act -> close) wajib agar tiap peran memakai akun benar.
 *
 * Kredensial diambil dari .env (bukan di-hardcode di users.json) via envPrefix,
 * mis. REQUESTER_USERNAME / REQUESTER_PASSWORD.
 *
 * Pemetaan akun:
 * - requester  = 240637 FAZHA AQSA PRIBADI
 * - approver1  = 201045 NADHIA PRAMESWARI P  (Atasan 1, otomatis dari sistem)
 * - approver2  = 211136 SARAH MAIDA ALIFAH NURINA (Mengetahui / acknowledge)
 */

type User = { username?: string; password?: string; envPrefix?: string };

/** Ambil kredensial dari .env (via envPrefix) atau fallback literal users.json. */
function resolveCreds(user: User): { username: string; password: string } {
  if (user.envPrefix) {
    return {
      username: process.env[`${user.envPrefix}_USERNAME`] ?? "",
      password: process.env[`${user.envPrefix}_PASSWORD`] ?? "",
    };
  }
  return { username: user.username ?? "", password: user.password ?? "" };
}

/**
 * Login satu akun di context baru, jalankan aksi, lalu tutup context.
 * `opts.geolocation` memberi izin & posisi geolokasi (dibutuhkan form penerimaan).
 */
async function withUser(
  browser: Browser,
  user: User,
  fn: (page: Page) => Promise<void>,
  opts?: { geolocation?: { latitude: number; longitude: number } },
): Promise<void> {
  const { username, password } = resolveCreds(user);
  const context = await browser.newContext(
    opts?.geolocation
      ? { geolocation: opts.geolocation, permissions: ["geolocation"] }
      : {},
  );
  const page = await context.newPage();
  try {
    const login = new LoginPage(page);
    await login.goto();
    await login.login(username, password);
    await page.waitForLoadState("networkidle");
    await login.openApp();
    await page.waitForURL(/dev-newmyapps/i);
    await fn(page);
  } finally {
    await context.close();
  }
}

test.describe("Approval Berjenjang Tanda Terima", () => {
  test("TC-005: [P26-1387] Approval berjenjang minimal 2 approver @regression @approver", async ({
    browser,
  }) => {
    // 1. Requester membuat & mengirim tanda terima (data lean: 1 Mengetahui)
    await withUser(browser, users.requester, async (page) => {
      const tt = new TandaTerimaPage(page);
      await tt.goto();
      await tt.createTandaTerima(tandaTerima.createApproval);
      await tt.expectSuccess();
    });

    // 2. Approver 1 (Atasan 1): radio Setuju + deskripsi + Kirim Persetujuan
    await withUser(browser, users.approver1, async (page) => {
      const tt = new TandaTerimaPage(page);
      await tt.goto();
      await tt.approveLevel1(tandaTerima.approve.level1.deskripsi);
      await tt.expectSuccess();
    });

    // 3. Approver 2 (Mengetahui): catatan + Setuju
    await withUser(browser, users.approver2, async (page) => {
      const tt = new TandaTerimaPage(page);
      await tt.goto();
      await tt.approveLevel2to4(tandaTerima.approve.level2to4.catatan);
      await tt.expectSuccess();
    });
  });

  test("TC-009: [P26-1387] Atasan 1 menolak tanda terima (jalur Tolak) @regression @approver", async ({
    browser,
  }) => {
    // 1. Requester membuat & mengirim tanda terima
    await withUser(browser, users.requester, async (page) => {
      const tt = new TandaTerimaPage(page);
      await tt.goto();
      await tt.createTandaTerima(tandaTerima.createApproval);
      await tt.expectSuccess();
    });

    // 2. Approver 1 (Atasan 1): radio Tolak + deskripsi + Kirim Persetujuan
    await withUser(browser, users.approver1, async (page) => {
      const tt = new TandaTerimaPage(page);
      await tt.goto();
      await tt.rejectLevel1(tandaTerima.reject.level1.deskripsi);
      await tt.expectSuccess();
    });
  });
});

/**
 * E2E penuh (TC-006/007/008): satu record mengalir lintas fase secara berurutan.
 * describe.serial memastikan fase berjalan berurutan; tiap fase memakai akun
 * yang sesuai dan bekerja pada item "Action needed" terbaru (record yang sama).
 */
test.describe
  .serial("TC-008: [P26-1387] E2E Tanda Terima penuh (create → approve → bukti) @e2e", () => {
  test("TC-005b: Requester create + approval berjenjang", async ({
    browser,
  }) => {
    await withUser(browser, users.requester, async (page) => {
      const tt = new TandaTerimaPage(page);
      await tt.goto();
      await tt.createTandaTerima(tandaTerima.createApproval);
      await tt.expectSuccess();
    });
    await withUser(browser, users.approver1, async (page) => {
      const tt = new TandaTerimaPage(page);
      await tt.goto();
      await tt.approveLevel1(tandaTerima.approve.level1.deskripsi);
      await tt.expectSuccess();
    });
    await withUser(browser, users.approver2, async (page) => {
      const tt = new TandaTerimaPage(page);
      await tt.goto();
      await tt.approveLevel2to4(tandaTerima.approve.level2to4.catatan);
      await tt.expectSuccess();
    });
  });

  test("TC-006: Requester upload bukti pengiriman + penerimaan via QR", async ({
    browser,
  }) => {
    // Upload pengiriman & isi penerimaan dilakukan dalam satu sesi karena link
    // QR berada di halaman detail yang sama (setelah pengiriman di-upload).
    await withUser(
      browser,
      users.requester,
      async (page) => {
        const tt = new TandaTerimaPage(page);
        await tt.goto();
        await tt.uploadBuktiPengiriman(tandaTerima.bukti.fileBuktiPengiriman);
        const qr = await tt.openQrPopup();
        await tt.uploadBuktiPenerimaan(qr, tandaTerima.bukti);
      },
      { geolocation: tandaTerima.bukti.geolocation },
    );
  });
});

export { expect };
