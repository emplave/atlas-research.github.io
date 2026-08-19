import { Link } from "react-router-dom";
import { findOpening, isFormPending } from "@/data/openings";

/**
 * Section 8 — closing CTA. INK FULL-BLEED.
 *
 * The second and final ink band on the page. Points at starting a group; the
 * homepage carries no path to the fellowship application.
 */
export function Closing() {
  const opening = findOpening("chapter-leader");
  const formPending = !opening || isFormPending(opening);

  return (
    <section id="start" className="on-ink bg-ink">
      <div className="mx-auto max-w-3xl px-6 py-16 md:py-20 text-center">
        <h2 className="type-section font-display">
          Start a research group this term.
        </h2>
        <p className="mt-5 text-lg text-paper/75 leading-relaxed">
          Pick a question, recruit three or more members, and submit the finished
          paper for review.
        </p>

        <div className="mt-9 flex flex-col sm:flex-row justify-center gap-3">
          {formPending ? (
            <span
              aria-disabled="true"
              className="rounded-control border border-paper/30 px-6 py-3 text-[15px] text-paper/70 cursor-not-allowed"
            >
              Applications opening soon
            </span>
          ) : (
            <a
              href={opening.formUrl as string}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-control bg-paper text-ink px-6 py-3 text-[15px] hover:bg-paper/90 transition-colors"
            >
              Start a research group
            </a>
          )}
          <Link
            to="/research-groups"
            className="rounded-control border border-paper/40 text-paper px-6 py-3 text-[15px] hover:bg-paper hover:text-ink transition-colors"
          >
            Browse research groups
          </Link>
        </div>
      </div>
    </section>
  );
}
