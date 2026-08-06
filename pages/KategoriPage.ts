import { Page, Locator, expect } from "@playwright/test";
import { BasePage } from "./BasePage";

/**
 * Tipe data variabel kategori (opsi dropdown "Tipe Data").
 */
export type TipeVariabel =
  | "Teks"
  | "Pilih"
  | "Pilih Beberapa"
  | "Angka"
  | "Presentase";

/**
 * Definisi satu variabel pada form Tambah Kategori.
 * `opsi` hanya relevan untuk tipe "Pilih" / "Pilih Beberapa".
 */
export type VariabelKategori = {
  nama: string;
  tipe?: TipeVariabel; // default: Teks
  opsi?: string;
};

/**
 * Page Object for the "Kategori Tanda Terima" module.
 * Covers: list, tambah (nama, divisi, status, variabel), edit, hapus, filter, search.
 * Semua selector kategori berada di sini. Selector diverifikasi dari `npm run codegen`.
 */
export class KategoriPage extends BasePage {
  readonly menuKategori: Locator;
  readonly tambahButton: Locator;
  readonly dialog: Locator;
  readonly namaInput: Locator;
  readonly pilihDivisiButton: Locator;
  readonly konfirmasiDivisiButton: Locator;
  readonly statusSelect: Locator;
  readonly tambahVariabelButton: Locator;
  readonly namaVariabelInputs: Locator;
  readonly tipeDataComboboxes: Locator;
  readonly simpanButton: Locator;
  readonly closeButton: Locator;
  readonly tabel: Locator;
  readonly errorMessage: Locator;
  readonly searchInput: Locator;
  readonly searchButton: Locator;
  readonly filterStatus: Locator;
  readonly filterDivisi: Locator;
  readonly pageSizeSelect: Locator;
  readonly batalButton: Locator;
  readonly confirmDeleteButton: Locator;

  constructor(page: Page) {
    super(page);
    this.menuKategori = page.getByRole("link", {
      name: /kategori tanda terima/i,
    });
    this.tambahButton = page.getByRole("button", { name: /tambah kategori/i });
    // Dialog aktif (Tambah/Edit Kategori) — semua field form di-scope ke sini
    // agar tidak bentrok dengan filter list (mis. search "Nama Kategori").
    this.dialog = page
      .getByRole("dialog")
      .filter({ hasText: /kategori/i })
      .last();
    this.namaInput = this.dialog.getByPlaceholder(/masukkan nama kategori/i);
    this.pilihDivisiButton = this.dialog.getByRole("button", {
      name: /pilih divisi/i,
    });
    this.konfirmasiDivisiButton = this.pilihDivisiButton;
    this.statusSelect = this.dialog.getByRole("combobox", { name: /status/i });
    this.tambahVariabelButton = this.dialog.getByRole("button", {
      name: /tambah variabel/i,
    });
    this.namaVariabelInputs = this.dialog.getByRole("textbox", {
      name: /masukkan nama variabel/i,
    });
    this.tipeDataComboboxes = this.dialog.getByRole("combobox");
    this.simpanButton = this.dialog.getByRole("button", { name: /simpan/i });
    this.closeButton = page
      .getByRole("button", { name: /close|tutup/i })
      .or(page.locator('[aria-label="Close"], [aria-label="close"]'))
      .first();
    this.tabel = page.locator("table").first();
    this.errorMessage = page.locator(
      '.alert-danger, [role="alert"], .invalid-feedback',
    );
    this.searchInput = page
      .getByPlaceholder(/cari|search/i)
      .or(page.locator('input[type="search"], input[name="search"]'))
      .first();
    this.searchButton = page
      .getByRole("button", { name: /cari|search/i })
      .or(
        page.locator(
          'button[aria-label*="cari" i], button[aria-label*="search" i]',
        ),
      )
      .first();
    this.filterStatus = page.locator('select[name="status"]');
    this.filterDivisi = page.locator('select[name="divisi"]');
    this.pageSizeSelect = page.locator(
      'select[name="pageSize"], select[aria-label*="show" i], select[aria-label*="entries" i]',
    );
    this.batalButton = page.getByRole("button", { name: /batal|cancel/i });
    this.confirmDeleteButton = page
      .getByRole("button", { name: /ya|hapus|konfirmasi|delete|lanjut/i })
      .last();
  }

  /** Navigate to the Kategori module via the sidebar (no direct deep-link). */
  async goto(): Promise<void> {
    await this.gotoApp();
    await this.openKategori();
  }

  /** Open the "Tambah Kategori" form dialog. */
  async openTambahForm(): Promise<void> {
    await this.tambahButton.click();
  }

  /** Fill the mandatory kategori name. */
  async fillForm(nama: string): Promise<void> {
    await this.namaInput.fill(nama);
  }

  /** Select one or more divisi from the inline checkbox dropdown. */
  async pilihDivisi(divisi: string[]): Promise<void> {
    await this.pilihDivisiButton.click();
    for (const nama of divisi) {
      await this.dialog
        .getByRole("checkbox", { name: nama, exact: true })
        .check();
    }
    // Tutup dropdown divisi dengan klik heading dialog (tombol "Pilih divisi"
    // berubah label setelah memilih, jadi tidak bisa dipakai untuk menutup).
    await this.dialog.getByRole("heading").first().click();
  }

  /** Set the kategori status (e.g. "Active" / "Inactive"). */
  async setStatus(status: string): Promise<void> {
    await this.statusSelect.selectOption(status);
  }

