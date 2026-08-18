import { Hero } from "@/components/Hero";
import { FeaturedGroups } from "@/components/home/FeaturedGroups";
import { EventsStrip } from "@/components/home/EventsStrip";
import { ProcessTrack } from "@/components/home/ProcessTrack";
import { FieldIndex } from "@/components/home/FieldIndex";
import { ProofBand } from "@/components/home/ProofBand";
import { FellowshipStrip } from "@/components/home/FellowshipStrip";
import { Faq } from "@/components/Faq";
import { Closing } from "@/components/Closing";

/**
 * The homepage.
 *
 *   hero · 01 research groups · 02 events · 03 how the work runs
 *   04 eight fields · 05 proof band · 06 fellowship · FAQ · closing CTA
 *
 * Groups come first because they are the proof. Events come second because a
 * named speaker with an affiliation and a date is stronger evidence than any
 * claim the site could make about itself — it was previously buried at 05.
 *
 * ProcessTrack and FieldIndex together are "what Atlas provides": the sequence
 * the work runs through, then the range of fields it covers.
 *
 * Section tones alternate paper / surface / paper / surface, then navy, so no
 * card ever sits on its own background colour. Each numbered section carries
 * its numeral in the heading's left margin (components/home/Section.tsx).
 *
 * Exactly two navy full-bleed bands: the proof band and the closing CTA.
 * Nothing here links to the fellowship application.
 */
export function Landing() {
  return (
    <>
      <Hero />
      <FeaturedGroups />
      <EventsStrip />
      <ProcessTrack />
      <FieldIndex />
      <ProofBand />
      <FellowshipStrip />
      <Faq />
      <Closing />
    </>
  );
}
