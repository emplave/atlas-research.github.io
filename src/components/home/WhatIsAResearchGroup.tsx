import { Reveal } from "@/components/Reveal";

/**
 * Section 2 — the definition, stated plainly.
 *
 * Topic agnostic by design: the field is whatever the group's question needs.
 * Nothing here narrows research to a subject area.
 */
const PARTS = [
  {
    t: "A named lead",
    d: "One student is responsible for the group: recruiting members, holding the meeting cadence, keeping records, and communicating with Atlas. Not an honorary title.",
  },
  {
    t: "A defined project",
    d: "One question, scoped to something the group can actually answer with the access it has. Vague interest is not a project; a stated question is.",
  },
  {
    t: "Members working it",
    d: "People with real assignments and deadlines, not a membership list. A group is the work its members are doing.",
  },
  {
    t: "A place to meet",
    d: "At a school, in a community setting, hybrid, or fully online. Groups without a school behind them are not second-class.",
  },
];

export function WhatIsAResearchGroup() {
  return (
    <section className="bg-ground border-t border-line">
      <div className="mx-auto max-w-6xl px-6 py-16 md:py-24">
        <Reveal>
          <p className="meta-label text-muted">What a research group is</p>
          <h2 className="mt-4 font-display text-3xl md:text-5xl text-text leading-tight max-w-3xl">
            Four things, and none of them is a subject area.
          </h2>
          <p className="mt-6 max-w-2xl text-lg text-muted leading-relaxed">
            A group may investigate a question in any field — computer science,
            health, engineering, the physical sciences, social sciences,
            humanities, economics, or the environment. What makes it a research
            group is how it works, not what it studies.
          </p>
        </Reveal>

        <div className="mt-12 grid gap-px bg-line border border-line md:grid-cols-2">
          {PARTS.map((p, i) => (
            <Reveal key={p.t} delay={i * 0.06} className="h-full">
              <div className="h-full bg-ground p-7 md:p-8">
                <h3 className="font-display text-xl text-text">{p.t}</h3>
                <p className="mt-3 text-[15px] text-muted leading-relaxed">
                  {p.d}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
