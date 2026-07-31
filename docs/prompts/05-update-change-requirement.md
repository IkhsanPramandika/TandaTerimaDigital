# Prompt 05 — Update Script saat Change Requirement

Gunakan prompt ini ketika ada perubahan requirement pada fitur yang sudah ada.

---

@workspace

Ada perubahan requirement pada fitur **[NAMA FITUR]**.

**Perubahan:**

```
[TULIS DETAIL PERUBAHAN DI SINI]
```

**Tugas:**

1. **Update `tests/[namafitur].spec.ts`** sesuai perubahan requirement.
2. **Update `pages/[NamaFitur]Page.ts`** jika ada perubahan selector atau aksi.
3. **JANGAN mengubah** test case atau method yang **tidak terdampak** oleh perubahan.
4. **Update changelog** pada file `docs/features/[NAMA FITUR].md` (tambahkan tanggal & ringkasan perubahan).

Pastikan tetap mengikuti aturan wajib: credential dari `process.env`, assertion di setiap test, tag di setiap test, selector hanya di `pages/`.
