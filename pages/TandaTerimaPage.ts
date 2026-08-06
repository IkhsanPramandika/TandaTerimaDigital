import { Page, Locator, expect } from "@playwright/test";
import { BasePage } from "./BasePage";

/**
 * Data pembuatan tanda terima (dipisahkan ke test-data/tandaterima.json).
 */
export type BarangItem = {
  no: string;
  merk: string;
  namaBarang: string;
  satuan: string;
  jumlah: number;
  catatan: string;
};

export type CreateTandaTerimaData = {
  jenis: string; // "Pemberian" | "Peminjaman"
  kategori: string; // mis. "ATK"
  barang: BarangItem;
  penerima: string; // Ditujukan Ke (dicari di picker)
  alamat: string; // Lokasi Tujuan
  supir: string; // Jenis Kurir, mis. "Supir CMK"
  mengetahui: string[]; // pihak Mengetahui (berantai)
  jenisPenerima?: string; // "Internal" | "Customer" | "SKK" (default: Customer)
  labelKolom?: string; // kolom tambahan kustom (opsional)
  nilaiKolom?: string;
};

/** Data unggah bukti pengiriman & penerimaan (test-data/tandaterima.json > bukti). */
export type BuktiData = {
  fileBuktiPengiriman: string;
  fileBuktiPenerimaan: string;
  kurir: { nama: string; noTelpon: string };
  geolocation: { latitude: number; longitude: number };
};

/**
 * Page Object modul "Tanda Terima Digital".
 *
 * Selector diturunkan dari hasil `npm run codegen` yang sudah dibersihkan
 * (form Tambah Tanda Terima + alur persetujuan Atasan 1 dan Mengetahui).
 * Navigasi antar modul memakai sidebar dari {@link BasePage}, bukan direct URL.
 */
export class TandaTerimaPage extends BasePage {
  readonly tambahLink: Locator;
  readonly tabel: Locator;
  readonly successNotification: Locator;

  constructor(page: Page) {
    super(page);
    this.tambahLink = page.getByRole("link", {
      name: /\+ tambah tanda terima/i,
    });
    this.tabel = page.locator("table").first();
    this.successNotification = page
      .locator(
        '.swal2-popup, .toast-success, .toast, .alert-success, [role="status"]',
      )
      .or(page.getByText(/berhasil|sukses|success/i))
      .first();
  }

  /** Buka daftar Tanda Terima lewat sidebar (bukan direct URL). */
  async goto(): Promise<void> {
    await this.gotoApp();
    await this.openTandaTerima();
  }

  /** Alias eksplisit untuk navigasi ke modul Tanda Terima. */
  async navigateToTandaTerima(): Promise<void> {
    await this.goto();
  }

  /**
   * Pilih satu orang dari dialog picker ("Pilih Internal" / "Pilih Customer" /
   * "Pilih ..."). Pencarian dipicu oleh keystroke asli (bukan fill), lalu klik
   * tombol "Pilih" pada baris hasil pertama. Dialog di-scope ke yang terakhir
   * (paling atas) karena picker bisa bertumpuk.
   */
  private async pilihOrang(trigger: Locator, nama: string): Promise<void> {
    await trigger.click();
    // Tiap field punya modal picker sendiri (Penerima/Pengirim/Mengetahui) yang
    // semuanya ada di DOM; hanya yang aktif ber-class `.show`. Scope ke situ.
    const dialog = this.page.locator(".modal.show").last();
    await dialog.waitFor({ state: "visible" });
    const search = dialog.getByRole("textbox", {
      name: /cari nama atau jabatan/i,
    });
    // Fokus dulu, lalu ketik lewat keyboard asli. `.fill()` maupun
    // `pressSequentially` di elemen tidak memicu pencarian server dengan andal
    // (input ter-render ulang), sedangkan keyboard.type setelah klik bekerja.
    await search.click();
    await this.page.keyboard.type(nama, { delay: 150 });
    // Tunggu hasil pencarian termuat, lalu pilih baris yang data-name-nya cocok
    // (mis. tombol btn-select-recipient dengan data-name) bila ada; jika tidak,
    // ambil baris pertama.
    const anyPilih = dialog.getByRole("button", { name: /^pilih$/i });
    await anyPilih.first().waitFor({ state: "visible" });
    const byName = dialog.locator(
      `button[data-name*="${nama.toUpperCase()}" i]`,
    );
    const pilih = ((await byName.count()) > 0 ? byName : anyPilih).first();
    await pilih.click();
  }

  /** Buka form Tambah Tanda Terima (tanpa mengisi). */
  async openCreateForm(): Promise<void> {
    await this.tambahLink.click();
    await this.page.waitForLoadState("networkidle");
  }

