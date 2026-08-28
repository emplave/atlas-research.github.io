import { Link } from "react-router-dom";
import { isVisibleByDefault, sortForFeatured } from "@/data/research-groups";
import { useResearchGroups } from "@/lib/useResearchGroups";
import { GroupCardSkeleton } from "@/components/research-groups/GroupCardSkeleton";
import { ResearchGroupCard } from "@/components/research-groups/ResearchGroupCard";
import { Section } from "./Section";

/**
 * How many groups the homepage shows. FIVE, AND IT IS THE GRID ARITHMETIC.
 *
 * The grid is three columns at lg and the lead card spans two of them, so the
 * cards occupy (N + 1) column units, not N. Five cards is six units — exactly
 * two full rows: one wide plus one narrow, then three narrow.
 *
 * SIX WAS WRONG, and wrong by one. Six cards is seven units, which fills two
 * rows and leaves a single orphan card alone on a third. The comment here used
 * to claim six filled two rows exactly; it did not.
 *
 * Any change to this number has to be checked against the span:
 *   N cards → N + 1 units → rows of 3 → whole rows only when N is 2 (mod 3).
 * So 5, 8, 11 tile cleanly. 6, 7, 9, 10 do not.
 *
 * The skeleton branch derives its count from this, so the loading grid and the
 * loaded grid can never show a different number of cards.
 */
const FEATURED_COUNT = 5;

/**
 * The groups themselves — the proof, directly under the hero.
 *
 * Restored from git after being removed, along with the listing, when every
 * group on the site was a fabricated placeholder. Real groups exist now.
 *
 * Asymmetric grid: the first card spans two columns with larger type, so the
 * row does not read as five interchangeable tiles. Remaining cards fill around
 * it.
 *
 * FIVE CARDS, HARD CAP, AND THEN A TEXT LINK. The cap is what makes the link
 * necessary: once this section can withhold groups, a reader has no way to reach
 * the sixth, and /research-groups stops being a longer copy of what they are
 * looking at and becomes the only place the rest exist.
 *
 * FIVE IS ARITHMETIC, NOT TASTE — see FEATURED_COUNT below.
 *
 * THE LINK IS TEXT, NOT A BUTTON, and it sits below the grid rather than in the
 * Section action slot. Both are about the primary CTA in the hero above and in
 * section 01 below: a second button here would read as a second offer, and the
 * action slot would put it on the heading line where the eye lands first. Under
 * the grid it is where a reader looks only after running out of cards. Do not
 * promote it to a button, do not give it an arrow, and do not move it up.
 *
 * THE LINK IS NOT GATED ON DATA. It used to render only when `!loading`, which
 * tied a static destination to the state of a network fetch: /research-groups
 * exists whether or not the Sheet has answered, so there is no state in which
 * the grid is on screen and the way out of it should not be. The only thing that
 * removes it is the whole section returning null.
 *
 * Archived groups are excluded by the same isVisibleByDefault() rule the
 * listing uses, so a dissolved group can never be featured.
 *
 * TITLED "Groups on Atlas", NOT "Research groups". Section 01 immediately below
 * is already titled "Research groups", and this section sits directly above it —
 * so sharing the noun would put the same heading on screen twice in a row, the
 * same duplication that was just removed from /get-involved. It also must not say
 * "running" or "active": most groups are Forming and several have one member.
 * "Groups on Atlas" is true of every one of them and claims nothing about
 * progress.
 *
 * DELIBERATELY UNNUMBERED. It sits above section 01 without taking a spine
 * numeral, for one hard reason: this section RENDERS NOTHING when no groups are
 * published, and a numbered section that can vanish leaves the spine starting at
 * 02 with no 01 above it. It is also not a seventh pillar — it is evidence for
 * section 01, the research groups offer, the same way the events strip is
 * evidence for the "Lessons from researchers" line.
 *
 * RENDERS NOTHING when there are no published groups — no empty grid and no
 * "none yet" copy. That is not the live state: the Sheet currently publishes
 * eleven rows, so the section renders and the cap is doing real work. Do not
 * re-describe this as an absent section without rechecking the Sheet.
 *
 * Reads through useResearchGroups, so this reflects the live Sheet.
 */
export function FeaturedGroups() {
  const { groups, loading } = useResearchGroups();

  /*
   * Recruiting first, then biggest, then newest — sortForFeatured, which is the
   * homepage's own order rather than the listing's. All three keys exist to serve
   * the slice below: with only five shown, the sort is deciding what a reader
   * never sees, so a group they can join is never the one cut, and of the ones
   * they can join the fullest lead.
   */
  const featured = sortForFeatured(groups.filter(isVisibleByDefault)).slice(
    0,
    FEATURED_COUNT
  );

  if (!loading && featured.length === 0) return null;

  /*
   * THE WIDE CARD IS ALWAYS featured[0] — the first group in sorted order, with
   * no condition attached. Destructuring here rather than deciding per-card
   * inside the map is what makes that unconditional: there is exactly one place
   * that renders md:col-span-2, it is outside the loop, and it is fed the head of
   * the array. A card cannot become wide by any other route, and the wide slot
   * cannot be given to anything but the first item.
   *
   * If the wrong group looks wide, the sort is what to inspect, not this — the
   * two are the same question. See sortForFeatured in src/data/research-groups.ts.
   */
  const [lead, ...rest] = featured;

  return (
    <Section title="Groups on Atlas" tone="paper">
      {/*
        items-start so a card sizes to its own content. Without it the grid
        stretches every card in a row to the tallest one, which is what padded
        the featured card with empty space.
      */}
      <div className="mt-8 grid items-start gap-5 md:grid-cols-2 lg:grid-cols-3">
        {loading ? (
          <>
            <div className="md:col-span-2">
              <GroupCardSkeleton featured />
            </div>
            {Array.from({ length: FEATURED_COUNT - 1 }, (_, i) => (
              <GroupCardSkeleton key={i} />
            ))}
          </>
        ) : (
          <>
            <div className="md:col-span-2">
              <ResearchGroupCard group={lead} featured />
            </div>
            {rest.map((group) => (
              <ResearchGroupCard key={group.slug} group={group} />
            ))}
          </>
        )}
      </div>

      <p className="mt-8 text-sm">
        <Link to="/research-groups" className="link">
          See all research groups
        </Link>
      </p>
    </Section>
  );
}
