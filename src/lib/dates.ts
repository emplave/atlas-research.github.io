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

/**
 * Partnership enquiries only, used on the Partners page.
 *
 * This is the ONE page that does not use CONTACT_EMAIL. Every other surface —
 * footer, privacy policy, form errors — uses the address above. Kept as a named
 * constant so the exception exists in exactly one place rather than being
 * pasted into a page.
 */
export const PARTNERS_EMAIL = "nirav.goenka@atlas-research.org";

/**
 * When the privacy policy was last substantively changed.
 *
 * Pulled from here so the date cannot go stale silently while the text is
 * edited. Update it in the same commit as any change to the policy content.
 */
export const PRIVACY_UPDATED = "17 August 2026";


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


/**
 * DO NOT DELETE — LIVE PARTNERSHIP ENQUIRY BACKEND.
 *
 * This is the deployed Google Apps Script that receives every partnership
 * enquiry submitted from /partners. It is a real, in-production endpoint
 * writing to a live Google Sheet. Deleting, renaming, or pointing this
 * elsewhere silently drops enquiries on the floor with no error surface.
 *
 * A DIFFERENT DEPLOYMENT AND A DIFFERENT SHEET from WAITLIST_ENDPOINT above.
 * The two are not interchangeable and must never be consolidated — they have
 * different column contracts. Partnership rows are:
 *
 *   new Date(), name, email, titleorg, interest, consent, 'New', '', ''
 *
 * The last three columns are written by the script itself. The client must not
 * send Status, Reviewer, or Notes.
 *
 * Typed as `string | null` so nulling it restores the disabled form state via
 * isFormEndpointConfigured() with no other edit.
 */
export const FORM_ENDPOINT: string | null =
  "https://script.google.com/macros/s/AKfycbz9ef5zv5geRWZXklzo-tbO9gNV6ix2UcLTsgXOB2n-qT1Rjj6qL10yloM2fOVbIm-ZzA/exec";
