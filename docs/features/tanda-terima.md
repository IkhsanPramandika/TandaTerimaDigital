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

> Catatan: selector adalah asumsi awal. Sesuaikan setelah `npm run codegen`.

## Approver Sequence

Flow: **Requester → Approver1 → Approver2 → … → Approver(n) → Approved** (min 2, max 5).

## Selector

| Nama                   | Selector                          | Keterangan          |
| ---------------------- | --------------------------------- | ------------------- | -------------------- |
| Menu Tanda Terima      | `role=link[name=/tanda terima/i]` | Navigasi ke halaman |
| Tombol Tambah          | `role=button[name=/tambah/i]`     | Buka form tambah    |
| Dropdown Kategori      | `select[name="kategori"]`         | Pilih kategori      |
| Input Nomor            | `input[name="nomor"]`             | Nomor tanda terima  |
| Input Penerima         | `input[name="penerima"]`          | Nama penerima       |
| Textarea Keterangan    | `textarea[name="keterangan"]`     | Keterangan          |
| Tombol Simpan          | `role=button[name=/simpan/i]`     | Simpan tanda terima |
| Tabel Tanda Terima     | `table`                           | Daftar tanda terima |
| Tombol Detail (baris)  | `role=button[name=/detail/i]`     | Buka detail         |
| Tombol Edit (baris)    | `role=button[name=/edit/i]`       | Edit tanda terima   |
| Tombol Pratinjau Cetak | `role=button[name=/pratinjau      | cetak/i}`           | Buka pratinjau cetak |
| Tombol Setujui         | `role=button[name=/setuju         | approve/i}`         | Approver menyetujui  |
| Tombol Tolak           | `role=button[name=/tolak          | reject/i}`          | Approver menolak     |
| Status Badge           | `[data-testid="status"]`          | Status tanda terima |
| View Bukti             | `[data-testid="bukti-view"], img` | Tampilan view bukti |
| Notifikasi Sukses      | `.alert-success, [role="status"]` | Toast sukses        |

## Test Cases

| ID     | Deskripsi                                                     | Priority | Tag                     |
| ------ | ------------------------------------------------------------- | -------- | ----------------------- |
| TC-001 | [P26-1387] Menampilkan daftar tanda terima                    | High     | `@smoke @positive`      |
| TC-002 | [P26-1397] Membuat tanda terima baru dengan data valid        | High     | `@smoke @positive`      |
| TC-003 | [P26-1397] Gagal membuat tanda terima saat field wajib kosong | Medium   | `@regression @negative` |
| TC-004 | [P26-1440] Mengedit tanda terima yang sudah ada               | High     | `@regression @positive` |
| TC-005 | [P26-1451] Menampilkan detail tanda terima                    | High     | `@regression @positive` |
| TC-006 | [P26-1445] Menampilkan pratinjau cetak tanda terima           | Medium   | `@regression @positive` |
| TC-007 | [P26-1497] Menampilkan view bukti pada halaman detail         | Medium   | `@regression @positive` |
| TC-008 | [P26-1387] Approval berjenjang minimal 2 approver             | High     | `@regression @approver` |

### TC-001: [P26-1387] Menampilkan daftar tanda terima

- **Precondition:** Requester login.
- **Steps:** Buka halaman Tanda Terima.
- **Expected Result:** Tabel daftar tampil.

### TC-002: [P26-1397] Membuat tanda terima baru dengan data valid

- **Precondition:** Requester login; minimal 1 kategori tersedia.
- **Steps:** Tambah → isi kategori, penerima, keterangan → Simpan.
- **Expected Result:** Notifikasi sukses; entri baru tampil di tabel.

### TC-003: [P26-1397] Gagal membuat tanda terima saat field wajib kosong

- **Precondition:** Form tambah terbuka.
- **Steps:** Kosongkan penerima → Simpan.
- **Expected Result:** Validasi menahan submit.

### TC-004: [P26-1440] Mengedit tanda terima yang sudah ada

- **Precondition:** Minimal 1 tanda terima berstatus draft/pending milik requester.
- **Steps:** Edit → ubah keterangan → Simpan.
- **Expected Result:** Notifikasi sukses; perubahan tersimpan.

### TC-005: [P26-1451] Menampilkan detail tanda terima

- **Precondition:** Minimal 1 tanda terima tersedia.
- **Steps:** Klik Detail pada baris.
- **Expected Result:** Halaman detail menampilkan informasi lengkap.

### TC-006: [P26-1445] Menampilkan pratinjau cetak

- **Precondition:** Berada di detail tanda terima.
- **Steps:** Klik Pratinjau Cetak.
- **Expected Result:** Pratinjau cetak tampil.

### TC-007: [P26-1497] Menampilkan view bukti pada halaman detail

- **Precondition:** Tanda terima memiliki bukti terunggah.
- **Steps:** Buka detail → lihat bagian bukti.
- **Expected Result:** Bukti (gambar) tampil di detail.

### TC-008: [P26-1387] Approval berjenjang minimal 2 approver

- **Precondition:** Requester & approver1-2 terdaftar; tanda terima diajukan.
- **Steps:** Approver1 setujui → Approver2 setujui.
- **Expected Result:** Status berubah menjadi Approved setelah approver terakhir menyetujui.
