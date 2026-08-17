import { Hero } from "@/components/Hero";
import { WhatIsAResearchGroup } from "@/components/home/WhatIsAResearchGroup";
import { HowItWorks } from "@/components/home/HowItWorks";
import { FeaturedGroups } from "@/components/home/FeaturedGroups";
import { WhatAtlasProvides } from "@/components/home/WhatAtlasProvides";
import { EventsStrip } from "@/components/home/EventsStrip";
import { FellowshipStrip } from "@/components/home/FellowshipStrip";
import { PartnersStrip } from "@/components/home/PartnersStrip";
import { Faq } from "@/components/Faq";
import { Closing } from "@/components/Closing";

/**
 * The homepage. Research groups lead; the fellowship is one compact
 * secondary strip.
 *
 * Section order is deliberate and matches the approved structure:
 *   1 hero · 2 what a group is · 3 how it works · 4 featured groups
 *   5 what Atlas provides · 6 events · 7 fellowship · 8 partners · 9 closing
 *
 * Nothing on this page links to the application. The fellowship's only action
 * here is the waitlist.
 */
export function Landing() {
  return (
    <>
      <Hero />
      <WhatIsAResearchGroup />
      <HowItWorks />
      <FeaturedGroups />
      <WhatAtlasProvides />
      <EventsStrip />
      <FellowshipStrip />
      <PartnersStrip />
      <Faq />
      <Closing />
    </>
  );
}
