import { Page, Locator, expect } from "@playwright/test";

/**
 * Page Object for the "Tanda Terima Digital" module.
 * Covers: list, tambah, edit, detail, pratinjau cetak, view bukti, approval.
 * Semua selector tanda terima berada di sini.
 */
export class TandaTerimaPage {
  readonly page: Page;
  readonly menuTandaTerima: Locator;
  readonly tambahButton: Locator;
  readonly kategoriSelect: Locator;
  readonly penerimaInput: Locator;
  readonly keteranganInput: Locator;
  readonly simpanButton: Locator;
  readonly tabel: Locator;
  readonly pratinjauButton: Locator;
  readonly setujuiButton: Locator;
  readonly tolakButton: Locator;
  readonly statusBadge: Locator;
  readonly viewBukti: Locator;
  readonly successNotification: Locator;
  readonly errorMessage: Locator;
  readonly searchInput: Locator;
  readonly searchButton: Locator;
  readonly exportButton: Locator;
  readonly pageSizeSelect: Locator;
  readonly tujuanPemberian: Locator;
  readonly tujuanPeminjaman: Locator;
  readonly lokasiTujuanInput: Locator;
  readonly deskripsiApprovalInput: Locator;

  constructor(page: Page) {
    this.page = page;
    this.menuTandaTerima = page.getByRole("link", { name: /tanda terima/i });
    this.tambahButton = page.getByRole("button", { name: /tambah/i });
    this.kategoriSelect = page.locator('select[name="kategori"]');
    this.penerimaInput = page.locator('input[name="penerima"]');
    this.keteranganInput = page.locator('textarea[name="keterangan"]');
    this.simpanButton = page.getByRole("button", { name: /simpan/i });
    this.tabel = page.locator("table");
    this.pratinjauButton = page.getByRole("button", {
      name: /pratinjau|cetak/i,
    });
    this.setujuiButton = page.getByRole("button", { name: /setuju|approve/i });
    this.tolakButton = page.getByRole("button", { name: /tolak|reject/i });
    this.statusBadge = page.locator('[data-testid="status"]');
    this.viewBukti = page.locator('[data-testid="bukti-view"], img');
    this.successNotification = page.locator('.alert-success, [role="status"]');
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
    this.exportButton = page.getByRole("button", { name: /export|excel/i });
    this.pageSizeSelect = page.locator(
      'select[name="pageSize"], select[aria-label*="show" i], select[aria-label*="entries" i]',
    );
    this.tujuanPemberian = page.getByLabel(/pemberian/i);
    this.tujuanPeminjaman = page.getByLabel(/peminjaman/i);
    this.lokasiTujuanInput = page.locator(
      'input[name="lokasiTujuan"], textarea[name="lokasiTujuan"]',
    );
    this.deskripsiApprovalInput = page.locator('textarea[name="deskripsi"]');
  }

  /** Navigate to the Tanda Terima list page. */
  async goto(): Promise<void> {
    const appUrl = process.env.APP_URL as string;
    await this.page.goto(appUrl);
    await this.page.waitForLoadState("networkidle");
  }

  /** Open the "tambah tanda terima" form. */
  async openTambahForm(): Promise<void> {
    await this.tambahButton.click();
  }

  /** Fill the tanda terima form. */
  async fillForm(
    penerima: string,
    keterangan: string,
    kategori?: string,
  ): Promise<void> {
    if (kategori) {
      await this.kategoriSelect.selectOption({ label: kategori });
    }
    await this.penerimaInput.fill(penerima);
    await this.keteranganInput.fill(keterangan);
  }

  /** Submit the form. */
  async simpan(): Promise<void> {
    await this.simpanButton.click();
  }

  /** Create a tanda terima end-to-end. */
  async tambahTandaTerima(
    penerima: string,
    keterangan: string,
    kategori?: string,
  ): Promise<void> {
    await this.openTambahForm();
    await this.fillForm(penerima, keterangan, kategori);
    await this.simpan();
  }

  /** Open the detail of the row matching the given text. */
  async openDetail(rowText: string): Promise<void> {
    const row = this.page.getByRole("row", { name: new RegExp(rowText, "i") });
    await row.getByRole("button", { name: /detail/i }).click();
    await this.page.waitForLoadState("networkidle");
  }

  /** Open the edit form of the row matching the given text. */
  async openEdit(rowText: string): Promise<void> {
    const row = this.page.getByRole("row", { name: new RegExp(rowText, "i") });
    await row.getByRole("button", { name: /edit/i }).click();
  }

  /** Open print preview from the detail page. */
  async openPratinjauCetak(): Promise<void> {
    await this.pratinjauButton.click();
  }

  /** Approve the current tanda terima (as an approver). */
  async setujui(): Promise<void> {
    await this.setujuiButton.click();
    await this.page.waitForLoadState("networkidle");
  }

  /** Reject the current tanda terima (as an approver). */
  async tolak(): Promise<void> {
    await this.tolakButton.click();
    await this.page.waitForLoadState("networkidle");
  }

  /** Assert the list table is visible. */
  async expectTableVisible(): Promise<void> {
    await expect(this.tabel).toBeVisible();
  }

  /** Assert a success notification appeared. */
  async expectSuccess(): Promise<void> {
    await expect(this.successNotification).toBeVisible();
  }

  /** Assert a row containing the given text exists. */
  async expectRowExists(rowText: string): Promise<void> {
    await expect(
      this.page.getByRole("cell", { name: new RegExp(rowText, "i") }),
    ).toBeVisible();
  }

  /** Assert the status badge shows the expected value. */
  async expectStatus(status: string | RegExp): Promise<void> {
    await expect(this.statusBadge).toContainText(status);
  }

  /** Assert the bukti (evidence) view is visible on the detail page. */
  async expectBuktiVisible(): Promise<void> {
    await expect(this.viewBukti.first()).toBeVisible();
  }

  /** Search tanda terima by keyword (auto-filter on type). */
  async search(keyword: string): Promise<void> {
    await this.searchInput.fill(keyword);
    await this.page.waitForLoadState("networkidle");
  }

  /** Change the page size (5/10/25/50). */
  async setPageSize(size: string): Promise<void> {
    await this.pageSizeSelect.selectOption(size);
    await this.page.waitForLoadState("networkidle");
  }

  /** Cancel (batalkan) the row matching the given text and confirm the popup. */
  async batalkan(rowText: string): Promise<void> {
    const row = this.page.getByRole("row", { name: new RegExp(rowText, "i") });
    await row.getByRole("button", { name: /batal|cancel/i }).click();
    await this.page
      .getByRole("button", { name: /ya|konfirmasi|lanjut|batalkan/i })
      .last()
      .click();
    await this.page.waitForLoadState("networkidle");
  }

  /** Approve as Atasan 1 with a mandatory description note. */
  async setujuiDenganDeskripsi(deskripsi: string): Promise<void> {
    await this.deskripsiApprovalInput.fill(deskripsi);
    await this.setujui();
  }

  /** Assert an error/validation message appeared. */
  async expectError(): Promise<void> {
    await expect(this.errorMessage.first()).toBeVisible();
  }

  /** Assert the approve button is not available (disabled or absent). */
  async expectApproveUnavailable(): Promise<void> {
    const count = await this.setujuiButton.count();
    if (count > 0) {
      await expect(this.setujuiButton.first()).toBeDisabled();
    } else {
      await expect(this.setujuiButton).toHaveCount(0);
    }
  }
}
