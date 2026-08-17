import type { Status } from "@/data/chapters";
import { cn } from "@/lib/utils";

/**
 * Lifecycle status chip for a research group.
 *
 * Small status chip — one of the few places rounded-full is permitted.
 *
 * Only "Recruiting" gets brass, because it is the only status that carries an
 * action. Everything else is muted: a status chip is information, not an
 * accent. "Archived" is muted too, not alert — a dissolved group is inactive,
 * not an error, and the alert token is reserved for failures.
 */
const STYLES: Record<Status, string> = {
  Recruiting: "border-brass/45 text-brass",
  "In Progress": "border-line text-text",
  Full: "border-line text-muted",
  Completed: "border-line text-muted",
  Archived: "border-line/60 text-muted/70",
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
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 meta-label",
        STYLES[status],
        className
      )}
    >
      {status === "Recruiting" && (
        <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-brass" />
      )}
      {status}
    </span>
  );
}
