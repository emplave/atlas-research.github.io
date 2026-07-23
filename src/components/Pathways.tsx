import { Link } from "react-router-dom";
import { Reveal } from "./Reveal";

/** Two systems, one mission — plus the partner door. */
const paths = [
  {
    eyebrow: "The Fellowship",
    badge: "Selective · Summer",
    title: "Four weeks. Real data. Published work.",
    body: "Policy briefs and literature reviews built on UNESCO, World Bank, and PISA datasets, with seminars from researchers at institutions like Stanford.",
    cta: { label: "Apply now", to: "/fellowship" },
  },
  {
    eyebrow: "Partners",
    badge: "Journals · Funders · NGOs",
    title: "Make the free model possible.",
    body: "Atlas is a for-youth nonprofit. If your organization works on education access, research integrity, or youth publishing — let's talk.",
    cta: { label: "Start a conversation", to: "/partners" },
  },
];

export function Pathways() {
  return (
    <section className="bg-cream-100">
      <div className="mx-auto max-w-6xl px-6 py-20 md:py-28">
        <Reveal>
          <p className="meta-label text-navy-500">Get involved</p>
          <h2 className="mt-4 font-serif text-3xl md:text-5xl text-navy-900 leading-tight">
            Apply to the Fellowship.
            <br />
            Or help make it possible.
          </h2>
        </Reveal>
        <div className="mt-12 grid md:grid-cols-2 gap-px bg-[rgba(28,46,69,0.12)] border border-hairline">
          {paths.map((p, i) => (
            <Reveal key={p.eyebrow} delay={i * 0.08} className="h-full">
              <div className="group h-full bg-cream-100 p-7 md:p-8 flex flex-col transition-colors hover:bg-cream-50">
                <div className="flex items-center justify-between gap-3">
                  <p className="meta-label text-gold-600">{p.eyebrow}</p>
                  <p className="font-mono text-[9px] tracking-caps uppercase text-navy-400 border border-hairline rounded-full px-2.5 py-1">
                    {p.badge}
                  </p>
                </div>
                <h3 className="mt-4 font-serif text-2xl text-navy-900 leading-snug">
                  {p.title}
                </h3>
                <p className="mt-3 text-[15px] leading-relaxed text-navy-600 flex-1">
                  {p.body}
                </p>
                <Link
                  to={p.cta.to}
                  className="mt-6 inline-flex items-center gap-2 self-start rounded-full border border-hairline px-5 py-2.5 text-sm text-navy-700 transition-all hover:border-navy-400 hover:text-navy-900 hover:gap-3"
                >
                  {p.cta.label}
                  <span aria-hidden className="text-gold-600">→</span>
                </Link>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
