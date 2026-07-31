# Prompt 11 — Setup Global Setup & Fixtures

Gunakan prompt ini untuk mengatur login global dan fixtures per role.

---

@workspace

**Login URL:** https://dev-myapps.intra.cmk.co.id/login

**Tugas:**

1. **Update `global-setup.ts`:**
   - Login sebagai **requester** menggunakan `process.env.REQUESTER_USERNAME` & `process.env.REQUESTER_PASSWORD`
   - Simpan authenticated session ke `auth.json` (`storageState`)
   - `console.log` sukses

2. **Update `fixtures/auth.fixture.ts`:**
   - Buat fixture per role: `requesterPage`, `approver1Page` s/d `approver5Page`
   - Setiap fixture: buat context baru → goto LOGIN_URL → isi credential dari `process.env` → klik Login → `use(page)` → `context.close()`
   - Export `test` dan `expect`

3. **Update `playwright.config.ts`:**
   - Daftarkan `globalSetup: require.resolve('./global-setup')`

**Aturan wajib:** semua credential dari `process.env`, TIDAK boleh hardcoded.
