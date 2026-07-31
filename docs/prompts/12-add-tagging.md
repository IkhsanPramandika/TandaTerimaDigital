# Prompt 12 — Tambah Tagging ke Test

Gunakan prompt ini untuk menambahkan tag pada test yang sudah ada.

---

@workspace

**Tugas:** Tambahkan tagging ke `tests/[namafitur].spec.ts`.

**Aturan tag:**

| Tag           | Kapan Dipakai                                      |
| ------------- | -------------------------------------------------- |
| `@smoke`      | Test kritikal / happy path utama                   |
| `@regression` | Test lengkap untuk regression suite                |
| `@approver`   | Test yang melibatkan proses approval approver      |
| `@positive`   | Skenario positif (valid input)                     |
| `@negative`   | Skenario negatif (invalid input, error handling)   |
| `@edge`       | Skenario edge case (batas nilai / kondisi ekstrem) |

**Contoh:**

```ts
test('TC-001 Login berhasil @smoke @positive', async ({ page }) => {
  // ...
});

test('TC-015 Approval berjenjang oleh 3 approver @regression @approver', async ({ ... }) => {
  // ...
});
```

Pastikan **setiap test** memiliki minimal 1 tag kategori (`@smoke` / `@regression`) dan tag jenis yang relevan.
