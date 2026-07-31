# Prompt 01 — Setup Project Automation Testing Baru

Gunakan prompt ini untuk membuat struktur project automation testing dari awal.

---

Kamu adalah seorang **QA Automation Engineer profesional**.

Buatkan struktur lengkap project automation testing baru dengan detail berikut:

- **Framework:** Playwright
- **Language:** TypeScript
- **Pattern:** Page Object Model (POM)
- **Login URL:** https://dev-myapps.intra.cmk.co.id/login
- **App URL:** https://dev-newmyapps.intra.cmk.co.id/TandaTerima
- **Users:** requester + approver1 s/d approver5
- **Approver sequence:** minimal 2, maksimal 5

Buatkan file & folder berikut:

1. **Struktur folder** — `tests/`, `pages/`, `fixtures/`, `test-data/`, `scripts/`, `docs/`, `docs/features/`, `docs/prompts/`, `.github/workflows/`
2. **playwright.config.ts** — testDir, retries, workers, reporter, projects (chromium, firefox, mobile), globalSetup
3. **docs/WORKFLOW.md** — tech stack, konvensi penamaan, aturan wajib, users & role, approver sequence, info Jira, CI/CD, npm scripts
4. **Template docs/features/\*.md** — struktur untuk Jira tickets & acceptance criteria per fitur
5. **.env.example** — semua environment variable (URL, credential requester + approver1-5, Jira)
6. **.gitignore** — node_modules, .env, auth.json, playwright-report, test-results
7. **package.json** — semua npm scripts dan devDependencies

Pastikan mengikuti aturan wajib: credential dari `process.env`, assertion di setiap test, tag di setiap test, selector di folder `pages/`.
