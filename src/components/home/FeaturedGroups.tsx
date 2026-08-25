import { isVisibleByDefault } from "@/data/research-groups";
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
 * NO "SEE ALL RESEARCH GROUPS" ACTION. The original had one, and it is
 * deliberately not restored: /research-groups leads with this same listing, so
 * the link went to a longer copy of what the reader was already looking at, and
 * it competed with the one primary CTA. Section 02 below carries the offer.
 *
 * Archived groups are excluded by the same isVisibleByDefault() rule the
 * listing uses, so a dissolved group can never be featured.
 *
 * DELIBERATELY UNNUMBERED. It sits above section 01 without taking a spine
 * numeral, for one hard reason: this section RENDERS NOTHING when no groups are
 * published, and a numbered section that can vanish leaves the spine starting at
 * 02 with no 01 above it. It is also not a seventh pillar — it is evidence for
 * section 01, the research groups offer, the same way the events strip is
 * evidence for the "sessions with researchers" line.
 *
 * RENDERS NOTHING when there are no published groups — no empty grid and no
 * "none yet" copy. That is the live state today: all six real rows have
 * Published set to "no", so this section is currently absent from the homepage.
 *
 * Reads through useResearchGroups, so this reflects the live Sheet.
 */
export function FeaturedGroups() {
  const { groups, loading } = useResearchGroups();

  const featured = groups
    .filter(isVisibleByDefault)
    .slice()
    .sort((a, b) => b.startedAt.localeCompare(a.startedAt))
    .slice(0, 6);

  if (!loading && featured.length === 0) return null;

  const [lead, ...rest] = featured;

  return (
    <Section title="Groups running now" tone="paper">
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
    </Section>
  );
}
