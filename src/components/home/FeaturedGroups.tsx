import { Link } from "react-router-dom";
import { isVisibleByDefault } from "@/data/research-groups";
import { useResearchGroups } from "@/lib/useResearchGroups";
import { GroupCardSkeleton } from "@/components/research-groups/GroupCardSkeleton";
import { ResearchGroupCard } from "@/components/research-groups/ResearchGroupCard";
import { Section } from "./Section";

/**
 * The groups themselves — the proof, directly under the hero.
 *
 * Asymmetric grid: the first card spans two columns with larger type, so the
 * row does not read as six interchangeable tiles. Remaining cards fill around
 * it.
 *
 * Archived groups are excluded by the same isVisibleByDefault() rule the
 * directory uses, so a dissolved group can never be featured.
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
    <Section
      number="01"
      title="Research groups"
      tone="paper"
      action={
        <Link
          to="/research-groups"
          className="text-sm link"
        >
          See all research groups
        </Link>
      }
    >
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
