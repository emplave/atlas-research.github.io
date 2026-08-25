import { Hero } from "@/components/Hero";
import { FeaturedGroups } from "@/components/home/FeaturedGroups";
import { ResearchGroupsPitch } from "@/components/home/ResearchGroupsPitch";
import { EventsStrip } from "@/components/home/EventsStrip";
import { ProcessTrack } from "@/components/home/ProcessTrack";
import { StatementPanel } from "@/components/home/StatementPanel";
import { FieldIndex } from "@/components/home/FieldIndex";
import { OutputSection } from "@/components/home/OutputSection";
import { ProofBand } from "@/components/home/ProofBand";
import { GetInvolvedLine } from "@/components/home/GetInvolvedLine";
import { FellowshipStrip } from "@/components/home/FellowshipStrip";
import { Faq } from "@/components/Faq";
import { Closing } from "@/components/Closing";
import { HatchDivider } from "@/components/visuals/HatchDivider";

/**
 * The homepage.
 *
 *   hero · [groups running now] · 01 research groups · 02 events
 *   03 how the work runs · [statement panel] · 04 eight fields
 *   05 what the work produces · 06 proof band · get involved · fellowship
 *   FAQ · closing CTA
 *
 * PROOF THEN OFFER. The unnumbered groups listing comes first — real groups are
 * the strongest evidence the claim in the hero is true — and section 01 then makes
 * the offer to start one. It was removed entirely when every group on the site was
 * a fabricated placeholder; real groups exist now, so it is back.
 *
 * The listing is UNNUMBERED because it renders nothing when no group is
 * published, and a numbered section that can vanish leaves the spine starting at
 * 02. It is evidence for section 01 rather than a pillar of its own.
 *
 * Section 01 is the OFFER, not a gallery. It carries the five value props, the
 * cost, and the one CTA.
 *
 * Events come second, and are the most prominent section after the offer,
 * because a named speaker with an affiliation and a date is stronger evidence
 * than any claim the site can make about itself — and because they are the proof
 * of section 01's "Lessons from researchers" line. Everything above the process
 * track is therefore claim, then evidence for that claim.
 *
 * The numbered spine runs 01-06 across the six pillars. The statement panel,
 * get-involved line, fellowship strip, FAQ and closing are deliberately
 * unnumbered — they are punctuation, not pillars.
 *
 * INK BANDS: the proof band and the closing CTA are the two ink *sections*.
 * The statement panel is also ink but carries no heading or content — it is a
 * typographic rule between sections. Three dark surfaces total, spaced so no
 * two are adjacent.
 *
 * The "Next" event card in section 02 is also ink. It is a CARD inside a surface
 * section rather than a band, so it does not break the no-adjacent-bands rule —
 * the nearest ink section, the statement panel, is two sections further down.
 *
 * Hatch dividers replace two plain rules, at the points where the page changes
 * register: after the process track, and before the fellowship.
 *
 * Nothing here links to the fellowship application.
 */
export function Landing() {
  return (
    <>
      <Hero />
      <FeaturedGroups />
      <ResearchGroupsPitch />
      <EventsStrip />
      <ProcessTrack />
      <HatchDivider id="post-process" className="bg-paper border-b border-line" />
      <StatementPanel />
      <FieldIndex />
      <OutputSection />
      <ProofBand />
      <GetInvolvedLine />
      <HatchDivider id="pre-fellowship" className="bg-paper border-b border-line" />
      <FellowshipStrip />
      <Faq />
      <Closing />
    </>
  );
}
