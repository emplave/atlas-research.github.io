import type { Field, Setting, Status } from "@/data/research-groups";
import { cn } from "@/lib/utils";

export const ALL = "all" as const;

export type DirectoryFilterState = {
  query: string;
  field: Field | typeof ALL;
  status: Status | typeof ALL;
  setting: Setting | typeof ALL;
  /** Archived is excluded unless this is explicitly turned on. */
  includeArchived: boolean;
};

export const EMPTY_FILTERS: DirectoryFilterState = {
  query: "",
  field: ALL,
  status: ALL,
  setting: ALL,
  includeArchived: false,
};

/** True when anything is narrowing the view — drives the reset affordance. */
export function isFiltered(f: DirectoryFilterState): boolean {
  return (
    f.query.trim() !== "" ||
    f.field !== ALL ||
    f.status !== ALL ||
    f.setting !== ALL ||
    f.includeArchived
  );
}

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

/**
 * Archived is deliberately NOT in this list. It is not a status you filter to
 * — it is behind the "Include archived" toggle, so the directory cannot be
 * filled with dead listings by a stray dropdown selection.
 */
const STATUSES: Status[] = ["Recruiting", "In Progress", "Full", "Completed"];

const SETTINGS: { value: Setting; label: string }[] = [
  { value: "school", label: "School-based" },
  { value: "community", label: "Community-based" },
  { value: "hybrid", label: "Hybrid" },
  { value: "online", label: "Online" },
];

const selectCls =
  "w-full rounded-control border border-line bg-paper px-3 py-2.5 text-sm text-ink focus:outline-none focus:border-accent transition-colors";

export function DirectoryFilters({
  value,
  onChange,
  onReset,
  resultCount,
  totalCount,
}: {
  value: DirectoryFilterState;
  onChange: (next: DirectoryFilterState) => void;
  onReset: () => void;
  resultCount: number;
  totalCount: number;
}) {
  const set = <K extends keyof DirectoryFilterState>(
    key: K,
    v: DirectoryFilterState[K]
  ) => onChange({ ...value, [key]: v });

  return (
    <div className="rounded-card border border-line bg-surface p-5 md:p-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <label className="block lg:col-span-2">
          <span className="meta-label text-muted">Search</span>
          <input
            type="search"
            value={value.query}
            onChange={(e) => set("query", e.target.value)}
            placeholder="Project title, summary, or lead name"
            className={cn(selectCls, "mt-2")}
          />
        </label>

        <label className="block">
          <span className="meta-label text-muted">Field</span>
          <select
            value={value.field}
            onChange={(e) => set("field", e.target.value as Field | typeof ALL)}
            className={cn(selectCls, "mt-2")}
          >
            <option value={ALL}>All fields</option>
            {FIELDS.map((f) => (
              <option key={f} value={f}>
                {f}
              </option>
            ))}
          </select>
        </label>

        <label className="block">
          <span className="meta-label text-muted">Status</span>
          <select
            value={value.status}
            onChange={(e) =>
              set("status", e.target.value as Status | typeof ALL)
            }
            className={cn(selectCls, "mt-2")}
          >
            <option value={ALL}>All statuses</option>
            {STATUSES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </label>

        <label className="block">
          <span className="meta-label text-muted">Setting</span>
          <select
            value={value.setting}
            onChange={(e) =>
              set("setting", e.target.value as Setting | typeof ALL)
            }
            className={cn(selectCls, "mt-2")}
          >
            <option value={ALL}>All settings</option>
            {SETTINGS.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="mt-5 pt-4 border-t border-line flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-5">
          <p className="text-sm text-muted" aria-live="polite">
            Showing <span className="text-ink">{resultCount}</span> of{" "}
            <span className="text-ink">{totalCount}</span>{" "}
            {totalCount === 1 ? "group" : "groups"}
          </p>
          <label className="inline-flex items-center gap-2.5 text-sm text-muted cursor-pointer">
            <input
              type="checkbox"
              checked={value.includeArchived}
              onChange={(e) => set("includeArchived", e.target.checked)}
              className="accent-accent"
            />
            Include archived
          </label>
        </div>

        {isFiltered(value) && (
          <button
            type="button"
            onClick={onReset}
            className="text-sm text-accent hover:text-navy-hi transition-colors"
          >
            Reset filters
          </button>
        )}
      </div>
    </div>
  );
}
