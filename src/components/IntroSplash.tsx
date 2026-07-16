import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

/**
 * Intro: the institution's name rises in, holds ~3s, then reverses back out
 * the same way and fades to reveal the site.
 *
 * Robustness: the whole sequence is guarded by a ref and the timers are NOT
 * cleared on cleanup — otherwise React StrictMode's dev mount→unmount→remount
 * cancels the sequence and leaves the fixed overlay stuck (the freeze bug).
 * The overlay is fully unmounted at the end, so it can never block the page.
 */
const WORDS = ["Atlas", "Research", "Institute"];
type Phase = "hidden" | "in" | "out";

/** Decided synchronously so the overlay paints on frame 0 (no site flash). */
function shouldPlay(reduce: boolean): boolean {
  if (reduce) return false;
  if (typeof window === "undefined") return false;
  try {
    return !sessionStorage.getItem("atlas-intro-seen");
  } catch {
    return true;
  }
}

export function IntroSplash() {
  const reduce = useReducedMotion();
  // lazy initializer → first render already shows the splash if it should play
  const [phase, setPhase] = useState<Phase>(() =>
    shouldPlay(!!reduce) ? "in" : "hidden"
  );
  const started = useRef(false);

  useEffect(() => {
    if (started.current) return;
    if (phase !== "in") return;
    started.current = true;
    try {
      sessionStorage.setItem("atlas-intro-seen", "1");
    } catch {
      /* private mode — play once, don't persist */
    }
    window.setTimeout(() => setPhase("out"), 3000); // hold ~3s, then reverse
    window.setTimeout(() => setPhase("hidden"), 4300); // reverse + fade, then remove
    // intentionally no cleanup: see note above.
  }, [phase]);

  const out = phase === "out";

  return (
    <AnimatePresence>
      {phase !== "hidden" && (
        <motion.div
          className="fixed inset-0 z-[100] bg-navy-950 flex flex-col items-center justify-center"
          initial={{ opacity: 1 }}
          animate={{ opacity: out ? 0 : 1 }}
          transition={{ duration: 0.8, delay: out ? 0.6 : 0, ease: "easeInOut" }}
          style={{ pointerEvents: out ? "none" : "auto" }}
          aria-hidden
        >
          <motion.span
            className="font-serif text-cream-100 text-5xl md:text-6xl"
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: out ? 0 : 1, scale: out ? 0.85 : 1 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            A
          </motion.span>
          <motion.span
            className="mt-3 h-px w-16 bg-gold-400 origin-center"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: out ? 0 : 1 }}
            transition={{
              duration: out ? 0.5 : 0.7,
              delay: out ? 0 : 0.35,
              ease: [0.22, 1, 0.36, 1],
            }}
          />
          <div className="mt-5 flex gap-3 overflow-hidden">
            {WORDS.map((w, i) => (
              <span key={w} className="inline-block overflow-hidden">
                <motion.span
                  className="inline-block font-serif text-cream-200 text-2xl md:text-4xl"
                  initial={{ y: "110%" }}
                  animate={{ y: out ? "110%" : 0 }}
                  transition={{
                    duration: out ? 0.5 : 0.75,
                    // reverse mirrors the entrance stagger
                    delay: out
                      ? (WORDS.length - 1 - i) * 0.08
                      : 0.5 + i * 0.14,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                >
                  {w}
                </motion.span>
              </span>
            ))}
          </div>
          <motion.p
            className="mt-6 meta-label text-cream-300/50"
            initial={{ opacity: 0 }}
            animate={{ opacity: out ? 0 : 1 }}
            transition={{ delay: out ? 0 : 1.3, duration: out ? 0.35 : 0.5 }}
          >
            Global research access · Founded for students
          </motion.p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
