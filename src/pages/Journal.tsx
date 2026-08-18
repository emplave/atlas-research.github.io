import { Link } from "react-router-dom";
import {
  isFullTextPending,
  peerReviewedArticles,
  workingPapers,
  type Publication,
} from "@/data/publications";

/**
 * The Atlas Journal.
 *
 * TWO TRACKS, KEPT VISUALLY AND STRUCTURALLY SEPARATE.
 *
 * Working papers are founding contributions published without external peer
 * review. Peer-reviewed articles have completed review. The page must never
 * let a reader mistake one for the other, and must never imply that
 * submission leads to publication.
 */
export function Journal() {
  const working = workingPapers();
  const reviewed = peerReviewedArticles();

  return (
    <div className="bg-paper">
      <section className="border-b border-line">
        <div className="mx-auto max-w-5xl px-6 pt-16 md:pt-24 pb-12">
          <p className="meta-label">The Atlas Journal</p>
          <h1 className="mt-4 font-display text-4xl md:text-6xl leading-[1.05] max-w-3xl">
            Student research, published in the open.
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-muted leading-relaxed">
            The Journal runs two separate tracks. Working papers are founding
            contributions from the Atlas team. Peer-reviewed articles have
            completed external review. They are not the same thing, and the
            Journal does not present them as though they are.
          </p>
        </div>
      </section>

      {/* ---------------------------------------------------------------- */}
      {/* TRACK 1 — Working papers. Published WITHOUT external peer review. */}
      {/* ---------------------------------------------------------------- */}
      <section className="mx-auto max-w-5xl px-6 py-12 md:py-16">
        <div className="flex flex-wrap items-baseline gap-x-4 gap-y-2">
          <h2 className="font-display text-2xl md:text-3xl">
            Atlas Working Papers
          </h2>
          <span className="meta-label">
            Not externally peer reviewed
          </span>
        </div>

        <p className="mt-4 max-w-2xl text-[15px] text-muted leading-relaxed">
          These are founding contributions from the Atlas team, published while
          the first open call for submissions is underway. They have not been
          through external peer review, and nothing in this track should be
          read as reviewed work.
        </p>

        {working.length > 0 ? (
          <ul className="mt-8 space-y-4">
            {working.map((paper) => (
              <PublicationRow key={paper.slug} publication={paper} />
            ))}
          </ul>
        ) : (
          <p className="mt-8 text-[15px] text-muted">
            No working papers have been published yet.
          </p>
        )}
      </section>

      {/* ---------------------------------------------------------------- */}
      {/* TRACK 2 — Peer-reviewed articles. Empty until the first issue.    */}
      {/* ---------------------------------------------------------------- */}
      <section className="border-t border-line">
        <div className="mx-auto max-w-5xl px-6 py-12 md:py-16">
          <div className="flex flex-wrap items-baseline gap-x-4 gap-y-2">
            <h2 className="font-display text-2xl md:text-3xl">
              Peer-Reviewed Articles
            </h2>
            <span className="meta-label">
              First issue not yet published
            </span>
          </div>

          {reviewed.length > 0 ? (
            <ul className="mt-8 space-y-4">
              {reviewed.map((article) => (
                <PublicationRow key={article.slug} publication={article} />
              ))}
            </ul>
          ) : (
            <div className="mt-8 rounded-card border border-line bg-surface p-7 md:p-9">
              <p className="max-w-2xl text-[15px] text-muted leading-relaxed">
                The first reviewed issue has not been published. Rather than
                list placeholders, here is what the process actually involves.
              </p>

              <div className="mt-8 grid gap-8 md:grid-cols-3">
                <ProcessStep
                  step="01"
                  title="Submission"
                  body="Completed work from a research group or fellow is submitted to Atlas. Submission is not acceptance, and it carries no expectation of publication."
                />
                <ProcessStep
                  step="02"
                  title="Review"
                  body="The Atlas research and editorial team evaluates the work against the criteria below. Reviewers may request revisions, and revision is the normal outcome rather than a bad one."
                />
                <ProcessStep
                  step="03"
                  title="Decision"
                  body="Work meeting the Journal's standards may be published. Work that does not is declined, with the reasons given so the group can act on them."
                />
              </div>

              <div className="mt-9 pt-7 border-t border-line">
                <h3 className="meta-label">What review looks for</h3>
                <ul className="mt-4 grid gap-2.5 md:grid-cols-2 text-[15px] text-muted">
                  <Criterion>
                    A question that is stated clearly and is actually answerable
                    with the evidence gathered.
                  </Criterion>
                  <Criterion>
                    Methods described in enough detail that someone else could
                    follow them.
                  </Criterion>
                  <Criterion>
                    Sources that are credible, accurately cited, and fairly
                    represented.
                  </Criterion>
                  <Criterion>
                    Conclusions that the evidence supports, without overstating
                    what was found.
                  </Criterion>
                  <Criterion>
                    Limitations discussed honestly rather than omitted.
                  </Criterion>
                  <Criterion>
                    Original work, with any assistance and prior work properly
                    attributed.
                  </Criterion>
                </ul>
              </div>

              <div className="mt-9 pt-7 border-t border-line grid gap-7 md:grid-cols-2">
                <div>
                  <h3 className="meta-label">
                    What revision means
                  </h3>
                  <p className="mt-3 text-[15px] text-muted leading-relaxed">
                    Most work that is eventually published is revised first. A
                    revision request is a description of what the argument
                    still needs — narrower claims, a clearer method, better
                    sourcing — and a group may revise and resubmit.
                  </p>
                </div>
                <div>
                  <h3 className="meta-label">
                    What rejection means
                  </h3>
                  <p className="mt-3 text-[15px] text-muted leading-relaxed">
                    Some work is declined. That is a judgment about a specific
                    manuscript against the Journal's standards, not about the
                    people who wrote it, and the reasons are given in writing.
                    Declined work remains the group's own to develop or publish
                    elsewhere.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

function ProcessStep({
  step,
  title,
  body,
}: {
  step: string;
  title: string;
  body: string;
}) {
  return (
    <div>
      <span className="meta-label">{step}</span>
      <h3 className="mt-2 font-display text-lg">{title}</h3>
      <p className="mt-2 text-[15px] text-muted leading-relaxed">{body}</p>
    </div>
  );
}

function Criterion({ children }: { children: React.ReactNode }) {
  return (
    <li className="flex gap-2.5 leading-relaxed">
      <span aria-hidden className="text-muted shrink-0">
        —
      </span>
      <span>{children}</span>
    </li>
  );
}

/**
 * A single publication row.
 *
 * Every entry links to the FULL paper, never an abstract-only stub. When no
 * full text exists yet the control renders disabled rather than as a dead
 * link, and the row does not pretend to be readable.
 */
function PublicationRow({ publication }: { publication: Publication }) {
  const pending = isFullTextPending(publication);

  return (
    <li className="card-hover rounded-card border border-line bg-surface p-6">
      <div className="flex flex-wrap items-center gap-3">
        <span className="meta-label">{publication.field}</span>
        <span className="meta-label">
          {formatPublishedDate(publication.publishedAt)}
        </span>
      </div>

      <h3 className="mt-3 font-display text-xl leading-snug">
        {publication.title}
      </h3>

      <p className="mt-1.5 text-sm text-muted">
        {publication.authors.join(", ")}
      </p>

      <p className="mt-3 max-w-2xl text-[15px] text-muted leading-relaxed">
        {publication.abstract.split(/\n\s*\n/)[0]}
      </p>

      <div className="mt-5 flex flex-wrap items-center gap-5">
        <Link
          to={`/journal/${publication.slug}`}
          className="text-sm link inline-flex items-center gap-1.5"
        >
          Read the paper
          <span aria-hidden>→</span>
        </Link>
        {pending && (
          <span className="text-sm text-muted">Full text coming soon</span>
        )}
      </div>
    </li>
  );
}

export function formatPublishedDate(iso: string): string {
  const d = new Date(`${iso}T00:00:00Z`);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    timeZone: "UTC",
  });
}
