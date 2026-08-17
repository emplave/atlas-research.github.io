import type { Status } from "@/data/research-groups";
import { cn } from "@/lib/utils";

/**
 * Lifecycle status chip.
 *
 * Only "Recruiting" is emphasised, because it is the only status carrying an
 * action. The rest are muted: a status chip is information, not an accent.
 * Archived is muted too — a dissolved group is inactive, not an error, and
 * `alert` is reserved for failures.
 */
const STYLES: Record<Status, string> = {
  Recruiting: "border-navy/35 bg-navy/[0.06] text-navy",
  "In Progress": "border-line bg-paper text-ink",
  Full: "border-line bg-paper text-muted",
  Completed: "border-line bg-paper text-muted",
  Archived: "border-line bg-paper text-muted",
};

export function StatusChip({
  status,
  className,
}: {
  status: Status;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center gap-1.5 rounded-full border px-2.5 py-1 meta-label",
        STYLES[status],
        className
      )}
    >
      {status === "Recruiting" && (
        <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-navy" />
      )}
      {status}
    </span>
  );
}
