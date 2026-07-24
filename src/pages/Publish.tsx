import { Reveal } from "@/components/Reveal";
import { APPLY_EMAIL } from "@/lib/dates";
import { Link } from "react-router-dom";

/**
 * Publish With Us — NSRI-extracted structure (numbered standards blocks,
 * journal identity, submission entry), Atlas content and grammar.
 */
const standards = [
  {
    n: "1",
    t: "Formatting",
    d: "Submit in Word or LaTeX. Standard fonts, double spacing, continuous line numbering. Use the Atlas template where you can — if you can't, our editorial team will format with you.",
    link: { label: "Request the template", href: `mailto:${APPLY_EMAIL}?subject=${encodeURIComponent("Template request")}` },
  },
  {
    n: "2",
    t: "Ethics & originality",
    d: "Plagiarism ends a submission immediately. Work involving human subjects needs an ethics statement. AI assistance must be disclosed — we study AI in education; we're not naive about it.",
    link: null,
  },
  {
    n: "3",
    t: "Data availability",
    d: "Cite your datasets precisely (UNESCO UIS, World Bank EdStats, OECD PISA, or your own collection) and include a data availability statement so others can check your work.",
    link: null,
  },
  {
    n: "4",
    t: "Authorship",
    d: "Everyone listed contributed to conception, analysis, or writing — and nobody who did is missing. Youth-led means the students who did the work get the credit.",
    link: null,
  },
];

export function Publish() {
  return (
    <div className="bg-cream-100">
      <section className="border-b border-hairline-soft">
        <div className="mx-auto max-w-3xl px-6 pt-16 md:pt-24 pb-12">
          <Reveal>
            <p className="meta-label text-navy-500">Publish with us</p>
            <h1 className="mt-4 font-serif text-4xl md:text-6xl text-navy-900 leading-[1.05]">
              Student research,
              <br />
              reviewed like it matters.
            </h1>
            <p className="mt-6 text-lg text-navy-600 leading-relaxed">
              Atlas publishes policy briefs and literature reviews on education
              access through the{" "}
              <strong className="font-medium text-navy-800">
                Atlas Journal of Education Policy
              </strong>{" "}
              (first issue Fall 2026) and submission to partner journals
              including the International Journal of High School Research
              (indexed in EBSCO &amp; Google Scholar).
            </p>
          </Reveal>
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-6 py-14 md:py-20">
        <div className="space-y-0 border-t border-hairline">
          {standards.map((s, i) => (
            <Reveal key={s.n} delay={i * 0.05}>
              <div className="border-b border-hairline py-8 flex gap-6">
                <span className="meta-label text-gold-600 mt-1.5 w-6 shrink-0">
                  {s.n.padStart(2, "0")}
                </span>
                <div>
                  <h2 className="font-serif text-2xl text-navy-900">{s.t}</h2>
                  <p className="mt-3 text-[15px] text-navy-600 leading-relaxed">{s.d}</p>
                  {s.link && (
                    <a
                      href={s.link.href}
                      className="mt-3 inline-block text-sm text-navy-700 underline underline-offset-4 hover:text-navy-900"
                    >
                      {s.link.label}
                    </a>
                  )}
                </div>
              </div>
            </Reveal>
          ))}
        </div>

        {/* submission box */}
        <Reveal delay={0.1}>
          <div className="mt-12 rounded-2xl bg-navy-950 text-cream-200 p-8 md:p-10">
            <p className="meta-label text-cream-300/50">Start a submission</p>
            <h2 className="mt-3 font-serif text-3xl text-cream-100">
              Two ways to publish with Atlas.
            </h2>
            <div className="mt-6 grid md:grid-cols-2 gap-6 text-[15px] leading-relaxed">
              <div>
                <p className="text-cream-100 font-medium">Through the programs</p>
                <p className="mt-2 text-cream-300/70">
                  Fellowship policy briefs and literature reviews are developed
                  with editorial support and submitted on your behalf.
                </p>
                <Link
                  to="/fellowship"
                  className="mt-4 inline-flex items-center gap-2 rounded-full bg-cream-100 text-navy-900 pl-5 pr-4 py-2.5 text-sm hover:bg-cream-200 transition-all hover:gap-3"
                >
                  Stay involved
                  <span aria-hidden className="text-gold-600">→</span>
                </Link>
              </div>
              <div>
                <p className="text-cream-100 font-medium">Direct manuscript</p>
                <p className="mt-2 text-cream-300/70">
                  Finished work on education access? Send it with "Manuscript"
                  in the subject line — every submission gets a real read and a
                  real reply.
                </p>
                <a
                  href={`mailto:${APPLY_EMAIL}?subject=${encodeURIComponent("Manuscript submission")}`}
                  className="mt-4 inline-flex items-center gap-2 rounded-full border border-hairline-inverse px-5 py-2.5 text-sm text-cream-200 hover:border-cream-300/50 transition-colors"
                >
                  Submit a manuscript
                </a>
              </div>
            </div>
          </div>
        </Reveal>
      </section>
    </div>
  );
}
