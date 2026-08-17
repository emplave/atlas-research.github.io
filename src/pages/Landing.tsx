import { Hero } from "@/components/Hero";
import { FeaturedGroups } from "@/components/home/FeaturedGroups";
import { ProcessTrack } from "@/components/home/ProcessTrack";
import { FieldIndex } from "@/components/home/FieldIndex";
import { ProofBand } from "@/components/home/ProofBand";
import { EventsStrip } from "@/components/home/EventsStrip";
import { FellowshipStrip } from "@/components/home/FellowshipStrip";
import { Faq } from "@/components/Faq";
import { Closing } from "@/components/Closing";

/**
 * The homepage.
 *
 *   hero · 01 research groups · 02 how the work runs · 03 eight fields
 *   04 proof band · 05 events · 06 fellowship · FAQ · closing CTA
 *
 * The groups sit first because they are the proof — a reader deciding whether
 * this is real needs actual projects, not a description of a project.
 *
 * ProcessTrack replaces the old four text boxes of "What Atlas provides": the
 * same commitments, drawn as the sequence they actually happen in.
 *
 * Section tones alternate paper / surface, and each numbered section carries
 * its numeral in the heading's left margin (see components/home/Section.tsx).
 *
 * Exactly two navy full-bleed bands: the proof band and the closing CTA.
 * Nothing here links to the fellowship application.
 */
export function Landing() {
  return (
    <>
      <Hero />
      <FeaturedGroups />
      <ProcessTrack />
      <FieldIndex />
      <ProofBand />
      <EventsStrip />
      <FellowshipStrip />
      <Faq />
      <Closing />
    </>
  );
}
