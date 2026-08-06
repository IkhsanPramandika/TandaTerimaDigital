# WORKFLOW - Tanda Terima Digital Automation Testing

Panduan kerja lengkap untuk automation testing project **Tanda Terima Digital**.

---

## 1. Tech Stack & URL Project

| Item      | Value                                             |
| --------- | ------------------------------------------------- |
| Framework | Playwright                                        |
| Language  | TypeScript                                        |
| Pattern   | Page Object Model (POM)                           |
| Base URL  | https://dev-myapps.intra.cmk.co.id                |
| Login URL | https://dev-myapps.intra.cmk.co.id/login          |
| App URL   | https://dev-newmyapps.intra.cmk.co.id/TandaTerima |

---

## 2. Konvensi Penamaan

| Elemen           | Konvensi                         | Contoh                          |
| ---------------- | -------------------------------- | ------------------------------- |
| File test        | `namafitur.spec.ts` (kebab-case) | `tanda-terima.spec.ts`          |
| File Page Object | `NamaFiturPage.ts` (PascalCase)  | `TandaTerimaPage.ts`            |
| Test Case ID     | `TC-XXX`                         | `TC-001`, `TC-045`              |
| Feature doc      | `docs/features/namafitur.md`     | `docs/features/tanda-terima.md` |
| Tag wajib        | `@smoke` atau `@regression`      | `TC-001 Login berhasil @smoke`  |

Format judul test dengan traceability Jira:

```
TC-001: [P26-1387] Membuat tanda terima baru @smoke @positive
```

---

## 3. Aturan Wajib

1. **Assertion wajib** — Setiap test WAJIB memiliki minimal 1 `expect()`.
2. **Tag wajib** — Setiap test WAJIB memiliki minimal 1 tag (`@smoke` atau `@regression`).
3. **Credential dari env** — Semua username/password WAJIB dari `process.env`, TIDAK boleh hardcoded.
4. **Selector di pages/** — Semua selector WAJIB berada di folder `pages/`, bukan di `tests/`.
5. **`.env` jangan di-commit** — File `.env` WAJIB masuk `.gitignore`.
6. **`users.json` dikosongkan** — Field username & password dikosongkan (`""`) di repo.

---

## 4. Daftar Users & Role

| User        | Env Prefix  | Role                   |
| ----------- | ----------- | ---------------------- |
| requester   | `REQUESTER` | Pembuat Tanda Terima   |
| approver1   | `APPROVER1` | Approver Level 1       |
| approver2   | `APPROVER2` | Approver Level 2       |
| approver3   | `APPROVER3` | Approver Level 3       |
| approver4   | `APPROVER4` | Approver Level 4       |
| approver5   | `APPROVER5` | Approver Level 5       |
| invalidUser | -           | Invalid User (negatif) |

---

## 5. Approver Sequence & Alur E2E

- **Atasan 1** ditetapkan **otomatis** oleh sistem dari struktur organisasi requester (tidak dipilih di form).
- **Mengetahui** dipilih manual di form (berantai). Gunakan **nama lengkap** agar tidak salah pilih orang.
- Aplikasi **tidak** menampilkan popup/toast sukses — sukses = redirect kembali ke daftar `/TandaTerima`.

**Flow persetujuan + bukti (tervalidasi E2E):**

```
Requester create ─▶ Atasan 1 (Setuju) ─▶ Mengetahui (Setuju)
   ─▶ Requester upload Bukti Pengiriman            (status: Dalam Pengiriman)
   ─▶ buka link QR ─▶ upload Bukti Penerimaan       (status: Selesai)
      (foto + nama kurir + no. telp + geolokasi)
```

Setiap approver hanya bisa menyetujui jika approver level sebelumnya telah menyetujui.
Jika Atasan 1 menolak, alur berhenti (Rejected).

> Catatan eksekusi: portal SSO membocorkan identitas antar-context bila beberapa akun login
> bersamaan, sehingga tiap peran dijalankan **berurutan** di context terpisah (open → login →
> act → close) via helper `withUser`. Upload penerimaan butuh **izin geolokasi** di context.

---

## 6. Jira Info

| Item          | Value                                                      |
| ------------- | ---------------------------------------------------------- |
| Jira Base URL | https://centralmegakencana-teamnew.atlassian.net           |
| Project Key   | `P26`                                                      |
| Epic Key      | `P26-283` (Tanda Terima Digital)                           |
| JQL Filter    | `project=P26 AND "Epic Link"=P26-283 ORDER BY created ASC` |

### Child Tickets Epic P26-283

| Ticket   | Modul                              |
| -------- | ---------------------------------- |
| P26-1365 | Modul Kategori Tanda Terima        |
| P26-1375 | Modul Tambah Kategori Tanda Terima |
| P26-1387 | Modul Tanda Terima Digital         |
| P26-1397 | Modul Tambah Tanda Terima          |
| P26-1440 | Modul Edit Tanda Terima            |
| P26-1445 | Modul Pratinjau Cetak Tanda Terima |
| P26-1451 | Modul Detail Tanda Terima          |
| P26-1480 | Modul Upload Bukti Penerimaan      |
| P26-1485 | Modul Upload Bukti Pengembalian    |
| P26-1490 | Email Notifikasi                   |
| P26-1496 | Modul Edit Kategori                |

Untuk generate feature docs otomatis dari Jira, jalankan `npm run fetch:jira`.

--

## 7. CI/CD

- **Trigger:**
  - `push` ke branch `main`
  - `pull_request` ke branch `main`
  - `schedule` setiap hari pukul **09:00 WIB** (`cron: '0 2 * * *'` UTC)
- **Workflow file:** `.github/workflows/playwright.yml`

### GitHub Secrets yang diperlukan

| Secret                                      | Keterangan                |
| ------------------------------------------- | ------------------------- |
| `BASE_URL`, `LOGIN_URL`, `APP_URL`          | URL environment           |
| `REQUESTER_USERNAME`, `REQUESTER_PASSWORD`  | Kredensial requester      |
| `APPROVER1_USERNAME` … `APPROVER5_USERNAME` | Username approver 1–5     |
| `APPROVER1_PASSWORD` … `APPROVER5_PASSWORD` | Password approver 1–5     |
| `JIRA_EMAIL`, `JIRA_API_TOKEN`              | Kredensial integrasi Jira |

---

## 8. NPM Scripts

| Script                    | Perintah                             | Penjelasan                                        |
| ------------------------- | ------------------------------------ | ------------------------------------------------- |
| `npm test`                | `playwright test`                    | Menjalankan semua test (headless)                 |
| `npm run test:headed`     | `playwright test --headed`           | Menjalankan test dengan browser terlihat          |
| `npm run test:smoke`      | `playwright test --grep @smoke`      | Menjalankan hanya test bertag `@smoke`            |
| `npm run test:regression` | `playwright test --grep @regression` | Menjalankan hanya test bertag `@regression`       |
| `npm run test:approver`   | `playwright test --grep @approver`   | Menjalankan test yang melibatkan approver         |
| `npm run codegen`         | `playwright codegen <LOGIN_URL>`     | Merekam interaksi UI menjadi kode Playwright      |
| `npm run report`          | `playwright show-report`             | Membuka HTML report hasil test terakhir           |
| `npm run fetch:jira`      | `ts-node scripts/fetch-jira.ts`      | Fetch tiket Jira & generate feature docs otomatis |
