/**
 * CSV parsing and Sheet-source helpers, shared by every live data source.
 *
 * There is ONE parser on this site. Both groupsSource.ts and eventsSource.ts
 * use it — a second implementation would drift, and the edge cases here are the
 * kind that only show up in production with a comma in someone's abstract.
 */

/**
 * Parse CSV into rows of cells.
 *
 * Hand-written, no dependency, and a real parser rather than a split on commas:
 * it handles quoted fields containing commas, quoted fields containing
 * newlines, escaped `""` quotes, CRLF and lone-CR line endings, and a UTF-8
 * BOM. Google Sheets emits all of these.
 */
export function parseCsv(text: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let cell = "";
  let inQuotes = false;
  let i = 0;

  // Strip a UTF-8 BOM, which Sheets sometimes prefixes.
  if (text.charCodeAt(0) === 0xfeff) i = 1;

  const endCell = () => {
    row.push(cell);
    cell = "";
  };
  const endRow = () => {
    endCell();
    rows.push(row);
    row = [];
  };

  while (i < text.length) {
    const c = text[i];

    if (inQuotes) {
      if (c === '"') {
        if (text[i + 1] === '"') {
          cell += '"'; // escaped quote
          i += 2;
          continue;
        }
        inQuotes = false;
        i++;
        continue;
      }
      cell += c;
      i++;
      continue;
    }

    if (c === '"') {
      inQuotes = true;
      i++;
      continue;
    }
    if (c === ",") {
      endCell();
      i++;
      continue;
    }
    if (c === "\r") {
      if (text[i + 1] === "\n") i++;
      endRow();
      i++;
      continue;
    }
    if (c === "\n") {
      endRow();
      i++;
      continue;
    }
    cell += c;
    i++;
  }

  if (cell.length > 0 || row.length > 0) endRow();

  // Drop entirely empty rows — a trailing blank line is normal.
  return rows.filter((r) => r.some((v) => v.trim() !== ""));
}

/**
 * Build a cell reader for a parsed sheet.
 *
 * Columns are matched by header NAME, so reordering columns in the Sheet is
 * safe and renaming one is not. A missing column reads as an empty string
 * rather than throwing, which is what lets a renamed optional column degrade to
 * a blank field instead of breaking the page.
 */
export function headerReader(header: string[]) {
  const names = header.map((h) => h.trim());
  return (row: string[], name: string): string => {
    const i = names.indexOf(name);
    return i >= 0 && i < row.length ? row[i].trim() : "";
  };
}

/** URL-safe slug from arbitrary text. */
export function slugify(input: string): string {
  return input
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

/**
 * Ensure a slug is unique within a sheet, appending a numeric suffix when it
 * is not. Mutates `seen`.
 */
export function uniqueSlug(
  slug: string,
  seen: Set<string>,
  onCollision: (from: string, to: string) => void
): string {
  if (!seen.has(slug)) {
    seen.add(slug);
    return slug;
  }
  let n = 2;
  while (seen.has(`${slug}-${n}`)) n++;
  const next = `${slug}-${n}`;
  onCollision(slug, next);
  seen.add(next);
  return next;
}

/** True when a Published cell publishes the row. Only "yes" does. */
export function isPublished(value: string): boolean {
  return value.trim().toLowerCase() === "yes";
}

/** Parse a non-negative integer, defaulting on failure. */
export function parseCount(raw: string, fallback = 0): number {
  const n = Number.parseInt(raw.trim(), 10);
  return Number.isFinite(n) && n >= 0 ? n : fallback;
}

/** Split a pipe-separated cell into trimmed, non-empty entries. */
export function pipeList(raw: string): string[] {
  return raw
    .split("|")
    .map((s) => s.trim())
    .filter(Boolean);
}

/** Blank string to null, for optional columns. */
export function orNull(raw: string): string | null {
  const v = raw.trim();
  return v === "" ? null : v;
}

export const SHEET_FETCH_TIMEOUT_MS = 8000;

/**
 * Fetch a published-to-web Sheet as CSV rows.
 *
 * Returns null on any failure so the caller can fall back. Never throws.
 *
 * The HTML check matters: un-publishing a Sheet makes Google serve an error
 * PAGE with a 200 status, which would otherwise parse as nonsense CSV.
 */
export async function fetchSheetRows(
  url: string,
  warn: (message: string) => void
): Promise<string[][] | null> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), SHEET_FETCH_TIMEOUT_MS);
  try {
    const res = await fetch(url, { signal: controller.signal, redirect: "follow" });
    if (!res.ok) {
      warn(`sheet fetch returned ${res.status}; using fallback data`);
      return null;
    }
    const text = await res.text();
    if (/^\s*</.test(text)) {
      warn("sheet returned HTML rather than CSV; using fallback data");
      return null;
    }
    return parseCsv(text);
  } catch {
    warn("sheet unreachable or timed out; using fallback data");
    return null;
  } finally {
    clearTimeout(timer);
  }
}
