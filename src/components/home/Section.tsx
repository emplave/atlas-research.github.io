import { cn } from "@/lib/utils";

/**
 * Homepage section shell.
 *
 * Owns the structural devices so no section can drift:
 *   - a small faint section number in the left margin of the heading
 *   - the MARGINAL SPINE: a hairline down the left margin connecting the
 *     numerals of consecutive sections into one continuous vertical rule
 *   - a full-width hairline rule between sections
 *   - alternating paper / surface backgrounds
 *
 * The spine is desktop only (lg and up). Below that the numeral sits inline
 * with the heading and a vertical rule would have nothing to run alongside.
 * It is drawn on an inner column rather than on the section element, so it
 * aligns with the content gutter instead of the viewport edge.
 */
export function Section({
  number,
  title,
  action,
  tone = "paper",
  children,
  className,
  id,
}: {
  /** "01" … "06". Rendered in the heading's left margin, beside the spine. */
  number?: string;
  title?: string;
  action?: React.ReactNode;
  tone?: "paper" | "surface";
  children: React.ReactNode;
  className?: string;
  id?: string;
}) {
  return (
    <section
      id={id}
      className={cn(
        "border-b border-line",
        tone === "surface" ? "bg-surface" : "bg-paper",
        className
      )}
    >
      <div className="mx-auto max-w-6xl px-6 py-12 md:py-16">
        {/*
          The spine runs the full height of this inner column, so consecutive
          numbered sections stack into one unbroken rule. Content is inset past
          it at lg.
        */}
        <div className={cn("relative", number && "lg:pl-12 lg:spine")}>
          {number && (
            <span
              aria-hidden
              className="meta-label mb-2 block lg:absolute lg:left-0 lg:top-1 lg:mb-0"
            >
              {number}
            </span>
          )}

          {(title || action) && (
            <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-3">
              {title && <h2 className="type-section font-display">{title}</h2>}
              {action}
            </div>
          )}
          {children}
        </div>
      </div>
    </section>
  );
}
