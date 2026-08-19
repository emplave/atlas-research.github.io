import { SITE_ORIGIN } from "@/lib/seo";
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
 *                      WITHOUT peer review. A working paper must
 *                      never be labelled peer reviewed, described as
 *                      reviewed, or presented alongside reviewed articles as
 *                      though the two carry the same standing.
 *
 *   "peer-reviewed"  — Articles that have completed peer review. Empty
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
   * ISO date peer review completed, or null.
   *
   * MEANINGFUL ONLY ON THE PEER-REVIEWED TRACK. A working paper has not been
   * reviewed, so this is null on every working paper — and the source drops a
   * value supplied by a working-paper row rather than storing it. Read it
   * through reviewedDate() rather than directly, so a record constructed by
   * hand cannot render a working paper as reviewed either.
   */
  reviewedAt: string | null;

  /*
   * EVERY FIELD BELOW IS OPTIONAL AND SHEET-DRIVEN.
   *
   * null means the cell was blank, and a blank cell must omit the field AND its
   * label from the page — never a label with nothing after it. There is no
   * default text for any of them: the licence and conflict-of-interest wording
   * in particular is Atlas's to write in the Sheet, not this file's to invent.
   */

  /** Author affiliation, as one line. */
  affiliation: string | null;
  /** Free-text article type, e.g. "Research article". Shown as a chip. */
  articleType: string | null;
  /** Keywords, from a pipe-separated cell. Empty array renders no chips. */
  keywords: string[];
  /** Licence terms, verbatim from the Sheet. Never authored here. */
  license: string | null;
  /** Conflict-of-interest statement, verbatim from the Sheet. */
  conflictOfInterest: string | null;
  /** Editorial note, verbatim from the Sheet. */
  editorialNote: string | null;
};

/**
 * THE REVIEW STATUS WORDING — ONE CONSTANT PER TRACK, AND THE ONLY COPY OF IT.
 *
 * This text was duplicated between the Journal index and the article page, which
 * is exactly how the two drift apart: a wording change lands on one page and the
 * other keeps making the old claim about the same paper. Both pages now read
 * these, so there is no second place to update.
 *
 * "external" is deliberately absent. Review is done by the Atlas research and
 * editorial team, so calling it external was inaccurate. The working-paper line
 * drops it for the same reason — contrasting a working paper against "external
 * peer review" would imply an external tier that does not exist.
 *
 * NEVER state or imply that publication is guaranteed. Review decides.
 */
export const REVIEW_STATUS: Record<
  Track,
  {
    /** Chip text. Short enough for a badge. */
    chip: string;
    /** One-line status, for the publication record and the index meta line. */
    short: string;
    /** The full statement shown on the article page. */
    statement: string;
  }
> = {
  "peer-reviewed": {
    chip: "Peer reviewed",
    short: "Completed peer review",
    statement:
      "This article completed peer review. It was evaluated by the Atlas research and editorial team against the Journal's published criteria.",
  },
  "working-paper": {
    chip: "Working paper",
    short: "Not peer reviewed",
    statement:
      "This is a working paper. It is a founding contribution from the Atlas team, published while the first open call for submissions is underway. It has not been through peer review.",
  },
};

/** The name the Journal is cited under. */
export const JOURNAL_NAME = "The Atlas Journal";

/**
 * PLACEHOLDER DATA — NOT A REAL PAPER.
 *
 * The fallback shown when the Sheet is unreachable, and one working paper is
 * enough to exercise the journal UI. Hamaad supplies the real papers and their
 * PDFs through the Sheet. The authors array deliberately does not name a person.
 *
 * The peer-reviewed track is deliberately EMPTY here. Seeding a fake reviewed
 * article would put an unreviewed placeholder behind a "completed peer review"
 * badge, which is the one thing this file must never do.
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
      "PLACEHOLDER ABSTRACT. This working paper describes the conditions under which small student research groups complete a project rather than abandoning it, drawing on the operating model Atlas uses to support them.\n\nIt sets out what a group needs in place before work starts — a defined question, a named lead, a meeting cadence, and access to sources it can actually reach — and identifies the points at which projects most often stall.\n\nAs a working paper, this has not been peer reviewed. It is published as a founding contribution while the first open call for submissions is underway.",
    fullTextUrl: null,
    publishedAt: "2026-06-01",
    reviewedAt: null,
    /*
     * Every optional field is null/empty in the fallback ON PURPOSE. This is the
     * data shown when the Sheet is unreachable, so anything invented here would
     * be an unsourced claim about a paper — a licence Atlas never granted, an
     * affiliation nobody stated. Blank means the page omits the field.
     */
    affiliation: null,
    articleType: null,
    keywords: [],
    license: null,
    conflictOfInterest: null,
    editorialNote: null,
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

/** True when this record completed peer review AND says when. */
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

/** Working papers, newest first. Published without peer review. */
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

/** The canonical public URL of a paper. Uses the host SEO already resolved. */
export function articleUrl(publication: Publication): string {
  return `${SITE_ORIGIN}/journal/${publication.slug}`;
}

/**
 * The citation string, GENERATED rather than stored.
 *
 * Format, exactly:
 *
 *   Authors (Year). Title. The Atlas Journal. Retrieved from <canonical URL>
 *
 * Generated so it cannot go stale. A stored citation would keep the old title
 * after a title fix and the old URL after a slug change, and would have to be
 * re-typed by hand in the Sheet for every edit.
 *
 * The year is the PUBLICATION year, not the review year, which is the
 * convention every citation style follows — the review date is a fact about the
 * article's history, not its date of record.
 *
 * NO ARTICLE ID, NO DOI, NO ISSN. None of those exist for this Journal and
 * inventing an identifier would be inventing a registration.
 */
export function citationFor(publication: Publication): string {
  const year = publication.publishedAt.slice(0, 4);
  const authors = publication.authors.join(", ");
  return `${authors} (${year}). ${publication.title}. ${JOURNAL_NAME}. Retrieved from ${articleUrl(publication)}`;
}
