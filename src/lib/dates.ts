/**
 * Single source of truth for cohort state + contact.
 *
 * CURRENT STATE: the Fellowship cohort is RUNNING. Applications for the
 * current cohort are closed; the waitlist is open for the next cycle.
 *
 * There is deliberately no deadline field. Nothing on the site may imply an
 * expired deadline — a past date reads as a dead program. When the next cycle
 * opens, set status to "open" and add the date then, not before.
 */
export const DATES = {
  status: "cohort-running" as const,
  /** What the current cohort is doing, for status lines. */
  cohortState: "The current cohort is underway",
  /** The call to action while applications are closed. */
  waitlist: "Join the waitlist for the next cohort",
  /** How the next cycle will be reviewed, stated without committing to a date. */
  review: "rolling — decisions within days of submission",
  /** When the next cycle opens. Intentionally undated until it is real. */
  nextCycle: "Next cohort dates are announced to the waitlist first",
} as const;

/**
 * The contact address, everywhere. There is no second address — do not
 * reintroduce info@ or any personal mailbox.
 */
export const CONTACT_EMAIL = "admin@atlas-research.org";

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
