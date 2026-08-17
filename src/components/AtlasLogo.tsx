import { cn } from "@/lib/utils";
import type { Mode } from "@/lib/theme";

/**
 * Brand lockup — cream chip with the display A, plus the stacked institution
 * name and tagline. Renders correctly in both modes.
 *
 * The tagline "Student Research Institute" is fixed brand copy. Do not reword it.
 */
export function AtlasLogo({
  className,
  mode = "dark",
}: {
  className?: string;
  mode?: Mode;
}) {
  const light = mode === "light";
  return (
    <span className={cn("inline-flex items-center gap-2.5 select-none", className)}>
      <span
        className="grid place-items-center h-8 w-8 rounded-control font-display font-medium text-lg leading-none bg-text text-ground"
        aria-hidden
      >
        A
      </span>
      <span className="flex flex-col leading-tight">
        <span
          className={cn(
            "font-display text-[15px] tracking-tight",
            light ? "text-ink" : "text-text"
          )}
        >
          Atlas Research Institute
        </span>
        <span
          className={cn(
            "meta-label text-[9px]",
            light ? "text-ink/55" : "text-muted"
          )}
        >
          Student Research Institute
        </span>
      </span>
    </span>
  );
}
