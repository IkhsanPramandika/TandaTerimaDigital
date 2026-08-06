# Fitur: Tanda Terima Digital

Modul inti pengelolaan tanda terima: daftar, tambah, edit, detail, pratinjau cetak, dan approval berjenjang.

## Jira Tickets

| Ticket   | Judul                                           | Status |
| -------- | ----------------------------------------------- | ------ |
| P26-1387 | Modul Tanda Terima Digital                      | -      |
| P26-1397 | Modul Tambah Tanda Terima                       | -      |
| P26-1440 | Modul Edit Tanda Terima                         | -      |
| P26-1445 | Modul Pratinjau Cetak Tanda Terima              | -      |
| P26-1451 | Modul Detail Tanda Terima                       | -      |
| P26-1497 | Modul Detail Tanda Terima - tampilan view bukti | -      |
| P26-1480 | Modul Upload Bukti Penerimaan                   | -      |

> Catatan: selector di bawah sudah **tervalidasi** lewat eksekusi test E2E nyata (create → approve berjenjang → upload bukti pengiriman → upload bukti penerimaan via link QR). Aplikasi TIDAK menampilkan popup/toast sukses; indikator sukses = redirect kembali ke daftar `/TandaTerima`.

## Approver Sequence

Flow: **Requester → Atasan 1 (otomatis dari sistem) → Mengetahui (1..n) → Disetujui**.

- **Atasan 1** ditetapkan otomatis oleh sistem berdasarkan struktur organisasi requester (tidak dipilih di form). Requester `FAZHA` → Atasan 1 = `NADHIA`.
- **Mengetahui** dipilih manual di form (berantai, bisa lebih dari satu). Gunakan **nama lengkap** agar tidak salah pilih orang.
- Setelah semua approve, requester meng-upload **Bukti Pengiriman**; penerima meng-upload **Bukti Penerimaan** lewat **link QR** (halaman publik `public-upload`) → status **Selesai**.

### E2E Flow penuh

```
Requester create ─▶ Atasan 1 (Setuju) ─▶ Mengetahui (Setuju)
     ─▶ Requester upload Bukti Pengiriman  (status: Dalam Pengiriman)
     ─▶ buka link QR ─▶ upload Bukti Penerimaan (foto + kurir + geolokasi)  (status: Selesai)
```

## Selector

