import { Hero } from "@/components/Hero";
import { FeaturedGroups } from "@/components/home/FeaturedGroups";
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
 *   hero · 01 research groups · 02 events · 03 how the work runs
 *   [statement panel] · 04 eight fields · 05 what the work produces
 *   06 proof band · get involved · fellowship · FAQ · closing CTA
 *
 * Groups come first because they are the proof. Events come second because a
 * named speaker with an affiliation and a date is stronger evidence than any
 * claim the site could make about itself.
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
