import { BringAtlasCta, CostLine } from "@/components/BringAtlasCta";
import { ValuePropList } from "@/components/ValuePropList";
import { Section } from "./Section";

/**
 * Section 01 — research groups, as an offer rather than a gallery.
 *
 * REPLACES FeaturedGroups, which listed group cards. The cards were the two
 * placeholder records, and a homepage whose first section is a grid of
 * fabricated COMPLETED projects is worse than one that makes a plain claim. The
 * listing is gone from here and from /research-groups, with no empty grid and no
 * "no groups yet" message — an empty state still advertises absence.
 *
 * WHAT THIS SECTION HAS TO DO: a homepage visitor is deciding whether to read
 * further, so this carries the five value props, the cost, and the one CTA, and
 * nothing else. The commitment ("what it takes") and the title ("you run it")
 * live only on /research-groups — repeating them here would put the whole
 * founder argument above the fold and leave that page as a duplicate.
 *
 * Value props come from src/data/value-props.ts, shared with that page, so the
 * two cannot drift.
 */
export function ResearchGroupsPitch() {
  return (
    <Section number="01" title="Research groups" tone="paper">
      <p className="mt-6 max-w-2xl type-body text-muted">
        Lead a research group at a school, in a community, or entirely online.
        Here is what you get.
      </p>

      {/*
        Shared with /research-groups — see src/components/ValuePropList.tsx for
        why this is a ruled ledger rather than the two-column grid it was.
      */}
      <ValuePropList className="mt-9" />

      <div className="mt-10">
        <CostLine />
        <div className="mt-6">
          <BringAtlasCta />
        </div>
      </div>
    </Section>
  );
}
