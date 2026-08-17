import { cn } from "@/lib/utils";

/**
 * Homepage section shell.
 *
 * Owns the three structural devices so every section cannot drift:
 *   - a small navy section number in the left margin of the heading
 *   - a full-width hairline rule between sections
 *   - alternating paper / surface backgrounds
 *
 * Vertical rhythm is tightened roughly 25% from the previous pass: what was
 * py-16/py-20 is now py-12/py-16.
 *
 * The number is decorative and hidden from assistive tech — it adds nothing to
 * a screen reader that the heading does not already say.
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
  /** "01" … "06". Rendered in the heading's left margin. */
  number?: string;
  title?: string;
  /** Optional right-aligned link beside the heading. */
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
        {(title || action) && (
          <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-3">
            <div className="flex items-baseline gap-4">
              {number && (
                <span aria-hidden className="meta-label text-navy/45 pt-1">
                  {number}
                </span>
              )}
              {title && (
                <h2 className="type-section font-display">{title}</h2>
              )}
            </div>
            {action}
          </div>
        )}
        {children}
      </div>
    </section>
  );
}
