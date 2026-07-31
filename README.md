# Tanda Terima Digital — Automation Testing

Project automation testing untuk aplikasi **Tanda Terima Digital** menggunakan **Playwright + TypeScript** dengan pola **Page Object Model (POM)**. Mencakup pengujian alur pembuatan tanda terima, approval berjenjang (2–5 approver), upload bukti, hingga notifikasi email.

---

## 🧰 Tech Stack & URL

| Item      | Value                                             |
| --------- | ------------------------------------------------- |
| Framework | Playwright                                        |
| Language  | TypeScript                                        |
| Pattern   | Page Object Model (POM)                           |
| Login URL | https://dev-myapps.intra.cmk.co.id/login          |
| App URL   | https://dev-newmyapps.intra.cmk.co.id/TandaTerima |

---

## ⚙️ Cara Setup

1. **Install dependencies & browser Playwright**

   ```bash
   npm install && npx playwright install
   ```

2. **Salin `.env.example` menjadi `.env`, lalu isi semua value**

   ```bash
   cp .env.example .env
   ```

   Isi URL, kredensial `REQUESTER`, `APPROVER1` s/d `APPROVER5`, serta kredensial Jira.

3. **Setup GitHub Secrets** dari daftar variabel di `.env.example` (untuk menjalankan CI/CD).

---

## 📜 NPM Scripts

| Script                    | Penjelasan                                        |
| ------------------------- | ------------------------------------------------- |
| `npm test`                | Menjalankan semua test (headless)                 |
| `npm run test:headed`     | Menjalankan test dengan browser terlihat          |
| `npm run test:smoke`      | Menjalankan hanya test bertag `@smoke`            |
| `npm run test:regression` | Menjalankan hanya test bertag `@regression`       |
| `npm run test:approver`   | Menjalankan test yang melibatkan approver         |
| `npm run codegen`         | Merekam interaksi UI menjadi kode Playwright      |
| `npm run report`          | Membuka HTML report hasil test terakhir           |
| `npm run fetch:jira`      | Fetch tiket Jira & generate feature docs otomatis |

---

## 📁 Struktur Folder

```
TandaTerimaDigital/
├── .github/
│   └── workflows/
│       └── playwright.yml        # Pipeline CI/CD GitHub Actions
├── docs/
│   ├── WORKFLOW.md               # Panduan kerja & konvensi project
│   ├── features/                 # Test case & AC per fitur (auto dari Jira)
│   └── prompts/                  # 14 prompt template untuk Copilot
├── fixtures/
│   └── auth.fixture.ts           # Fixture login per role (requester + approver1-5)
├── pages/                        # Page Object (semua selector di sini)
├── scripts/
│   └── fetch-jira.ts             # Script fetch tiket Jira → feature docs
├── test-data/
│   └── users.json                # Data user & role (username/password kosong)
├── tests/                        # File test (*.spec.ts)
├── .env.example                  # Template environment variable
├── .gitignore                    # Ignore node_modules, .env, auth.json, dll.
├── global-setup.ts               # Login requester & simpan auth.json
├── package.json                  # Dependencies & npm scripts
├── playwright.config.ts          # Konfigurasi Playwright
├── tsconfig.json                 # Konfigurasi TypeScript
└── README.md
```

---

## 🔄 Alur Kerja (5 Langkah)

1. **`npm run fetch:jira`** — Ambil tiket Jira dari Epic P26-283 → generate `docs/features/*.md`.
2. **`npm run codegen`** — Rekam interaksi UI untuk mempercepat pembuatan selector.
3. **Prompt Copilot** — Gunakan prompt di `docs/prompts/` untuk generate test case & script.
4. **`npm run test:headed`** — Jalankan & verifikasi test secara visual.
5. **`git push`** — Push ke `main` untuk memicu CI/CD.

---

## 🗂️ Cheat Sheet 14 Prompt

| No  | File                                                                            | Kapan Dipakai        | Status      |
| --- | ------------------------------------------------------------------------------- | -------------------- | ----------- |
| 01  | [01-setup-project.md](docs/prompts/01-setup-project.md)                         | Project baru         | 🔴 Wajib    |
| 02  | [02-generate-testcase-brd.md](docs/prompts/02-generate-testcase-brd.md)         | Ada BRD/FSD          | 🔴 Wajib    |
| 03  | [03-generate-testcase-ui.md](docs/prompts/03-generate-testcase-ui.md)           | Tidak ada BRD        | 🔴 Wajib    |
| 04  | [04-generate-script.md](docs/prompts/04-generate-script.md)                     | Mau bikin script     | 🔴 Wajib    |
| 05  | [05-update-change-requirement.md](docs/prompts/05-update-change-requirement.md) | Ada CR               | 🟡 Penting  |
| 06  | [06-review-improve-script.md](docs/prompts/06-review-improve-script.md)         | Script bermasalah    | 🟡 Penting  |
| 07  | [07-rapikan-codegen.md](docs/prompts/07-rapikan-codegen.md)                     | Setelah codegen      | 🔴 Wajib    |
| 08  | [08-setup-cicd.md](docs/prompts/08-setup-cicd.md)                               | Setup CI/CD          | 🔴 Wajib    |
| 09  | [09-update-cicd.md](docs/prompts/09-update-cicd.md)                             | Update CI/CD         | 🟢 Opsional |
| 10  | [10-generate-test-data.md](docs/prompts/10-generate-test-data.md)               | Bikin test data      | 🔴 Wajib    |
| 11  | [11-setup-global-setup.md](docs/prompts/11-setup-global-setup.md)               | Setup global login   | 🔴 Wajib    |
| 12  | [12-add-tagging.md](docs/prompts/12-add-tagging.md)                             | Tambah tag test      | 🟡 Penting  |
| 13  | [13-generate-testcase-jira.md](docs/prompts/13-generate-testcase-jira.md)       | Ada tiket Jira       | 🟡 Penting  |
| 14  | [14-fetch-jira.md](docs/prompts/14-fetch-jira.md)                               | Setup integrasi Jira | 🟢 Opsional |

---

## ✅ Aturan Wajib

- Semua **credential WAJIB dari `process.env`**, tidak boleh hardcoded.
- Setiap test **WAJIB ada minimal 1 assertion** (`expect`).
- Setiap test **WAJIB ada tag** (`@smoke` atau `@regression`).
- Semua **selector WAJIB ada di folder `pages/`**, bukan di `tests/`.
- File **`.env` WAJIB ada di `.gitignore`**, jangan pernah di-commit.
- Field **username & password di `users.json` dikosongkan** (string kosong `""`).
