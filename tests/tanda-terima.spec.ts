import { test } from "@playwright/test";
import { TandaTerimaPage } from "../pages/TandaTerimaPage";
import tandaTerima from "../test-data/tandaterima.json";

/**
 * Tanda Terima Digital — tests/tanda-terima.spec.ts
 * Feature doc: docs/features/tanda-terima.md
 * Jira: P26-1387, P26-1397
 *
 * Menggunakan storageState auth.json (requester) dari global-setup.
 * Semua data uji diambil dari test-data/tandaterima.json (tanpa hardcode).
 * Approval berjenjang ada di tests/tanda-terima-approval.spec.ts.
 */

test.describe("Tanda Terima Digital - Requester", () => {
  test("TC-001: [P26-1387] Menampilkan daftar tanda terima @smoke @positive", async ({
    page,
  }) => {
    const tt = new TandaTerimaPage(page);

    // Step: buka halaman tanda terima via sidebar (bukan direct URL)
    await tt.goto();

    // Expected: tabel daftar tampil
    await tt.expectListVisible();
  });

  test("TC-002: [P26-1397] Membuat tanda terima baru (Pemberian) dengan data valid @smoke @positive", async ({
    page,
  }) => {
    const tt = new TandaTerimaPage(page);

    // Step: buka daftar → buat tanda terima "Pemberian" dari data JSON
    await tt.goto();
    await tt.expectListVisible();
    await tt.createTandaTerima(tandaTerima.create);

    // Expected: sukses — kembali ke daftar Tanda Terima
    await tt.expectSuccess();
  });

  test("TC-003: [P26-1397] Membuat tanda terima baru (Peminjaman) dengan data valid @regression @positive", async ({
    page,
  }) => {
    const tt = new TandaTerimaPage(page);

    // Pemberian & Peminjaman adalah radio button pada form yang sama;
    // cukup ganti jenis-nya, sisa data identik.
    await tt.goto();
    await tt.expectListVisible();
    await tt.createTandaTerima({ ...tandaTerima.create, jenis: "Peminjaman" });

    // Expected: sukses — kembali ke daftar Tanda Terima
    await tt.expectSuccess();
  });

  test("TC-004: [P26-1397] Gagal membuat tanda terima saat field wajib kosong @regression @negative", async ({
    page,
  }) => {
    const tt = new TandaTerimaPage(page);

    // Step: buka form tambah → langsung Kirim tanpa mengisi apa pun
    await tt.goto();
    await tt.openCreateForm();
    await tt.kirim();

    // Expected: submit ditahan validasi — form tetap terbuka, tidak tersimpan
    await tt.expectSubmitBlocked();
  });
});
