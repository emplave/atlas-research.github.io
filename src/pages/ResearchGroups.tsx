import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import {
  isVisibleByDefault,
  type Field,
  type ResearchGroup,
} from "@/data/research-groups";
import { useResearchGroups } from "@/lib/useResearchGroups";
import { GroupGridSkeleton } from "@/components/research-groups/GroupCardSkeleton";
import { findOpening, isFormPending } from "@/data/openings";
import { ResearchGroupCard } from "@/components/research-groups/ResearchGroupCard";
import {
  ALL,
  DirectoryFilters,
  EMPTY_FILTERS,
  isFiltered,
  type DirectoryFilterState,
} from "@/components/research-groups/DirectoryFilters";

const FIELDS: Field[] = [
  "Computer Science & AI",
  "Health & Life Sciences",
  "Engineering & Technology",
  "Physical Sciences & Mathematics",
  "Social Sciences",
  "Humanities",
  "Economics & Business",
  "Environment & Sustainability",
];

/** Newest first by startedAt — the default order for the directory. */
function byNewest(a: ResearchGroup, b: ResearchGroup): number {
  return b.startedAt.localeCompare(a.startedAt);
}

/** Free-text match across project title, one-line summary, and lead name. */
function matchesQuery(group: ResearchGroup, query: string): boolean {
  const q = query.trim().toLowerCase();
  if (!q) return true;
  return [group.projectTitle, group.oneLine, group.leadName]
    .join(" ")
    .toLowerCase()
    .includes(q);
}

/**
 * The research group directory. Dark chrome.
 *
 * Everything rendered here comes through useResearchGroups, which reads the
 * live Google Sheet and falls back to the seed dataset. No group is hardcoded. Archived groups are excluded by isVisibleByDefault() unless the
 * reader explicitly asks for them, so the directory never fills with dead
 * listings.
 */
