import type { Status } from "@/data/research-groups";
import { cn } from "@/lib/utils";

/**
 * Lifecycle status chip.
 *
 * Only "Recruiting" is emphasised, because it is the only status carrying an
 * action. The rest are faint: a status chip is information, not emphasis.
 * Archived is muted too — a dissolved group is inactive, not an error, and
 * `alert` is reserved for failures.
 *
 * `onInk` is required inside an ink card header, where the paper-toned
 * variants would be illegible.
 */
const STYLES: Record<Status, string> = {
  Recruiting: "border-ink/40 bg-ink/[0.05] text-ink",
  "In Progress": "border-line bg-paper text-muted",
  Full: "border-line bg-paper text-faint",
  Completed: "border-line bg-paper text-faint",
  Archived: "border-line bg-paper text-faint",
};

const ON_INK_STYLES: Record<Status, string> = {
  Recruiting: "border-paper/60 bg-paper/15 text-paper",
  "In Progress": "border-paper/35 text-paper/90",
  Full: "border-paper/25 text-paper/75",
  Completed: "border-paper/25 text-paper/75",
  Archived: "border-paper/20 text-faint",
};

export function StatusChip({
  status,
  onInk = false,
  className,
}: {
  status: Status;
  onInk?: boolean;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center gap-1.5 rounded-full border px-2.5 py-1 meta-label",
        onInk ? ON_INK_STYLES[status] : STYLES[status],
        className
      )}
    >
      {status === "Recruiting" && (
        <span
          aria-hidden
          className={cn(
            "h-1.5 w-1.5 rounded-full",
            onInk ? "bg-paper" : "bg-ink"
          )}
        />
      )}
      {status}
    </span>
  );
}
