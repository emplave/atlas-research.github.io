import { Link } from "react-router-dom";
import { Reveal } from "@/components/Reveal";
import { isVisibleByDefault, RESEARCH_GROUPS } from "@/data/research-groups";
import { ResearchGroupCard } from "@/components/research-groups/ResearchGroupCard";

/**
 * Section 4 — three featured groups, straight from the data file.
 *
 * Archived groups are excluded by the same isVisibleByDefault() rule the
 * directory uses, so a dissolved group can never be featured. Newest first.
 */
export function FeaturedGroups() {
  const featured = RESEARCH_GROUPS.filter(isVisibleByDefault)
    .slice()
    .sort((a, b) => b.startedAt.localeCompare(a.startedAt))
    .slice(0, 3);

  if (featured.length === 0) return null;

  return (
    <section className="bg-ground border-t border-line">
      <div className="mx-auto max-w-6xl px-6 py-16 md:py-24">
        <Reveal>
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div>
              <p className="meta-label text-muted">Featured research groups</p>
              <h2 className="mt-4 font-display text-3xl md:text-5xl text-text leading-tight max-w-2xl">
                What groups are working on right now.
              </h2>
            </div>
            <Link
              to="/research-groups"
              className="text-sm text-accent hover:text-accent-hi transition-colors inline-flex items-center gap-1.5"
            >
              Browse all research groups
              <span aria-hidden>→</span>
            </Link>
          </div>
        </Reveal>

        <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {featured.map((group) => (
            <ResearchGroupCard key={group.slug} group={group} />
          ))}
        </div>
      </div>
    </section>
  );
}
