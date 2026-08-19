import { cn } from "@/lib/utils";

/**
 * The Atlas mark — two interlocking angular blocks forming an A.
 *
 * The large block is the main diagonal stroke, running top-left to
 * bottom-right and widening as it falls. The small block is the lower-left
 * leg. The gap between them is the counter of the A.
 *
 * Geometry is fixed. Do not nudge these paths: the counter is what makes the
 * pair read as a letter rather than two shapes, and it is already tight at
 * small sizes.
 *
 * Legibility floor: 16px. At that size the leg is ~6px wide and the counter
 * ~4px, which still resolves. Below 16px use the mark alone at a larger size
 * rather than shrinking it further.
 */
const LARGE = "M30 8 L104 8 L154 146 L80 146 Z";
const SMALL = "M44 100 L74 100 L74 146 L10 146 Z";

/** Grey used for the leg on an ink ground — the `faint` token value. */
const FAINT = "#8A8A92";

export type MarkTone = "light" | "ink";

export function AtlasMark({
  size = 32,
  tone = "light",
  className,
  title,
}: {
  /** Rendered height in px. The mark is slightly taller than it is wide. */
  size?: number;
  /** Ground the mark sits on. */
  tone?: MarkTone;
  className?: string;
  /** Set only when the mark stands alone as the accessible name. */
  title?: string;
}) {
  const large = tone === "ink" ? "#FFFFFF" : "#0E0E10";
  const small = FAINT;

  return (
    <svg
      viewBox="0 0 170 160"
      height={size}
      width={(size * 170) / 160}
      className={cn("shrink-0", className)}
      role={title ? "img" : undefined}
      aria-label={title}
      aria-hidden={title ? undefined : true}
      focusable="false"
    >
      <path d={LARGE} fill={large} />
      <path d={SMALL} fill={small} />
    </svg>
  );
}

/**
 * The lockup: the mark plus "Atlas Research Institute" in Instrument Serif.
 *
 * NOTHING SITS BENEATH THE WORDMARK. A descriptor line here repeated "Research
 * Institute" twice in the same lockup. Do not reintroduce one.
 *
 * BALANCE, measured rather than eyeballed. The mark is a solid filled wedge and
 * the wordmark is a light serif, so at equal height the mark always wins. What
 * matters is the mark's INK height against the wordmark's CAP height:
 *
 *   Instrument Serif capHeight = 0.720 em (from OS/2)
 *   the mark's ink spans y8–146 of a 160 viewBox = 0.863 of rendered height
 *
 *   mark 32 / word 17  →  ink 27.6px vs cap 12.2px  =  2.25×   (was: competing)
 *   mark 24 / word 20  →  ink 20.7px vs cap 14.4px  =  1.44×   (now: one unit)
 *
 * The mark came down and the wordmark went up, because doing only one of the
 * two left the pair either weightless or too wide for the nav — the wordmark at
 * 21px costs 31px of nav width, at 20px only 24px, and the bar also carries five
 * links and a CTA.
 *
 * Slight negative tracking on the wordmark for the same reason the headings have
 * it: this face sets loose, and a lockup should read as one dense mark.
 */
export function AtlasLockup({
  size = 24,
  tone = "light",
  variant = "horizontal",
  className,
}: {
  size?: number;
  tone?: MarkTone;
  variant?: "horizontal" | "stacked";
  className?: string;
}) {
  const onInk = tone === "ink";
  const stacked = variant === "stacked";

  return (
    <span
      className={cn(
        "inline-flex select-none",
        stacked
          ? "flex-col items-start gap-2.5"
          : "flex-row items-center gap-2.5",
        className
      )}
    >
      <AtlasMark size={size} tone={tone} />
      <span
        className={cn(
          "font-display text-[20px] leading-none tracking-[-0.015em]",
          onInk ? "text-paper" : "text-ink"
        )}
      >
        Atlas Research Institute
      </span>
    </span>
  );
}
