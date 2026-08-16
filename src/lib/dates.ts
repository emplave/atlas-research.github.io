/**
 * Single source of truth for cohort dates + contact.
 * Applications OPEN, due July 24, 2026, reviewed on a rolling basis.
 * Cohort runs four weeks, starting August 3, 2026.
 */
export const DATES = {
  status: "open" as const,
  deadline: "July 24, 2026",
  review: "rolling — decisions within days of submission",
  programStart: "August 3, 2026",
} as const;

export const APPLY_EMAIL = "info@atlas-research.org";
export const LEGACY_PORTAL = "https://atlas-research.org/apply.html";

/**
 * DO NOT DELETE — LIVE WAITLIST BACKEND.
 *
 * This is the deployed Google Apps Script that receives every waitlist /
 * fellowship application submitted from public/apply.html. It is a real,
 * in-production endpoint writing to a live Google Sheet. Deleting, renaming,
 * or pointing this elsewhere silently drops applicant submissions on the
 * floor with no error surface.
 *
 * The same literal is currently inlined in public/apply.html (that file is a
 * standalone static page, intentionally untouched). If this URL ever changes,
 * it must be updated in BOTH places.
 */
export const WAITLIST_ENDPOINT =
  "https://script.google.com/macros/s/AKfycbzoGRSNMoJhYjcbHbqG2NEdIqCZ9DJ5vGVaMBvnXHwnRnoQInQ6RsuwWirb5nb0iwTqlA/exec";

/** The static page that posts to WAITLIST_ENDPOINT. */
export const WAITLIST_FORM_PATH = "/apply.html";

/**
 * Where the fellowship/chapter forms POST. Point this at a real endpoint
 * (Formspree, Google Apps Script, your own API) to activate direct
 * submission; until then the forms fall back to a prefilled email draft.
 */
export const FORM_ENDPOINT: string | null = null;
