import { cn } from "@/lib/utils";

/**
 * Brand lockup — navy chip with the display A, plus the stacked institution
 * name and tagline.
 *
 * The tagline "Student Research Institute" is fixed brand copy. Do not reword.
 *
 * `onNavy` inverts the lockup for use inside a navy full-bleed band.
 */
export function AtlasLogo({
  className,
  onNavy = false,
}: {
  className?: string;
  onNavy?: boolean;
}) {
  return (
    <span
      className={cn("inline-flex items-center gap-2.5 select-none", className)}
    >
      <span
        aria-hidden
        className={cn(
          "grid place-items-center h-8 w-8 rounded-control font-display font-medium text-lg leading-none",
          onNavy ? "bg-white text-navy" : "bg-navy text-white"
        )}
      >
        A
      </span>
      <span className="flex flex-col leading-tight">
        <span
          className={cn(
            "font-display text-[15px] tracking-tight",
            onNavy ? "text-white" : "text-navy"
          )}
        >
          Atlas Research Institute
        </span>
        <span
          className={cn(
            "meta-label text-[9px]",
            onNavy ? "text-white/60" : "text-muted"
          )}
        >
          Student Research Institute
        </span>
      </span>
    </span>
  );
}
