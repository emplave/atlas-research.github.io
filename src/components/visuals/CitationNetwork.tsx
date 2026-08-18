import { useEffect, useRef, useState } from "react";

/**
 * Citation network — nodes and hairline edges drifting like a citation graph.
 *
 * Hand-authored geometry, no library. 26 nodes in ink and faint, 0.5px edges.
 * Drift is capped well under 0.15px per frame, so the movement is felt rather
 * than seen; it reads as a slowly settling diagram, not an animation.
 *
 * Fully static under prefers-reduced-motion: the rAF loop never starts and the
 * layout renders at its seeded positions.
 *
 * Positions are seeded from a fixed PRNG rather than Math.random, so the graph
 * is identical on every load. A layout that reshuffles per visit reads as
 * decoration; one that is stable reads as a diagram of something.
 */
type Node = { x: number; y: number; r: number; dx: number; dy: number; big: boolean };

const W = 640;
const H = 300;
const COUNT = 26;
/** Edges connect nodes closer than this, in viewBox units. */
const LINK_DIST = 112;

/** Deterministic PRNG (mulberry32) so the graph never reshuffles. */
function seeded(seed: number) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function seedNodes(): Node[] {
  const rand = seeded(20260817);
  return Array.from({ length: COUNT }, (_, i) => ({
    x: 24 + rand() * (W - 48),
    y: 22 + rand() * (H - 44),
    r: rand() < 0.28 ? 3.6 : 2.1,
    // Max component ~0.055px/frame, comfortably under the 0.15 ceiling.
    dx: (rand() - 0.5) * 0.11,
    dy: (rand() - 0.5) * 0.11,
    big: i % 4 === 0,
  }));
}

export function CitationNetwork({ className }: { className?: string }) {
  const [nodes, setNodes] = useState<Node[]>(seedNodes);
  const [reduceMotion, setReduceMotion] = useState(false);
  const raf = useRef(0);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduceMotion(mq.matches);
    const onChange = (e: MediaQueryListEvent) => setReduceMotion(e.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  useEffect(() => {
    if (reduceMotion) return; // static: no loop at all

    let last = 0;
    const tick = (t: number) => {
      // Throttle to ~20fps. The drift is slow enough that more frames buy
      // nothing and cost battery.
      if (t - last > 50) {
        last = t;
        setNodes((prev) =>
          prev.map((n) => {
            let { x, y, dx, dy } = n;
            x += dx;
            y += dy;
            // Reflect at the edges so the graph never drifts out of frame.
            if (x < 16 || x > W - 16) dx = -dx;
            if (y < 14 || y > H - 14) dy = -dy;
            return { ...n, x, y, dx, dy };
          })
        );
      }
      raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf.current);
  }, [reduceMotion]);

  const edges: [Node, Node][] = [];
  for (let i = 0; i < nodes.length; i++) {
    for (let j = i + 1; j < nodes.length; j++) {
      const a = nodes[i];
      const b = nodes[j];
      if (Math.hypot(a.x - b.x, a.y - b.y) < LINK_DIST) edges.push([a, b]);
    }
  }

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      className={className}
      aria-hidden="true"
      focusable="false"
      preserveAspectRatio="xMidYMid slice"
    >
      <g stroke="#8A8A92" strokeWidth={0.5} opacity={0.55}>
        {edges.map(([a, b], i) => (
          <line key={i} x1={a.x} y1={a.y} x2={b.x} y2={b.y} />
        ))}
      </g>
      {nodes.map((n, i) => (
        <circle
          key={i}
          cx={n.x}
          cy={n.y}
          r={n.r}
          fill={n.big ? "#0E0E10" : "#8A8A92"}
        />
      ))}
    </svg>
  );
}
