# Fitur: Upload Bukti (Penerimaan & Pengembalian)

Modul unggah bukti penerimaan dan bukti pengembalian pada tanda terima.

## Jira Tickets

| Ticket   | Judul                           | Status |
| -------- | ------------------------------- | ------ |
| P26-1480 | Modul Upload Bukti Penerimaan   | -      |
| P26-1485 | Modul Upload Bukti Pengembalian | -      |

> Catatan: selector adalah asumsi awal. Sesuaikan setelah `npm run codegen`.
>
> **Prasyarat file:** letakkan sebuah gambar contoh di `test-data/sample-bukti.png`
> (tidak di-commit jika sensitif). Digunakan oleh test upload.

## Selector

| Nama                       | Selector                                         | Keterangan              |
| -------------------------- | ------------------------------------------------ | ----------------------- | ----------------- |
| Tombol Upload Penerimaan   | `role=button[name=/upload bukti penerimaan/i}`   | Buka dialog upload      |
| Tombol Upload Pengembalian | `role=button[name=/upload bukti pengembalian/i}` | Buka dialog upload      |
| Input File Penerimaan      | `input[name="buktiPenerimaan"]`                  | Input file penerimaan   |
| Input File Pengembalian    | `input[name="buktiPengembalian"]`                | Input file pengembalian |
| Tombol Simpan Upload       | `role=button[name=/simpan                        | upload/i}`              | Konfirmasi upload |
| Preview Bukti              | `[data-testid="bukti-view"], img`                | Preview file terunggah  |
| Notifikasi Sukses          | `.alert-success, [role="status"]`                | Toast sukses            |
| Pesan Error Validasi       | `.alert-danger, [role="alert"]`                  | Error tipe/ukuran file  |

## Test Cases

| ID     | Deskripsi                                                 | Priority | Tag                     |
| ------ | --------------------------------------------------------- | -------- | ----------------------- |
| TC-001 | [P26-1480] Upload bukti penerimaan dengan file valid      | High     | `@smoke @positive`      |
| TC-002 | [P26-1480] Preview bukti penerimaan tampil setelah upload | Medium   | `@regression @positive` |
| TC-003 | [P26-1485] Upload bukti pengembalian dengan file valid    | High     | `@regression @positive` |
| TC-004 | [P26-1480] Gagal upload saat tidak memilih file           | Medium   | `@regression @negative` |

### TC-001: [P26-1480] Upload bukti penerimaan dengan file valid

- **Precondition:** Ada tanda terima; berada di halaman detail.
- **Steps:** Klik Upload Bukti Penerimaan → pilih file → Simpan.
- **Expected Result:** Notifikasi sukses.

### TC-002: [P26-1480] Preview bukti penerimaan tampil setelah upload

- **Precondition:** Bukti penerimaan berhasil diunggah.
- **Steps:** Lihat area preview.
- **Expected Result:** Preview gambar tampil.

### TC-003: [P26-1485] Upload bukti pengembalian dengan file valid

- **Precondition:** Ada tanda terima; berada di halaman detail.
- **Steps:** Klik Upload Bukti Pengembalian → pilih file → Simpan.
- **Expected Result:** Notifikasi sukses.

### TC-004: [P26-1480] Gagal upload saat tidak memilih file

- **Precondition:** Dialog upload terbuka.
- **Steps:** Klik Simpan tanpa memilih file.
- **Expected Result:** Validasi menahan / muncul pesan error.
