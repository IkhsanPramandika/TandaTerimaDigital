import axios from "axios";
import * as fs from "fs";
import * as path from "path";
import * as dotenv from "dotenv";

// Load environment variables from .env file
dotenv.config();

const JIRA_BASE_URL = process.env.JIRA_BASE_URL as string;
const JIRA_EMAIL = process.env.JIRA_EMAIL as string;
const JIRA_API_TOKEN = process.env.JIRA_API_TOKEN as string;
const JIRA_PROJECT_KEY = process.env.JIRA_PROJECT_KEY || "P26";
const JIRA_EPIC_KEY = process.env.JIRA_EPIC_KEY || "P26-283";

interface JiraIssue {
  key: string;
  fields: {
    summary: string;
    status?: { name: string };
    description?: any;
    components?: Array<{ name: string }>;
  };
}

/**
 * Basic Auth header for Jira Cloud REST API.
 */
function getAuthHeader(): string {
  const token = Buffer.from(`${JIRA_EMAIL}:${JIRA_API_TOKEN}`).toString(
    "base64",
  );
  return `Basic ${token}`;
}

/**
 * Derive a feature group slug from an issue.
 * Priority: first component name, otherwise parse from the summary.
 * e.g. "Modul Tambah Tanda Terima" -> "tanda-terima"
 */
function getFeatureGroup(issue: JiraIssue): string {
  const component = issue.fields.components?.[0]?.name;
  if (component) {
    return slugify(component);
  }

  // Parse from summary: strip common prefixes then slugify the remainder.
  let summary = issue.fields.summary || "";
  summary = summary
    .replace(/^Modul\s+/i, "")
    .replace(/^Tambah\s+/i, "")
    .replace(/^Edit\s+/i, "")
    .replace(/^Detail\s+/i, "")
    .replace(/^Upload\s+/i, "")
    .replace(/^Pratinjau\s+/i, "")
    .replace(/^Cetak\s+/i, "");

  // Special-case grouping for the well-known modules.
  const lower = summary.toLowerCase();
  if (lower.includes("kategori")) return "kategori";
  if (lower.includes("tanda terima")) return "tanda-terima";
  if (lower.includes("bukti penerimaan")) return "bukti-penerimaan";
  if (lower.includes("bukti pengembalian")) return "bukti-pengembalian";
  if (lower.includes("email")) return "email-notifikasi";

  return slugify(summary) || "lainnya";
}

/**
 * Convert an arbitrary string into a filesystem-friendly slug.
 */
function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/**
 * Convert Atlassian Document Format (ADF) or plain text description into
 * readable markdown text.
 */
function extractDescription(description: any): string {
  if (!description) return "_Tidak ada deskripsi._";
  if (typeof description === "string") return description;

  // Recursively walk the ADF node tree collecting text.
  const parts: string[] = [];
  const walk = (node: any) => {
    if (!node) return;
    if (node.type === "text" && node.text) {
      parts.push(node.text);
    }
    if (Array.isArray(node.content)) {
      node.content.forEach(walk);
      // Add a line break after block-level containers.
      if (["paragraph", "listItem", "heading"].includes(node.type)) {
        parts.push("\n");
      }
    }
  };
  walk(description);

  const text = parts.join("").trim();
  return text.length ? text : "_Tidak ada deskripsi._";
}

/**
 * Fetch all child issues under the epic using the configured JQL and
 * generate one markdown file per feature group under docs/features/.
 */
async function main() {
  if (!JIRA_EMAIL || !JIRA_API_TOKEN) {
    throw new Error(
      "Missing JIRA_EMAIL or JIRA_API_TOKEN. Please set them in your .env file.",
    );
  }

  const jql = `project=${JIRA_PROJECT_KEY} AND "Epic Link"=${JIRA_EPIC_KEY} ORDER BY created ASC`;
  const url = `${JIRA_BASE_URL}/rest/api/3/search?jql=${encodeURIComponent(
    jql,
  )}&maxResults=100&fields=summary,status,description,components`;

  console.log(`🔎 Fetching Jira issues for epic ${JIRA_EPIC_KEY}...`);

  const response = await axios.get(url, {
    headers: {
      Authorization: getAuthHeader(),
      Accept: "application/json",
    },
  });

  const issues: JiraIssue[] = response.data.issues || [];
  console.log(`📥 Retrieved ${issues.length} issue(s).`);

  // Group issues by feature.
  const groups = new Map<string, JiraIssue[]>();
  for (const issue of issues) {
    const group = getFeatureGroup(issue);
    if (!groups.has(group)) {
      groups.set(group, []);
    }
    groups.get(group)!.push(issue);
  }

  // Ensure output directory exists.
  const outDir = path.join("docs", "features");
  fs.mkdirSync(outDir, { recursive: true });

  for (const [group, groupIssues] of groups.entries()) {
    const lines: string[] = [];
    lines.push(`# Fitur: ${group}`);
    lines.push("");

    // Jira Tickets table.
    lines.push("## Jira Tickets");
    lines.push("");
    lines.push("| Ticket | Judul | Status |");
    lines.push("| ------ | ----- | ------ |");
    for (const issue of groupIssues) {
      const status = issue.fields.status?.name || "-";
      lines.push(`| ${issue.key} | ${issue.fields.summary} | ${status} |`);
    }
    lines.push("");

    // Acceptance Criteria section.
    lines.push("## Acceptance Criteria");
    lines.push("");
    for (const issue of groupIssues) {
      lines.push(`### ${issue.key}: ${issue.fields.summary}`);
      lines.push("");
      lines.push(extractDescription(issue.fields.description));
      lines.push("");
    }

    const filePath = path.join(outDir, `${group}.md`);
    fs.writeFileSync(filePath, lines.join("\n"), "utf-8");
    console.log(`✅ Generated ${filePath} (${groupIssues.length} ticket(s))`);
  }

  console.log("🎉 Done fetching Jira and generating feature docs.");
}

main().catch((err) => {
  console.error(
    "❌ Failed to fetch Jira issues:",
    err.response?.data || err.message,
  );
  process.exit(1);
});
