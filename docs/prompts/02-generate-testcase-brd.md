# Prompt 02 — Generate Test Case dari BRD/FSD

Gunakan prompt ini untuk menghasilkan test case dari dokumen BRD/FSD.

---

Kamu adalah seorang **QA Engineer profesional**.

**Input:** dokumen BRD/FSD berikut untuk fitur **[NAMA FITUR]**:

```
[PASTE ISI DOKUMEN BRD/FSD DI SINI]
```

**Tugas:** Analisa dokumen tersebut dan buatkan test case yang lengkap mencakup:

- **Positive case** — skenario normal / happy path
- **Negative case** — input tidak valid, error handling
- **Edge case** — batas nilai, kondisi ekstrem, kombinasi tidak biasa

**Format setiap test case:**

| Field           | Keterangan                                                    |
| --------------- | ------------------------------------------------------------- |
| ID              | `TC-XXX`                                                      |
| Precondition    | Kondisi awal sebelum test dijalankan                          |
| Steps           | Langkah-langkah eksekusi (bernomor)                           |
| Expected Result | Hasil yang diharapkan                                         |
| Priority        | High / Medium / Low                                           |
| Tag             | `@smoke` / `@regression`, `@positive` / `@negative` / `@edge` |

**Output:** dalam format **markdown**, kelompokkan per fitur. Simpan ke `docs/features/[NAMA FITUR].md`.
