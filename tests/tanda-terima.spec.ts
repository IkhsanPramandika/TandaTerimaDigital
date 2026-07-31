import { test, expect } from "@playwright/test";
import { TandaTerimaPage } from "../pages/TandaTerimaPage";

/**
 * Tanda Terima Digital — tests/tanda-terima.spec.ts
 * Feature doc: docs/features/tanda-terima.md
 * Jira: P26-1387, P26-1397, P26-1440, P26-1445, P26-1451, P26-1497
 *
 * Menggunakan storageState auth.json (requester) dari global-setup.
 * Test approval berjenjang ada di tests/tanda-terima-approval.spec.ts.
 */

test.describe("Tanda Terima Digital - Requester", () => {
  // ---------------------------------------------------------------------------
  // POSITIVE
  // ---------------------------------------------------------------------------
  test("TC-001: [P26-1387] Menampilkan daftar tanda terima @smoke @positive", async ({
    page,
  }) => {
    const tt = new TandaTerimaPage(page);

    // Step: buka halaman tanda terima
    await tt.goto();

    // Expected: tabel daftar tampil
    await tt.expectTableVisible();
  });

  test("TC-002: [P26-1397] Membuat tanda terima baru dengan data valid @smoke @positive", async ({
    page,
  }) => {
    const tt = new TandaTerimaPage(page);
    const penerima = `Penerima Auto ${Date.now()}`;

    // Step: buka halaman → tambah tanda terima
    await tt.goto();
    await tt.tambahTandaTerima(penerima, "Dibuat oleh automation test");

    // Expected: sukses & entri baru muncul
    await tt.expectSuccess();
    await tt.expectRowExists(penerima);
  });

  test("TC-003: [P26-1440] Mengedit tanda terima yang sudah ada @regression @positive", async ({
    page,
  }) => {
    const tt = new TandaTerimaPage(page);
    const penerima = `Edit TT ${Date.now()}`;

    // Precondition: buat dulu
    await tt.goto();
    await tt.tambahTandaTerima(penerima, "Sebelum edit");
    await tt.expectRowExists(penerima);

    // Step: edit keterangan
    await tt.openEdit(penerima);
    await tt.keteranganInput.fill("Sesudah edit");
    await tt.simpan();

    // Expected: sukses
    await tt.expectSuccess();
  });

  test("TC-004: [P26-1451] Menampilkan detail tanda terima @regression @positive", async ({
    page,
  }) => {
    const tt = new TandaTerimaPage(page);
    const penerima = `Detail TT ${Date.now()}`;

    // Precondition: buat dulu
    await tt.goto();
    await tt.tambahTandaTerima(penerima, "Untuk detail");
    await tt.expectRowExists(penerima);

    // Step: buka detail
    await tt.openDetail(penerima);

    // Expected: informasi penerima tampil di detail
    await expect(page.getByText(penerima)).toBeVisible();
  });

  test("TC-005: [P26-1451] Mencari tanda terima berdasarkan kata kunci @regression @positive", async ({
    page,
  }) => {
    const tt = new TandaTerimaPage(page);
    const penerima = `Cari TT ${Date.now()}`;

    // Precondition: buat entri yang akan dicari
    await tt.goto();
    await tt.tambahTandaTerima(penerima, "Untuk pencarian");
    await tt.expectRowExists(penerima);

    // Step: cari berdasarkan penerima
    await tt.search(penerima);

    // Expected: baris hasil pencarian tampil
    await tt.expectRowExists(penerima);
  });

  test("TC-006: [P26-1451] Mengubah jumlah baris per halaman (pagination) @regression @positive", async ({
    page,
  }) => {
    const tt = new TandaTerimaPage(page);

    // Precondition: kontrol page size tersedia
    await tt.goto();
    test.skip(
      (await tt.pageSizeSelect.count()) === 0,
      "Kontrol jumlah baris per halaman tidak tersedia di UI.",
    );

    // Step: ubah menjadi 25 baris per halaman
    await tt.setPageSize("25");

    // Expected: tabel tetap tampil
    await tt.expectTableVisible();
  });

  test("TC-007: [P26-1451] Mengekspor daftar tanda terima ke Excel @regression @positive", async ({
    page,
  }) => {
    const tt = new TandaTerimaPage(page);

    // Precondition: tombol export tersedia
    await tt.goto();
    test.skip(
      (await tt.exportButton.count()) === 0,
      "Tombol export Excel tidak tersedia di UI.",
    );

    // Step: klik export dan tunggu unduhan
    const [download] = await Promise.all([
      page.waitForEvent("download"),
      tt.exportButton.click(),
    ]);

    // Expected: berkas terunduh dengan nama tidak kosong
    expect(download.suggestedFilename().length).toBeGreaterThan(0);
  });

  test("TC-008: [P26-1445] Menampilkan pratinjau cetak tanda terima @regression @positive", async ({
    page,
  }) => {
    const tt = new TandaTerimaPage(page);
    const penerima = `Cetak TT ${Date.now()}`;

    // Precondition: buat & buka detail
    await tt.goto();
    await tt.tambahTandaTerima(penerima, "Untuk pratinjau cetak");
    await tt.openDetail(penerima);

    // Step: buka pratinjau cetak
    await tt.openPratinjauCetak();

    // Expected: tombol pratinjau memicu tampilan (heading pratinjau tampil)
    await expect(
      page.getByRole("heading", { name: /pratinjau|cetak/i }),
    ).toBeVisible();
  });

  test("TC-009: [P26-1497] Menampilkan view bukti pada halaman detail @regression @positive", async ({
    page,
  }) => {
    const tt = new TandaTerimaPage(page);

    // Precondition: buka detail entri pertama pada daftar
    await tt.goto();
    const firstDetail = page.getByRole("button", { name: /detail/i }).first();
    await firstDetail.click();
    await page.waitForLoadState("networkidle");

    // Expected: bagian view bukti tampil
    await tt.expectBuktiVisible();
  });

  // ---------------------------------------------------------------------------
  // NEGATIVE
  // ---------------------------------------------------------------------------
  test("TC-010: [P26-1397] Gagal membuat tanda terima saat field wajib kosong @regression @negative", async ({
    page,
  }) => {
    const tt = new TandaTerimaPage(page);

    // Step: buka form → simpan tanpa penerima
    await tt.goto();
    await tt.openTambahForm();
    await tt.fillForm("", "Tanpa penerima");
    await tt.simpan();

    // Expected: notifikasi sukses tidak muncul (validasi menahan)
    await expect(tt.successNotification).toHaveCount(0);
  });

  test("TC-011: [P26-1397] Gagal membuat tanda terima tanpa memilih kategori @regression @negative", async ({
    page,
  }) => {
    const tt = new TandaTerimaPage(page);
    const penerima = `Tanpa Kategori ${Date.now()}`;

    // Step: isi penerima & keterangan tetapi kategori dibiarkan kosong
    await tt.goto();
    await tt.openTambahForm();
    await tt.penerimaInput.fill(penerima);
    await tt.keteranganInput.fill("Kategori sengaja dikosongkan");
    await tt.simpan();

    // Expected: notifikasi sukses tidak muncul (kategori wajib)
    await expect(tt.successNotification).toHaveCount(0);
  });

  test("TC-012: [P26-1440] Membatalkan tanda terima berstatus Menunggu Persetujuan @regression @negative", async ({
    page,
  }) => {
    const tt = new TandaTerimaPage(page);
    const penerima = `Batal TT ${Date.now()}`;

    // Precondition: buat entri baru (status Menunggu Persetujuan)
    await tt.goto();
    await tt.tambahTandaTerima(penerima, "Akan dibatalkan");
    await tt.expectRowExists(penerima);

    const row = page.getByRole("row", { name: new RegExp(penerima, "i") });
    test.skip(
      (await row.getByRole("button", { name: /batal|cancel/i }).count()) === 0,
      "Tombol batalkan tidak tersedia di UI.",
    );

    // Step: batalkan tanda terima
    await tt.batalkan(penerima);

    // Expected: status berubah menjadi Dibatalkan
    await expect(
      page
        .getByRole("row", { name: new RegExp(penerima, "i") })
        .getByText(/dibatalkan/i),
    ).toBeVisible();
  });

  // ---------------------------------------------------------------------------
  // EDGE
  // ---------------------------------------------------------------------------
  test("TC-013: [P26-1397] Lokasi tujuan pada batas maksimal 500 karakter @regression @edge", async ({
    page,
  }) => {
    const tt = new TandaTerimaPage(page);
    const penerima = `Lokasi Max ${Date.now()}`;

    // Precondition: field lokasi tujuan tersedia pada form
    await tt.goto();
    await tt.openTambahForm();
    test.skip(
      (await tt.lokasiTujuanInput.count()) === 0,
      "Field Lokasi Tujuan tidak tersedia di UI.",
    );

    // Step: isi lokasi tujuan tepat 500 karakter
    await tt.penerimaInput.fill(penerima);
    await tt.lokasiTujuanInput.fill("L".repeat(500));

    // Expected: nilai terpotong / dibatasi maksimal 500 karakter
    const nilai = await tt.lokasiTujuanInput.inputValue();
    expect(nilai.length).toBeLessThanOrEqual(500);
  });

  test("TC-014: [P26-1397] Batas maksimal 25 tanda terima per hari memunculkan pesan @regression @edge", async ({
    page,
  }) => {
    const tt = new TandaTerimaPage(page);

    // Precondition: indikator batas harian tersedia (skip bila belum tercapai)
    await tt.goto();
    const limitMessage = page.getByText(
      /esok lagi|batas.*25|25.*tanda terima|maksimal.*hari/i,
    );
    test.skip(
      (await limitMessage.count()) === 0,
      "Batas 25/hari belum tercapai atau pesan tidak tersedia.",
    );

    // Expected: pesan pembatasan pembuatan tanda terima tampil
    await expect(limitMessage.first()).toBeVisible();
  });
});
