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
    <section className="bg-ground border-y border-line/50">
      <div className="mx-auto max-w-6xl px-6 py-20 md:py-28">
        <Reveal>
          <p className="meta-label text-muted">Try the instrument</p>
          <h2 className="mt-4 font-display text-3xl md:text-5xl text-text max-w-2xl leading-tight">
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
                <div className="border border-line rounded-card bg-ground p-5 md:p-6 flex flex-col sm:flex-row sm:items-center gap-4 justify-between">
                  <div className="flex gap-4 items-start">
                    <span className="meta-label text-brass mt-1">
                      {q.tag}
                    </span>
                    <p className="text-[15px] md:text-base text-text leading-snug max-w-md">
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
                            "rounded-control px-5 py-2 text-sm transition-all border " +
                            (active
                              ? "bg-panel text-text border-panel"
                              : "bg-transparent text-muted border-line hover:border-brass")
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
              <p className="meta-label text-muted pt-2">
                Adapted from the Atlas access framework · Nothing you click
                here is recorded
              </p>
            </Reveal>
          </div>

          {/* Reading — dark result card, HealthSync inversion */}
          <Reveal delay={0.15}>
            <div className="rounded-card bg-ground text-text p-7 md:p-9 lg:sticky lg:top-24 overflow-hidden">
              <p className="meta-label text-muted/50">
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
                      <p className="mt-6 font-display text-4xl md:text-5xl text-text">
                        — / 3
                      </p>
                      <p className="mt-4 text-muted/70 leading-relaxed text-[15px]">
                        Answer the three items and see where your school sits on
                        the access gap.
                      </p>
                    </>
                  ) : (
                    <>
                      <p className="mt-6 font-display text-4xl md:text-5xl text-brass">
                        {yesCount} / 3
                      </p>
                      <p className="mt-2 font-display text-xl text-text">
                        {reading.label}
                      </p>
                      <p className="mt-4 text-muted/70 leading-relaxed text-[15px]">
                        {reading.body}
                      </p>
                    </>
                  )}
                </motion.div>
              </AnimatePresence>
              <div className="mt-8 pt-6 border-t border-line/50">
                <p className="text-[13px] text-muted/50 leading-relaxed">
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
