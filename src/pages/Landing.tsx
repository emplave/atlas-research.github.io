import { Hero } from "@/components/Hero";
import { FeaturedGroups } from "@/components/home/FeaturedGroups";
import { WhatAtlasProvides } from "@/components/home/WhatAtlasProvides";
import { ProofBand } from "@/components/home/ProofBand";
import { EventsStrip } from "@/components/home/EventsStrip";
import { FellowshipStrip } from "@/components/home/FellowshipStrip";
import { Faq } from "@/components/Faq";
import { Closing } from "@/components/Closing";

/**
 * The homepage, ordered for a five-second read.
 *
 *   1 hero · 2 research groups · 3 what Atlas provides · 4 proof band
 *   5 events · 6 fellowship · 7 FAQ · 8 closing CTA
 *
 * The groups sit second because they are the proof — a reader deciding whether
 * this is real needs actual projects, not a description of what a project is.
 *
 * Exactly two navy full-bleed bands: the proof band and the closing CTA.
 * Nothing here links to the fellowship application.
 */
export function Landing() {
  return (
    <>
      <Hero />
      <FeaturedGroups />
      <WhatAtlasProvides />
      <ProofBand />
      <EventsStrip />
      <FellowshipStrip />
      <Faq />
      <Closing />
    </>
  );
}
