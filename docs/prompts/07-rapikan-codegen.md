# Prompt 07 — Rapikan Hasil Playwright Codegen

Gunakan prompt ini untuk merapikan output mentah dari `npm run codegen`.

---

@workspace

Kamu adalah seorang **QA Automation Engineer profesional**.

**Tugas:**

1. **Rapikan** menjadi proper Playwright test yang mengikuti struktur project.
2. **Pisahkan selector** ke `pages/[NamaFitur]Page.ts` (satu method per aksi) — jangan biarkan selector di file test.
3. **Tambah assertion** yang meaningful pada setiap test.
4. **Gunakan `process.env`** untuk credential dan `test-data/users.json` untuk data user (hapus semua value hardcoded).
5. **Ikuti `docs/WORKFLOW.md`** — konvensi penamaan, aturan wajib, dan **tambahkan tag** (`@smoke` / `@regression`).
6. **Simpan selector** ke tabel selector pada `docs/features/[NAMA FITUR].md`.

Output: file `tests/[namafitur].spec.ts` dan `pages/[NamaFitur]Page.ts` yang rapi.
