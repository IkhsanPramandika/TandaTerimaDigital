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

> Login adalah fungsi portal **existing** dan di luar scope Tanda Terima Digital, sehingga cakupannya sengaja minimal (1 positif + 1 negatif). Autentikasi requester untuk test lain ditangani oleh `global-setup`.

| ID     | Deskripsi                                        | Priority | Tag                     |
| ------ | ------------------------------------------------ | -------- | ----------------------- |
| TC-001 | Login berhasil dengan kredensial requester valid | High     | `@smoke @positive`      |
| TC-002 | Login gagal dengan kredensial tidak valid        | High     | `@regression @negative` |

### TC-001: Login berhasil dengan kredensial requester valid

- **Precondition:** User `requester` terdaftar dan aktif.
- **Steps:**
  1. Buka halaman login.
  2. Isi username & password requester dari `process.env`.
  3. Klik tombol Login lalu masuk ke aplikasi "NEW MYAPPS - DEV".
- **Expected Result:** Keluar dari halaman `/login` dan mendarat di domain aplikasi (`dev-newmyapps`).

### TC-002: Login gagal dengan kredensial tidak valid

- **Precondition:** Menggunakan `invalidUser` dari `users.json`.
- **Steps:**
  1. Buka halaman login.
  2. Isi username & password yang salah.
  3. Klik tombol Login.
- **Expected Result:** Tetap di halaman login & form login masih tampil (gagal masuk).
