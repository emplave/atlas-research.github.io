import { Reveal } from "@/components/Reveal";

/**
 * Section 5 — what Atlas actually provides.
 *
 * Every item here is a thing Atlas does. Nothing on this list promises an
 * outcome, and the review referral is described as eligibility to submit, not
 * as placement.
 */
const PROVISIONS = [
  {
    t: "Onboarding",
    d: "A structured start for new groups: what to set up first, how to run the first few meetings, and what a realistic first project looks like.",
  },
  {
    t: "Research frameworks",
    d: "Session-by-session materials on scoping a question, choosing a method, reading and citing sources, and writing up findings with limitations stated honestly.",
  },
  {
    t: "Mentor and youth volunteer guidance",
    d: "Access to mentors and experienced student volunteers who review the work at checkpoints and give specific, usable feedback.",
  },
  {
    t: "Webinars and guest sessions",
    d: "Live sessions on methods and writing, including guest sessions with university researchers.",
  },
  {
    t: "Progress review",
    d: "Regular check-ins on whether a group is actually moving, with early intervention when a project stalls rather than a post-mortem when it fails.",
  },
  {
    t: "Referral to specialised mentorship",
    d: "Where a project needs expertise Atlas does not hold in-house, groups are pointed toward mentors who have it.",
  },
  {
    t: "An international peer community",
    d: "Other groups working the same problems in different places, and a directory that makes their work findable.",
  },
];

export function WhatAtlasProvides() {
  return (
    <section className="bg-ground border-t border-line">
      <div className="mx-auto max-w-6xl px-6 py-16 md:py-24">
        <Reveal>
          <p className="meta-label text-muted">What Atlas provides</p>
          <h2 className="mt-4 font-display text-3xl md:text-5xl text-text leading-tight max-w-3xl">
            The support behind the work.
          </h2>
        </Reveal>

        <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {PROVISIONS.map((p, i) => (
            <Reveal key={p.t} delay={i * 0.04}>
              <div>
                <h3 className="font-display text-lg text-text">{p.t}</h3>
                <p className="mt-2.5 text-[15px] text-muted leading-relaxed">
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
