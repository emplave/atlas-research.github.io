/**
 * Section 3 — what Atlas provides. Four items, no paragraph intro.
 *
 * Each item is a thing Atlas does, stated as a mechanism with a cadence. None
 * promises an outcome, and the last one is eligibility to submit — never
 * submission or publication happening on its own.
 */
const ITEMS = [
  {
    t: "Mentor guidance and feedback at set checkpoints",
    d: "A mentor reads the question, the sources, and the draft at fixed points in the term and returns written changes to make.",
  },
  {
    t: "Weekly logs and research milestones",
    d: "Groups record what they did each week. The project is split into milestones so a stall shows up in days, not months.",
  },
  {
    t: "Guest sessions with university researchers",
    d: "Fellows and group members learn from researchers at institutions including USC, the University of Melbourne, and Stanford.",
  },
  {
    t: "A route to submit completed work for review",
    d: "Finished work may be submitted to the Atlas Journal. Review decides what is published. Submission is not acceptance.",
  },
];

export function WhatAtlasProvides() {
  return (
    <section className="bg-paper border-b border-line">
      <div className="mx-auto max-w-6xl px-6 py-16 md:py-20">
        <h2 className="font-display text-2xl md:text-3xl">
          What Atlas provides
        </h2>

        <div className="mt-8 grid gap-px bg-line border border-line md:grid-cols-2">
          {ITEMS.map((item) => (
            <div key={item.t} className="bg-surface p-6 md:p-7">
              <h3 className="font-display text-lg leading-snug">{item.t}</h3>
              <p className="mt-2.5 text-[15px] text-muted leading-relaxed">
                {item.d}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
