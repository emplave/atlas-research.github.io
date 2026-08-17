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

/** Light reading equivalents, for briefs and articles on paper. */
const LIGHT_STYLES: Record<Status, string> = {
  Recruiting: "border-brass/50 text-brass",
  "In Progress": "border-ink/20 text-ink",
  Full: "border-ink/20 text-ink/60",
  Completed: "border-ink/20 text-ink/60",
  Archived: "border-ink/15 text-ink/45",
};

export function StatusChip({
  status,
  mode = "dark",
  className,
}: {
  status: Status;
  mode?: "dark" | "light";
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 meta-label",
        mode === "light" ? LIGHT_STYLES[status] : STYLES[status],
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
