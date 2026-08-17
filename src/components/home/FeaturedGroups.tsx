import { Link } from "react-router-dom";
import { isVisibleByDefault, RESEARCH_GROUPS } from "@/data/research-groups";
import { ResearchGroupCard } from "@/components/research-groups/ResearchGroupCard";

/**
 * Section 2 — the groups themselves, six cards, immediately.
 *
 * This is the proof. It sits directly under the hero because a reader
 * deciding whether Atlas is real needs to see actual projects, not a
 * description of what a project is. No paragraph intro.
 *
 * Archived groups are excluded by the same isVisibleByDefault() rule the
 * directory uses, so a dissolved group can never be featured here.
 */
export function FeaturedGroups() {
  const featured = RESEARCH_GROUPS.filter(isVisibleByDefault)
    .slice()
    .sort((a, b) => b.startedAt.localeCompare(a.startedAt))
    .slice(0, 6);

  if (featured.length === 0) return null;

  return (
    <section className="bg-paper border-b border-line">
      <div className="mx-auto max-w-6xl px-6 py-16 md:py-20">
        <div className="flex flex-wrap items-baseline justify-between gap-4">
          <h2 className="font-display text-2xl md:text-3xl">Research groups</h2>
          <Link
            to="/research-groups"
            className="text-sm text-accent underline underline-offset-4 hover:text-navy-hi transition-colors"
          >
            See all research groups
          </Link>
        </div>

        <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {featured.map((group) => (
            <ResearchGroupCard key={group.slug} group={group} />
          ))}
        </div>
      </div>
    </section>
  );
}
