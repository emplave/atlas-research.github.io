import { useEffect, useRef, useState } from "react";
import createGlobe from "cobe";
import { REACH_COUNT, reachMarkers } from "@/data/reach";

/**
 * The reach globe. Renders ONLY from src/data/reach.ts — every marker is a
 * country with a real fellow in it.
 *
 * Tuned to the light palette: paper-toned sphere, navy dots, a hairline rim
 * rather than a glow.
 *
 * Rotation is driven by our own rAF loop calling the documented `update()`
 * API, rather than cobe's `onRender` callback, which this version does not
 * expose in its types.
 *
 * Under prefers-reduced-motion the globe still draws — frozen at an opening
 * angle that shows the widest spread of markers. A static render is the
 * accessible outcome, not a blank space.
 */
export function ReachGlobe({ className }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [reduceMotion, setReduceMotion] = useState(false);

  // Track the preference live, so toggling it does not require a reload.
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduceMotion(mq.matches);
    const onChange = (e: MediaQueryListEvent) => setReduceMotion(e.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const sizeOf = () => Math.max(canvas.offsetWidth, 1);
    let size = sizeOf();
    // Opening angle: Africa, Europe and South Asia in view, where most
    // markers sit. Also the frozen angle under reduced motion.
    let phi = 4.2;
    let raf = 0;

    const globe = createGlobe(canvas, {
      devicePixelRatio: Math.min(window.devicePixelRatio || 1, 2),
      width: size * 2,
      height: size * 2,
      phi,
      theta: 0.22,
      dark: 0,
      diffuse: 0.85,
      mapSamples: 17000,
      mapBrightness: 1.45,
      baseColor: [0.965, 0.961, 0.953], // paper  #FAFAF9
      markerColor: [0.11, 0.247, 0.369], // navy   #1C3F5E
      glowColor: [0.886, 0.878, 0.855], // line   #E2E0DA
      markers: reachMarkers().map((location) => ({ location, size: 0.045 })),
    });

    const onResize = () => {
      size = sizeOf();
      globe.update({ width: size * 2, height: size * 2 });
    };
    window.addEventListener("resize", onResize);

    if (reduceMotion) {
      // Draw once at the opening angle and stop. No loop, no rAF churn.
      globe.update({ phi });
    } else {
      const tick = () => {
        phi += 0.0022; // slow, continuous
        globe.update({ phi });
        raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);
    }

    // Reveal only once the first frame exists, to avoid a blank-canvas flash.
    const reveal = window.setTimeout(() => {
      canvas.style.opacity = "1";
    }, 90);

    return () => {
      if (raf) cancelAnimationFrame(raf);
      window.clearTimeout(reveal);
      window.removeEventListener("resize", onResize);
      globe.destroy();
    };
  }, [reduceMotion]);

  return (
    <div className={className}>
      <div className="relative mx-auto w-full max-w-[480px] aspect-square">
        <canvas
          ref={canvasRef}
          className="h-full w-full opacity-0 transition-opacity duration-700"
          style={{ contain: "layout paint size" }}
          role="img"
          aria-label={`Globe showing fellows in ${REACH_COUNT} countries`}
        />
      </div>
      <p className="mt-3 text-center meta-label text-muted">
        Fellows in {REACH_COUNT} countries
      </p>
    </div>
  );
}
