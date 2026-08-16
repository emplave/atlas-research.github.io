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
    <div className="h-full w-full text-left flex flex-col font-sans text-[11px] md:text-xs">
      <div className="flex items-center justify-between px-4 md:px-6 py-3 border-b border-line/50 text-muted/80">
        <span className="tracking-caps uppercase">Atlas fellow workspace</span>
        <span className="flex items-center gap-2">
          <span className="h-1.5 w-1.5 rounded-full bg-brass" />
          Preview
        </span>
      </div>
      <div className="grid md:grid-cols-[1.4fr_1fr] flex-1 min-h-0">
        <div className="p-4 md:p-6 space-y-3 overflow-hidden">
          <p className="text-muted/50 tracking-caps uppercase">
            The evidence base
          </p>
          {datasets.map((d) => (
            <div
              key={d.tag}
              className="border border-line/50 rounded-control p-3 md:p-4 flex gap-3 items-start"
            >
              <span className="text-brass whitespace-nowrap">{d.tag}</span>
              <div className="flex-1">
                <p className="font-sans text-[13px] md:text-sm text-text leading-snug">
                  {d.text}
                </p>
                <p className="mt-1 text-muted/40">{d.meta}</p>
              </div>
            </div>
          ))}
          <p className="text-muted/40">
            The same datasets professionals cite — not classroom toys.
          </p>
        </div>
        <div className="border-t md:border-t-0 md:border-l border-line/50 p-4 md:p-6">
          <p className="text-muted/50 tracking-caps uppercase mb-3">
            Your brief
          </p>
          <ul className="space-y-3">
            {brief.map((b) => (
              <li key={b.k} className="flex flex-col gap-0.5">
                <span className="text-muted/40">{b.k}</span>
                <span className="font-sans text-[13px] text-text">
                  {b.v}
                </span>
              </li>
            ))}
          </ul>
          <div className="mt-5 pt-4 border-t border-line/50 text-muted/40">
            Drafted with editorial support · Wave 1
          </div>
        </div>
      </div>
    </div>
  );
}

export function Instrument() {
  return (
    <section className="bg-ground text-text overflow-hidden">
      <div className="mx-auto max-w-6xl px-6 pt-20 md:pt-28">
        <Reveal>
          <p className="meta-label text-muted/60">The work</p>
        </Reveal>
      </div>
      <ContainerScroll
        titleComponent={
          <div className="px-6">
            <h2 className="font-display text-3xl md:text-6xl text-text leading-tight">
              Real datasets. Your region.
              <br />
              <span className="italic text-brass">One brief that argues.</span>
            </h2>
            <p className="mt-5 mx-auto max-w-xl text-muted/70 text-base md:text-lg">
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
