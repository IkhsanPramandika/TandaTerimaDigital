# Prompt 06 — Review & Improve Script

Gunakan prompt ini untuk mereview dan memperbaiki script yang sudah ada.

---

@workspace

Kamu adalah seorang **QA Automation Engineer profesional**.

**Tugas:** Review file `tests/[namafitur].spec.ts` dan lakukan perbaikan berikut:

1. **Identifikasi masalah** — flaky test, selector rapuh, duplikasi kode, missing wait, dsb.
2. **Tambah assertion** — pastikan setiap test punya assertion yang meaningful (bukan hanya navigasi).
3. **Improve selector** — gunakan selector yang stabil (role, label, test-id) dan pindahkan ke `pages/[NamaFitur]Page.ts` jika masih ada di test.
4. **Pastikan coverage** — semua test case (TC-XXX) di `docs/features/[NAMA FITUR].md` sudah ter-cover.
5. **Pastikan tag** — semua test memiliki tag (`@smoke` / `@regression`).
6. **Tambah komentar** — beri komentar penjelasan pada setiap step penting.

Jelaskan setiap perubahan yang kamu lakukan beserta alasannya.
