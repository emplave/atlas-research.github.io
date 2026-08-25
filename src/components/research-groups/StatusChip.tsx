import type { Status } from "@/data/research-groups";
import { cn } from "@/lib/utils";

/**
 * Lifecycle status chip.
 *
 * NOTHING IS EMPHASISED ANY MORE. "Recruiting" used to be, on the reasoning that
 * it was the only status carrying an action — but the apply action is now gated
 * on the RecruitingOpen column, not on status, so an emphasised "Recruiting"
 * chip could sit on a card with no button and read as a broken promise. Every
 * status is now information at the same weight.
 *
 * "Pending" and "Forming" are the pre-active states, and the ones the six real
 * groups actually use. They are styled faintest of all: a group that has not
 * started must not look like one that is running.
 *
 * `onInk` is required inside an ink card header, where the paper-toned
 * variants would be illegible.
 */
const STYLES: Record<Status, string> = {
  Pending: "border-line bg-paper text-faint",
  Forming: "border-line bg-paper text-faint",
  Recruiting: "border-line bg-paper text-muted",
  "In Progress": "border-line bg-paper text-muted",
  Full: "border-line bg-paper text-faint",
  Completed: "border-line bg-paper text-faint",
  Archived: "border-line bg-paper text-faint",
};

const ON_INK_STYLES: Record<Status, string> = {
  Pending: "border-paper/25 text-paper/75",
  Forming: "border-paper/25 text-paper/75",
  Recruiting: "border-paper/35 text-paper/90",
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
      {status}
    </span>
  );
}
