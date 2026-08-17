import { useMemo, useState } from "react";
import {
  isVisibleByDefault,
  RESEARCH_GROUPS,
  type ResearchGroup,
} from "@/data/research-groups";
import { findOpening, isFormPending } from "@/data/openings";
import { ResearchGroupCard } from "@/components/research-groups/ResearchGroupCard";
import {
  ALL,
  DirectoryFilters,
  EMPTY_FILTERS,
  isFiltered,
  type DirectoryFilterState,
} from "@/components/research-groups/DirectoryFilters";

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
 * Everything rendered here comes from src/data/research-groups.ts — no group is
 * hardcoded. Archived groups are excluded by isVisibleByDefault() unless the
 * reader explicitly asks for them, so the directory never fills with dead
 * listings.
 */
export function ResearchGroups() {
  const [filters, setFilters] = useState<DirectoryFilterState>(EMPTY_FILTERS);

  /** Groups in scope before the field/status/setting/search filters apply. */
  const inScope = useMemo(
    () =>
      RESEARCH_GROUPS.filter(
        (g) => filters.includeArchived || isVisibleByDefault(g)
      ),
    [filters.includeArchived]
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
          <p className="meta-label text-muted">Research groups · Directory</p>
          <h1 className="mt-4 font-display text-4xl md:text-6xl leading-[1.05] max-w-3xl">
            Every Atlas research group, and what it is working on.
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-muted leading-relaxed">
            A research group is a working research community. Each one investigates a
            question in its own local context — in any discipline — and takes
            it through to a concrete output. Groups open to new members are
            marked Recruiting.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-10 md:py-14">
        <DirectoryFilters
          value={filters}
          onChange={setFilters}
          onReset={() => setFilters(EMPTY_FILTERS)}
          resultCount={results.length}
          totalCount={inScope.length}
        />

        {results.length > 0 ? (
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
              {isFiltered(filters)
                ? "Try widening the field, status, or setting — or clear the search term."
                : "There are no research groups in the directory yet."}
            </p>
            {isFiltered(filters) && (
              <button
                type="button"
                onClick={() => setFilters(EMPTY_FILTERS)}
                className="mt-7 rounded-control bg-navy text-white px-5 py-2.5 text-sm hover:bg-navy-hi transition-colors"
              >
                Reset filters
              </button>
            )}
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
              <p className="meta-label text-muted">
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
                  className="inline-flex items-center gap-2.5 rounded-control bg-navy text-white pl-6 pr-5 py-3 text-[15px] hover:bg-navy-hi transition-all hover:gap-3.5"
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
