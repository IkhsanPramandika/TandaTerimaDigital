import { test, expect } from "@playwright/test";
import * as fs from "fs";
import * as path from "path";
import { TandaTerimaPage } from "../pages/TandaTerimaPage";
import { BuktiPage } from "../pages/BuktiPage";

/**
 * Upload Bukti (Penerimaan & Pengembalian) — tests/bukti.spec.ts
 * Feature doc: docs/features/bukti.md
 * Jira: P26-1480, P26-1485
 *
 * Menggunakan storageState auth.json (requester) dari global-setup.
 * Prasyarat: file gambar contoh di test-data/sample-bukti.png
 */

const SAMPLE_FILE = path.join("test-data", "sample-bukti.png");
const OVERSIZE_FILE = path.join("test-data", "tmp-oversize-bukti.png");
const WRONG_FORMAT_FILE = path.join("test-data", "tmp-invalid-bukti.txt");

async function openFirstDetail(page: import("@playwright/test").Page) {
  const tt = new TandaTerimaPage(page);
  await tt.goto();
  await page
    .getByRole("button", { name: /detail/i })
    .first()
    .click();
  await page.waitForLoadState("networkidle");
}

test.describe("Upload Bukti Tanda Terima", () => {
  // Lewati suite ini jika file gambar contoh belum disediakan.
  test.beforeAll(() => {
    test.skip(
      !fs.existsSync(SAMPLE_FILE),
      `File contoh ${SAMPLE_FILE} tidak ditemukan. Tambahkan gambar untuk menjalankan test upload.`,
    );
  });

  // ---------------------------------------------------------------------------
  // POSITIVE
  // ---------------------------------------------------------------------------
  test("TC-001: [P26-1480] Upload bukti penerimaan dengan file valid @smoke @positive", async ({
    page,
  }) => {
    await openFirstDetail(page);
    const bukti = new BuktiPage(page);

    // Step: upload bukti penerimaan
    await bukti.uploadPenerimaan(SAMPLE_FILE);

    // Expected: notifikasi sukses
    await bukti.expectSuccess();
  });

  test("TC-002: [P26-1480] Preview bukti penerimaan tampil setelah upload @regression @positive", async ({
    page,
  }) => {
    await openFirstDetail(page);
    const bukti = new BuktiPage(page);

    // Step: upload lalu lihat preview
    await bukti.uploadPenerimaan(SAMPLE_FILE);

    // Expected: preview tampil
    await bukti.expectPreviewVisible();
  });

  test("TC-003: [P26-1485] Upload bukti pengembalian dengan file valid @regression @positive", async ({
    page,
  }) => {
    await openFirstDetail(page);
    const bukti = new BuktiPage(page);

    // Step: upload bukti pengembalian
    await bukti.uploadPengembalian(SAMPLE_FILE);

    // Expected: notifikasi sukses
    await bukti.expectSuccess();
  });

  test("TC-004: [P26-1480] Mengganti file bukti yang telah diunggah @regression @positive", async ({
    page,
  }) => {
    await openFirstDetail(page);
    const bukti = new BuktiPage(page);

    // Step: upload awal
    await bukti.uploadPenerimaan(SAMPLE_FILE);
    await bukti.expectSuccess();

    // Precondition: tombol Ganti File tersedia
    test.skip(
      (await bukti.gantiFileButton.count()) === 0,
      "Tombol Ganti File tidak tersedia di UI.",
    );

    // Step: ganti file lalu unggah ulang
    await bukti.gantiFileButton.click();
    await bukti.inputPenerimaan.setInputFiles(SAMPLE_FILE);
    await bukti.simpanUploadButton.click();
    await page.waitForLoadState("networkidle");

    // Expected: notifikasi sukses tampil kembali
    await bukti.expectSuccess();
  });

  // ---------------------------------------------------------------------------
  // NEGATIVE
  // ---------------------------------------------------------------------------
  test("TC-005: [P26-1480] Gagal upload saat tidak memilih file @regression @negative", async ({
    page,
  }) => {
    await openFirstDetail(page);
    const bukti = new BuktiPage(page);

    // Step: buka dialog lalu simpan tanpa memilih file
    await bukti.openPenerimaanDialog();
    await bukti.confirmUpload();

    // Expected: notifikasi sukses tidak muncul (validasi menahan)
    await expect(bukti.successNotification).toHaveCount(0);
  });
});

/**
 * Validasi format & ukuran file — membuat berkas sementara sendiri sehingga
 * tidak bergantung pada test-data/sample-bukti.png.
 */
test.describe("Validasi Upload Bukti", () => {
  test.beforeAll(() => {
    // Buat berkas > 5 MB (batas maksimal FSD adalah 5 MB).
    fs.writeFileSync(OVERSIZE_FILE, Buffer.alloc(6 * 1024 * 1024, 0));
    // Buat berkas dengan format tidak didukung (.txt).
    fs.writeFileSync(WRONG_FORMAT_FILE, "bukan gambar");
  });

  test.afterAll(() => {
    for (const f of [OVERSIZE_FILE, WRONG_FORMAT_FILE]) {
      if (fs.existsSync(f)) fs.unlinkSync(f);
    }
  });

  // ---------------------------------------------------------------------------
  // EDGE
  // ---------------------------------------------------------------------------
  test("TC-006: [P26-1480] Gagal upload bukti melebihi 5 MB @regression @edge", async ({
    page,
  }) => {
    await openFirstDetail(page);
    const bukti = new BuktiPage(page);

    // Step: pilih file > 5 MB lalu simpan
    await bukti.selectPenerimaanFile(OVERSIZE_FILE);
    await bukti.confirmUpload();
    await page.waitForLoadState("networkidle");

    // Expected: upload ditolak (pesan error atau tanpa notifikasi sukses)
    await expect(bukti.successNotification).toHaveCount(0);
  });

  test("TC-007: [P26-1480] Gagal upload bukti dengan format tidak didukung @regression @edge", async ({
    page,
  }) => {
    await openFirstDetail(page);
    const bukti = new BuktiPage(page);

    // Step: pilih file .txt lalu simpan
    await bukti.selectPenerimaanFile(WRONG_FORMAT_FILE);
    await bukti.confirmUpload();
    await page.waitForLoadState("networkidle");

    // Expected: upload ditolak (format hanya JPG/PNG/PDF)
    await expect(bukti.successNotification).toHaveCount(0);
  });
});
