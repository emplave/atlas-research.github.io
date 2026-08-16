import { Reveal } from "./Reveal";
import {
  COUNTRIES_ACTIVE,
  ELIGIBILITY_LABEL,
  FELLOWSHIP_COST_LABEL,
  FELLOWSHIP_WEEKS,
  hasStat,
} from "@/lib/stats";

/**
 * The network section.
 *
 * The globe is gone — it rendered invented cohort seed data, and the country
 * count it illustrated has no source behind it. Every figure here now comes
 * from src/lib/stats.ts, and any stat that is null renders nothing at all
 * rather than a placeholder or a guess.
 */
const facts: { n: string; label: string }[] = [
  { n: FELLOWSHIP_COST_LABEL, label: "Always, for everyone" },
  { n: String(FELLOWSHIP_WEEKS), label: "Weeks, the Fellowship" },
  { n: "Worldwide", label: "Secondary and university" },
  // Country count is intentionally absent until there is a real record to
  // count. hasStat() keeps it out rather than rendering a 0 or a guess.
  ...(hasStat(COUNTRIES_ACTIVE)
    ? [{ n: String(COUNTRIES_ACTIVE), label: "Countries active" }]
    : []),
];

export function WorldSection() {
  return (
    <section
      id="world"
      className="relative bg-ground border-y border-line overflow-hidden mt-14"
    >
      <div className="relative z-10 mx-auto max-w-6xl px-6 py-20 md:py-28 text-center">
        <Reveal>
          <p className="meta-label text-muted">The network</p>
        </Reveal>
        <Reveal delay={0.1}>
          <h2 className="mt-4 font-display text-3xl md:text-5xl text-text leading-tight">
            Research communities,
            <br />
            <span className="italic">wherever the question is.</span>
          </h2>
        </Reveal>
        <Reveal delay={0.22}>
          <p className="mt-6 mx-auto max-w-2xl text-muted leading-relaxed">
            An Atlas Chapter investigates an issue in its own local context, in
            any discipline. {ELIGIBILITY_LABEL}.
          </p>
        </Reveal>
        <Reveal delay={0.3}>
          <div
            className="mt-12 grid grid-cols-2 border border-line divide-x divide-line bg-panel max-w-3xl mx-auto"
            style={{
              gridTemplateColumns: `repeat(${Math.min(facts.length, 4)}, minmax(0, 1fr))`,
            }}
          >
            {facts.map((f) => (
              <div key={f.label} className="px-4 py-5">
                <p className="font-display text-2xl md:text-3xl text-text">
                  {f.n}
                </p>
                <p className="mt-1 meta-label text-muted">{f.label}</p>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
