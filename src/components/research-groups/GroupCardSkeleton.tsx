/**
 * Loading placeholder for a research group card.
 *
 * Dimensions match ResearchGroupCard exactly — the same min-height on the
 * header block, the same padding, the same number of body rows — so swapping
 * real cards in causes no layout shift. That is the whole point: a spinner
 * would reflow the grid the moment data arrived.
 *
 * No pulse animation. The site's motion budget is the globe and the citation
 * network; a shimmering grid would be the busiest thing on the page.
 */
export function GroupCardSkeleton({ featured = false }: { featured?: boolean }) {
  return (
    <div
      aria-hidden
      className="flex flex-col overflow-hidden rounded-card border border-line bg-surface"
    >
      <div
        className={
          "bg-surface border-b border-line " +
          (featured ? "min-h-[15rem] md:min-h-[17rem]" : "min-h-[11.5rem]")
        }
      />
      <div className="flex flex-1 flex-col p-6">
        <Bar w="w-24" />
        <Bar w="w-4/5" className="mt-4 h-4" />
        <Bar w="w-3/5" className="mt-2 h-4" />
        <Bar w="w-full" className="mt-5" />
        <Bar w="w-2/3" className="mt-2" />
        <div className="mt-5 space-y-2">
          <Bar w="w-1/2" />
          <Bar w="w-2/3" />
          <Bar w="w-1/3" />
        </div>
        <div className="mt-6 pt-4 border-t border-line">
          <Bar w="w-28" />
        </div>
      </div>
    </div>
  );
}

function Bar({ w, className = "" }: { w: string; className?: string }) {
  return <div className={`h-3 rounded bg-line ${w} ${className}`} />;
}

/** A grid of skeletons matching the directory layout. */
export function GroupGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: count }, (_, i) => (
        <GroupCardSkeleton key={i} />
      ))}
    </div>
  );
}