  /** Klik tombol Kirim pada form. */
  async kirim(): Promise<void> {
    await this.page.getByRole("button", { name: "Kirim", exact: true }).click();
  }

  /** Buat & kirim tanda terima end-to-end (requester). */
  async createTandaTerima(data: CreateTandaTerimaData): Promise<void> {
    await this.tambahLink.click();
    await this.page.waitForLoadState("networkidle");

    // Tujuan transaksi (Pemberian / Peminjaman)
    await this.page.getByRole("radio", { name: data.jenis }).check();

    // Kolom kustom (opsional): buat label lalu isi nilainya.
    if (data.labelKolom) {
      await this.page.getByRole("button", { name: /\+ tambah kolom/i }).click();
      await this.page
        .getByRole("textbox", { name: /nama label kolom/i })
        .fill(data.labelKolom);
      await this.page.getByRole("button", { name: /buat kolom/i }).click();
      if (data.nilaiKolom) {
        await this.page
          .getByRole("textbox", {
            name: new RegExp(`enter ${data.labelKolom}`, "i"),
          })
          .fill(data.nilaiKolom);
      }
    }

    // Kategori (Select2) → memunculkan tabel item
    const katCombo = this.page.getByRole("combobox", {
      name: /pilih kategori/i,
    });
    await katCombo.click();
    await this.page.locator(".select2-search__field").fill(data.kategori);
    await this.page
      .getByRole("option", { name: data.kategori, exact: true })
      .first()
      .click();

    // Item barang (baris pertama)
    const b = data.barang;
    await this.page.getByRole("textbox", { name: /masukkan no/i }).fill(b.no);
    await this.page
      .getByRole("textbox", { name: /masukkan merk/i })
      .fill(b.merk);
    await this.page
      .getByRole("textbox", { name: /masukkan nama barang/i })
      .fill(b.namaBarang);
    await this.page
      .getByRole("textbox", { name: /masukkan satuan/i })
      .fill(b.satuan);
    await this.page.getByRole("spinbutton").first().fill(String(b.jumlah));
    await this.page
      .getByRole("textbox", { name: /masukkan catatan/i })
      .fill(b.catatan);

    // Ditujukan Ke: WAJIB centang radio Jenis Penerima dulu agar field "Ditujukan
    // ke" aktif (default Customer), baru pilih orang dari picker.
    const jenisPenerima = data.jenisPenerima ?? "Customer";
    await this.page
      .getByRole("radio", { name: jenisPenerima, exact: true })
      .check();
    await this.pilihOrang(
      this.page.getByRole("textbox", {
        name: new RegExp(`klik untuk memilih ${jenisPenerima}`, "i"),
      }),
      data.penerima,
    );

    // Lokasi tujuan
    await this.page
      .getByRole("textbox", { name: /masukkan alamat tujuan/i })
      .fill(data.alamat);

    // Jenis kurir
    await this.page.getByRole("radio", { name: data.supir }).check();

    // Mengetahui (berantai): baris pertama sudah ada, klik "+ Tambah Mengetahui"
    // untuk baris berikutnya.
    for (let i = 0; i < data.mengetahui.length; i++) {
      if (i > 0) {
        await this.page
          .getByRole("button", { name: /\+ tambah mengetahui/i })
          .click();
      }
      // Baris yang sudah terisi menampilkan nama (tidak lagi cocok placeholder),
      // jadi trigger kosong terbaru selalu yang terakhir.
      const trigger = this.page
        .getByRole("textbox", {
          name: /klik untuk memilih pihak yang mengetahui/i,
        })
        .last();
      await this.pilihOrang(trigger, data.mengetahui[i]);
    }

    // Kirim
    await this.page.getByRole("button", { name: "Kirim", exact: true }).click();
    await this.page.waitForLoadState("networkidle");
  }

  /** Buka item pertama yang menunggu aksi ("Action needed"). */
  private async openActionNeeded(): Promise<void> {
    await this.page
      .getByRole("link", { name: /action needed/i })
      .first()
      .click();
    await this.page.waitForLoadState("networkidle");
  }

  /**
   * Persetujuan Approver Level 1 (Atasan 1):
   * radio "Setuju" + isi deskripsi + tombol "Kirim Persetujuan".
   */
  async approveLevel1(deskripsi: string): Promise<void> {
    await this.openActionNeeded();
    await this.page
      .getByRole("radio", { name: /setuju/i })
      .first()
      .check();
    await this.page
      .getByRole("textbox", { name: /masukkan deskripsi/i })
      .fill(deskripsi);
    await this.page.getByRole("button", { name: /kirim persetujuan/i }).click();
    await this.page.waitForLoadState("networkidle");
  }

