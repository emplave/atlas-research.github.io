import { Link } from "react-router-dom";
import { findOpening, isFormPending } from "@/data/openings";

/**
 * Section 8 — closing CTA. NAVY FULL-BLEED.
 *
 * The second and final navy band on the page. Points at starting a group; the
 * homepage carries no path to the fellowship application.
 */
export function Closing() {
  const opening = findOpening("chapter-leader");
  const formPending = !opening || isFormPending(opening);

  return (
    <section id="start" className="on-navy bg-navy">
      <div className="mx-auto max-w-3xl px-6 py-16 md:py-20 text-center">
        <h2 className="type-section font-display">
          Start a research group this term.
        </h2>
        <p className="mt-5 text-lg text-white/75 leading-relaxed">
          Pick a question, recruit three to ten members, and submit the finished
          paper for review.
        </p>

        <div className="mt-9 flex flex-col sm:flex-row justify-center gap-3">
          {formPending ? (
            <span
              aria-disabled="true"
              className="rounded-control border border-white/30 px-6 py-3 text-[15px] text-white/70 cursor-not-allowed"
            >
              Applications opening soon
            </span>
          ) : (
            <a
              href={opening.formUrl as string}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-control bg-white text-navy px-6 py-3 text-[15px] hover:bg-white/90 transition-colors"
            >
              Start a research group
            </a>
          )}
          <Link
            to="/research-groups"
            className="rounded-control border border-white/40 text-white px-6 py-3 text-[15px] hover:bg-white hover:text-navy transition-colors"
          >
            Browse research groups
          </Link>
        </div>
      </div>
    </section>
  );
}
