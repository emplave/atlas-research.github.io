import { Link } from "react-router-dom";
import { isVisibleByDefault, sortForFeatured } from "@/data/research-groups";
import { useResearchGroups } from "@/lib/useResearchGroups";
import { GroupCardSkeleton } from "@/components/research-groups/GroupCardSkeleton";
import { ResearchGroupCard } from "@/components/research-groups/ResearchGroupCard";
import { Section } from "./Section";

/**
 * The groups themselves — the proof, directly under the hero.
 *
 * Restored from git after being removed, along with the listing, when every
 * group on the site was a fabricated placeholder. Real groups exist now.
 *
 * Asymmetric grid: the first card spans two columns with larger type, so the
 * row does not read as six interchangeable tiles. Remaining cards fill around
 * it.
 *
 * SIX CARDS, HARD CAP, AND THEN A TEXT LINK. The cap is what makes the link
 * necessary: once this section can withhold groups, a reader has no way to reach
 * the seventh, and /research-groups stops being a longer copy of what they are
 * looking at and becomes the only place the rest exist.
 *
 * THE LINK IS TEXT, NOT A BUTTON, and it sits below the grid rather than in the
 * Section action slot. Both are about the primary CTA in the hero above and in
 * section 01 below: a second button here would read as a second offer, and the
 * action slot would put it on the heading line where the eye lands first. Under
 * the grid it is where a reader looks only after running out of cards. Do not
 * promote it to a button, do not give it an arrow, and do not move it up.
 *
 * Archived groups are excluded by the same isVisibleByDefault() rule the
 * listing uses, so a dissolved group can never be featured.
 *
 * TITLED "Groups on Atlas", NOT "Research groups". Section 01 immediately below
 * is already titled "Research groups", and this section sits directly above it —
 * so sharing the noun would put the same heading on screen twice in a row, the
 * same duplication that was just removed from /get-involved. It also must not say
 * "running" or "active": every group is Pending with one member. "Groups on
 * Atlas" is true of all six and claims nothing about progress.
 *
 * DELIBERATELY UNNUMBERED. It sits above section 01 without taking a spine
 * numeral, for one hard reason: this section RENDERS NOTHING when no groups are
 * published, and a numbered section that can vanish leaves the spine starting at
 * 02 with no 01 above it. It is also not a seventh pillar — it is evidence for
 * section 01, the research groups offer, the same way the events strip is
 * evidence for the "Lessons from researchers" line.
 *
 * RENDERS NOTHING when there are no published groups — no empty grid and no
 * "none yet" copy. That is the live state today: all six real rows have
 * Published set to "no", so this section is currently absent from the homepage.
 *
 * Reads through useResearchGroups, so this reflects the live Sheet.
 */
export function FeaturedGroups() {
  const { groups, loading } = useResearchGroups();

  /*
   * Recruiting first, then biggest, then newest — sortForFeatured, which is the
   * homepage's own order rather than the listing's. All three keys exist to serve
   * the slice below: with only six shown, the sort is deciding what a reader
   * never sees, so a group they can join is never the one cut, and of the ones
   * they can join the fullest lead.
   *
   * SIX IS THE CAP, and it is also the grid: the lead card spans two columns of
   * a three-column row, so six cards fill exactly two rows with no gap. Changing
   * this number without changing the grid leaves a ragged last row.
   */
  const featured = sortForFeatured(groups.filter(isVisibleByDefault)).slice(0, 6);

  if (!loading && featured.length === 0) return null;

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
            {Array.from({ length: 4 }, (_, i) => (
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

      {/*
        Hidden while loading, so the link does not appear under a grid of
        skeletons and offer to show "all" of nothing.
      */}
      {!loading && (
        <p className="mt-8 text-sm">
          <Link to="/research-groups" className="link">
            See all research groups
          </Link>
        </p>
      )}
    </Section>
  );
}
