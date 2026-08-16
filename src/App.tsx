import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Nav } from "./components/Nav";
import { Footer } from "./components/Footer";
import { Landing } from "./pages/Landing";
import { Fellowship } from "./pages/Fellowship";
import { Partners } from "./pages/Partners";
import { Chapters } from "./pages/Chapters";
import { Publish } from "./pages/Publish";
import { modeClass, modeForPath } from "./lib/theme";

/** Scroll to top on route change; honor #hash targets within a page. */
function ScrollManager() {
  const { pathname, hash } = useLocation();
  useEffect(() => {
    if (hash) {
      const el = document.querySelector(hash);
      if (el) {
        el.scrollIntoView({ behavior: "smooth" });
        return;
      }
    }
    window.scrollTo({ top: 0 });
  }, [pathname, hash]);
  return null;
}

/**
 * Applies the route's display mode to <html>.
 *
 * The mode lives on the document element, not on a wrapper div, so the
 * background extends past the app's own height — no light strip under a short
 * dark page. The two modes never overlap: exactly one class is on at a time.
 */
function ModeManager() {
  const { pathname } = useLocation();
  const mode = modeForPath(pathname);
  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove("mode-dark", "mode-light");
    root.classList.add(modeClass(mode));
  }, [mode]);
  return null;
}

export default function App() {
  return (
    <BrowserRouter>
      <ScrollManager />
      <ModeManager />
      <div className="min-h-screen flex flex-col">
        <Nav />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/chapters" element={<Chapters />} />
            <Route path="/fellowship" element={<Fellowship />} />
            <Route path="/apply" element={<Fellowship />} />
            <Route path="/journal" element={<Publish />} />
            <Route path="/partners" element={<Partners />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  );
}

/** 404 — dark chrome, same as the rest of the shell. */
function NotFound() {
  return (
    <div className="mx-auto max-w-2xl px-6 py-32 text-center">
      <p className="meta-label text-muted">404</p>
      <h1 className="mt-5 font-display text-4xl md:text-5xl text-text">
        That page isn't here.
      </h1>
      <p className="mt-5 text-muted leading-relaxed">
        The link may be out of date. The Chapters directory and the Fellowship
        are both reachable from the navigation above.
      </p>
      <a
        href="/"
        className="mt-8 inline-flex items-center gap-2 rounded-control bg-brass text-ground pl-5 pr-4 py-2.5 text-sm hover:bg-brass-hi transition-colors"
      >
        Back to the homepage
        <span aria-hidden>→</span>
      </a>
    </div>
  );
}
