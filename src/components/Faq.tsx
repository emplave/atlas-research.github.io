/**
 * FAQ — written for research groups, the primary programme.
 *
 * Exactly one question covers the fellowship, marked as a separate programme
 * with applications closed. Publication is never stated or implied to be
 * guaranteed.
 */
const faqs = [
  {
    q: "What is a research group?",
    a: "Three to ten students working one research question, run by a student lead. The lead recruits members, holds a weekly meeting, keeps the log, and is the contact point with Atlas.",
  },
  {
    q: "Who can start one?",
    a: "Any secondary or university student who will run the weekly meeting and keep the log. You need school or community approval where your setting requires it. You do not need a school: online and community groups work the same way.",
  },
  {
    q: "Do I need prior research experience?",
    a: "No. Atlas provides onboarding, the research frameworks, and mentor feedback at checkpoints. Most leads start with no research background.",
  },
  {
    q: "What fields can a group research?",
    a: "Any of eight: computer science and AI, health and life sciences, engineering and technology, physical sciences and mathematics, social sciences, humanities, economics and business, environment and sustainability.",
  },
  {
    q: "How much time does it take?",
    a: "One meeting a week plus your own assignments. Leads spend more. Groups that stop meeting stop finishing, which is what the weekly log catches.",
  },
  {
    q: "What happens to completed work?",
    a: "The work belongs to the group. It may be submitted to the Atlas Journal for review. Groups also present findings locally to councils, schools, and community organisations.",
  },
  {
    q: "Is publication guaranteed?",
    a: "No. Review decides. The Atlas research and editorial team checks whether the question is answerable, the methods are described in enough detail to follow, the sources are credible and cited accurately, the conclusions match the evidence, and the limitations are stated. Revision is the normal outcome. Some work is declined, with reasons given in writing.",
  },
  {
    q: "What does Atlas cost?",
    a: "Nothing. There is no fee to start a group, join one, or submit work for review.",
  },
  {
    q: "Is the Fellowship the same thing?",
    a: "No. The Fellowship is a separate programme: a selective four-week summer cohort. Applications for the current cohort are closed and the waitlist is open. Starting a research group is open now, and a student may do both.",
  },
];

export function Faq() {
  return (
    <section id="faq" className="bg-surface border-b border-line">
      <div className="mx-auto max-w-3xl px-6 py-12 md:py-16">
        <h2 className="type-section font-display">Questions</h2>

        <div className="mt-8">
          {faqs.map((f) => (
            <details
              key={f.q}
              className="group border-t border-line last:border-b"
            >
              <summary className="flex items-center justify-between gap-6 py-5 cursor-pointer list-none [&::-webkit-details-marker]:hidden">
                <span className="font-display text-lg text-navy">{f.q}</span>
                <span
                  aria-hidden
                  className="shrink-0 h-7 w-7 rounded-control border border-line grid place-items-center text-muted group-hover:border-navy group-hover:text-navy transition-colors"
                >
                  +
                </span>
              </summary>
              <p className="pb-6 pr-10 text-[15px] leading-relaxed text-muted">
                {f.a}
              </p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
