/**
 * Feature flags.
 *
 * Each flag hides finished, working code. Nothing behind a flag is deleted, and
 * flipping one back to `true` must restore the feature intact with no other
 * edit anywhere.
 */

/**
 * Whether the Atlas Working Papers track appears on the Journal.
 *
 * ============================================================================
 * FLIP THIS TO `true` TO RESTORE THE SECTION. That is the only change needed.
 * ============================================================================
 *
 * While `false`:
 *   - /journal renders no working-papers heading, disclosure paragraph, cards,
 *     or empty state, and the page's intro copy describes only the reviewed
 *     track, so it does not advertise a section that is not there.
 *   - /journal/:slug for a working paper renders the 404, so a hidden paper is
 *     not reachable by direct URL. Peer-reviewed articles are unaffected.
 *
 * Nothing is removed to achieve this. The Publication type, the
 * src/data/publications.ts selectors, workingPapers(), the article page, and the
 * "not externally peer reviewed" disclosure copy are all still present and
 * still correct — see src/pages/Journal.tsx and src/pages/JournalArticle.tsx.
 *
 * This flag is independent of the Sheet. Working-paper rows in the publications
 * Sheet are still fetched and parsed while it is `false` — they are simply
 * neither listed nor reachable. Setting a row's Published to `no` is how you
 * unpublish one paper; this flag hides the whole track.
 */
export const SHOW_WORKING_PAPERS = false;
