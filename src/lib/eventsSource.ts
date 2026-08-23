/**
 * Events — LIVE SOURCE.
 *
 * Events are managed in a Google Sheet published to the web as CSV, fetched and
 * parsed at runtime. A change in the Sheet appears on the site with no code
 * change and no deploy.
 *
 * Mirrors src/lib/groupsSource.ts, and shares its CSV parser (src/lib/csv.ts).
 *
 * ============================================================================
 * EXPECTED SHEET COLUMNS — the header row must contain exactly these names:
 *
 * Published, Slug, Title, Kind, DateStatus, Date, Time, EndTime, Timezone,
 * Location, JoinUrl, SpeakerName, SpeakerAffiliation, SpeakerBio, SpeakerUrl,
 * Audience, Description, LongDescription, RegistrationUrl, RecordingUrl,
 * Capacity, ImageSrc, ImageAlt
 *
 * Column ORDER does not matter — columns are matched by header name. Renaming a
 * column breaks only the field it feeds: required fields cause the row to be
 * skipped with a console warning, optional ones go blank. Nothing crashes.
 *
 * Notes on specific columns:
 *   Published    "yes" (case-insensitive) publishes the row. Anything else,
 *                including blank, hides it.
 *   Slug         Blank derives one from Title. Collisions get a numeric suffix
 *                and a console warning.
 *   Kind         webinar | guest session | workshop | lesson | deadline |
 *                info session
 *   DateStatus   confirmed | tbd. Blank counts as confirmed.
 *   Date         YYYY-MM-DD. REQUIRED when DateStatus is confirmed. May be
 *                blank when DateStatus is tbd — that is valid, not an error.
 *   SpeakerName  Leave blank until the person has agreed to appear.
 *   LongDescription  Blank lines separate paragraphs, same as abstracts.
 *   JoinUrl      Rendered for upcoming events only.
 *   RecordingUrl Rendered for past events only.
 *   ImageSrc     Both are needed for an image to appear; otherwise the
 *   ImageAlt     typographic fallback renders.
 * ============================================================================
 *
 * See notes/managing-events.md for the operator workflow.
 */
import {
  EVENTS as FALLBACK_EVENTS,
  type AtlasEvent,
  type DateStatus,
  type EventKind,
  type EventStatus,
} from "@/data/events";
import {
  fetchSheetRows,
  headerReader,
  isPublished,
  orNull,
  slugify,
  uniqueSlug,
} from "./csv";

/**
 * The published-to-web CSV URL for the events Sheet.
 *
 * PASTE THE URL HERE. While it is null the site renders the fallback dataset in
 * src/data/events.ts, so nothing breaks before it is wired up.
 *
 * Format: https://docs.google.com/spreadsheets/d/e/<long-id>/pub?gid=0&single=true&output=csv
 */
export const EVENTS_CSV_URL: string | null =
  "https://docs.google.com/spreadsheets/d/e/2PACX-1vQz8CTA0Pnp8eBsg56shVfGLfbyi8_lr4TPedWI1QBCjLSQX1TTFoPWgtJk1MaSwMaa83V-ne-kq-Kc/pub?gid=953737550&single=true&output=csv";

/** Must stay in step with the EventKind union in src/data/events.ts. */
const KINDS: readonly EventKind[] = [
  "webinar",
  "guest session",
  "workshop",
  "lesson",
  "deadline",
  "info session",
];

const STATUSES: readonly EventStatus[] = ["upcoming", "past", "cancelled"];

const DATE_STATUSES: readonly DateStatus[] = ["confirmed", "tbd"];

/** ISO calendar date, and a real one — 2026-02-31 is rejected. */
function isIsoDate(value: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const d = new Date(`${value}T00:00:00Z`);
  return !Number.isNaN(d.getTime()) && d.toISOString().slice(0, 10) === value;
}

function warn(message: string): void {
  // Console only. A visitor must never see sheet-shaped diagnostics.
  console.warn(`[events] ${message}`);
}

/**
 * Convert parsed CSV rows into events.
 *
 * Skips-and-logs rather than throwing: one bad row must not blank the page.
 *
 * The date rules are the delicate part. A confirmed event needs a valid date. A
 * TBD event may have none — and if a TBD row does carry a date it is kept, so a
 * date can be entered before DateStatus is flipped without losing it.
 */
