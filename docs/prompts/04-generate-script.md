# Prompt 04 — Generate Script Playwright

Gunakan prompt ini untuk menghasilkan script Playwright dari test case.

---

@workspace

Kamu adalah seorang **QA Automation Engineer profesional**.

**Baca terlebih dahulu:**

- `docs/WORKFLOW.md` — untuk konvensi penamaan, aturan wajib, users & role
- `docs/features/[NAMA FITUR].md` — untuk daftar test case dan selector

**Tugas:**

1. **Generate `tests/[namafitur].spec.ts`** yang berisi:
   - Semua test case (TC-XXX) dari file `.md`
   - Credential dari `process.env` (TIDAK boleh hardcoded)
   - Gunakan `test-data/users.json` untuk data user
   - Setiap test WAJIB memiliki minimal 1 assertion (`expect`)
   - Setiap test WAJIB memiliki tag (`@smoke` / `@regression` + `@positive` / `@negative` / `@edge` / `@approver`)
   - Gunakan **Page Object Model** dan **fixtures** (`fixtures/auth.fixture.ts`)

2. **Generate `pages/[NamaFitur]Page.ts`** yang berisi:
   - Semua selector dari file `.md`
   - Satu method per aksi (mis. `fillForm()`, `submit()`, `approve()`)

Pastikan tidak ada selector di dalam file test — semua selector harus berada di Page Object.
