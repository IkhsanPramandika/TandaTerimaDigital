import { Page, Locator } from "@playwright/test";

/**
 * Base Page Object shared by all module pages.
 *
 * Alur akses sistem:
 * 1. Login di portal (dev-myapps).
 * 2. Klik link "NEW MYAPPS - DEV" → pindah ke aplikasi (dev-newmyapps).
 * 3. Navigasi antar modul HANYA lewat sidebar — tidak bisa langsung `goto`
 *    ke URL deep-link modul.
 *
 * Semua method navigasi sidebar berada di sini agar dipakai ulang oleh
 * setiap Page Object modul.
 */
export class BasePage {
  readonly page: Page;
  readonly sidebar: Locator;

  constructor(page: Page) {
    this.page = page;
    this.sidebar = page
      .getByRole("navigation")
      .or(page.locator('aside, .sidebar, [class*="sidebar" i]'))
      .first();
  }

  /**
   * Buka root aplikasi di dev-newmyapps. Titik awal sebelum klik sidebar.
   * Menggunakan session tersimpan (auth.json) sehingga tidak perlu login ulang.
   */
  async gotoApp(): Promise<void> {
    const appUrl = process.env.APP_URL as string;
    await this.page.goto(appUrl);
    await this.page.waitForLoadState("networkidle");
  }

  /**
   * Klik satu menu sidebar berdasarkan nama tampilannya.
   *
   * Sidebar adalah panel `complementary > navigation` yang tinggi dan
   * scrollable, sehingga item menu bisa berada di luar viewport. Kita
   * scroll item ke tampilan lalu klik dengan `force` agar klik tidak
   * menunggu elemen masuk viewport (yang tidak akan pernah terjadi pada
   * sidebar fixed). Navigasi tetap lewat link sidebar, bukan direct URL.
   */
  async openSidebarMenu(name: string | RegExp): Promise<void> {
    const menu = this.page.getByRole("link", { name }).first();
    await menu.scrollIntoViewIfNeeded();
    await menu.click({ force: true });
    await this.page.waitForLoadState("networkidle");
  }

  /** Sidebar → Kategori Tanda Terima */
  async openKategori(): Promise<void> {
    await this.openSidebarMenu(/kategori tanda terima/i);
  }

  /** Sidebar → Tanda Terima (Digital) */
  async openTandaTerima(): Promise<void> {
    // Nama sidebar berbentuk " Tanda Terima 2" (ikon di depan + badge angka),
    // jadi `^` tak bisa dipakai. Lookahead menolak "Kategori Tanda Terima".
    await this.openSidebarMenu(/^(?!.*kategori).*tanda terima/i);
  }

  /**
   * Buka aplikasi lalu masuk ke modul via sidebar.
   * Dipakai oleh Page Object modul pada method `goto()` masing-masing.
   */
  async gotoModul(name: string | RegExp): Promise<void> {
    await this.gotoApp();
    await this.openSidebarMenu(name);
  }
}
