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
        <motion.p {...fade(0.05)} className="meta-label text-navy-500 mb-7">
          A for-youth nonprofit · Global education access · Grades 9–12
        </motion.p>
        <h1 className="font-serif text-navy-900 text-[13vw] sm:text-6xl md:text-8xl leading-[1.02] tracking-tight max-w-5xl">
          <StaggerWords text="Put your school on the map." delay={0.15} />
        </h1>
        <div className="mt-9 md:mt-12 grid md:grid-cols-[1.2fr_0.8fr] gap-10 items-end">
          <motion.p
            {...fade(0.6)}
            className="max-w-xl text-lg md:text-xl text-navy-600 leading-relaxed"
          >
            Atlas trains high school students to study education inequality in
            their own regions —{" "}
            <em className="font-serif not-italic text-navy-800">
              with real datasets, toward published work
            </em>
            . The Fellowship is a selective, six-week summer cohort — free,
            remote, and open to grades 9–12.
          </motion.p>
          <motion.div {...fade(0.75)} className="flex flex-col items-start gap-4">
            <Link
              to="/fellowship"
              className="rounded-full bg-navy-800 text-cream-100 pl-6 pr-5 py-3 text-[15px] inline-flex items-center gap-2.5 hover:bg-navy-700 transition-all hover:gap-3.5"
            >
              Apply to the Fellowship
              <span aria-hidden className="text-gold-300">→</span>
            </Link>
          </motion.div>
        </div>
        <motion.p {...fade(0.9)} className="meta-label text-navy-500 mt-10">
          $0 — free, always · Four weeks · Selective · No prior research required
        </motion.p>
      </div>

      {/* Credibility strip */}
      <div className="border-y border-hairline-soft bg-cream-50">
        <div className="mx-auto max-w-6xl px-6 py-6 flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="meta-label text-navy-500">Where fellows publish</p>
            <p className="mt-1.5 text-sm text-navy-600 max-w-md">
              The Atlas Journal of Education Policy{" "}
              <span className="text-navy-400">(first issue Fall 2026)</span>, and
              peer-reviewed partner journals.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center rounded-md bg-white border border-hairline px-3 py-2">
              <img
                src="/partners/ijhsr.png"
                alt="International Journal of High School Research"
                className="h-6 w-auto"
              />
            </span>
            <span className="inline-flex items-center rounded-md bg-white border border-hairline px-3 py-2">
              <img
                src="/partners/curieux.png"
                alt="The Curieux Review"
                className="h-8 w-auto"
              />
            </span>
            <span className="inline-flex items-center rounded-md bg-white border border-hairline px-3 py-2">
              <img
                src="/partners/lumiere.png"
                alt="Lumiere Education"
                className="h-6 w-auto"
              />
            </span>
          </div>
        </div>
        <div className="border-t border-hairline-soft">
          <div className="mx-auto max-w-6xl px-6 py-4">
            <p className="text-sm text-navy-600">
              Fellows and research leads receive thousands of dollars in
              scholarships through our partnership with{" "}
              <span className="text-navy-800">Lumiere Education</span>. Seminars
              feature researchers from institutions like Stanford.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
