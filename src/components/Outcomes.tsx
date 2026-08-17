import { Reveal } from "./Reveal";

/**
 * What fellows actually get.
 *
 * The previous copy claimed co-author credit on a cross-national dataset and
 * asserted journal submission as a completed fact. Neither was true. Every
 * item below is something the programme actually delivers, and the review
 * item is stated as ELIGIBILITY TO SUBMIT — never as submission or
 * publication happening automatically.
 */
const outcomes = [
  {
    title: "Research methodology training",
    body: "How to narrow a question until it is answerable, choose a method that fits it, judge whether a source holds up, and write about limitations honestly instead of hiding them.",
  },
  {
    title: "Structured mentor feedback",
    body: "Scheduled check-ins with a mentor who reads the work and pushes back on it — the question, the sourcing, the reasoning, the draft. Revision is the normal outcome, not a sign something went wrong.",
  },
  {
    title: "Guest sessions with university researchers",
    body: "Fellows learn from researchers at institutions including USC, the University of Melbourne, and Stanford, in sessions on methods and on how research actually gets done.",
  },
  {
    title: "A completed literature review or policy brief",
    body: "You finish the cohort holding a real piece of work on a question you chose, in whatever field it belongs to — not a certificate of attendance.",
  },
  {
    title: "Eligibility to submit for review",
    body: "Completed work may be submitted to the Atlas Journal. The Atlas research and editorial team decides what advances; work meeting the Journal's standards may be considered for publication. Submission does not guarantee publication.",
  },
];

export function Outcomes() {
  return (
    <section id="outcomes" className="bg-ground border-t border-line">
      <div className="mx-auto max-w-6xl px-6 py-20 md:py-28">
        <Reveal>
          <p className="meta-label text-muted">What fellows get</p>
          <h2 className="mt-4 font-display text-3xl md:text-5xl text-text leading-tight">
            Outcomes, not perks.
          </h2>
        </Reveal>

        <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {outcomes.map((o, i) => (
            <Reveal key={o.title} delay={i * 0.05}>
              <div>
                <h3 className="font-display text-xl text-text">{o.title}</h3>
                <p className="mt-3 text-[15px] text-muted leading-relaxed">
                  {o.body}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
