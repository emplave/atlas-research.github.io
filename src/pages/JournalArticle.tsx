import { useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  articleUrl,
  citationFor,
  findPublication,
  isFullTextPending,
  publicationDate,
  REVIEW_STATUS,
  reviewedDate,
  type Publication,
} from "@/data/publications";
import { Prose, ProseParagraphs } from "@/components/Prose";
import { SHOW_WORKING_PAPERS } from "@/lib/flags";
import { usePublications } from "@/lib/usePublications";
import { formatPublishedDate } from "./Journal";

/**
 * A single journal article or working paper, as a formal publication record.
 *
 * The standing of the piece is stated in words on the page, not implied by which
 * list it came from — a reader arriving from a shared link has no memory of the
 * list. That statement comes from REVIEW_STATUS in src/data/publications.ts,
 * which is the only copy of the wording; see the note there.
 *
 * EVERY OPTIONAL FIELD IS OMITTED WHEN BLANK, label included. A record with no
 * affiliation, keywords, licence, conflict statement or editorial note renders as
 * a shorter page, never as a page of empty labels. That is why almost everything
 * below is behind a truthiness check and why the sidebar's anchor list is built
 * from the sections that actually exist.
 */
export function JournalArticle() {
  const { slug } = useParams<{ slug: string }>();
  const { publications, loading } = usePublications();

  /*
   * The 404 renders only AFTER the fetch resolves. Rendering it while the
   * request is outstanding would tell a reader a paper does not exist when it
   * does — the same rule EventDetail follows.
   */
  if (loading) return <ArticleSkeleton />;

  const publication = slug ? findPublication(publications, slug) : undefined;
  if (!publication) return <ArticleNotFound />;

  /*
   * A working paper is unreachable while SHOW_WORKING_PAPERS is off. The
   * Journal does not link to it, but the slug is guessable, so without this the
   * page would be live by direct URL — a published claim with no route into it.
   * 404 is the honest answer: as far as the site is concerned, it is not
   * published. Peer-reviewed articles are unaffected by the flag.
   */
  if (!SHOW_WORKING_PAPERS && publication.track === "working-paper") {
    return <ArticleNotFound />;
  }

  return <Article publication={publication} />;
}

/* ------------------------------------------------------------------------- */
/* Clipboard                                                                  */
/* ------------------------------------------------------------------------- */

type CopyState = "idle" | "copied" | "failed";

/**
 * A button that writes to the clipboard and confirms briefly.
 *
 * navigator.clipboard is unavailable in a non-secure context and can be denied
 * by permission, so the failure is surfaced rather than swallowed — a copy
 * button that silently does nothing is worse than one that says it failed.
 *
 * The timer is cleared on unmount and before being replaced, so navigating away
 * mid-confirmation cannot set state on an unmounted component.
 */
function CopyButton({
  value,
  label,
  variant = "outline",
}: {
  value: string;
  label: string;
  variant?: "outline" | "solid";
}) {
  const [state, setState] = useState<CopyState>("idle");
  const timer = useRef<number | null>(null);

  useEffect(
    () => () => {
      if (timer.current !== null) window.clearTimeout(timer.current);
    },
    []
  );

  const onClick = async () => {
    let ok = false;
    try {
      await navigator.clipboard.writeText(value);
      ok = true;
    } catch {
      ok = false;
    }
    setState(ok ? "copied" : "failed");
    if (timer.current !== null) window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setState("idle"), 2000);
  };

  const text =
    state === "copied" ? "Copied" : state === "failed" ? "Copy failed" : label;

  const base =
    "inline-flex items-center gap-2 rounded-control px-4 py-2.5 text-sm transition-colors";
  const skin =
    variant === "solid"
      ? "bg-ink text-paper hover:bg-ink-hover"
      : "border border-line bg-paper text-ink hover:bg-ink hover:text-paper";

  return (
    <button
      type="button"
      onClick={onClick}
      // Announced on change, so a screen reader hears the confirmation too.
      aria-live="polite"
      className={`${base} ${skin}`}
    >
      {text}
    </button>
  );
}

