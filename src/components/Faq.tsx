import { Reveal } from "./Reveal";
import { DATES } from "@/lib/dates";

/** The skeptic's section — every answer must survive a hostile fact-check. */
const faqs = [
  {
    q: "Is this legitimate?",
    a: "Fair question — ask it of every program. Here's what's real and checkable: the Fellowship is free, fellows work with real datasets (UNESCO, World Bank, PISA), seminars feature researchers from institutions like USC, the University of Melbourne, and Stanford, and work is developed toward publication in the Atlas Journal of Education Policy and partner journals including IJHSR, which is indexed in EBSCO and Google Scholar.",
  },
  {
    q: "Why is it free?",
    a: "Because the founding thesis is that research literacy is a function of structural access, not ability — and a fee would rebuild the exact wall we study. Paid competitors charge $3,000–$10,000 for individual mentorship. Atlas is structurally different: collective, cross-national, and free, run as a nonprofit.",
  },
  {
    q: "Is the Fellowship selective?",
    a: `Yes — mentored cohorts have real capacity limits — but selection is based on your thinking in three short essays, not your résumé, and there's no invented acceptance-rate theater. Applications are open now, due ${DATES.deadline}, reviewed on a rolling basis.`,
  },
  {
    q: "What do fellows actually produce?",
    a: "A policy brief or literature review on education inequality in your own region, built on real datasets (UNESCO, World Bank, PISA), written with editorial support, and developed toward publication in the Atlas Journal and partner journals — then used for advocacy, not just a line on a résumé.",
  },
  {
    q: "Will this get me into a top university?",
    a: "No program can honestly promise that, and we won't. What you'll have is real: published or publication-track work, experience with professional datasets, and proof you finished something hard. What admissions officers do with that is up to them — skeptical readers can verify every part of it.",
  },
];

export function Faq() {
  return (
    <section id="faq" className="bg-cream-100">
      <div className="mx-auto max-w-3xl px-6 py-20 md:py-28">
        <Reveal>
          <p className="meta-label text-navy-500">Straight answers</p>
          <h2 className="mt-4 font-serif text-3xl md:text-5xl text-navy-900">
            Asked by skeptics, answered plainly.
          </h2>
        </Reveal>
        <div className="mt-12">
          {faqs.map((f, i) => (
            <Reveal key={f.q} delay={i * 0.04}>
              <details className="group border-t border-hairline last:border-b">
                <summary className="flex items-center justify-between gap-6 py-5 cursor-pointer list-none [&::-webkit-details-marker]:hidden">
                  <span className="font-serif text-lg md:text-xl text-navy-900">
                    {f.q}
                  </span>
                  <span
                    aria-hidden
                    className="shrink-0 h-8 w-8 rounded-full border border-hairline grid place-items-center text-navy-500 transition-transform duration-300 group-open:rotate-45 group-hover:border-navy-400"
                  >
                    +
                  </span>
                </summary>
                <p className="pb-6 pr-10 text-[15px] leading-relaxed text-navy-600">
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
