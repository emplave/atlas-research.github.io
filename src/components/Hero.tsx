import { motion, useReducedMotion } from "framer-motion";
import { Link } from "react-router-dom";
import { StaggerWords } from "./Reveal";
import { findOpening, isFormPending } from "@/data/openings";

/**
 * Homepage hero — research groups lead.
 *
 * The fellowship is a secondary programme and is deliberately absent here:
 * there is no "Apply to the Fellowship" CTA, and nothing on this page links
 * to the application. Primary action is starting a group; secondary is
 * browsing the directory.
 */
export function Hero() {
  const reduce = useReducedMotion();
  const fade = (delay: number) => ({
    initial: reduce ? false : { opacity: 0, y: 22 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.9, delay, ease: [0.22, 1, 0.36, 1] as const },
  });

  const opening = findOpening("chapter-leader");
  const formPending = !opening || isFormPending(opening);

  return (
    <section id="top" className="relative overflow-hidden bg-ground">
      <div className="mx-auto max-w-6xl px-6 pt-20 pb-16 md:pt-28 md:pb-20">
        <motion.p {...fade(0.05)} className="meta-label text-muted mb-7">
          Atlas Research Institute · Student Research Institute
        </motion.p>

        <h1 className="font-display text-text text-[12vw] sm:text-6xl md:text-7xl leading-[1.04] tracking-tight max-w-5xl">
          <StaggerWords
            text="Student research groups, doing real work."
            delay={0.15}
          />
        </h1>

        <div className="mt-9 md:mt-12 grid md:grid-cols-[1.2fr_0.8fr] gap-10 items-end">
          <motion.p
            {...fade(0.6)}
            className="max-w-xl text-lg md:text-xl text-muted leading-relaxed"
          >
            A research group is a named lead, a defined project, and members
            working it — at a school, in a community, hybrid, or fully online.
            Any field. Atlas provides the structure, the mentorship, and a
            route to submit finished work for review.
          </motion.p>

          <motion.div
            {...fade(0.75)}
            className="flex flex-col sm:flex-row md:flex-col items-stretch gap-3"
          >
            {formPending ? (
              <span
                aria-disabled="true"
                className="rounded-control border border-line px-6 py-3 text-[15px] text-muted text-center cursor-not-allowed"
              >
                Opening soon
              </span>
            ) : (
              <a
                href={opening.formUrl as string}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-control bg-text text-ground pl-6 pr-5 py-3 text-[15px] inline-flex items-center justify-center gap-2.5 hover:bg-text-hi transition-all hover:gap-3.5"
              >
                Start a research group
                <span aria-hidden>→</span>
              </a>
            )}

            <Link
              to="/research-groups"
              className="rounded-control border border-line text-text px-6 py-3 text-[15px] inline-flex items-center justify-center gap-2.5 hover:border-muted transition-colors"
            >
              Browse research groups
            </Link>
          </motion.div>
        </div>

        <motion.p {...fade(0.9)} className="meta-label text-muted mt-10">
          Free · Any field · Secondary and university students worldwide
        </motion.p>
      </div>
    </section>
  );
}
