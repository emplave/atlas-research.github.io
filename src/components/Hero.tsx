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
            . Two ways in: a selective summer Fellowship, and Chapters any
            school can start.
          </motion.p>
          <motion.div {...fade(0.75)} className="flex flex-col items-start gap-4">
            <Link
              to="/fellowship"
              className="rounded-full bg-navy-800 text-cream-100 pl-6 pr-5 py-3 text-[15px] inline-flex items-center gap-2.5 hover:bg-navy-700 transition-all hover:gap-3.5"
            >
              Apply to the Fellowship
              <span aria-hidden className="text-gold-300">→</span>
            </Link>
            <Link
              to="/chapters"
              className="rounded-full border border-hairline text-navy-700 px-6 py-3 text-[15px] hover:border-navy-400 hover:text-navy-900 transition-colors"
            >
              Start a Chapter at your school
            </Link>
          </motion.div>
        </div>
        <motion.p {...fade(0.9)} className="meta-label text-navy-500 mt-10">
          $0 — free, always · Fellowship: 6 weeks, selective · Chapters: open
          to every school
        </motion.p>
      </div>

      {/* Credibility strip */}
      <div className="border-y border-hairline-soft bg-cream-50">
        <div className="mx-auto max-w-6xl px-6 py-4 flex flex-col md:flex-row md:items-center gap-2 md:gap-8">
          <p className="meta-label text-navy-500">Where the work goes</p>
          <p className="text-sm text-navy-600">
            Atlas Journal of Education Policy{" "}
            <span className="text-navy-400">(first issue Fall 2026)</span> ·
            partner journals incl. IJHSR{" "}
            <span className="text-navy-400">
              (indexed in EBSCO &amp; Google Scholar)
            </span>{" "}
            · seminars with researchers from institutions like Stanford
          </p>
        </div>
      </div>
    </section>
  );
}
