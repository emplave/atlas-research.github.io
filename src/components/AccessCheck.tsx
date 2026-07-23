import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Reveal } from "./Reveal";

/**
 * Interactive access check — the HealthSync-calculator pattern from the
 * reference set, made product-true: the toggles ARE items from the Atlas
 * instrument, and the readout never fakes a score or a promise. The visitor
 * experiences the study instead of reading about it.
 */
const questions = [
  {
    id: "q07",
    tag: "Q07",
    text: "Has anyone at your school ever shown you how to write a literature review?",
  },
  {
    id: "q09",
    tag: "Q09",
    text: "Does your school have a research club, funded program, or research mentor?",
  },
  {
    id: "q12",
    tag: "Q12",
    text: "Do you know a teacher who has read an academic paper with a student?",
  },
];

const readings: Record<number, { label: string; body: string }> = {
  0: {
    label: "No scaffolding",
    body: "That's not a verdict on you — it's precisely the structural gap Atlas exists to close. Students from schools like yours are exactly who the Fellowship is built for.",
  },
  1: {
    label: "Thin scaffolding",
    body: "One support out of three. Most of the world's schools live here — squarely inside the access gap the Fellowship works on.",
  },
  2: {
    label: "Partial scaffolding",
    body: "Two supports out of three. Your school sits right on the line the Fellowship is built around.",
  },
  3: {
    label: "Full scaffolding",
    body: "You're on the resourced side of the gap — and there is real research to do from here too. The Fellowship is open to you.",
  },
};

export function AccessCheck() {
  const [answers, setAnswers] = useState<Record<string, boolean>>({});
  const yesCount = questions.filter((q) => answers[q.id]).length;
  const answered = Object.keys(answers).length;
  const reading = readings[yesCount];

  return (
    <section className="bg-cream-50 border-y border-hairline-soft">
      <div className="mx-auto max-w-6xl px-6 py-20 md:py-28">
        <Reveal>
          <p className="meta-label text-navy-500">Try the instrument</p>
          <h2 className="mt-4 font-serif text-3xl md:text-5xl text-navy-900 max-w-2xl leading-tight">
            Three questions about access.
            <br />
            <span className="italic">Answer them for your school.</span>
          </h2>
        </Reveal>

        <div className="mt-12 grid lg:grid-cols-[1.2fr_0.8fr] gap-10 items-start">
          {/* Questions — light panel */}
          <div className="space-y-4">
            {questions.map((q, i) => (
              <Reveal key={q.id} delay={i * 0.07}>
                <div className="border border-hairline rounded-2xl bg-cream-100 p-5 md:p-6 flex flex-col sm:flex-row sm:items-center gap-4 justify-between">
                  <div className="flex gap-4 items-start">
                    <span className="meta-label text-gold-600 mt-1">
                      {q.tag}
                    </span>
                    <p className="text-[15px] md:text-base text-navy-800 leading-snug max-w-md">
                      {q.text}
                    </p>
                  </div>
                  <div className="flex gap-2 shrink-0" role="group" aria-label={q.text}>
                    {[true, false].map((val) => {
                      const active = answers[q.id] === val;
                      return (
                        <button
                          key={String(val)}
                          type="button"
                          aria-pressed={active}
                          onClick={() =>
                            setAnswers((a) => ({ ...a, [q.id]: val }))
                          }
                          className={
                            "rounded-full px-5 py-2 text-sm transition-all border " +
                            (active
                              ? "bg-navy-800 text-cream-100 border-navy-800"
                              : "bg-transparent text-navy-600 border-hairline hover:border-navy-400")
                          }
                        >
                          {val ? "Yes" : "No"}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </Reveal>
            ))}
            <Reveal delay={0.25}>
              <p className="meta-label text-navy-400 pt-2">
                Adapted from the Atlas access framework · Nothing you click
                here is recorded
              </p>
            </Reveal>
          </div>

          {/* Reading — dark result card, HealthSync inversion */}
          <Reveal delay={0.15}>
            <div className="rounded-3xl bg-navy-950 text-cream-200 p-7 md:p-9 lg:sticky lg:top-24 overflow-hidden">
              <p className="meta-label text-cream-300/50">
                Structural access reading
              </p>
              <AnimatePresence mode="wait">
                <motion.div
                  key={answered === 0 ? "empty" : yesCount}
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                >
                  {answered === 0 ? (
                    <>
                      <p className="mt-6 font-serif text-4xl md:text-5xl text-cream-100">
                        — / 3
                      </p>
                      <p className="mt-4 text-cream-300/70 leading-relaxed text-[15px]">
                        Answer the three items and see where your school sits on
                        the access gap.
                      </p>
                    </>
                  ) : (
                    <>
                      <p className="mt-6 font-serif text-4xl md:text-5xl text-gold-300">
                        {yesCount} / 3
                      </p>
                      <p className="mt-2 font-serif text-xl text-cream-100">
                        {reading.label}
                      </p>
                      <p className="mt-4 text-cream-300/70 leading-relaxed text-[15px]">
                        {reading.body}
                      </p>
                    </>
                  )}
                </motion.div>
              </AnimatePresence>
              <div className="mt-8 pt-6 border-t border-hairline-inverse-soft">
                <p className="text-[13px] text-cream-300/50 leading-relaxed">
                  Whatever you answered: the Fellowship is free, because
                  access to research should not depend on which school you
                  attend.
                </p>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
