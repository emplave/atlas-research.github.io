import { Link } from "react-router-dom";
import { isVisibleByDefault, RESEARCH_GROUPS } from "@/data/research-groups";
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
 */
export function FeaturedGroups() {
  const featured = RESEARCH_GROUPS.filter(isVisibleByDefault)
    .slice()
    .sort((a, b) => b.startedAt.localeCompare(a.startedAt))
    .slice(0, 6);

  if (featured.length === 0) return null;

  const [lead, ...rest] = featured;

  return (
    <Section
      number="01"
      title="Research groups"
      tone="paper"
      action={
        <Link
          to="/research-groups"
          className="text-sm text-accent underline underline-offset-4 hover:text-navy-hi transition-colors"
        >
          See all research groups
        </Link>
      }
    >
      <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        <div className="md:col-span-2">
          <ResearchGroupCard group={lead} featured />
        </div>
        {rest.map((group) => (
          <ResearchGroupCard key={group.slug} group={group} />
        ))}
      </div>
    </Section>
  );
}
