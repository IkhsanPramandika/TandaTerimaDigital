# Prompt 13 — Generate Test Case dari Jira Ticket

Gunakan prompt ini untuk menghasilkan test case dari Acceptance Criteria tiket Jira.

---

Kamu adalah seorang **QA Engineer profesional**.

**Input:** Acceptance Criteria dari tiket Jira **[P26-XXX]**:


**Tugas:** Buatkan test case yang lengkap mencakup:

- **Positive case** — skenario normal sesuai AC
- **Negative case** — input tidak valid / pelanggaran AC
- **Edge case** — batas nilai / kondisi ekstrem

**Format ID:** `TC-XXX: [P26-XXX] deskripsi singkat`

**Wajib ada di setiap test case:**

| Field           | Keterangan                                                    |
| --------------- | ------------------------------------------------------------- |
| Precondition    | Kondisi awal sebelum test dijalankan                          |
| Steps           | Langkah-langkah eksekusi (bernomor)                           |
| Expected Result | Hasil yang diharapkan                                         |
| Priority        | High / Medium / Low                                           |
| Tag             | `@smoke` / `@regression`, `@positive` / `@negative` / `@edge` |

**Output:** tambahkan hasil test case ke `docs/features/[NAMA FITUR].md`.