| Nama                    | Selector                                                                                                                                    | Keterangan                                                                                     |
| ----------------------- | ------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------- | ---------------- |
| Menu Tanda Terima       | `role=link[name=/^tanda terima/i]`                                                                                                          | Navigasi via sidebar (`BasePage`)                                                              |
| Tambah Tanda Terima     | `role=link[name=/\+ tambah tanda terima/i]`                                                                                                 | Buka form tambah                                                                               |
| Radio Jenis             | `role=radio[name="Pemberian"                                                                                                                | "Peminjaman"]`                                                                                 | Tujuan transaksi |
| Tambah Kolom            | `role=button[name=/\+ tambah kolom/i]`                                                                                                      | Buat kolom kustom                                                                              |
| Nama Label Kolom        | `role=textbox[name=/nama label kolom/i]` + `role=button[name=/buat kolom/i]`                                                                | Definisi kolom kustom                                                                          |
| Nilai Kolom Kustom      | `role=textbox[name=/enter {label}/i]`                                                                                                       | Isi kolom kustom                                                                               |
| Kategori                | `role=combobox[name=/pilih kategori/i]` + `role=option[name={kategori} exact]`                                                              | Pilih kategori barang                                                                          |
| Item Barang             | `role=textbox[name=/masukkan (no\|merk\|nama barang\|satuan)/i]`                                                                            | Kolom baris barang                                                                             |
| Jumlah                  | `role=spinbutton` (first)                                                                                                                   | Jumlah barang                                                                                  |
| Catatan Barang          | `role=textbox[name=/masukkan catatan/i]`                                                                                                    | Catatan opsional                                                                               |
| Jenis Penerima (radio)  | `role=radio[name="Customer"\|"Internal"]`                                                                                                   | **Wajib dipilih dulu**; jika belum, field "Ditujukan Ke" terkunci                              |
| Penerima (picker)       | `role=textbox[name=/klik untuk memilih {jenisPenerima}/i]`                                                                                  | Ditujukan Ke (label ikut jenis penerima)                                                       |
| Cari Orang (picker)     | `.modal.show` + `role=textbox[name=/cari nama atau jabatan/i]` + `role=button[name=/^pilih$/i]` (atau `button[data-name*=nama]`)            | Popup pilih orang (modal aktif). Ketik pakai `keyboard.type` (real keystroke), bukan `.fill()` |
| Alamat Tujuan           | `role=textbox[name=/masukkan alamat tujuan/i]`                                                                                              | Lokasi tujuan                                                                                  |
| Jenis Kurir             | `role=radio[name="Supir CMK"]`                                                                                                              | Pilih kurir                                                                                    |
| Tambah Mengetahui       | `role=button[name=/\+ tambah mengetahui/i]`                                                                                                 | Tambah baris Mengetahui                                                                        |
| Mengetahui (picker)     | `role=textbox[name=/klik untuk memilih pihak yang mengetahui/i]` (`.last()`)                                                                | Pihak Mengetahui (berantai). Form tidak punya field "Pengirim"                                 |
| Kirim                   | `role=button[name="Kirim" exact]`                                                                                                           | Submit tanda terima                                                                            |
| Action Needed           | `role=link[name=/action needed/i]` (first)                                                                                                  | Buka item menunggu aksi                                                                        |
| Approver 1 (Atasan 1)   | `role=radio[name="Setuju"]` + `/masukkan deskripsi/i` + `/kirim persetujuan/i`                                                              | Setuju level 1 (Atasan 1)                                                                      |
| Approver Mengetahui     | `role=textbox[name=/masukkan catatan/i]` + `role=button[name="Setuju" exact]`                                                               | Setuju level Mengetahui                                                                        |
| Tolak (Atasan 1)        | `role=radio[name="Tolak"]` + `/masukkan deskripsi/i` + `/kirim persetujuan/i`                                                               | Jalur penolakan                                                                                |
| Upload Bukti Pengiriman | `role=button[name=/upload file bukti pengiriman/i]` + `role=button[name=/kirim bukti pengiriman/i]`                                         | Oleh requester; sukses = teks /bukti pengiriman yang telah disubmit/                           |
| Link QR (penerimaan)    | `role=link[name=/buka link qr/i]` → `/TandaTerima/public-upload/...`                                                                        | Href dibuka di tab baru (`context().newPage().goto()`)                                         |
| Upload Bukti Penerimaan | `getByLabel(/pilih foto bukti penerimaan/i)` + `input[name="CourierName"]` + `#courierPhone` + `role=button[name=/konfirmasi penerimaan/i]` | Halaman publik QR; butuh izin geolokasi di context                                             |
| Tabel Tanda Terima      | `table` (first)                                                                                                                             | Daftar tanda terima                                                                            |
| Notifikasi Sukses       | Redirect ke daftar `/TandaTerima` (aplikasi tidak menampilkan popup/toast sukses)                                                           | Sukses = form terkirim & kembali ke daftar                                                     |

## Test Cases

Test aktual berada di dua file:

- `tests/tanda-terima.spec.ts` (requester, storageState `auth.json`)
- `tests/tanda-terima-approval.spec.ts` (multi-user via `fixtures/auth.fixture.ts`)

Data uji: `test-data/tandaterima.json` (tanpa hardcode di spec).

