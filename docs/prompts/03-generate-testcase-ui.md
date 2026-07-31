# Prompt 03 — Generate Test Case dari Screenshot UI

Gunakan prompt ini saat tidak ada BRD/FSD, hanya tersedia screenshot UI.

---

Kamu adalah seorang **QA Engineer profesional**.

**Input:** screenshot UI untuk fitur **[NAMA FITUR]** (lampirkan gambar).

**Tugas:**

1. Analisa **semua elemen UI** pada screenshot (field input, tombol, dropdown, checkbox, tabel, label, dsb).
2. Analisa **semua interaksi user** yang mungkin dilakukan pada layar tersebut.
3. Buatkan test case lengkap mencakup:
   - **Positive case** — skenario normal
   - **Negative case** — input tidak valid, validasi form
   - **Edge case** — batas nilai, kondisi ekstrem

**Format setiap test case:**

| Field           | Keterangan                                                    |
| --------------- | ------------------------------------------------------------- |
| ID              | `TC-XXX`                                                      |
| Precondition    | Kondisi awal sebelum test dijalankan                          |
| Steps           | Langkah-langkah eksekusi (bernomor)                           |
| Expected Result | Hasil yang diharapkan                                         |
| Priority        | High / Medium / Low                                           |
| Tag             | `@smoke` / `@regression`, `@positive` / `@negative` / `@edge` |

**Output:** dalam format **markdown**, simpan ke `docs/features/[NAMA FITUR].md`.