export function ResearchGroups() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [filters, setFilters] = useState<DirectoryFilterState>(EMPTY_FILTERS);
  const { groups, loading } = useResearchGroups();

  /**
   * Adopt ?field= from the URL, so the field index on the homepage links to a
   * genuinely pre-filtered directory rather than an unfiltered one. Only a
   * value matching the Field union is accepted; anything else is ignored
   * rather than producing an empty directory for a bad query string.
   */
  useEffect(() => {
    const requested = searchParams.get("field");
    if (!requested) return;
    const match = FIELDS.find((f) => f === requested);
    if (match) setFilters((prev) => ({ ...prev, field: match }));
    searchParams.delete("field");
    setSearchParams(searchParams, { replace: true });
  }, [searchParams, setSearchParams]);

  /** Groups in scope before the field/status/setting/search filters apply. */
  const inScope = useMemo(
    () =>
      groups.filter((g) => filters.includeArchived || isVisibleByDefault(g)),
    [groups, filters.includeArchived]
  );

  const results = useMemo(
    () =>
      inScope
        .filter((g) => filters.field === ALL || g.field === filters.field)
        .filter((g) => filters.status === ALL || g.status === filters.status)
        .filter((g) => filters.setting === ALL || g.setting === filters.setting)
        .filter((g) => matchesQuery(g, filters.query))
        .sort(byNewest),
    [inScope, filters.field, filters.status, filters.setting, filters.query]
  );

  const groupOpening = findOpening("chapter-leader");
  const startFormPending = !groupOpening || isFormPending(groupOpening);

  return (
    <div className="bg-paper">
      <section className="border-b border-line">
        <div className="mx-auto max-w-6xl px-6 pt-16 md:pt-24 pb-12">
          <p className="meta-label">Research groups · Directory</p>
          <h1 className="type-hero font-display max-w-3xl">
            Every Atlas research group.
          </h1>
          <p className="mt-8 max-w-2xl type-body text-muted">
            Groups open to new members are marked Recruiting.
          </p>
        </div>
      </section>

      {/*
        Starting a group is pushed hard here, above the filters. Most readers
        arriving at a directory are deciding whether to join OR to start, and
        the second option was previously buried at the bottom of the page.
      */}
      <section className="border-b border-line bg-surface">
        <div className="mx-auto max-w-6xl px-6 py-8 md:py-10 flex flex-col md:flex-row md:items-center justify-between gap-5">
          <div className="max-w-2xl">
            <h2 className="font-display text-xl md:text-2xl">
              No group here doing your question? Start one.
            </h2>
            <p className="mt-2 text-[15px] text-muted leading-relaxed">
              You need three or more members and one question. Atlas provides the
              rest.
            </p>
          </div>
          <div className="shrink-0">
            {startFormPending ? (
              <span
                aria-disabled="true"
                className="inline-flex rounded-control border border-line px-6 py-3 text-[15px] text-muted cursor-not-allowed"
              >
                Applications opening soon
              </span>
            ) : (
              <a
                href={groupOpening.formUrl as string}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex rounded-control bg-ink text-paper px-6 py-3 text-[15px] hover:bg-ink-hover transition-colors"
              >
                Start a research group
              </a>
            )}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-10 md:py-12">
        <DirectoryFilters
          value={filters}
          onChange={setFilters}
          onReset={() => setFilters(EMPTY_FILTERS)}
          resultCount={results.length}
          totalCount={inScope.length}
        />

        {loading ? (
          <div className="mt-8">
            <GroupGridSkeleton />
          </div>
        ) : results.length > 0 ? (
          <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {results.map((group) => (
              <ResearchGroupCard key={group.slug} group={group} />
            ))}
          </div>
        ) : (
          <div className="mt-8 rounded-card border border-line bg-surface px-6 py-16 text-center">
            <h2 className="font-display text-2xl">
              No groups match those filters.
            </h2>
            <p className="mt-3 mx-auto max-w-md text-[15px] text-muted leading-relaxed">
              No group here is working on what you are looking for. That is a
              reason to start one.
            </p>
            {/*
              Starting a group is the primary action in the empty state.
              Resetting filters only returns the reader to a list that already
              did not have what they wanted.
            */}
            <div className="mt-7 flex flex-wrap justify-center gap-3">
              {startFormPending ? (
                <span
                  aria-disabled="true"
                  className="rounded-control border border-line px-5 py-2.5 text-sm text-muted cursor-not-allowed"
                >
                  Applications opening soon
                </span>
              ) : (
                <a
                  href={groupOpening.formUrl as string}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-control bg-ink text-paper px-5 py-2.5 text-sm hover:bg-ink-hover transition-colors"
                >
                  Start a research group
                </a>
              )}
              {isFiltered(filters) && (
                <button
                  type="button"
                  onClick={() => setFilters(EMPTY_FILTERS)}
                  className="rounded-control border border-line bg-paper text-ink px-5 py-2.5 text-sm hover:bg-ink hover:text-paper transition-colors"
                >
                  Reset filters
                </button>
              )}
            </div>
          </div>
        )}
      </section>

      {/*
        Someone who finds no group worth joining still needs a path forward:
        start their own. Links to the Research Group Leader opening, never a
        hardcoded URL.
      */}
      <section className="border-t border-line">
        <div className="mx-auto max-w-6xl px-6 py-16 md:py-20">
          <div className="rounded-card border border-line bg-surface p-8 md:p-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
            <div className="max-w-xl">
              <p className="meta-label">
                {groupOpening?.area ?? "Research Group leadership"}
              </p>
              <h2 className="mt-3 font-display text-2xl md:text-3xl">
                Nothing here fits? Start your own.
              </h2>
              <p className="mt-3 text-[15px] text-muted leading-relaxed">
                {groupOpening?.oneLine ??
                  "Start and lead a local Atlas research group."}{" "}
                You pick the question, recruit the team, and take it through to
                a real output.
              </p>
            </div>
            <div className="shrink-0">
              {startFormPending ? (
                <span
                  aria-disabled="true"
                  title="The Research Group Leader form is not open yet"
                  className="inline-flex rounded-control border border-line px-6 py-3 text-[15px] text-muted cursor-not-allowed"
                >
                  Opening soon
                </span>
              ) : (
                <a
                  href={groupOpening.formUrl as string}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2.5 rounded-control bg-ink text-paper pl-6 pr-5 py-3 text-[15px] hover:bg-ink-hover transition-all hover:gap-3.5"
                >
                  Apply to lead a group
                  <span aria-hidden>→</span>
                </a>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
