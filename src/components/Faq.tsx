import { Reveal } from "./Reveal";
import { DATES } from "@/lib/dates";

/**
 * FAQ — written for research groups, which are the primary programme.
 *
 * Exactly one question covers the fellowship, and it is marked clearly as a
 * separate programme with applications currently closed.
 *
 * Two rules hold throughout: research is topic agnostic, and publication is
 * never stated or implied to be guaranteed.
 */
const faqs = [
  {
    q: "What is a research group?",
    a: "A named student lead, a defined project, and members actually working it — at a school, in a community setting, hybrid, or fully online. The lead recruits the team, holds the meeting cadence, keeps records, and is the point of contact with Atlas. It is a working research community, not a title for a résumé.",
  },
  {
    q: "Who can start one?",
    a: "Any student who will do the work of running it. That means reliability, clear communication with peers and adults, and realistic planning. You will need school or community approval where your setting requires it, but you do not need a school behind you — online and community groups are not second-class.",
  },
  {
    q: "Do I need prior research experience?",
    a: "No. Most leads and members start with none. Atlas provides onboarding, session-by-session research frameworks, and mentor feedback at checkpoints precisely because this is the point at which people usually get stuck. What you do need is willingness to take feedback and revise.",
  },
  {
    q: "What fields can a group research?",
    a: "Any field. Computer science and AI, health and life sciences, engineering, the physical sciences and mathematics, social sciences, humanities, economics and business, or the environment. What makes something a research group is how it works — a stated question, a real method, honest limitations — not the subject it studies.",
  },
  {
    q: "How much time does it take?",
    a: "Enough to finish something. Groups meet on a set cadence and keep weekly logs, and the lead carries more of the load than the members do. The realistic failure mode is not difficulty but attrition — groups stall when the cadence slips, which is why the logs and checkpoints exist.",
  },
  {
    q: "What happens to completed work?",
    a: "A finished literature review, policy brief, survey study, data profile, or presentation belongs to the group. It may be submitted to the Atlas Journal for review, and it can equally be used locally — presented to a council, a school, or a community organisation — which is often where it does the most good.",
  },
  {
    q: "Is publication guaranteed?",
    a: "No. Submission is not acceptance. The Atlas research and editorial team reviews submitted work against stated criteria: a clear and answerable question, methods described in enough detail to follow, credible and accurately cited sources, conclusions the evidence supports, and limitations discussed honestly. Work meeting those standards may be published. Revision is the normal outcome, and some work is declined with reasons given.",
  },
  {
    q: "What does Atlas actually provide?",
    a: "Onboarding for new groups, research frameworks and materials, mentor and youth volunteer guidance, webinars and guest sessions with university researchers, regular progress review, referral to specialised mentorship where a project needs expertise Atlas does not hold, and an international community of groups whose work is findable in the directory.",
  },
  {
    q: "What about the Fellowship? Is that the same thing?",
    a: `No — the Fellowship is a separate programme. It is a selective four-week summer cohort, free and remote, and it is not how research groups work. ${DATES.cohortState}, so applications for the current cohort are closed. ${DATES.nextCycle}. Starting or joining a research group is open independently of the Fellowship, and a student may do both.`,
  },
];

export function Faq() {
  return (
    <section id="faq" className="bg-ground border-t border-line">
      <div className="mx-auto max-w-3xl px-6 py-20 md:py-28">
        <Reveal>
          <p className="meta-label text-muted">Straight answers</p>
          <h2 className="mt-4 font-display text-3xl md:text-5xl text-text">
            Asked by skeptics, answered plainly.
          </h2>
        </Reveal>
        <div className="mt-12">
          {faqs.map((f, i) => (
            <Reveal key={f.q} delay={i * 0.04}>
              <details className="group border-t border-line last:border-b">
                <summary className="flex items-center justify-between gap-6 py-5 cursor-pointer list-none [&::-webkit-details-marker]:hidden">
                  <span className="font-display text-lg md:text-xl text-text">
                    {f.q}
                  </span>
                  <span
                    aria-hidden
                    className="shrink-0 h-8 w-8 rounded-control border border-line grid place-items-center text-muted transition-transform duration-300 group-open:rotate-45 group-hover:border-muted"
                  >
                    +
                  </span>
                </summary>
                <p className="pb-6 pr-10 text-[15px] leading-relaxed text-muted">
                  {f.a}
                </p>
              </details>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
