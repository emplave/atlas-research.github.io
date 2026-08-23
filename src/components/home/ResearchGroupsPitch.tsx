import { BringAtlasCta, CostLine } from "@/components/BringAtlasCta";
import { VALUE_PROPS } from "@/data/value-props";
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
        Two columns at md, so five items do not read as a long list. The fifth
        wraps to a row of its own, which is fine — it is the least
        load-bearing of the five.
      */}
      <ul className="mt-9 grid gap-x-10 gap-y-7 md:grid-cols-2">
        {VALUE_PROPS.map((prop) => (
          <li key={prop.title}>
            <h3 className="type-card font-display">{prop.title}</h3>
            <p className="mt-2 text-[15px] text-muted leading-relaxed">
              {prop.body}
            </p>
          </li>
        ))}
      </ul>

      <div className="mt-10 pt-8 border-t border-line">
        <CostLine />
        <div className="mt-6">
          <BringAtlasCta />
        </div>
      </div>
    </Section>
  );
}
