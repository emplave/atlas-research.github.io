import { Link } from "react-router-dom";
import { findOpening, isFormPending } from "@/data/openings";

/**
 * Homepage hero. Headline, one-sentence subhead, two buttons. Nothing else.
 *
 * No motion: entrance animation delayed the one thing a first-time reader
 * needs, which is the sentence telling them what this is.
 *
 * The fellowship is deliberately absent. Nothing on the homepage links to the
 * application.
 */
export function Hero() {
  const opening = findOpening("chapter-leader");
  const formPending = !opening || isFormPending(opening);

  return (
    <section id="top" className="bg-paper border-b border-line">
      <div className="mx-auto max-w-5xl px-6 pt-20 pb-16 md:pt-28 md:pb-20">
        <h1 className="font-display text-4xl sm:text-5xl md:text-6xl leading-[1.06] tracking-tight max-w-3xl">
          Atlas runs student research groups in any field.
        </h1>

        <p className="mt-6 max-w-2xl text-lg md:text-xl text-muted leading-relaxed">
          You pick the question, recruit three to ten members, and finish a
          paper in one term.
        </p>

        <div className="mt-9 flex flex-col sm:flex-row gap-3">
          {formPending ? (
            <span
              aria-disabled="true"
              className="rounded-control border border-line bg-surface px-6 py-3 text-[15px] text-muted text-center cursor-not-allowed"
            >
              Applications opening soon
            </span>
          ) : (
            <a
              href={opening.formUrl as string}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-control bg-navy text-white px-6 py-3 text-[15px] text-center hover:bg-navy-hi transition-colors"
            >
              Start a research group
            </a>
          )}

          <Link
            to="/research-groups"
            className="rounded-control border border-navy bg-surface text-navy px-6 py-3 text-[15px] text-center hover:bg-navy hover:text-white transition-colors"
          >
            Browse research groups
          </Link>
        </div>
      </div>
    </section>
  );
}
