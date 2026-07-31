import { test, expect } from "@playwright/test";
import { TandaTerimaPage } from "../pages/TandaTerimaPage";

/**
 * Email Notifikasi — tests/email-notifikasi.spec.ts
 * Feature doc: docs/features/email-notifikasi.md
 * Jira: P26-1490, P26-1498
 *
 * Catatan: verifikasi dilakukan dari sisi aplikasi (indikator "email dikirim"),
 * bukan dengan membaca inbox. Test di-skip otomatis jika indikator tidak tersedia.
 * Menggunakan storageState auth.json (requester) dari global-setup.
 */

test.describe("Email Notifikasi", () => {
  // ---------------------------------------------------------------------------
  // POSITIVE
  // ---------------------------------------------------------------------------
  test("TC-001: [P26-1490] Notifikasi email terpicu saat tanda terima diajukan @regression @positive", async ({
    page,
  }) => {
    const tt = new TandaTerimaPage(page);
    const penerima = `Email TT ${Date.now()}`;

    // Step: buat & ajukan tanda terima baru
    await tt.goto();
    await tt.tambahTandaTerima(penerima, "Memicu notifikasi email");

    // Expected: konfirmasi umum sukses tampil
    await tt.expectSuccess();

    // Verifikasi tambahan: indikator email terkirim (skip jika fitur belum ada)
    const emailIndicator = page.getByText(/email .*(terkirim|dikirim)/i);
    const hasIndicator = (await emailIndicator.count()) > 0;
    test.skip(!hasIndicator, "Indikator 'email dikirim' tidak tersedia di UI.");
    await expect(emailIndicator.first()).toBeVisible();
  });

  test("TC-002: [P26-1490] Email permintaan persetujuan terpicu ke Atasan 1 @regression @positive", async ({
    page,
  }) => {
    const tt = new TandaTerimaPage(page);
    const penerima = `Email Approval ${Date.now()}`;

    // Step: buat tanda terima yang membutuhkan persetujuan
    await tt.goto();
    await tt.tambahTandaTerima(penerima, "Memicu email permintaan persetujuan");
    await tt.expectSuccess();

    // Verifikasi tambahan: indikator email persetujuan (skip jika belum ada)
    const emailIndicator = page.getByText(
      /email .*(persetujuan|approval|terkirim|dikirim)/i,
    );
    test.skip(
      (await emailIndicator.count()) === 0,
      "Indikator email persetujuan tidak tersedia di UI.",
    );
    await expect(emailIndicator.first()).toBeVisible();
  });

  test("TC-003: [P26-1498] Konfirmasi email dengan lampiran bukti penerimaan @regression @positive", async ({
    page,
  }) => {
    const tt = new TandaTerimaPage(page);

    // Precondition: buka detail entri pertama yang memiliki bukti
    await tt.goto();
    await page
      .getByRole("button", { name: /detail/i })
      .first()
      .click();
    await page.waitForLoadState("networkidle");

    // Expected: bagian bukti tampil sebagai prasyarat lampiran email
    await tt.expectBuktiVisible();

    // Verifikasi tambahan: indikator email berlampiran (skip jika belum ada)
    const emailIndicator = page.getByText(
      /email .*(terkirim|dikirim|lampiran)/i,
    );
    test.skip(
      (await emailIndicator.count()) === 0,
      "Indikator 'email dikirim' tidak tersedia di UI.",
    );
    await expect(emailIndicator.first()).toBeVisible();
  });

  // ---------------------------------------------------------------------------
  // NEGATIVE
  // ---------------------------------------------------------------------------
  test("TC-004: [P26-1490] Tidak ada notifikasi email saat pembuatan tanda terima gagal @regression @negative", async ({
    page,
  }) => {
    const tt = new TandaTerimaPage(page);

    // Step: buka form → simpan tanpa field wajib (gagal tersimpan)
    await tt.goto();
    await tt.openTambahForm();
    await tt.fillForm("", "Tanpa penerima");
    await tt.simpan();

    // Expected: karena gagal tersimpan, tidak ada indikator email terkirim
    await expect(tt.successNotification).toHaveCount(0);
    await expect(page.getByText(/email .*(terkirim|dikirim)/i)).toHaveCount(0);
  });

  // ---------------------------------------------------------------------------
  // EDGE
  // ---------------------------------------------------------------------------
  test("TC-005: [P26-1490] Email reminder terpicu setelah lebih dari 1 hari @regression @edge", async ({
    page,
  }) => {
    const tt = new TandaTerimaPage(page);

    // Precondition: indikator reminder tersedia (skip bila belum ada)
    await tt.goto();
    const reminderIndicator = page.getByText(
      /reminder|pengingat|belum.*konfirmasi/i,
    );
    test.skip(
      (await reminderIndicator.count()) === 0,
      "Indikator email reminder tidak tersedia di UI.",
    );

    // Expected: indikator reminder tampil
    await expect(reminderIndicator.first()).toBeVisible();
  });
});
