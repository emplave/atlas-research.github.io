import { Reveal } from "@/components/Reveal";

/**
 * Section 3 — how it works, in four steps.
 *
 * Step four states the review route accurately: completed work MAY be
 * submitted, and review decides. It must never read as scheduled publication.
 */
const STEPS = [
  {
    n: "01",
    t: "Form the group and define the project",
    d: "A lead recruits members, secures school or community approval where it is needed, and narrows a broad interest into one stated question the group can answer.",
  },
  {
    n: "02",
    t: "Weekly logs and research milestones",
    d: "The group meets on a set cadence and keeps a written record: what was done, what was found, what is next. Milestones break the project into pieces that can actually be finished.",
  },
  {
    n: "03",
    t: "Mentor feedback at checkpoints",
    d: "At defined points a mentor reviews the work — the question, the sourcing, the method, the draft — and pushes back where the argument is thin. Revision is the normal outcome.",
  },
  {
    n: "04",
    t: "Completed work may be submitted for review",
    d: "Finished work can be submitted to the Atlas Journal. The Atlas research and editorial team decides what advances; work meeting the Journal's standards may be considered for publication. Submission does not guarantee publication.",
  },
];

export function HowItWorks() {
  return (
    <section className="bg-ground border-t border-line">
      <div className="mx-auto max-w-6xl px-6 py-16 md:py-24">
        <Reveal>
          <p className="meta-label text-muted">How it works</p>
          <h2 className="mt-4 font-display text-3xl md:text-5xl text-text leading-tight max-w-3xl">
            From a question to finished work.
          </h2>
        </Reveal>

        <ol className="mt-12 space-y-px bg-line border border-line">
          {STEPS.map((s, i) => (
            <Reveal key={s.n} delay={i * 0.05}>
              <li className="bg-ground p-7 md:p-8 grid md:grid-cols-[auto_1fr] gap-4 md:gap-8">
                <span className="meta-label text-muted md:pt-1.5">{s.n}</span>
                <div>
                  <h3 className="font-display text-xl md:text-2xl text-text">
                    {s.t}
                  </h3>
                  <p className="mt-3 max-w-2xl text-[15px] text-muted leading-relaxed">
                    {s.d}
                  </p>
                </div>
              </li>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}
