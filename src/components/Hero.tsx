import { motion, useReducedMotion } from "framer-motion";
import { Link } from "react-router-dom";
import { StaggerWords } from "./Reveal";

/** Institutional hero — two-product model, credible register. */
export function Hero() {
  const reduce = useReducedMotion();
  const fade = (delay: number) => ({
    initial: reduce ? false : { opacity: 0, y: 22 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.9, delay, ease: [0.22, 1, 0.36, 1] as const },
  });

  return (
    <section id="top" className="relative overflow-hidden">
      <div className="mx-auto max-w-6xl px-6 pt-20 pb-16 md:pt-28 md:pb-20">
        <motion.p {...fade(0.05)} className="meta-label text-muted mb-7">
          A nonprofit · Global Research Access · Secondary and university
        </motion.p>
        <h1 className="font-display text-text text-[13vw] sm:text-6xl md:text-8xl leading-[1.02] tracking-tight max-w-5xl">
          <StaggerWords text="Research that gets published." delay={0.15} />
        </h1>
        <div className="mt-9 md:mt-12 grid md:grid-cols-[1.2fr_0.8fr] gap-10 items-end">
          <motion.p
            {...fade(0.6)}
            className="max-w-xl text-lg md:text-xl text-muted leading-relaxed"
          >
            Atlas trains students to investigate a question in their own local
            context, in any discipline —{" "}
            <em className="font-display not-italic text-text">
              with real evidence, toward work that holds up
            </em>
            . The Fellowship is a selective, four-week summer cohort — free,
            remote, and open to secondary and university students worldwide.
          </motion.p>
          <motion.div {...fade(0.75)} className="flex flex-col items-start gap-4">
            <Link
              to="/fellowship"
              className="rounded-control bg-brass text-ground pl-6 pr-5 py-3 text-[15px] inline-flex items-center gap-2.5 hover:bg-brass-hi transition-all hover:gap-3.5"
            >
              Apply to the Fellowship
              <span aria-hidden>→</span>
            </Link>
          </motion.div>
        </div>
        <motion.p {...fade(0.9)} className="meta-label text-muted mt-10">
          $0 — free, always · Four weeks · Selective · No prior research required
        </motion.p>
      </div>

      {/* Credibility strip */}
      <div className="border-y border-line/50 bg-ground">
        <div className="mx-auto max-w-6xl px-6 py-6 flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="meta-label text-muted">Where fellows publish</p>
            <p className="mt-1.5 text-sm text-muted max-w-md">
              The Atlas Journal of Education Policy{" "}
              <span className="text-muted">(first issue Fall 2026)</span>, and
              peer-reviewed partner journals.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center rounded-control bg-logo-plate border border-line px-3 py-2">
              <img
                src="/partners/ijhsr.png"
                alt="International Journal of High School Research"
                className="h-6 w-auto"
              />
            </span>
            <span className="inline-flex items-center rounded-control bg-logo-plate border border-line px-3 py-2">
              <img
                src="/partners/curieux.png"
                alt="The Curieux Review"
                className="h-8 w-auto"
              />
            </span>
            <span className="inline-flex items-center rounded-control bg-logo-plate border border-line px-3 py-2">
              <img
                src="/partners/lumiere.png"
                alt="Lumiere Education"
                className="h-6 w-auto"
              />
            </span>
          </div>
        </div>
        <div className="border-t border-line/50">
          <div className="mx-auto max-w-6xl px-6 py-4">
            <p className="text-sm text-muted">
              Fellows get thousands of dollars in discounts on{" "}
              <span className="text-text">Lumiere Education</span> programs
              through our partnership. Fellows learn from researchers at
              institutions including USC, the University of Melbourne, and
              Stanford.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
