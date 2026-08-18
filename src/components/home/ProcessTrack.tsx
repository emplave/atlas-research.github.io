import { Section } from "./Section";

/**
 * The research process, drawn as a track rather than four text boxes.
 *
 * Five nodes on a hairline. Pure SVG and CSS — no animation, no library.
 *
 * Desktop: horizontal, the rule running behind the node row.
 * Mobile: the same track rotated to a vertical rail, the line running down the
 * left through the nodes. Same markup, one grid change — the steps are not
 * duplicated for the two layouts.
 *
 * Step five states the review route accurately. It must never read as
 * scheduled publication.
 */
const STEPS = [
  {
    n: "01",
    label: "Question",
    body: "Narrow a broad interest until the group can answer it with the access it has.",
  },
  {
    n: "02",
    label: "Sources",
    body: "Find what already exists, judge whether it holds up, and cite it accurately.",
  },
  {
    n: "03",
    label: "Analysis",
    body: "Collect and work the evidence with a method that fits the question.",
  },
  {
    n: "04",
    label: "Draft",
    body: "Write it up with limitations stated. A mentor reads it and returns changes.",
  },
  {
    n: "05",
    label: "Review",
    body: "Completed work may be submitted to the Atlas Journal. Review decides.",
  },
];

/** A small hollow node, drawn rather than a styled div. */
function Node() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 18 18"
      fill="none"
      aria-hidden="true"
      className="shrink-0"
    >
      <circle cx="9" cy="9" r="8.25" className="fill-paper stroke-ink" strokeWidth="1.5" />
      <circle cx="9" cy="9" r="2.75" className="fill-ink" />
    </svg>
  );
}

export function ProcessTrack() {
  return (
    <Section number="03" title="How the work runs" tone="paper">
      <ol className="mt-10 grid gap-y-0 md:grid-cols-5 md:gap-x-6">
        {STEPS.map((step, i) => (
          <li key={step.n} className="relative md:pt-0">
            {/* Mobile rail: vertical line down the left, through the nodes. */}
            <span
              aria-hidden
              className={
                "absolute left-[8px] w-px bg-line md:hidden " +
                (i === 0
                  ? "top-[18px] bottom-0"
                  : i === STEPS.length - 1
                    ? "top-0 h-[18px]"
                    : "top-0 bottom-0")
              }
            />

            <div className="flex gap-4 pb-8 md:block md:pb-0">
              <div className="relative md:mb-4">
                {/* Desktop rule: runs behind the node, clipped at the ends. */}
                <span
                  aria-hidden
                  className={
                    "hidden md:block absolute top-[8.5px] h-px bg-line " +
                    (i === 0
                      ? "left-[18px] right-[-1.5rem]"
                      : i === STEPS.length - 1
                        ? "left-[-1.5rem] right-full"
                        : "left-[-1.5rem] right-[-1.5rem]")
                  }
                />
                <span className="relative block">
                  <Node />
                </span>
              </div>

              <div className="min-w-0">
                <span className="meta-label text-faint">{step.n}</span>
                <h3 className="mt-1 font-display text-lg leading-snug">
                  {step.label}
                </h3>
                <p className="mt-1.5 text-[15px] text-muted leading-relaxed">
                  {step.body}
                </p>
              </div>
            </div>
          </li>
        ))}
      </ol>
    </Section>
  );
}
