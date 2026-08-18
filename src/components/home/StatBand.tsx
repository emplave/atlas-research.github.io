import { displayStats } from "@/lib/stats";

/**
 * The stat band.
 *
 * Renders NOTHING at launch, and that is the intended state — every value in
 * src/lib/stats.ts is null. Filling in one number there makes the band appear
 * with no change to this file or to the page that mounts it.
 *
 * There is no empty state, no skeleton, and no "coming soon" slot. A stat
 * without a real number does not exist.
 *
 * Designed to sit inside the ink proof band, so its type is paper.
 */
export function StatBand() {
  const stats = displayStats();
  if (stats.length === 0) return null;

  return (
    <dl
      className="grid grid-cols-2 gap-x-8 gap-y-6 sm:grid-cols-4"
      style={{
        gridTemplateColumns: `repeat(${Math.min(stats.length, 4)}, minmax(0, 1fr))`,
      }}
    >
      {stats.map((stat) => (
        <div key={stat.label}>
          <dt className="meta-label text-faint">{stat.label}</dt>
          <dd className="mt-1.5 font-display text-3xl md:text-4xl text-paper">
            {stat.value.toLocaleString("en-US")}
          </dd>
        </div>
      ))}
    </dl>
  );
}