/* ------------------------------------------------------------------------- */
/* The record                                                                 */
/* ------------------------------------------------------------------------- */

/** One row of the publication record. Renders nothing when the value is empty. */
function RecordRow({
  label,
  children,
}: {
  label: string;
  children?: React.ReactNode;
}) {
  if (!children) return null;
  return (
    <div className="grid grid-cols-[10rem_1fr] gap-x-4 gap-y-1 py-2.5 border-b border-line last:border-0">
      <dt className="meta-label pt-0.5">{label}</dt>
      <dd className="text-[15px] text-ink leading-relaxed">{children}</dd>
    </div>
  );
}

function SectionHeading({ id, children }: { id: string; children: string }) {
  return (
    <h2 id={id} className="type-section font-display scroll-mt-24">
      {children}
    </h2>
  );
}

function Article({ publication }: { publication: Publication }) {
  const status = REVIEW_STATUS[publication.track];
  const pending = isFullTextPending(publication);
  const reviewed = reviewedDate(publication);
  const citation = citationFor(publication);
  const url = articleUrl(publication);
  const authors = publication.authors.join(", ");

  // Only sections that exist get an anchor. Built once, used by the sidebar.
  const sections = [
    { id: "abstract", title: "Abstract", present: true },
    {
      id: "keywords",
      title: "Keywords",
      present: publication.keywords.length > 0,
    },
    { id: "citation", title: "Citation", present: true },
    { id: "details", title: "Publication details", present: true },
    {
      id: "editorial-note",
      title: "Editorial note",
      present: Boolean(publication.editorialNote),
    },
  ].filter((s) => s.present);

  /** The record fields, shared by the header block and the sidebar. */
  const record = (
    <>
      <RecordRow label="Authors">{authors}</RecordRow>
      <RecordRow label="Affiliation">{publication.affiliation}</RecordRow>
      <RecordRow label="Article type">{publication.articleType}</RecordRow>
      <RecordRow label="Field">{publication.field}</RecordRow>
      <RecordRow label="Publication date">
        {formatPublishedDate(publication.publishedAt)}
      </RecordRow>
      <RecordRow label="Review date">
        {reviewed ? formatPublishedDate(reviewed) : null}
      </RecordRow>
    </>
  );

  return (
    <article className="bg-paper">
      {/* ---------------------------------------------------------------- */}
      {/* Header: breadcrumb, chips, title, record                          */}
      {/* ---------------------------------------------------------------- */}
      <header className="border-b border-line">
        <div className="mx-auto max-w-6xl px-6 pt-10 md:pt-14 pb-10">
          <nav aria-label="Breadcrumb">
            <ol className="flex flex-wrap items-center gap-2 meta-label">
              <li>
                <Link to="/journal" className="hover:text-ink transition-colors">
                  The Atlas Journal
                </Link>
              </li>
              <li aria-hidden className="text-faint">
                /
              </li>
              {/*
                The current page is not a link. Truncated because a full title
                in a breadcrumb wraps to three lines on a phone.
              */}
              <li aria-current="page" className="text-ink truncate max-w-[18rem]">
                {publication.title}
              </li>
            </ol>
          </nav>

          <div className="mt-6 flex flex-wrap items-center gap-2.5">
            {publication.articleType && <Chip>{publication.articleType}</Chip>}
            <Chip>{status.chip}</Chip>
          </div>

          <h1 className="mt-5 font-display text-3xl md:text-5xl leading-[1.12] max-w-4xl">
            {publication.title}
          </h1>

          <p className="mt-4 type-body text-ink">{authors}</p>
          {publication.affiliation && (
            <p className="mt-1 text-[15px] text-muted">
              {publication.affiliation}
            </p>
          )}

          <dl className="mt-8 max-w-2xl border-t border-line">{record}</dl>

          {/* Action row */}
          <div className="mt-8 flex flex-wrap items-center gap-3">
            {pending ? (
              <span
                aria-disabled="true"
                className="inline-flex rounded-control border border-line px-4 py-2.5 text-sm text-muted cursor-not-allowed"
              >
                Full text coming soon
              </span>
            ) : (
              <a
                href={publication.fullTextUrl as string}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-control bg-ink text-paper px-4 py-2.5 text-sm hover:bg-ink-hover transition-colors"
              >
                Open PDF
                <span aria-hidden>→</span>
              </a>
            )}
            <CopyButton value={citation} label="Copy citation" />
            <CopyButton value={url} label="Copy link" />
          </div>
        </div>
      </header>

      {/* ---------------------------------------------------------------- */}
      {/* Body + sidebar. Sidebar sits ABOVE the content on mobile via      */}
      {/* order, and to the right on desktop.                               */}
      {/* ---------------------------------------------------------------- */}
      <div className="mx-auto max-w-6xl px-6 py-12 grid lg:grid-cols-[1fr_18rem] gap-10 lg:gap-16 items-start">
        <div className="order-2 lg:order-1 min-w-0">
          {/* Standing, stated plainly and early. */}
          <div className="max-w-[68ch] rounded-card border border-line bg-surface px-5 py-4">
            <p className="text-[15px] text-muted leading-relaxed">
              <strong className="text-ink font-medium">{status.chip}.</strong>{" "}
              {status.statement}
            </p>
          </div>

          <section className="mt-12">
            <SectionHeading id="abstract">Abstract</SectionHeading>
            <Prose className="mt-5">
              <ProseParagraphs text={publication.abstract} />
            </Prose>
          </section>

          {publication.keywords.length > 0 && (
            <section className="mt-12">
              <SectionHeading id="keywords">Keywords</SectionHeading>
              <ul className="mt-5 flex flex-wrap gap-2.5">
                {publication.keywords.map((keyword) => (
                  <li key={keyword}>
                    <Chip>{keyword}</Chip>
                  </li>
                ))}
              </ul>
            </section>
          )}

          <section className="mt-12">
            <SectionHeading id="citation">Citation</SectionHeading>
            <div className="mt-5 max-w-[68ch] rounded-card border border-line bg-surface p-5">
              {/*
                Generated from the record, never stored — see citationFor. A
                stored string would keep the old title after a title fix.
              */}
              <p className="text-[15px] text-ink leading-relaxed break-words">
                {citation}
              </p>
              <div className="mt-4">
                <CopyButton value={citation} label="Copy citation" />
              </div>
            </div>
          </section>

          <section className="mt-12">
            <SectionHeading id="details">Publication details</SectionHeading>
            <dl className="mt-5 max-w-[68ch] border-t border-line">
              <RecordRow label="Full text">
                {pending ? (
                  <span className="text-muted">Full text coming soon</span>
                ) : (
                  <a
                    href={publication.fullTextUrl as string}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="link break-all"
                  >
                    Open PDF
                  </a>
                )}
              </RecordRow>
              <RecordRow label="Review status">{status.short}</RecordRow>
              {/*
                Licence and conflict of interest are Sheet-driven and omitted
                when blank. No wording is authored here — an invented licence is
                a legal claim Atlas never made.
              */}
              <RecordRow label="License">{publication.license}</RecordRow>
              <RecordRow label="Conflict of interest">
                {publication.conflictOfInterest}
              </RecordRow>
            </dl>
          </section>

          {publication.editorialNote && (
            <section className="mt-12">
              <SectionHeading id="editorial-note">Editorial note</SectionHeading>
              <Prose className="mt-5">
                <ProseParagraphs text={publication.editorialNote} />
              </Prose>
            </section>
          )}

          <div className="mt-14 pt-8 border-t border-line">
            <Link
              to="/journal"
              className="inline-flex items-center gap-2 text-sm link"
            >
              <span aria-hidden>←</span> Back to The Atlas Journal
            </Link>
          </div>
        </div>

        <aside className="order-1 lg:order-2 lg:sticky lg:top-24 w-full">
          <div className="rounded-card border border-line bg-surface p-6">
            <h2 className="meta-label">Publication record</h2>
            <dl className="mt-4 text-[15px]">
              <SidebarRow label="Authors">{authors}</SidebarRow>
              <SidebarRow label="Affiliation">
                {publication.affiliation}
              </SidebarRow>
              <SidebarRow label="Article type">
                {publication.articleType}
              </SidebarRow>
              <SidebarRow label="Field">{publication.field}</SidebarRow>
              <SidebarRow label="Published">
                {formatPublishedDate(publication.publishedAt)}
              </SidebarRow>
              <SidebarRow label="Reviewed">
                {reviewed ? formatPublishedDate(reviewed) : null}
              </SidebarRow>
              <SidebarRow label="Review status">{status.short}</SidebarRow>
              <SidebarRow label="License">{publication.license}</SidebarRow>
            </dl>

            <div className="mt-5 pt-5 border-t border-line">
              <h2 className="meta-label">On this page</h2>
              <ul className="mt-3 space-y-2">
                {sections.map((section) => (
                  <li key={section.id}>
                    <a href={`#${section.id}`} className="text-sm link">
                      {section.title}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </aside>
      </div>
    </article>
  );
}

/** Monochrome pill. The only chip on the site, used for chips and keywords. */
function Chip({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex rounded-full border border-line bg-paper px-3 py-1 meta-label text-muted">
      {children}
    </span>
  );
}

/** Stacked label/value for the narrow sidebar. Omitted when empty. */
function SidebarRow({
  label,
  children,
}: {
  label: string;
  children?: React.ReactNode;
}) {
  if (!children) return null;
  return (
    <div className="py-2 border-b border-line last:border-0">
      <dt className="meta-label">{label}</dt>
      <dd className="mt-1 text-ink leading-snug">{children}</dd>
    </div>
  );
}

/** Matches the article layout so nothing shifts when the fetch resolves. */
function ArticleSkeleton() {
  return (
    <div aria-hidden className="bg-paper">
      <header className="border-b border-line">
        <div className="mx-auto max-w-6xl px-6 pt-10 md:pt-14 pb-10">
          <div className="h-3 w-52 rounded bg-line" />
          <div className="mt-6 h-6 w-64 rounded-full bg-line" />
          <div className="mt-5 h-9 w-4/5 rounded bg-line" />
          <div className="mt-5 h-4 w-1/3 rounded bg-line" />
          <div className="mt-8 max-w-2xl space-y-3">
            {Array.from({ length: 5 }, (_, i) => (
              <div key={i} className="h-3 w-2/3 rounded bg-line" />
            ))}
          </div>
        </div>
      </header>
      <div className="mx-auto max-w-6xl px-6 py-12 grid lg:grid-cols-[1fr_18rem] gap-10 lg:gap-16 items-start">
        <div className="order-2 lg:order-1 space-y-3">
          {Array.from({ length: 10 }, (_, i) => (
            <div
              key={i}
              className="h-3 rounded bg-line"
              style={{ width: `${95 - i * 4}%` }}
            />
          ))}
        </div>
        <div className="order-1 lg:order-2 rounded-card border border-line p-6 space-y-4">
          {Array.from({ length: 6 }, (_, i) => (
            <div key={i} className="space-y-1.5">
              <div className="h-2.5 w-20 rounded bg-line" />
              <div className="h-3 w-32 rounded bg-line" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function ArticleNotFound() {
  return (
    <div className="bg-paper">
      <div className="mx-auto max-w-2xl px-6 py-28 text-center">
        <p className="meta-label">Not found</p>
        <h1 className="mt-5 font-display text-4xl">
          No paper at this address.
        </h1>
        <p className="mt-5 text-muted leading-relaxed">
          The link may be out of date.
        </p>
        <Link
          to="/journal"
          className="mt-8 inline-flex items-center gap-2 rounded-control bg-ink text-paper px-5 py-2.5 text-sm hover:bg-ink-hover transition-colors"
        >
          Back to the Journal
          <span aria-hidden>→</span>
        </Link>
      </div>
    </div>
  );
}
