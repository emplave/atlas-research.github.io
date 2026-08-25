import { BringAtlasCta, CostLine } from "@/components/BringAtlasCta";
import { ValuePropList } from "@/components/ValuePropList";
import { Section } from "./Section";

/**
 * Section 01 — research groups, as an offer.
 *
 * WHAT THIS SECTION HAS TO DO: a homepage visitor is deciding whether to read
 * further, so it carries the value props, the cost, and the one CTA, and nothing
 * else. The commitment ("what running a group involves") and the ownership
 * section live only on /research-groups — repeating them here would put the whole
 * founder argument above the fold and leave that page a duplicate.
 *
 * NO Section title and NO intro paragraph. ValuePropList supplies both now.
 * Leaving the old "Research groups" title in place put two headings back to back,
 * and the old intro — "Lead a research group at a school, in a community, or
 * entirely online" — said almost exactly what the new shared subhead says. The 01
 * numeral still renders in the spine, alongside the component's own heading.
 *
 * Heading, subhead and props all come from src/data/value-props.ts, shared with
 * /research-groups, so the two pages cannot drift.
 */
export function ResearchGroupsPitch() {
  return (
    <Section number="01" tone="paper">
      <ValuePropList />

      <div className="mt-10">
        <CostLine />
        <div className="mt-6">
          <BringAtlasCta />
        </div>
      </div>
    </Section>
  );
}
