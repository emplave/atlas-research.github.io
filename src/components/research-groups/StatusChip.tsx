import type { Status } from "@/data/research-groups";
import { cn } from "@/lib/utils";

/**
 * Lifecycle status chip.
 *
 * Only "Recruiting" is emphasised, because it is the only status carrying an
 * action. The rest are muted: a status chip is information, not an accent.
 * Archived is muted too — a dissolved group is inactive, not an error, and
 * `alert` is reserved for failures.
 *
 * `onNavy` is required inside a navy card header, where the paper-toned
 * variants would be illegible.
 */
const STYLES: Record<Status, string> = {
  Recruiting: "border-navy/35 bg-navy/[0.06] text-navy",
  "In Progress": "border-line bg-paper text-ink",
  Full: "border-line bg-paper text-muted",
  Completed: "border-line bg-paper text-muted",
  Archived: "border-line bg-paper text-muted/70",
};

const ON_NAVY_STYLES: Record<Status, string> = {
  Recruiting: "border-white/60 bg-white/15 text-white",
  "In Progress": "border-white/35 text-white/90",
  Full: "border-white/25 text-white/75",
  Completed: "border-white/25 text-white/75",
  Archived: "border-white/20 text-white/60",
};

export function StatusChip({
  status,
  onNavy = false,
  className,
}: {
  status: Status;
  onNavy?: boolean;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center gap-1.5 rounded-full border px-2.5 py-1 meta-label",
        onNavy ? ON_NAVY_STYLES[status] : STYLES[status],
        className
      )}
    >
      {status === "Recruiting" && (
        <span
          aria-hidden
          className={cn(
            "h-1.5 w-1.5 rounded-full",
            onNavy ? "bg-white" : "bg-navy"
          )}
        />
      )}
      {status}
    </span>
  );
}