  /**
   * Penolakan Approver Level 1 (Atasan 1):
   * radio "Tolak" + isi deskripsi + tombol "Kirim Persetujuan".
   */
  async rejectLevel1(deskripsi: string): Promise<void> {
    await this.openActionNeeded();
    await this.page.getByRole("radio", { name: /tolak/i }).first().check();
    await this.page
      .getByRole("textbox", { name: /masukkan deskripsi/i })
      .fill(deskripsi);
    await this.page.getByRole("button", { name: /kirim persetujuan/i }).click();
    await this.page.waitForLoadState("networkidle");
  }

  /**
   * Persetujuan Approver Level 2–4 (Mengetahui):
   * isi catatan + tombol "Setuju" (alur sama untuk tiap level).
   */
  async approveLevel2to4(catatan: string): Promise<void> {
    await this.openActionNeeded();
    await this.page
      .getByRole("textbox", { name: /masukkan catatan/i })
      .fill(catatan);
    await this.page
      .getByRole("button", { name: "Setuju", exact: true })
      .click();
    await this.page.waitForLoadState("networkidle");
  }

  /**
   * Unggah Bukti Pengiriman (oleh requester, setelah semua approval selesai):
   * buka item action needed → pilih file → kirim. Halaman tetap di detail
   * (status berubah "Dalam Pengiriman") agar bisa lanjut ke QR penerimaan.
   */
  async uploadBuktiPengiriman(filePath: string): Promise<void> {
    await this.openActionNeeded();
    await this.page
      .getByRole("button", { name: /upload file bukti pengiriman/i })
      .setInputFiles(filePath);
    await this.page
      .getByRole("button", { name: /kirim bukti pengiriman/i })
      .click();
    await this.page.waitForLoadState("networkidle");
    // Sukses: muncul daftar "Bukti Pengiriman yang Telah Disubmit".
    await this.page
      .getByText(/bukti pengiriman yang telah disubmit/i)
      .waitFor({ state: "visible" });
  }

  /**
   * Buka link "Buka Link QR (Testing)" (halaman public-upload) di tab baru.
   * Link publik (tanpa login), jadi cukup buka href-nya di page baru pada
   * context yang sama (izin geolocation sudah di-grant di context).
   */
  async openQrPopup(): Promise<Page> {
    const href = await this.page
      .getByRole("link", { name: /buka link qr/i })
      .getAttribute("href");
    if (!href) throw new Error("Link QR (public-upload) tidak ditemukan");
    const popup = await this.page.context().newPage();
    await popup.goto(href, { waitUntil: "networkidle" });
    return popup;
  }

  /**
   * Isi form Bukti Penerimaan pada halaman QR (public-upload):
   * unggah foto + data kurir + konfirmasi. Geolocation di-grant di level context.
   */
  async uploadBuktiPenerimaan(pageQR: Page, data: BuktiData): Promise<void> {
    await pageQR
      .getByLabel(/pilih foto bukti penerimaan/i)
      .setInputFiles(data.fileBuktiPenerimaan);
    await pageQR.locator('input[name="CourierName"]').fill(data.kurir.nama);
    await pageQR.locator("#courierPhone").fill(data.kurir.noTelpon);
    await pageQR
      .getByRole("button", { name: /konfirmasi penerimaan/i })
      .click();
    await pageQR.waitForLoadState("networkidle");
  }

  /** Preview bukti penerimaan pada halaman detail (setelah penerimaan). */
  async previewBuktiPenerimaan(): Promise<void> {
    await this.page.locator("#btnPreviewBuktiPenerimaan").click();
  }

  /** Assert tabel daftar tanda terima tampil. */
  async expectListVisible(): Promise<void> {
    await expect(this.tabel).toBeVisible();
  }

  /**
   * Assert aksi berhasil. Aplikasi tidak menampilkan popup/toast sukses;
   * sukses ditandai form dikirim & halaman kembali ke daftar Tanda Terima.
   */
  async expectSuccess(): Promise<void> {
    await expect(this.page).toHaveURL(/\/TandaTerima\/?$/i);
    await expect(this.tabel).toBeVisible();
  }

  /**
   * Assert submit ditahan validasi: form tidak terkirim sehingga tombol Kirim
   * masih tampil dan halaman belum kembali ke daftar Tanda Terima.
   */
  async expectSubmitBlocked(): Promise<void> {
    await expect(
      this.page.getByRole("button", { name: "Kirim", exact: true }),
    ).toBeVisible();
    await expect(this.page).not.toHaveURL(/\/TandaTerima\/?$/i);
  }
}
