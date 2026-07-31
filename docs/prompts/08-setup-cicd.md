# Prompt 08 — Setup GitHub Actions CI/CD

Gunakan prompt ini untuk membuat pipeline CI/CD GitHub Actions.

---

Kamu adalah seorang **QA Automation Engineer profesional**.

**Detail project:**

- **Repository:** IkhsanPramandika/TandaTerimaDigital
- **Branch:** main
- **Login URL:** https://dev-myapps.intra.cmk.co.id/login
- **App URL:** https://dev-newmyapps.intra.cmk.co.id/TandaTerima
- **Users:** REQUESTER + APPROVER1 s/d APPROVER5

**Tugas:**

1. **Buatkan `.github/workflows/playwright.yml`** dengan ketentuan:
   - **Trigger:** `push` ke `main`, `pull_request` ke `main`, dan `schedule` setiap hari **08:00 WIB** (`cron: '0 1 * * *'`)
   - **Steps:** checkout → setup Node 20 → `npm ci` → `npx playwright install --with-deps` → `npx playwright test`
   - **Env dari GitHub Secrets:** `BASE_URL`, `LOGIN_URL`, `APP_URL`, `REQUESTER_USERNAME/PASSWORD`, `APPROVER1` s/d `APPROVER5` `USERNAME/PASSWORD`
   - **Upload artifact:** `playwright-report/`, retention 30 hari, `if: always()`

2. **Update `playwright.config.ts`** jika perlu (mis. retries & workers untuk CI).

Sebutkan juga daftar **GitHub Secrets** yang harus dikonfigurasi di repository.
