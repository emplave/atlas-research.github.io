import createGlobe, { COBEOptions } from "cobe";
import { useCallback, useEffect, useRef, useState } from "react";

import { cn } from "@/lib/utils";
import { APPLICANT_COUNTRIES, buildArcs, CohortCountry } from "@/lib/cohort";

/**
 * Atlas globe — adapted from the 21st.dev cobe component, extended with an
 * arc overlay: animated great-circle connections between applicant
 * countries, projection-synced to the sphere's rotation (arcs and their
 * endpoint dots are drawn from the same math, so they always cohere).
 */
export const ATLAS_MARKERS: COBEOptions["markers"] = APPLICANT_COUNTRIES.map(
  (c) => ({ location: [c.lat, c.lng] as [number, number], size: 0 })
);

export const GLOBE_DARK: COBEOptions = {
  width: 800,
  height: 800,
  onRender: () => {},
  devicePixelRatio: 2,
  phi: 0,
  theta: 0.28,
  dark: 1,
  diffuse: 1.2,
  mapSamples: 18000,
  mapBrightness: 2.4,
  baseColor: [0.16, 0.22, 0.33],
  markerColor: [0.79, 0.65, 0.31],
  glowColor: [0.1, 0.15, 0.24],
  markers: ATLAS_MARKERS,
};

/** Light editorial globe — cream sphere, dotted continents (reference image). */
export const GLOBE_LIGHT: COBEOptions = {
  width: 800,
  height: 800,
  onRender: () => {},
  devicePixelRatio: 2,
  phi: 0,
  theta: 0.22,
  dark: 0,
  diffuse: 0.4,
  mapSamples: 22000,
  mapBrightness: 1.2,
  baseColor: [1, 1, 1],
  markerColor: [0.86, 0.68, 0.29],
  glowColor: [0.98, 0.97, 0.94],
  markers: ATLAS_MARKERS,
};

const DEG = Math.PI / 180;

/**
 * lat/lng → cobe's marker model space (verified against cobe 0.6.5 source):
 * m = (cos·cos(lng−π)·−1, sin(lat), cos·sin(lng−π)) = (cos·cos, sin, −cos·sin)
 */
function toXYZ(lat: number, lng: number): [number, number, number] {
  const la = lat * DEG;
  const lo = lng * DEG;
  return [
    Math.cos(la) * Math.cos(lo),
    Math.sin(la),
    -Math.cos(la) * Math.sin(lo),
  ];
}

/** spherical linear interpolation between two unit vectors. */
function slerp(
  a: [number, number, number],
  b: [number, number, number],
  t: number
): [number, number, number] {
  const dot = Math.min(1, Math.max(-1, a[0] * b[0] + a[1] * b[1] + a[2] * b[2]));
  const th = Math.acos(dot);
  if (th < 1e-4) return a;
  const s = Math.sin(th);
  const w1 = Math.sin((1 - t) * th) / s;
  const w2 = Math.sin(t * th) / s;
  return [
    a[0] * w1 + b[0] * w2,
    a[1] * w1 + b[1] * w2,
    a[2] * w1 + b[2] * w2,
  ];
}

type Projected = { x: number; y: number; z: number };

/**
 * Model → screen, mirroring cobe's fragment shader exactly (cobe 0.6.5):
 * view ray l = M·m with M = J(theta, phi) from the shader (column-major
 * mat3(cφ, sφsθ, −sφcθ | 0, cθ, sθ | sφ, −cφsθ, cφcθ)), and the visible
 * sphere satisfies l = vec3(a, √(0.64−|a|²))/0.8 ⇒ screen a = 0.8·l.xy,
 * i.e. the sphere's pixel radius is exactly 0.4 × canvas width.
 */
function project(
  v: [number, number, number],
  phi: number,
  theta: number,
  cx: number,
  cy: number,
  w: number
): Projected {
  const cp = Math.cos(phi);
  const sp = Math.sin(phi);
  const ct = Math.cos(theta);
  const st = Math.sin(theta);
  const lx = cp * v[0] + sp * v[2];
  const ly = sp * st * v[0] + ct * v[1] - cp * st * v[2];
  const lz = -sp * ct * v[0] + st * v[1] + cp * ct * v[2];
  return { x: cx + lx * 0.4 * w, y: cy - ly * 0.4 * w, z: lz };
}