| File                          | ID     | Deskripsi                                                                   | Tag                     |
| ----------------------------- | ------ | --------------------------------------------------------------------------- | ----------------------- |
| tanda-terima.spec.ts          | TC-001 | [P26-1387] Menampilkan daftar tanda terima                                  | `@smoke @positive`      |
| tanda-terima.spec.ts          | TC-002 | [P26-1397] Membuat tanda terima baru (Pemberian) data valid                 | `@smoke @positive`      |
| tanda-terima.spec.ts          | TC-003 | [P26-1397] Membuat tanda terima baru (Peminjaman) data valid                | `@regression @positive` |
| tanda-terima.spec.ts          | TC-004 | [P26-1397] Gagal membuat saat field wajib kosong                            | `@regression @negative` |
| tanda-terima-approval.spec.ts | TC-005 | [P26-1387] Approval berjenjang minimal 2 approver                           | `@regression @approver` |
| tanda-terima-approval.spec.ts | TC-009 | [P26-1387] Atasan 1 menolak tanda terima (jalur Tolak)                      | `@regression @approver` |
| tanda-terima-approval.spec.ts | TC-008 | [P26-1387] E2E penuh: create → approve → bukti pengiriman + penerimaan (QR) | `@e2e`                  |

### TC-001 (list): Menampilkan daftar tanda terima

- **Precondition:** Requester login (storageState).
- **Steps:** Buka halaman Tanda Terima via sidebar.
- **Expected Result:** Tabel daftar tampil (`expectListVisible`).

### TC-002 (list): Membuat tanda terima baru (Pemberian) dengan data valid

- **Precondition:** Requester login; data dari `tandaterima.json > create`.
- **Steps:** Sidebar → `+ Tambah Tanda Terima` → isi form (jenis, kolom kustom, kategori, barang, **pilih Jenis Penerima** lalu penerima, alamat, kurir, mengetahui) → Kirim.
- **Expected Result:** Sukses — form terkirim & halaman kembali ke daftar `/TandaTerima` (`expectSuccess`).

### TC-003 (list): Membuat tanda terima baru (Peminjaman) dengan data valid

- **Precondition:** Requester login; data `create` dengan `jenis` di-override `Peminjaman`.
- **Steps:** Sama seperti TC-002; Pemberian/Peminjaman adalah radio pada form yang sama.
- **Expected Result:** Sukses — kembali ke daftar `/TandaTerima` (`expectSuccess`).

### TC-004 (list): Gagal membuat saat field wajib kosong

- **Precondition:** Requester login.
- **Steps:** Sidebar → `+ Tambah Tanda Terima` → langsung `Kirim` tanpa mengisi apa pun.
- **Expected Result:** Submit ditahan validasi — tombol Kirim masih tampil & belum kembali ke daftar (`expectSubmitBlocked`).

### TC-005 (approval): Approval berjenjang minimal 2 approver

- **Precondition:** Requester + approver1 (Atasan 1) + approver2 (Mengetahui) terdaftar (kredensial di `.env`).
- **Steps:** Requester kirim (`createApproval`) → Atasan 1 (radio Setuju + deskripsi + Kirim Persetujuan) → Mengetahui (catatan + Setuju). Tiap peran login berurutan di context terpisah.
- **Expected Result:** Tiap langkah sukses — kembali ke daftar `/TandaTerima` (`expectSuccess`).

### TC-009 (approval): Atasan 1 menolak tanda terima (jalur Tolak)

- **Precondition:** Requester + approver1 terdaftar (kredensial di `.env`).
- **Steps:** Requester kirim → Atasan 1 (radio **Tolak** + deskripsi alasan + Kirim Persetujuan).
- **Expected Result:** Penolakan terkirim & halaman kembali ke daftar `/TandaTerima` (`expectSuccess`).

### TC-008 (approval): E2E Tanda Terima penuh (`describe.serial`, `@e2e`)

- **Precondition:** Requester + approver1 + approver2 terdaftar; file bukti nyata di `test-data/files/` (`bukti-pengiriman.pdf`, `bukti-penerimaan.jpeg`).
- **Steps:**
  1. **TC-005b** — Requester create (`createApproval`) → Atasan 1 setuju → Mengetahui setuju.
  2. **TC-006** — Requester upload Bukti Pengiriman → buka link QR (tab baru) → upload Bukti Penerimaan (foto + nama kurir + no. telp + konfirmasi, izin geolokasi diberikan).
- **Expected Result:** Bukti pengiriman tersubmit (`/bukti pengiriman yang telah disubmit/`) dan penerimaan terkonfirmasi tanpa error (status **Selesai**).
