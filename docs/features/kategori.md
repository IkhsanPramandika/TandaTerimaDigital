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

| ID     | Deskripsi                                                     | Priority | Tag                     |
| ------ | ------------------------------------------------------------- | -------- | ----------------------- |
| TC-001 | [P26-1365] Menampilkan daftar kategori tanda terima           | High     | `@smoke @positive`      |
| TC-002 | [P26-1375] Menambah kategori baru dengan data valid           | High     | `@smoke @positive`      |
| TC-003 | [P26-1496] Mengedit kategori yang sudah ada                   | High     | `@regression @positive` |
| TC-004 | [P26-1365] Mencari kategori berdasarkan kata kunci            | Medium   | `@regression @positive` |
| TC-005 | [P26-1365] Memfilter kategori berdasarkan status Aktif        | Medium   | `@regression @positive` |
| TC-006 | [P26-1365] Mengubah jumlah baris per halaman (pagination)     | Low      | `@regression @positive` |
| TC-007 | [P26-1496] Menonaktifkan kategori melalui toggle status       | Medium   | `@regression @positive` |
| TC-008 | [P26-1496] Menghapus kategori dengan konfirmasi popup         | High     | `@regression @positive` |
| TC-009 | [P26-1375] Gagal menambah kategori saat nama dikosongkan      | Medium   | `@regression @negative` |
| TC-010 | [P26-1375] Membatalkan penambahan kategori                    | Low      | `@regression @negative` |
| TC-011 | [P26-1375] Nama kategori pada batas maksimal 100 karakter     | Low      | `@regression @edge`     |
| TC-012 | [P26-1375] Nama kategori melebihi batas maksimal ditolak      | Low      | `@regression @edge`     |
| TC-013 | [P26-1375] Menambah kategori lengkap dengan divisi & variabel | High     | `@regression @positive` |

### TC-001: [P26-1365] Menampilkan daftar kategori

- **Precondition:** Requester sudah login (auth.json).
- **Steps:** Buka halaman Kategori.
- **Expected Result:** Tabel daftar kategori tampil.

### TC-002: [P26-1375] Menambah kategori baru dengan data valid

- **Precondition:** Requester login, berada di halaman Kategori.
- **Steps:** Klik Tambah → isi nama & deskripsi → Simpan.
- **Expected Result:** Notifikasi sukses tampil; kategori muncul di tabel.

### TC-003: [P26-1375] Gagal menambah kategori saat nama dikosongkan

- **Precondition:** Form tambah kategori terbuka.
- **Steps:** Kosongkan nama → Simpan.
- **Expected Result:** Validasi menahan submit / muncul pesan error.

### TC-004: [P26-1496] Mengedit kategori yang sudah ada

- **Precondition:** Minimal satu kategori tersedia.
- **Steps:** Klik Edit pada baris → ubah nama → Simpan.
- **Expected Result:** Notifikasi sukses; perubahan tersimpan.

### TC-005: [P26-1375] Nama kategori dengan karakter maksimal (edge)

- **Precondition:** Form tambah kategori terbuka.
- **Steps:** Isi nama dengan string panjang (boundary) → Simpan.
- **Expected Result:** Sistem menangani sesuai batasan (tersimpan atau ditolak dengan pesan jelas).
