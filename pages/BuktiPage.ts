import { Page, Locator, expect } from "@playwright/test";

/**
 * Page Object for the upload bukti (penerimaan & pengembalian) module.
 * Semua selector upload bukti berada di sini.
 */
export class BuktiPage {
  readonly page: Page;
  readonly uploadPenerimaanButton: Locator;
  readonly uploadPengembalianButton: Locator;
  readonly inputPenerimaan: Locator;
  readonly inputPengembalian: Locator;
  readonly simpanUploadButton: Locator;
  readonly preview: Locator;
  readonly successNotification: Locator;
  readonly errorMessage: Locator;
  readonly gantiFileButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.uploadPenerimaanButton = page.getByRole("button", {
      name: /upload bukti penerimaan/i,
    });
    this.uploadPengembalianButton = page.getByRole("button", {
      name: /upload bukti pengembalian/i,
    });
    this.inputPenerimaan = page.locator('input[name="buktiPenerimaan"]');
    this.inputPengembalian = page.locator('input[name="buktiPengembalian"]');
    this.simpanUploadButton = page.getByRole("button", {
      name: /simpan|upload/i,
    });
    this.preview = page.locator('[data-testid="bukti-view"], img');
    this.successNotification = page.locator('.alert-success, [role="status"]');
    this.errorMessage = page.locator('.alert-danger, [role="alert"]');
    this.gantiFileButton = page.getByRole("button", { name: /ganti file/i });
  }

  /** Upload bukti penerimaan from a local file path. */
  async uploadPenerimaan(filePath: string): Promise<void> {
    await this.uploadPenerimaanButton.click();
    await this.inputPenerimaan.setInputFiles(filePath);
    await this.simpanUploadButton.click();
    await this.page.waitForLoadState("networkidle");
  }

  /** Upload bukti pengembalian from a local file path. */
  async uploadPengembalian(filePath: string): Promise<void> {
    await this.uploadPengembalianButton.click();
    await this.inputPengembalian.setInputFiles(filePath);
    await this.simpanUploadButton.click();
    await this.page.waitForLoadState("networkidle");
  }

  /** Open the penerimaan upload dialog without selecting a file. */
  async openPenerimaanDialog(): Promise<void> {
    await this.uploadPenerimaanButton.click();
  }

  /** Confirm upload (used for negative tests). */
  async confirmUpload(): Promise<void> {
    await this.simpanUploadButton.click();
  }

  /** Assert a success notification appeared. */
  async expectSuccess(): Promise<void> {
    await expect(this.successNotification).toBeVisible();
  }

  /** Assert the uploaded preview is visible. */
  async expectPreviewVisible(): Promise<void> {
    await expect(this.preview.first()).toBeVisible();
  }

  /** Select a bukti penerimaan file without confirming (for validation tests). */
  async selectPenerimaanFile(filePath: string): Promise<void> {
    await this.openPenerimaanDialog();
    await this.inputPenerimaan.setInputFiles(filePath);
  }

  /** Assert an error/validation message appeared. */
  async expectError(): Promise<void> {
    await expect(this.errorMessage.first()).toBeVisible();
  }
}
