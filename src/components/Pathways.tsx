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
    <section className="bg-ground">
      <div className="mx-auto max-w-6xl px-6 py-20 md:py-28">
        <Reveal>
          <p className="meta-label text-muted">Get involved</p>
          <h2 className="mt-4 font-display text-3xl md:text-5xl text-text leading-tight">
            Apply to the Fellowship.
            <br />
            Or help make it possible.
          </h2>
        </Reveal>
        <div className="mt-12 grid md:grid-cols-2 gap-px bg-line border border-line">
          {paths.map((p, i) => (
            <Reveal key={p.eyebrow} delay={i * 0.08} className="h-full">
              <div className="group h-full bg-ground p-7 md:p-8 flex flex-col transition-colors hover:bg-ground">
                <div className="flex items-center justify-between gap-3">
                  <p className="meta-label text-brass">{p.eyebrow}</p>
                  <p className="font-sans text-[9px] tracking-caps uppercase text-muted border border-line rounded-full px-2.5 py-1">
                    {p.badge}
                  </p>
                </div>
                <h3 className="mt-4 font-display text-2xl text-text leading-snug">
                  {p.title}
                </h3>
                <p className="mt-3 text-[15px] leading-relaxed text-muted flex-1">
                  {p.body}
                </p>
                <Link
                  to={p.cta.to}
                  className="mt-6 inline-flex items-center gap-2 self-start rounded-control border border-line px-5 py-2.5 text-sm text-text transition-all hover:border-brass hover:text-text hover:gap-3"
                >
                  {p.cta.label}
                  <span aria-hidden className="text-brass">→</span>
                </Link>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
