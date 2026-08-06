# Fitur: Kategori Tanda Terima

Modul pengelolaan kategori tanda terima (lihat daftar, tambah, edit).

## Jira Tickets

| Ticket   | Judul                              | Status |
| -------- | ---------------------------------- | ------ |
| P26-1365 | Modul Kategori Tanda Terima        | -      |
| P26-1375 | Modul Tambah Kategori Tanda Terima | -      |
| P26-1496 | Modul Edit Kategori                | -      |

> Selector di bawah diverifikasi dari hasil `npm run codegen` pada form Tambah Kategori sebenarnya.

## Selector

| Nama                   | Selector                                                    | Keterangan                                 |
| ---------------------- | ----------------------------------------------------------- | ------------------------------------------ | ------------ |
| Menu Kategori          | `getByRole('link', { name: /kategori tanda terima/i })`     | Navigasi ke halaman                        |
| Tombol Tambah          | `getByRole('button', { name: /tambah kategori/i })`         | Buka form "+ Tambah Kategori"              |
| Dialog Tambah          | `getByRole('dialog', { name: /tambah kategori/i })`         | Popup form tambah kategori                 |
| Input Nama Kategori    | `getByRole('textbox', { name: /nama kategori/i })`          | Field nama kategori (wajib)                |
| Tombol Pilih Divisi    | `getByRole('button', { name: /pilih divisi/i })`            | Buka multiselect divisi                    |
| Checkbox Divisi        | `getByRole('checkbox', { name: <nama divisi> })`            | Pilih divisi                               |
| Konfirmasi Divisi      | `getByRole('button', { name: /divisi dipilih/i })`          | Terapkan pilihan divisi                    |
| Dropdown Status        | `dialog.getByLabel(/status/i)`                              | Status Active/Inactive                     |
| Tombol Tambah Variabel | `getByRole('button', { name: /tambah variabel/i })`         | Tambah baris variabel                      |
| Input Nama Variabel    | `getByRole('textbox', { name: /masukkan nama variabel/i })` | Nama variabel (per baris, `nth`)           |
| Dropdown Tipe Data     | `getByRole('combobox').nth(i)`                              | Teks/Pilih/Pilih Beberapa/Angka/Presentase |
| Input Opsi Variabel    | `row.getByPlaceholder(/masukkan opsi/i)`                    | Opsi (untuk tipe Pilih)                    |
| Tombol Simpan          | `getByRole('button', { name: /simpan/i })`                  | Simpan kategori                            |
| Tombol Close           | `getByRole('button', { name: /close                         | tutup/i })`                                | Tutup dialog |
| Tabel Kategori         | `table`                                                     | Tabel daftar kategori                      |
| Tombol Edit (baris)    | `row.getByRole('button', { name: /edit/i })`                | Edit kategori pada baris                   |
| Notifikasi Sukses      | `.alert-success, [role="status"]`                           | Toast sukses                               |

## Test Cases

> Cakupan sengaja dijaga **tipis (smoke saja)**. Kategori adalah master-data
> yang dimaintain 1 admin dengan risiko rendah, sehingga effort pengujian
> difokuskan ke modul Tanda Terima. Verifikasi edit/hapus/filter/pagination
> dilakukan manual/exploratory bila diperlukan.

| ID     | Deskripsi                                           | Priority | Tag                |
| ------ | --------------------------------------------------- | -------- | ------------------ |
| TC-001 | [P26-1365] Menampilkan daftar kategori tanda terima | High     | `@smoke @positive` |
| TC-002 | [P26-1375] Menambah kategori baru dengan data valid | High     | `@smoke @positive` |

### TC-001: [P26-1365] Menampilkan daftar kategori

- **Precondition:** Requester sudah login (auth.json).
- **Steps:** Buka halaman Kategori.
- **Expected Result:** Tabel daftar kategori tampil.

### TC-002: [P26-1375] Menambah kategori baru dengan data valid

- **Precondition:** Requester login, berada di halaman Kategori.
- **Steps:** Klik Tambah → isi nama & divisi → Simpan.
- **Expected Result:** Sukses (form tertutup, kembali ke daftar); kategori muncul di tabel.
