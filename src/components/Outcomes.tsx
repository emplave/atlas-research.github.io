/**
 * What fellows actually get. Used on the Fellowship page.
 *
 * FIVE items, laid out as a 2 + 3 split: the first row is two wider cells, the
 * second row three. Five items in a three-column grid left a visible empty
 * sixth cell, and the fix is a layout that divides by five — not a sixth item
 * invented to fill the hole.
 *
 * The previous copy claimed co-author credit on a cross-national dataset and
 * asserted journal submission as a completed fact. Neither was true. Every item
 * below is something the programme delivers, and the review item is eligibility
 * to submit — never submission or publication happening on its own.
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
    body: "Live sessions on methods and on how research actually gets done.",
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
  const firstRow = outcomes.slice(0, 2);
  const secondRow = outcomes.slice(2);

  return (
    <section id="outcomes" className="bg-surface border-t border-line">
      <div className="mx-auto max-w-6xl px-6 py-12 md:py-16">
        <h2 className="type-section font-display">What fellows get</h2>

        {/*
          Two rows rather than one grid, so five items divide cleanly and no
          cell is left empty. Hairline separators come from the gap-px + bg-line
          pattern used elsewhere on the site.
        */}
        <div className="mt-8 border border-line bg-line grid gap-px">
          <div className="grid gap-px md:grid-cols-2">
            {firstRow.map((o) => (
              <Cell key={o.title} title={o.title} body={o.body} wide />
            ))}
          </div>
          <div className="grid gap-px md:grid-cols-3">
            {secondRow.map((o) => (
              <Cell key={o.title} title={o.title} body={o.body} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function Cell({
  title,
  body,
  wide = false,
}: {
  title: string;
  body: string;
  wide?: boolean;
}) {
  return (
    <div className="bg-paper p-6 md:p-7">
      <h3
        className={
          "font-display leading-snug " + (wide ? "text-xl md:text-2xl" : "text-lg")
        }
      >
        {title}
      </h3>
      <p className="mt-2.5 text-[15px] text-muted leading-relaxed">{body}</p>
    </div>
  );
}
