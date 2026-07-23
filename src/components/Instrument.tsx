import { ContainerScroll } from "@/components/ui/container-scroll-animation";
import { Reveal } from "./Reveal";

/**
 * The evidence base — dark section. The scroll card presents the fellow's
 * working desk: real datasets on one side, the brief taking shape on the
 * other. All values are illustrative UI labeled as a preview.
 */
function EvidenceMock() {
  const datasets = [
    {
      tag: "UNESCO UIS",
      text: "Out-of-school rates, by region and income group",
      meta: "1970–2024 · 200+ territories",
    },
    {
      tag: "WORLD BANK",
      text: "EdStats — education spending per student",
      meta: "Public expenditure · PPP-adjusted",
    },
    {
      tag: "OECD PISA",
      text: "Achievement gaps by socioeconomic status",
      meta: "Reading · Math · Science",
    },
  ];
  const brief = [
    { k: "REGION", v: "Yours" },
    { k: "QUESTION", v: "Who gets left out, and why?" },
    { k: "OUTPUT", v: "Policy brief · Lit review" },
    { k: "DESTINATION", v: "Atlas Journal · partners" },
  ];
  return (
    <div className="h-full w-full text-left flex flex-col font-mono text-[11px] md:text-xs">
      <div className="flex items-center justify-between px-4 md:px-6 py-3 border-b border-hairline-inverse-soft text-cream-300/80">
        <span className="tracking-caps uppercase">Atlas fellow workspace</span>
        <span className="flex items-center gap-2">
          <span className="h-1.5 w-1.5 rounded-full bg-gold-400 animate-pulse-node" />
          Preview
        </span>
      </div>
      <div className="grid md:grid-cols-[1.4fr_1fr] flex-1 min-h-0">
        <div className="p-4 md:p-6 space-y-3 overflow-hidden">
          <p className="text-cream-300/50 tracking-caps uppercase">
            The evidence base
          </p>
          {datasets.map((d) => (
            <div
              key={d.tag}
              className="border border-hairline-inverse-soft rounded-lg p-3 md:p-4 flex gap-3 items-start"
            >
              <span className="text-gold-400 whitespace-nowrap">{d.tag}</span>
              <div className="flex-1">
                <p className="font-sans text-[13px] md:text-sm text-cream-200 leading-snug">
                  {d.text}
                </p>
                <p className="mt-1 text-cream-300/40">{d.meta}</p>
              </div>
            </div>
          ))}
          <p className="text-cream-300/40">
            The same datasets professionals cite — not classroom toys.
          </p>
        </div>
        <div className="border-t md:border-t-0 md:border-l border-hairline-inverse-soft p-4 md:p-6">
          <p className="text-cream-300/50 tracking-caps uppercase mb-3">
            Your brief
          </p>
          <ul className="space-y-3">
            {brief.map((b) => (
              <li key={b.k} className="flex flex-col gap-0.5">
                <span className="text-cream-300/40">{b.k}</span>
                <span className="font-sans text-[13px] text-cream-200">
                  {b.v}
                </span>
              </li>
            ))}
          </ul>
          <div className="mt-5 pt-4 border-t border-hairline-inverse-soft text-cream-300/40">
            Drafted with editorial support · Wave 1
          </div>
        </div>
      </div>
    </div>
  );
}

export function Instrument() {
  return (
    <section className="bg-navy-950 text-cream-200 overflow-hidden">
      <div className="mx-auto max-w-6xl px-6 pt-20 md:pt-28">
        <Reveal>
          <p className="meta-label text-cream-300/60">The work</p>
        </Reveal>
      </div>
      <ContainerScroll
        titleComponent={
          <div className="px-6">
            <h2 className="font-serif text-3xl md:text-6xl text-cream-100 leading-tight">
              Real datasets. Your region.
              <br />
              <span className="italic text-gold-300">One brief that argues.</span>
            </h2>
            <p className="mt-5 mx-auto max-w-xl text-cream-300/70 text-base md:text-lg">
              Fellows don't simulate research — they do it: UNESCO, World Bank,
              and PISA data, pointed at the education gaps they live inside.
            </p>
          </div>
        }
      >
        <EvidenceMock />
      </ContainerScroll>
    </section>
  );
}
