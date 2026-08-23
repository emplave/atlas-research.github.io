import { findOpening, isFormPending } from "@/data/openings";
import { cn } from "@/lib/utils";

/**
 * THE ONE PRIMARY CTA ON THE SITE.
 *
 * Every path a student can take into Atlas goes through this button. It is a
 * component rather than four copies of an anchor because the copy, the link and
 * the not-yet-open state all have to stay identical — and they did not, when
 * this was duplicated across the hero, the closing band and two blocks on the
 * research groups page.
 *
 * "LEAD AN ATLAS RESEARCH GROUP". Two earlier versions were wrong in different
 * ways. "Start a research group" implied building something from nothing, which
 * is the thing a student reading this is afraid of. "Bring Atlas to your school"
 * fixed that but presupposed a school — and a group can be based at a school, in
 * a community, or run entirely online, so it excluded two of the three settings
 * and contradicted the page's own "no school approval required" line. "Lead"
 * carries the ownership without naming a venue.
 *
 * There is deliberately NO SECONDARY CTA anywhere beside this. Joining an
 * existing group is not currently a path — there is no group listing to browse —
 * so a "browse groups" button next to this one sent readers to a page that could
 * not act on their intent.
 *
 * The link is always read from the Principal Researcher opening, never
 * hardcoded, so closing the form closes every entry point at once. When the form
 * has no URL this renders a disabled control rather than a dead link.
 */
export function BringAtlasCta({
  tone = "ink",
  size = "lg",
  className,
}: {
  /** "ink" = dark button on a light ground. "paper" = light button on ink. */
  tone?: "ink" | "paper";
  size?: "md" | "lg";
  className?: string;
}) {
  const opening = findOpening("chapter-leader");
  const pending = !opening || isFormPending(opening);

  const dims =
    size === "lg" ? "px-6 py-3 text-[15px]" : "px-5 py-2.5 text-sm";

  if (pending) {
    return (
      <span
        aria-disabled="true"
        className={cn(
          "inline-flex justify-center rounded-control border cursor-not-allowed text-center",
          dims,
          tone === "paper"
            ? "border-paper/30 text-paper/70"
            : "border-line bg-surface text-muted",
          className
        )}
      >
        Applications opening soon
      </span>
    );
  }

  return (
    <a
      href={opening.formUrl as string}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        "inline-flex justify-center rounded-control transition-colors text-center",
        dims,
        tone === "paper"
          ? "bg-paper text-ink hover:bg-paper/90"
          : "bg-ink text-paper hover:bg-ink-hover",
        className
      )}
    >
      Lead an Atlas research group
    </a>
  );
}

/**
 * The cost line. Free is the strongest fact Atlas has, so it is stated as a
 * fact and not softened.
 *
 * Comparable programmes in this category run $3,900–$6,650. The site does not
 * name them or quote those figures — an unsourced competitor price is a claim
 * this page cannot support — but that gap is the reason this line sits directly
 * under the hero subhead instead of in a FAQ.
 */
export function CostLine({ className }: { className?: string }) {
  return (
    <p className={cn("type-body", className)}>
      <span className="text-ink font-medium">Free.</span>{" "}
      <span className="text-muted">
        No application fee, no tuition, no cost to anyone.
      </span>
    </p>
  );
}
