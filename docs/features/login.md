# Fitur: Login (Autentikasi)

Modul autentikasi ke aplikasi Tanda Terima Digital.

- **Login URL:** https://dev-myapps.intra.cmk.co.id/login
- **App URL:** https://dev-newmyapps.intra.cmk.co.id/TandaTerima

> Selector di bawah diverifikasi dari hasil `npm run codegen` pada halaman login sebenarnya.

## Selector

| Nama           | Selector                                          | Keterangan                    |
| -------------- | ------------------------------------------------- | ----------------------------- |
| Input User Id  | `getByRole('textbox', { name: 'User Id' })`       | Field username / User Id      |
| Input Password | `getByRole('textbox', { name: 'Password' })`      | Field password                |
| Tombol Login   | `getByRole('button', { name: 'Login' })`          | Tombol submit login           |
| Link Aplikasi  | `getByRole('link', { name: 'NEW MYAPPS - DEV' })` | Masuk ke aplikasi dari portal |
| Pesan Error    | `.alert-danger, [role="alert"]`                   | Notifikasi gagal              |

## Test Cases

| ID     | Deskripsi                                        | Priority | Tag                     |
| ------ | ------------------------------------------------ | -------- | ----------------------- |
| TC-001 | Login berhasil dengan kredensial requester valid | High     | `@smoke @positive`      |
| TC-002 | Login gagal dengan kredensial tidak valid        | High     | `@regression @negative` |
| TC-003 | Login gagal dengan field dikosongkan             | Medium   | `@regression @negative` |
| TC-004 | Login berhasil untuk setiap approver (level 1-5) | High     | `@regression @approver` |

### TC-001: Login berhasil dengan kredensial requester valid

- **Precondition:** User `requester` terdaftar dan aktif.
- **Steps:**
  1. Buka halaman login.
  2. Isi username & password requester dari `process.env`.
  3. Klik tombol Login.
- **Expected Result:** Redirect keluar dari halaman `/login` dan sesi terautentikasi.

### TC-002: Login gagal dengan kredensial tidak valid

- **Precondition:** Menggunakan `invalidUser` dari `users.json`.
- **Steps:**
  1. Buka halaman login.
  2. Isi username & password yang salah.
  3. Klik tombol Login.
- **Expected Result:** Tetap di halaman login / muncul pesan error.

### TC-003: Login gagal dengan field dikosongkan

- **Precondition:** -
- **Steps:**
  1. Buka halaman login.
  2. Biarkan username & password kosong.
  3. Klik tombol Login.
- **Expected Result:** Tetap di halaman login (validasi form).

### TC-004: Login berhasil untuk setiap approver (level 1-5)

- **Precondition:** Approver 1-5 terdaftar dan kredensial tersedia di `process.env`.
- **Steps:**
  1. Untuk tiap approver, buka halaman login dan login.
- **Expected Result:** Setiap approver berhasil login (jika kredensial tersedia).
