import { Link, useParams } from "react-router-dom";
import {
  findPublication,
  isFullTextPending,
  type Publication,
} from "@/data/publications";
import { Prose, ProseParagraphs } from "@/components/Prose";
import { SHOW_WORKING_PAPERS } from "@/lib/flags";
import { formatPublishedDate } from "./Journal";

/**
 * A single journal article or working paper, using the
 * same Prose component as the research group briefs.
 *
 * The track badge is not decoration. A working paper must never read as
 * reviewed, so the standing of the piece is stated in words on the page
 * itself, not just implied by which list it came from.
 */
export function JournalArticle() {
  const { slug } = useParams<{ slug: string }>();
  const publication = slug ? findPublication(slug) : undefined;

  if (!publication) return <ArticleNotFound />;

  /*
   * A working paper is unreachable while SHOW_WORKING_PAPERS is off. The
   * Journal does not link to it, but the slug is guessable and the record is
   * still in the data file, so without this the page would be live by direct
   * URL — a published claim with no route into it. 404 is the honest answer:
   * as far as the site is concerned, it is not published.
   *
   * Peer-reviewed articles are unaffected by the flag.
   */
  if (!SHOW_WORKING_PAPERS && publication.track === "working-paper") {
    return <ArticleNotFound />;
  }

  return <Article publication={publication} />;
}

function Article({ publication }: { publication: Publication }) {
  const pending = isFullTextPending(publication);
  const isWorkingPaper = publication.track === "working-paper";

  return (
    <article className="bg-paper">
      <header className="border-b border-line">
        <div className="mx-auto max-w-4xl px-6 pt-12 md:pt-16 pb-10">
          <Link
            to="/journal"
            className="meta-label text-muted hover:text-ink transition-colors inline-flex items-center gap-1.5"
          >
            <span aria-hidden>←</span> The Atlas Journal
          </Link>

          <div className="mt-7 flex flex-wrap items-center gap-3">
            <span className="meta-label">{publication.field}</span>
            <span className="meta-label">
              {formatPublishedDate(publication.publishedAt)}
            </span>
            <span className="inline-flex rounded-full border border-line px-2.5 py-1 meta-label text-muted">
              {isWorkingPaper ? "Working paper" : "Peer reviewed"}
            </span>
          </div>

          <h1 className="mt-4 font-display text-3xl md:text-5xl leading-[1.12] max-w-3xl">
            {publication.title}
          </h1>

          <p className="mt-4 text-muted">{publication.authors.join(", ")}</p>
        </div>
      </header>

      <div className="mx-auto max-w-4xl px-6 py-12">
        {/*
          Standing stated plainly, on the article itself. A reader who arrives
          here from a link — with no memory of which list it was in — must
          still be told whether this was reviewed.
        */}
        <div className="max-w-[68ch] rounded-card border border-line bg-surface px-5 py-4">
          <p className="text-[15px] text-muted leading-relaxed">
            {isWorkingPaper ? (
              <>
                <strong className="text-ink font-medium">
                  This is a working paper.
                </strong>{" "}
                It is a founding contribution from the Atlas team, published
                while the first open call for submissions is underway. It has
                not been through external peer review.
              </>
            ) : (
              <>
                <strong className="text-ink font-medium">
                  This article completed external peer review.
                </strong>{" "}
                It was evaluated by the Atlas research and editorial team
                against the Journal's published criteria.
              </>
            )}
          </p>
        </div>

        <Prose className="mt-10">
          <h2>Abstract</h2>
          <ProseParagraphs text={publication.abstract} />
        </Prose>

        <div className="mt-10 max-w-[68ch]">
          {pending ? (
            <span
              aria-disabled="true"
              className="inline-flex rounded-control border border-line px-5 py-2.5 text-sm text-muted cursor-not-allowed"
            >
              Full text coming soon
            </span>
          ) : (
            <a
              href={publication.fullTextUrl as string}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-control bg-ink text-paper px-5 py-2.5 text-sm hover:bg-ink-hover transition-colors"
            >
              Read the full paper
              <span aria-hidden>→</span>
            </a>
          )}
        </div>
      </div>
    </article>
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
