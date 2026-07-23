import { cn } from "@/lib/utils";

/**
 * Top-left brand lockup (NSRI-informed institutional presence):
 * navy chip with the serif A + stacked institution name.
 */
export function AtlasLogo({
  className,
  inverse = false,
}: {
  className?: string;
  inverse?: boolean;
}) {
  return (
    <span className={cn("inline-flex items-center gap-2.5 select-none", className)}>
      <span
        className={cn(
          "grid place-items-center h-8 w-8 rounded-lg font-serif text-lg leading-none",
          inverse
            ? "bg-cream-200 text-navy-900"
            : "bg-navy-800 text-cream-100"
        )}
        aria-hidden
      >
        A
      </span>
      <span className="flex flex-col leading-tight">
        <span
          className={cn(
            "font-serif text-[15px] tracking-tight",
            inverse ? "text-cream-100" : "text-navy-900"
          )}
        >
          Atlas Research Institute
        </span>
        <span
          className={cn(
            "font-mono text-[9px] tracking-caps uppercase",
            inverse ? "text-cream-300/60" : "text-navy-500"
          )}
        >
          Global research access
        </span>
      </span>
    </span>
  );
}
