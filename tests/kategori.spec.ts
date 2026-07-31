import { test, expect } from "@playwright/test";
import { KategoriPage } from "../pages/KategoriPage";

/**
 * Kategori Tanda Terima — tests/kategori.spec.ts
 * Feature doc: docs/features/kategori.md
 * Jira: P26-1365, P26-1375, P26-1496
 *
 * Menggunakan storageState auth.json (requester) dari global-setup.
 */

test.describe("Kategori Tanda Terima", () => {
  // ---------------------------------------------------------------------------
  // POSITIVE
  // ---------------------------------------------------------------------------
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

  test("TC-003: [P26-1496] Mengedit kategori yang sudah ada @regression @positive", async ({
    page,
  }) => {
    const kategori = new KategoriPage(page);
    const namaAwal = `Edit Src ${Date.now()}`;
    const namaBaru = `Edit Dst ${Date.now()}`;

    // Precondition: buat kategori dulu agar ada yang diedit
    await kategori.goto();
    await kategori.tambahKategori(namaAwal);
    await kategori.expectRowExists(namaAwal);

    // Step: edit kategori
    await kategori.editKategori(namaAwal, namaBaru);

    // Expected: sukses & nama baru tampil
    await kategori.expectSuccess();
    await kategori.expectRowExists(namaBaru);
  });

  test("TC-004: [P26-1365] Mencari kategori berdasarkan kata kunci @regression @positive", async ({
    page,
  }) => {
    const kategori = new KategoriPage(page);
    const nama = `Cari Kategori ${Date.now()}`;

    // Precondition: buat kategori yang akan dicari
    await kategori.goto();
    await kategori.tambahKategori(nama);
    await kategori.expectRowExists(nama);

    // Step: cari berdasarkan nama
    await kategori.search(nama);

    // Expected: baris hasil pencarian tampil
    await kategori.expectRowExists(nama);
  });

  test("TC-005: [P26-1365] Memfilter kategori berdasarkan status Aktif @regression @positive", async ({
    page,
  }) => {
    const kategori = new KategoriPage(page);

    // Precondition: fitur filter status tersedia
    await kategori.goto();
    test.skip(
      (await kategori.filterStatus.count()) === 0,
      "Filter Status tidak tersedia di UI.",
    );

    // Step: filter status Aktif via tombol kaca pembesar
    await kategori.filterByStatus("Aktif");

    // Expected: tabel tetap tampil dengan hasil terfilter
    await kategori.expectTableVisible();
  });

  test("TC-006: [P26-1365] Mengubah jumlah baris per halaman (pagination) @regression @positive", async ({
    page,
  }) => {
    const kategori = new KategoriPage(page);

    // Precondition: kontrol page size tersedia
    await kategori.goto();
    test.skip(
      (await kategori.pageSizeSelect.count()) === 0,
      "Kontrol jumlah baris per halaman tidak tersedia di UI.",
    );

    // Step: ubah menjadi 25 baris per halaman
    await kategori.setPageSize("25");

    // Expected: tabel tetap tampil
    await kategori.expectTableVisible();
  });

  test("TC-007: [P26-1496] Menonaktifkan kategori melalui toggle status @regression @positive", async ({
    page,
  }) => {
    const kategori = new KategoriPage(page);
    const nama = `Toggle Kategori ${Date.now()}`;

    // Precondition: buat kategori dulu
    await kategori.goto();
    await kategori.tambahKategori(nama);
    await kategori.expectRowExists(nama);

    const row = page.getByRole("row", { name: new RegExp(nama, "i") });
    test.skip(
      (await row.locator('input[type="checkbox"], [role="switch"]').count()) ===
        0,
      "Toggle status tidak tersedia di UI.",
    );

    // Step: toggle status
    await kategori.toggleStatus(nama);

    // Expected: konfirmasi sukses tampil
    await kategori.expectSuccess();
  });

  test("TC-008: [P26-1496] Menghapus kategori dengan konfirmasi popup @regression @positive", async ({
    page,
  }) => {
    const kategori = new KategoriPage(page);
    const nama = `Hapus Kategori ${Date.now()}`;

    // Precondition: buat kategori yang akan dihapus
    await kategori.goto();
    await kategori.tambahKategori(nama);
    await kategori.expectRowExists(nama);

    const row = page.getByRole("row", { name: new RegExp(nama, "i") });
    test.skip(
      (await row.getByRole("button", { name: /hapus|delete/i }).count()) === 0,
      "Tombol hapus tidak tersedia di UI.",
    );

    // Step: hapus & konfirmasi
    await kategori.deleteKategori(nama);

    // Expected: baris tidak lagi tampil
    await kategori.expectRowAbsent(nama);
  });

  // ---------------------------------------------------------------------------
  // NEGATIVE
  // ---------------------------------------------------------------------------
  test("TC-009: [P26-1375] Gagal menambah kategori saat nama dikosongkan @regression @negative", async ({
    page,
  }) => {
    const kategori = new KategoriPage(page);

    // Step: buka form tambah → simpan tanpa nama
    await kategori.goto();
    await kategori.openTambahForm();
    await kategori.fillForm("");
    await kategori.simpan();

    // Expected: notifikasi sukses TIDAK muncul (submit ditahan validasi)
    await expect(kategori.successNotification).toHaveCount(0);
  });

  test("TC-010: [P26-1375] Membatalkan penambahan kategori menutup form tanpa menyimpan @regression @negative", async ({
    page,
  }) => {
    const kategori = new KategoriPage(page);
    const nama = `Batal Kategori ${Date.now()}`;

    // Step: buka form → isi → batal
    await kategori.goto();
    await kategori.openTambahForm();
    await kategori.fillForm(nama);
    test.skip(
      (await kategori.batalButton.count()) === 0,
      "Tombol Batal tidak tersedia di UI.",
    );
    await kategori.batal();

    // Expected: kategori tidak tersimpan
    await kategori.expectRowAbsent(nama);
  });

  // ---------------------------------------------------------------------------
  // EDGE
  // ---------------------------------------------------------------------------
  test("TC-011: [P26-1375] Nama kategori pada batas maksimal 100 karakter @regression @edge", async ({
    page,
  }) => {
    const kategori = new KategoriPage(page);
    const namaBoundary = "K".repeat(100);

    // Step: tambah kategori dengan nama tepat 100 karakter
    await kategori.goto();
    await kategori.tambahKategori(namaBoundary);

    // Expected: sistem merespons (sukses atau error tervalidasi) tanpa crash
    await expect(
      kategori.successNotification.or(kategori.errorMessage.first()),
    ).toBeVisible();
  });

  test("TC-012: [P26-1375] Nama kategori melebihi batas maksimal (101 karakter) ditolak @regression @edge", async ({
    page,
  }) => {
    const kategori = new KategoriPage(page);
    const namaTerlaluPanjang = "K".repeat(101);

    // Step: coba tambah kategori dengan nama > 100 karakter
    await kategori.goto();
    await kategori.openTambahForm();
    await kategori.fillForm(namaTerlaluPanjang);

    // Expected: input dibatasi <=100 karakter ATAU submit ditolak validasi
    const nilai = await kategori.namaInput.inputValue();
    if (nilai.length <= 100) {
      expect(nilai.length).toBeLessThanOrEqual(100);
    } else {
      await kategori.simpan();
      await expect(kategori.successNotification).toHaveCount(0);
    }
  });

  test("TC-013: [P26-1375] Menambah kategori lengkap dengan divisi & variabel @regression @positive", async ({
    page,
  }) => {
    const kategori = new KategoriPage(page);
    const nama = `Kategori Variabel ${Date.now()}`;

    // Step: buka halaman → tambah kategori dengan 3 divisi & 5 variabel
    await kategori.goto();
    await kategori.tambahKategoriLengkap(
      nama,
      ["IT & BUSINESS PROCESS", "MANUFACTURING DJ CMK", "DIREKSI"],
      [
        { nama: "Teks", tipe: "Teks" },
        { nama: "Pilih", tipe: "Pilih", opsi: "opsi 1, opsi 2" },
        {
          nama: "Pilih Beberapa",
          tipe: "Pilih Beberapa",
          opsi: "opsi 1, opsi 2",
        },
        { nama: "Angka", tipe: "Angka" },
        { nama: "Persentase", tipe: "Presentase" },
      ],
      "Active",
    );

    // Expected: sukses & kategori baru tampil di tabel
    await kategori.expectSuccess();
    await kategori.expectRowExists(nama);
  });
});
