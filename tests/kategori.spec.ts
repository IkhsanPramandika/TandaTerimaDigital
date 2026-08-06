import { test } from "@playwright/test";
import { KategoriPage } from "../pages/KategoriPage";

/**
 * Kategori Tanda Terima — tests/kategori.spec.ts
 * Feature doc: docs/features/kategori.md
 * Jira: P26-1365, P26-1375
 *
 * Menggunakan storageState auth.json (requester) dari global-setup.
 *
 * Cakupan sengaja dijaga tipis (smoke saja): Kategori adalah master-data
 * yang dimaintain 1 admin, risiko rendah. Effort pengujian difokuskan ke
 * modul Tanda Terima. Verifikasi edit/hapus/filter/pagination dilakukan
 * manual/exploratory bila diperlukan.
 */

test.describe("Kategori Tanda Terima", () => {
  test("TC-001: [P26-1365] Menampilkan daftar kategori tanda terima @smoke @positive", async ({
    page,
  }) => {
    const kategori = new KategoriPage(page);

    // Step: buka halaman kategori
    await kategori.goto();

    // Expected: tabel daftar kategori tampil
    await kategori.expectTableVisible();
  });

  test("TC-002: [P26-1375] Menambah kategori baru dengan data valid @smoke @positive", async ({
    page,
  }) => {
    const kategori = new KategoriPage(page);
    const nama = `Kategori Otomatis ${Date.now()}`;

    // Step: buka halaman → tambah kategori
    await kategori.goto();
    await kategori.tambahKategori(nama);

    // Expected: sukses & baris muncul
    await kategori.expectSuccess();
    await kategori.expectRowExists(nama);
  });
});
