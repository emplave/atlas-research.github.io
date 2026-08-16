import { Link } from "react-router-dom";
import { Reveal } from "./Reveal";

const criteria = [
  {
    k: "Follow-through",
    d: "The ability to finish something — including the boring middle. Four weeks is long enough for motivation to run out; that's by design.",
  },
  {
    k: "Comfort with ambiguity",
    d: "Real data rarely gives clean answers. If that excites you more than it scares you, keep reading.",
  },
  {
    k: "A problem you've actually seen",
    d: "The application asks about education access in your region. The strongest answers come from noticing, not from Googling.",
  },
];

export function WhoItsFor() {
  return (
    <section className="bg-ground border-y border-line/50">
      <div className="mx-auto max-w-6xl px-6 py-20 md:py-28 grid md:grid-cols-[0.9fr_1.1fr] gap-12">
        <Reveal>
          <p className="meta-label text-muted">Who the Fellowship is for</p>
          <h2 className="mt-4 font-display text-3xl md:text-[2.6rem] leading-[1.15] text-text">
            Selective about follow-through.
            <br />
            <span className="italic">Never about pedigree.</span>
          </h2>
          <p className="mt-6 text-muted leading-relaxed max-w-md">
            Yes, the Fellowship is selective — mentored cohorts have real
            capacity limits. But we select on how you think, not what's on
            your résumé, and no prior research is required, because access is
            the mission.
          </p>
        </Reveal>
        <div className="space-y-8">
          {criteria.map((c, i) => (
            <Reveal key={c.k} delay={i * 0.08}>
              <div className="flex gap-5 items-start">
                <span className="meta-label text-brass mt-1.5 shrink-0 w-6 text-right">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div className="border-l border-line pl-5">
                  <h3 className="font-display text-xl text-text">{c.k}</h3>
                  <p className="mt-2 text-[15px] text-muted leading-relaxed">
                    {c.d}
                  </p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
