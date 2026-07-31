# Prompt 14 — Setup Fetch Jira Script

Gunakan prompt ini untuk mengatur integrasi fetch tiket Jira otomatis.

---

@workspace

**Detail Jira:**

- **Jira Base URL:** https://centralmegakencana-teamnew.atlassian.net
- **Project Key:** P26
- **Epic Key:** P26-283 (Tanda Terima Digital)
- **JQL:** `project=P26 AND "Epic Link"=P26-283 ORDER BY created ASC`
- **Credential dari `.env`:** `JIRA_EMAIL`, `JIRA_API_TOKEN`, `JIRA_EPIC_KEY`

**Tugas:**

1. **Update `scripts/fetch-jira.ts`:**
   - Fetch semua tiket child dari epic menggunakan JQL di atas (`encodeURIComponent`, `maxResults: 100`)
   - Auth: `Buffer.from(JIRA_EMAIL:JIRA_API_TOKEN).toString('base64')`
   - Parse Acceptance Criteria dari field `description`
   - Group tiket per modul (dari `fields.components[0].name` atau parse dari `summary`)
   - Generate `docs/features/[namafitur].md` per group berisi tabel **Jira Tickets** dan **Acceptance Criteria**
   - `console.log` progress setiap file yang di-generate

2. **Update `package.json`:** tambahkan script `fetch:jira` → `ts-node scripts/fetch-jira.ts`

3. **Update `.env.example`:** tambahkan `JIRA_EPIC_KEY`