  /** Add N empty variabel rows to the form. */
  async tambahVariabel(jumlah = 1): Promise<void> {
    for (let i = 0; i < jumlah; i++) {
      await this.tambahVariabelButton.click();
    }
  }

  /** Fill a single variabel row by index (0-based). */
  async isiVariabel(index: number, variabel: VariabelKategori): Promise<void> {
    await this.namaVariabelInputs.nth(index).fill(variabel.nama);
    if (variabel.tipe && variabel.tipe !== "Teks") {
      await this.tipeDataComboboxes.nth(index).selectOption(variabel.tipe);
    }
    if (variabel.opsi) {
      const row = this.namaVariabelInputs
        .nth(index)
        .locator("xpath=ancestor::tr[1]");
      await row.getByPlaceholder(/masukkan opsi/i).fill(variabel.opsi);
    }
  }

  /** Submit the kategori form. */
  async simpan(): Promise<void> {
    await this.simpanButton.click();
  }

  /** Create a kategori (name + mandatory divisi). */
  async tambahKategori(
    nama: string,
    divisi: string[] = ["IT & BUSINESS PROCESS"],
  ): Promise<void> {
    await this.openTambahForm();
    await this.fillForm(nama);
    await this.pilihDivisi(divisi);
    await this.simpan();
  }

  /** Create a kategori end-to-end with divisi, status, and variabel. */
  async tambahKategoriLengkap(
    nama: string,
    divisi: string[],
    variabel: VariabelKategori[],
    status = "Active",
  ): Promise<void> {
    await this.openTambahForm();
    await this.fillForm(nama);
    if (divisi.length > 0) {
      await this.pilihDivisi(divisi);
    }
    await this.setStatus(status);
    await this.tambahVariabel(variabel.length);
    for (let i = 0; i < variabel.length; i++) {
      await this.isiVariabel(i, variabel[i]);
    }
    await this.simpan();
  }

  /** Open the edit form for the row matching the given name. */
  async editKategori(namaLama: string, namaBaru: string): Promise<void> {
    const row = this.page.getByRole("row", { name: new RegExp(namaLama, "i") });
    // Kolom Aksi hanya berisi satu tombol ikon (tanpa nama) yang langsung
    // membuka dialog "Edit Kategori".
    await row.getByRole("cell").last().getByRole("button").first().click();
    await expect(this.dialog).toBeVisible();
    await this.namaInput.fill(namaBaru);
    await this.simpan();
  }

  /** Close the tambah/edit dialog. */
  async close(): Promise<void> {
    await this.closeButton.click();
  }

  /** Assert the kategori table is visible. */
  async expectTableVisible(): Promise<void> {
    await expect(this.tabel).toBeVisible();
  }

  /**
   * Assert the save succeeded. Aplikasi tidak menampilkan popup/toast sukses;
   * sukses ditandai form (dialog) tertutup & halaman kembali ke daftar.
   */
  async expectSuccess(): Promise<void> {
    await expect(this.dialog).toBeHidden();
  }

  /** Assert the submit was blocked by validation: the form dialog stays open. */
  async expectSubmitBlocked(): Promise<void> {
    await expect(this.dialog).toBeVisible();
  }

  /** Assert a row with the given name exists in the table. */
  async expectRowExists(nama: string): Promise<void> {
    await expect(
      this.page.getByRole("cell", { name: new RegExp(nama, "i") }),
    ).toBeVisible();
  }

  /** Search kategori by keyword (auto-filter on type). */
  async search(keyword: string): Promise<void> {
    await this.searchInput.fill(keyword);
    await this.page.waitForLoadState("networkidle");
  }

  /** Apply a Status filter, then trigger it via the search (magnifier) button. */
  async filterByStatus(status: string): Promise<void> {
    await this.filterStatus.selectOption({ label: status });
    await this.searchButton.click();
    await this.page.waitForLoadState("networkidle");
  }

  /** Apply a Divisi filter, then trigger it via the search (magnifier) button. */
  async filterByDivisi(divisi: string): Promise<void> {
    await this.filterDivisi.selectOption({ label: divisi });
    await this.searchButton.click();
    await this.page.waitForLoadState("networkidle");
  }

  /** Change the page size (5/10/25/50). */
  async setPageSize(size: string): Promise<void> {
    await this.pageSizeSelect.selectOption(size);
    await this.page.waitForLoadState("networkidle");
  }

  /** Toggle the active/inactive status of the row matching the given name. */
  async toggleStatus(nama: string): Promise<void> {
    const row = this.page.getByRole("row", { name: new RegExp(nama, "i") });
    await row
      .locator('input[type="checkbox"], [role="switch"]')
      .first()
      .click();
    await this.page.waitForLoadState("networkidle");
  }

  /** Delete the row matching the given name and confirm the popup. */
  async deleteKategori(nama: string): Promise<void> {
    const row = this.page.getByRole("row", { name: new RegExp(nama, "i") });
    await row.getByRole("button", { name: /hapus|delete/i }).click();
    await this.confirmDeleteButton.click();
    await this.page.waitForLoadState("networkidle");
  }

  /** Close the tambah/edit popup via the Batal button. */
  async batal(): Promise<void> {
    await this.batalButton.click();
  }

  /** Assert an error/validation message appeared. */
  async expectError(): Promise<void> {
    await expect(this.errorMessage.first()).toBeVisible();
  }

  /** Assert a row with the given name is NOT present in the table. */
  async expectRowAbsent(nama: string): Promise<void> {
    await expect(
      this.page.getByRole("cell", { name: new RegExp(nama, "i") }),
    ).toHaveCount(0);
  }
}