export function Globe({
  className,
  config = GLOBE_DARK,
  rotateSpeed = 0.0035,
  showArcs = false,
  arcColor = "201, 165, 78", // gold, rgb triplet
}: {
  className?: string;
  config?: COBEOptions;
  rotateSpeed?: number;
  showArcs?: boolean;
  arcColor?: string;
}) {
  const phiRef = useRef(0);
  const widthRef = useRef(0);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const overlayRef = useRef<HTMLCanvasElement>(null);
  const pointerInteracting = useRef<number | null>(null);
  const pointerInteractionMovement = useRef(0);
  const [r, setR] = useState(0);
  const prefersReducedMotion = useRef(false);
  const hasRenderedRef = useRef(false);
  const arcsRef = useRef(buildArcs(APPLICANT_COUNTRIES));

  const updatePointerInteraction = (value: number | null) => {
    pointerInteracting.current = value;
    if (canvasRef.current) {
      canvasRef.current.style.cursor = value !== null ? "grabbing" : "grab";
    }
  };

  const updateMovement = (clientX: number) => {
    if (pointerInteracting.current !== null) {
      const delta = clientX - pointerInteracting.current;
      pointerInteractionMovement.current = delta;
      setR(delta / 200);
    }
  };

  const drawOverlay = useCallback(
    (phi: number) => {
      const overlay = overlayRef.current;
      if (!overlay) return;
      const w = widthRef.current;
      if (!w) return;
      const dpr = 2;
      if (overlay.width !== w * dpr) {
        overlay.width = w * dpr;
        overlay.height = w * dpr;
      }
      const ctx = overlay.getContext("2d");
      if (!ctx) return;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, w, w);

      const theta = (config.theta as number) ?? 0.22;
      const cx = w / 2;
      const cy = w / 2;
      const R = w; // project() applies the exact 0.4× sphere scale itself
      const now = performance.now();

      // one holding dot per applicant country — big, unmissable
      for (const c of APPLICANT_COUNTRIES) {
        const p = project(toXYZ(c.lat, c.lng), phi, theta, cx, cy, R);
        if (p.z <= 0.02) continue;
        const a = Math.min(1, (p.z - 0.02) * 3);
        const breath = 1 + 0.12 * Math.sin(now / 700 + c.lng);
        // halo
        ctx.beginPath();
        ctx.arc(p.x, p.y, 11 * breath, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${arcColor}, ${0.14 * a})`;
        ctx.fill();
        // ring
        ctx.beginPath();
        ctx.arc(p.x, p.y, 6.5 * breath, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(${arcColor}, ${0.5 * a})`;
        ctx.lineWidth = 1;
        ctx.stroke();
        // core
        ctx.beginPath();
        ctx.arc(p.x, p.y, 4.2, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${arcColor}, ${0.95 * a})`;
        ctx.fill();
      }

      // arcs with traveling pulses
      arcsRef.current.forEach(([A, B], idx) => {
        const va = toXYZ(A.lat, A.lng);
        const vb = toXYZ(B.lat, B.lng);
        const SEG = 28;
        let started = false;
        ctx.beginPath();
        for (let s = 0; s <= SEG; s++) {
          const t = s / SEG;
          const v = slerp(va, vb, t);
          const lift = 1 + 0.14 * Math.sin(Math.PI * t); // altitude bulge
          const p = project(v, phi, theta, cx, cy, R * lift);
          if (p.z <= 0.0) {
            started = false;
            continue;
          }
          if (!started) {
            ctx.moveTo(p.x, p.y);
            started = true;
          } else {
            ctx.lineTo(p.x, p.y);
          }
        }
        ctx.strokeStyle = `rgba(${arcColor}, 0.38)`;
        ctx.lineWidth = 1.4;
        ctx.stroke();

        // traveling light
        if (!prefersReducedMotion.current) {
          const tp = (now / 2400 + idx * 0.29) % 1;
          const v = slerp(va, vb, tp);
          const lift = 1 + 0.14 * Math.sin(Math.PI * tp);
          const p = project(v, phi, theta, cx, cy, R * lift);
          if (p.z > 0.02) {
            const a = Math.min(1, (p.z - 0.02) * 3);
            ctx.beginPath();
            ctx.arc(p.x, p.y, 2.4, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(${arcColor}, ${0.95 * a})`;
            ctx.fill();
          }
        }
      });
    },
    [arcColor, config.theta]
  );

  const onRender = useCallback(
    (state: Record<string, unknown>) => {
      if (!hasRenderedRef.current && canvasRef.current) {
        hasRenderedRef.current = true;
        canvasRef.current.style.opacity = "1";
        if (overlayRef.current) overlayRef.current.style.opacity = "1";
      }
      if (!pointerInteracting.current && !prefersReducedMotion.current) {
        phiRef.current += rotateSpeed;
      }
      state.phi = phiRef.current + r;
      state.width = widthRef.current * 2;
      state.height = widthRef.current * 2;
      if (showArcs) drawOverlay(phiRef.current + r);
    },
    [r, rotateSpeed, showArcs, drawOverlay]
  );

  useEffect(() => {
    prefersReducedMotion.current = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    const onResize = () => {
      if (canvasRef.current) {
        widthRef.current = canvasRef.current.offsetWidth;
      }
    };
    window.addEventListener("resize", onResize);
    onResize();

    const globe = createGlobe(canvasRef.current!, {
      ...config,
      width: widthRef.current * 2,
      height: widthRef.current * 2,
      onRender,
    });

    return () => {
      window.removeEventListener("resize", onResize);
      globe.destroy();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className={cn("relative aspect-square w-full", className)}>
      <canvas
        className={cn(
          "size-full opacity-0 transition-opacity duration-700 [contain:layout_paint_size]"
        )}
        ref={canvasRef}
        aria-label="Rotating globe showing countries where Atlas is active, connected by animated arcs"
        onPointerDown={(e) =>
          updatePointerInteraction(
            e.clientX - pointerInteractionMovement.current
          )
        }
        onPointerUp={() => updatePointerInteraction(null)}
        onPointerOut={() => updatePointerInteraction(null)}
        onMouseMove={(e) => updateMovement(e.clientX)}
        onTouchMove={(e) =>
          e.touches[0] && updateMovement(e.touches[0].clientX)
        }
      />
      {showArcs && (
        <canvas
          ref={overlayRef}
          aria-hidden
          className="pointer-events-none absolute inset-0 size-full opacity-0 transition-opacity duration-700"
        />
      )}
    </div>
  );
}