export function rowsToEvents(rows: string[][]): AtlasEvent[] {
  if (rows.length === 0) return [];

  const read = headerReader(rows[0]);
  const out: AtlasEvent[] = [];
  const seenSlugs = new Set<string>();

  for (let r = 1; r < rows.length; r++) {
    const row = rows[r];
    const at = (name: string) => read(row, name);
    const label = `row ${r + 1}`;

    if (!isPublished(at("Published"))) continue;

    const title = at("Title");
    if (!title) {
      warn(`${label} skipped: Title is blank`);
      continue;
    }

    const kind = at("Kind").toLowerCase() as EventKind;
    if (!KINDS.includes(kind)) {
      warn(`${label} skipped: Kind "${at("Kind")}" is not a known kind`);
      continue;
    }

    const rawDateStatus = at("DateStatus").toLowerCase();
    const dateStatus = (rawDateStatus || "confirmed") as DateStatus;
    if (!DATE_STATUSES.includes(dateStatus)) {
      warn(
        `${label} skipped: DateStatus "${at("DateStatus")}" is not "confirmed" or "tbd"`
      );
      continue;
    }

    const rawDate = at("Date");
    let date: string | null = null;
    if (dateStatus === "confirmed") {
      if (!rawDate) {
        warn(
          `${label} skipped: Date is required when DateStatus is "confirmed" (set DateStatus to "tbd" if the date is not settled)`
        );
        continue;
      }
      if (!isIsoDate(rawDate)) {
        warn(
          `${label} skipped: Date "${rawDate}" is not a valid YYYY-MM-DD date`
        );
        continue;
      }
      date = rawDate;
    } else if (rawDate) {
      // A TBD row may carry a date already — keep it if valid, so entering the
      // date before flipping DateStatus does not silently discard it.
      if (isIsoDate(rawDate)) date = rawDate;
      else warn(`${label}: Date "${rawDate}" is not valid; treating as undated`);
    }

    const description = at("Description");
    if (!description) {
      warn(`${label} skipped: Description is blank`);
      continue;
    }

    const rawStatus = at("Status").toLowerCase();
    const status = (rawStatus || "upcoming") as EventStatus;
    if (!STATUSES.includes(status)) {
      warn(`${label} skipped: Status "${at("Status")}" is not a known status`);
      continue;
    }

    const slug = uniqueSlug(
      slugify(at("Slug") || title) || `event-${r}`,
      seenSlugs,
      (from, to) => warn(`${label}: slug "${from}" already used, using "${to}"`)
    );

    const imageSrc = at("ImageSrc");
    const imageAlt = at("ImageAlt");

    out.push({
      slug,
      title,
      kind,
      dateStatus: date === null ? "tbd" : dateStatus,
      date,
      time: orNull(at("Time")),
      endTime: orNull(at("EndTime")),
      timezone: orNull(at("Timezone")),
      location: orNull(at("Location")),
      joinUrl: orNull(at("JoinUrl")),
      speakerName: orNull(at("SpeakerName")),
      speakerAffiliation: orNull(at("SpeakerAffiliation")),
      speakerBio: orNull(at("SpeakerBio")),
      speakerUrl: orNull(at("SpeakerUrl")),
      audience: orNull(at("Audience")),
      description,
      longDescription: orNull(at("LongDescription")),
      registrationUrl: orNull(at("RegistrationUrl")),
      recordingUrl: orNull(at("RecordingUrl")),
      capacity: orNull(at("Capacity")),
      status,
      image: imageSrc && imageAlt ? { src: imageSrc, alt: imageAlt } : null,
    });
  }

  return out;
}

/* ------------------------------------------------------------------------- */
/* Fetch + cache                                                              */
/* ------------------------------------------------------------------------- */

const FALLBACK: AtlasEvent[] = FALLBACK_EVENTS;

/**
 * In-memory cache for the session. The promise is cached, not just the result,
 * so concurrent callers during the first render share one request.
 */
let cache: Promise<AtlasEvent[]> | null = null;

async function fetchEvents(url: string): Promise<AtlasEvent[]> {
  const rows = await fetchSheetRows(url, warn);
  if (!rows) return FALLBACK;
  const events = rowsToEvents(rows);
  if (events.length === 0) {
    warn("sheet parsed to zero published events; using fallback data");
    return FALLBACK;
  }
  return events;
}

/**
 * All published events. Never throws — returns the fallback dataset when the
 * URL is null, and on any fetch failure, timeout, or malformed response.
 */
export function loadEvents(): Promise<AtlasEvent[]> {
  if (!cache) {
    cache = EVENTS_CSV_URL ? fetchEvents(EVENTS_CSV_URL) : Promise.resolve(FALLBACK);
  }
  return cache;
}

/** True when the Sheet is wired up. Drives whether a loading state shows. */
export const IS_EVENTS_SHEET_CONFIGURED = EVENTS_CSV_URL !== null;

/**
 * The events available synchronously, for a component's initial state.
 *
 * With no Sheet configured the fallback is already in the bundle, so returning
 * it here means the first paint is correct rather than flashing an empty page
 * while an effect resolves a promise that was never going to do any work.
 */
export function initialEvents(): AtlasEvent[] {
  return IS_EVENTS_SHEET_CONFIGURED ? [] : FALLBACK;
}

/** Test seam: clears the session cache. Not used by the app. */
export function __resetEventsCache(): void {
  cache = null;
}
