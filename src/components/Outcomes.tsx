/**
 * What fellows actually get. Used on the Fellowship page.
 *
 * The previous copy claimed co-author credit on a cross-national dataset and
 * asserted journal submission as a completed fact. Neither was true. Every
 * item below is something the programme delivers, and the review item is
 * eligibility to submit — never submission or publication happening on its own.
 */
const outcomes = [
  {
    title: "Research methodology training",
    body: "Narrowing a question until it is answerable, choosing a method that fits it, judging whether a source holds up, and writing limitations honestly.",
  },
  {
    title: "Structured mentor feedback",
    body: "Scheduled check-ins with a mentor who reads the question, the sources, and the draft, and returns written changes to make.",
  },
  {
    title: "Guest sessions with university researchers",
    body: "Fellows learn from researchers at USC, the University of Melbourne, and Stanford.",
  },
  {
    title: "A completed literature review or policy brief",
    body: "You finish the cohort holding a real piece of work on a question you chose, in any field.",
  },
  {
    title: "Eligibility to submit for review",
    body: "Completed work may be submitted to the Atlas Journal. Review decides what is published. Submission is not acceptance.",
  },
];

export function Outcomes() {
  return (
    <section id="outcomes" className="bg-paper border-t border-line">
      <div className="mx-auto max-w-6xl px-6 py-16 md:py-20">
        <h2 className="font-display text-2xl md:text-3xl">What fellows get</h2>

        <div className="mt-8 grid gap-px bg-line border border-line md:grid-cols-2 lg:grid-cols-3">
          {outcomes.map((o) => (
            <div key={o.title} className="bg-surface p-6">
              <h3 className="font-display text-lg leading-snug">{o.title}</h3>
              <p className="mt-2.5 text-[15px] text-muted leading-relaxed">
                {o.body}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
