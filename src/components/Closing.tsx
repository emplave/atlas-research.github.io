import { Link } from "react-router-dom";
import { Reveal } from "./Reveal";
import { findOpening, isFormPending } from "@/data/openings";

/**
 * Closing CTA — the homepage bookend.
 *
 * Points at starting a research group, not at the fellowship. Nothing here
 * links to the application; the homepage carries no apply path.
 */
export function Closing() {
  const opening = findOpening("chapter-leader");
  const formPending = !opening || isFormPending(opening);

  return (
    <section id="start" className="bg-ground border-t border-line">
      <div className="mx-auto max-w-4xl px-6 py-24 md:py-32 text-center">
        <Reveal>
          <p className="meta-label text-muted">Start where you are</p>
        </Reveal>
        <Reveal delay={0.1}>
          <h2 className="mt-6 font-display text-4xl md:text-6xl leading-[1.08] text-text">
            Do research that
            <br />
            gets taken seriously.
          </h2>
        </Reveal>
        <Reveal delay={0.22}>
          <p className="mt-6 mx-auto max-w-xl text-muted text-lg leading-relaxed">
            Pick a question that matters where you are, in whatever field it
            belongs to. Recruit a team. Atlas provides the structure, the
            feedback, and a route to submit the finished work for review.
          </p>
        </Reveal>
        <Reveal delay={0.34}>
          <div className="mt-10 flex flex-wrap justify-center items-center gap-4">
            {formPending ? (
              <span
                aria-disabled="true"
                className="rounded-control border border-line px-7 py-3.5 text-[15px] text-muted cursor-not-allowed"
              >
                Opening soon
              </span>
            ) : (
              <a
                href={opening.formUrl as string}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-control bg-text text-ground pl-7 pr-6 py-3.5 text-[15px] inline-flex items-center gap-2.5 hover:bg-text-hi transition-all hover:gap-3.5"
              >
                Start a research group
                <span aria-hidden>→</span>
              </a>
            )}
            <Link
              to="/research-groups"
              className="rounded-control border border-line text-text px-7 py-3.5 text-[15px] inline-flex items-center gap-2.5 hover:border-muted transition-colors"
            >
              Browse research groups
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
