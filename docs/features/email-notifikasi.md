# Fitur: Email Notifikasi

Modul notifikasi email untuk alur tanda terima dan lampiran foto bukti penerimaan.

## Jira Tickets

| Ticket   | Judul                                    | Status |
| -------- | ---------------------------------------- | ------ |
| P26-1490 | Email Notifikasi                         | -      |
| P26-1498 | Email - Attachment foto bukti penerimaan | -      |

> Catatan: verifikasi isi inbox email berada di luar cakupan UI test Playwright.
> Test di sini memverifikasi **indikator dari sisi aplikasi** bahwa notifikasi email
> terpicu (mis. pesan konfirmasi "email telah dikirim"). Untuk verifikasi end-to-end
> inbox, integrasikan layanan email testing (mis. Mailosaur/Mailtrap) terpisah.

## Selector

| Nama                      | Selector                          | Keterangan        |
| ------------------------- | --------------------------------- | ----------------- | ------------------------ |
| Notifikasi Email Terkirim | `text=/email .\*(terkirim         | dikirim)/i`       | Konfirmasi email terpicu |
| Notifikasi Sukses         | `.alert-success, [role="status"]` | Toast sukses umum |

## Test Cases

| ID     | Deskripsi                                                      | Priority | Tag                     |
| ------ | -------------------------------------------------------------- | -------- | ----------------------- |
| TC-001 | [P26-1490] Notifikasi email terpicu saat tanda terima diajukan | High     | `@regression @positive` |
| TC-002 | [P26-1498] Konfirmasi email dengan lampiran bukti penerimaan   | Medium   | `@regression @positive` |

### TC-001: [P26-1490] Notifikasi email terpicu saat tanda terima diajukan

- **Precondition:** Requester login.
- **Steps:** Buat & ajukan tanda terima baru.
- **Expected Result:** Aplikasi menampilkan konfirmasi bahwa notifikasi email dikirim.

### TC-002: [P26-1498] Konfirmasi email dengan lampiran bukti penerimaan

- **Precondition:** Tanda terima memiliki bukti penerimaan terunggah.
- **Steps:** Picu aksi yang mengirim email berlampiran (mis. approve/penerimaan).
- **Expected Result:** Aplikasi mengonfirmasi email berlampiran terkirim.
