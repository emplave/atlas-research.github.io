import { Link } from "react-router-dom";
import { findOpening, isFormPending } from "@/data/openings";
import { ReachGlobe } from "./ReachGlobe";

/**
 * Homepage hero. Asymmetric: text on the left at ~55%, globe on the right.
 *
 * No entrance animation — the globe's rotation is the only motion, and the
 * headline is never delayed.
 *
 * The fellowship is deliberately absent. Nothing on the homepage links to the
 * application.
 */
export function Hero() {
  const opening = findOpening("chapter-leader");
  const formPending = !opening || isFormPending(opening);

  return (
    <section id="top" className="bg-paper border-b border-line">
      <div className="mx-auto max-w-6xl px-6 pt-16 pb-14 md:pt-20 md:pb-16">
        <div className="grid items-center gap-10 lg:gap-14 lg:grid-cols-[55fr_45fr]">
          <div>
            <h1 className="type-hero font-display">
              Atlas runs student research groups in any field.
            </h1>

            <p className="mt-6 max-w-xl type-body text-muted">
              You pick the question, recruit three to ten members, and finish a
              paper in one term.
            </p>

            <div className="mt-8 flex flex-col sm:flex-row gap-3">
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

          <ReachGlobe className="order-first lg:order-none" />
        </div>
      </div>
    </section>
  );
}
