# Prompt 10 — Generate Test Data

Gunakan prompt ini untuk membuat / memperbarui test data.

---

@workspace

**Project:** Tanda Terima Digital

**Ketentuan approver:** minimal 2, maksimal 5

**Tugas:**

1. **Update `test-data/users.json`** dengan struktur:
   - `requester` — Pembuat Tanda Terima
   - `approver1` s/d `approver5` — Approver Level 1–5
   - `invalidUser` — user tidak valid (untuk negative test)

2. **Tambah variasi test data:**
   - **Valid** — data yang benar dan lolos validasi
   - **Invalid** — data yang gagal validasi (format salah, field kosong, dsb.)
   - **Edge case** — batas nilai (string terpanjang, karakter spesial, angka boundary, dsb.)

**Aturan wajib:**

- Field `username` & `password` untuk user asli **dikosongkan** (`""`) — diisi via `.env` / GitHub Secrets.
- Hanya `invalidUser` yang boleh memiliki value dummy (`wronguser` / `wrongpass`).
