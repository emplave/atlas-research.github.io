import type { Field } from "./research-groups";

/**
 * Atlas Journal publications — TYPES AND FALLBACK DATA.
 *
 * Publications are managed in a Google Sheet and read at runtime through
 * src/lib/publicationsSource.ts. This file holds the authoritative types, the
 * selectors, and the fallback dataset used when the Sheet is unreachable —
 * exactly the arrangement src/data/events.ts has with src/lib/eventsSource.ts.
 *
 * The selectors take a publications array rather than reading the module-level
 * one, so every page goes through the live source. Nothing may import
 * PUBLICATIONS directly to render with.
 *
 * TWO TRACKS, NEVER MERGED:
 *
 *   "working-paper"  — Founding contributions from the Atlas team, published
 *                      WITHOUT external peer review. A working paper must
 *                      never be labelled peer reviewed, described as
 *                      reviewed, or presented alongside reviewed articles as
 *                      though the two carry the same standing.
 *
 *   "peer-reviewed"  — Articles that have completed external review. Empty
 *                      until the first reviewed issue is actually published.
 *                      Do not seed placeholders in this track: an empty
 *                      reviewed list is honest, a fake one is not.
 *
 * NEVER write "ISSN" anywhere. No invented authors, affiliations, metrics, or
 * impact factor. Publication is decided by review.
 */
export type Track = "working-paper" | "peer-reviewed";

export type Publication = {
  slug: string;
  title: string;
  authors: string[];
  track: Track;
  field: Field;
  abstract: string;
  /** null renders "Full text coming soon" — never a dead link. */
  fullTextUrl: string | null;
  /** ISO date (YYYY-MM-DD). */
  publishedAt: string;
  /**
   * ISO date external review completed, or null.
   *
   * MEANINGFUL ONLY ON THE PEER-REVIEWED TRACK. A working paper has not been
   * reviewed, so this is null on every working paper — and the source drops a
   * value supplied by a working-paper row rather than storing it. Read it
   * through reviewedDate() rather than directly, so a record constructed by
   * hand cannot render a working paper as reviewed either.
   */
  reviewedAt: string | null;
};

/**
 * PLACEHOLDER DATA — NOT A REAL PAPER.
 *
 * The fallback shown when the Sheet is unreachable, and one working paper is
 * enough to exercise the journal UI. Hamaad supplies the real papers and their
 * PDFs through the Sheet. The authors array deliberately does not name a person.
 *
 * The peer-reviewed track is deliberately EMPTY here. Seeding a fake reviewed
 * article would put an unreviewed placeholder behind a "completed external peer
 * review" badge, which is the one thing this file must never do.
 */
export const PUBLICATIONS: Publication[] = [
  {
    slug: "placeholder-working-paper",
    title:
      "PLACEHOLDER: What student research groups produce, and what gets in the way",
    authors: ["Atlas Research Institute"],
    track: "working-paper",
    field: "Social Sciences",
    abstract:
      "PLACEHOLDER ABSTRACT. This working paper describes the conditions under which small student research groups complete a project rather than abandoning it, drawing on the operating model Atlas uses to support them.\n\nIt sets out what a group needs in place before work starts — a defined question, a named lead, a meeting cadence, and access to sources it can actually reach — and identifies the points at which projects most often stall.\n\nAs a working paper, this has not been externally peer reviewed. It is published as a founding contribution while the first open call for submissions is underway.",
    fullTextUrl: null,
    publishedAt: "2026-06-01",
    reviewedAt: null,
  },
];

/**
 * The review date to display, or null.
 *
 * THE TRACK WINS. A working paper returns null whatever reviewedAt holds, so
 * the "must never render as reviewed" rule is enforced at the point of render
 * and not only at the point of parse. Both layers apply it on purpose: the
 * source cleans the Sheet, this protects every other caller.
 */
export function reviewedDate(publication: Publication): string | null {
  return publication.track === "peer-reviewed" ? publication.reviewedAt : null;
}

/** True when this record completed external review AND says when. */
export function isReviewed(publication: Publication): boolean {
  return reviewedDate(publication) !== null;
}

export type DateLabel = {
  /** "Reviewed" or "Published" — the word shown before the date. */
  label: string;
  /** The ISO date to format. */
  iso: string;
};

/**
 * Which date a publication shows, and what to call it.
 *
 * Peer-reviewed records show the review date. Working papers show the published
 * date only — a working paper has no review date to show, and labelling its
 * publication date "Reviewed" is exactly the confusion the two tracks exist to
 * prevent.
 *
 * A peer-reviewed record whose reviewedAt is blank falls back to the published
 * date rather than showing nothing. The source warns about that row; the page
 * still renders truthfully, because "Published <date>" is true of every record.
 */
export function publicationDate(publication: Publication): DateLabel {
  const reviewed = reviewedDate(publication);
  return reviewed
    ? { label: "Reviewed", iso: reviewed }
    : { label: "Published", iso: publication.publishedAt };
}

/** The date a list is ordered by: whichever one the row actually displays. */
function sortKey(publication: Publication): string {
  return publicationDate(publication).iso;
}

/** Working papers, newest first. Published without external peer review. */
export function workingPapers(publications: Publication[]): Publication[] {
  return publications
    .filter((p) => p.track === "working-paper")
    .sort((a, b) => sortKey(b).localeCompare(sortKey(a)));
}

/**
 * Peer-reviewed articles, newest first. Expected to be empty until the first
 * reviewed issue is published — callers must render the empty case honestly
 * rather than filling it.
 */
export function peerReviewedArticles(publications: Publication[]): Publication[] {
  return publications
    .filter((p) => p.track === "peer-reviewed")
    .sort((a, b) => sortKey(b).localeCompare(sortKey(a)));
}

/** True when the full-text control must render disabled, not as a dead link. */
export function isFullTextPending(publication: Publication): boolean {
  return !publication.fullTextUrl;
}

export function findPublication(
  publications: Publication[],
  slug: string
): Publication | undefined {
  return publications.find((p) => p.slug === slug);
}
