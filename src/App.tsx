import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useLocation,
  useParams,
} from "react-router-dom";
import { useEffect } from "react";
import { Nav } from "./components/Nav";
import { Footer } from "./components/Footer";
import { Landing } from "./pages/Landing";
import { Fellowship } from "./pages/Fellowship";
import { Partners } from "./pages/Partners";
import { ResearchGroups } from "./pages/ResearchGroups";
import { ResearchGroupBrief } from "./pages/ResearchGroupBrief";
import { Journal } from "./pages/Journal";
import { JournalArticle } from "./pages/JournalArticle";
import { Events } from "./pages/Events";

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
 * Legacy /chapters/:slug → /research-groups/:slug.
 *
 * Chapters were renamed to research groups. Old links must keep working
 * rather than dropping readers on a 404.
 */
function LegacyChapterRedirect() {
  const { slug } = useParams<{ slug: string }>();
  return <Navigate to={`/research-groups/${slug ?? ""}`} replace />;
}

export default function App() {
  return (
    <BrowserRouter>
      <ScrollManager />
      <div className="min-h-screen flex flex-col">
        <Nav />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<Landing />} />

            <Route path="/research-groups" element={<ResearchGroups />} />
            <Route
              path="/research-groups/:slug"
              element={<ResearchGroupBrief />}
            />

            <Route path="/events" element={<Events />} />
            <Route path="/journal" element={<Journal />} />
            <Route path="/journal/:slug" element={<JournalArticle />} />
            <Route path="/fellowship" element={<Fellowship />} />
            <Route path="/partners" element={<Partners />} />

            {/* Legacy paths — kept so existing links do not break. */}
            <Route
              path="/chapters"
              element={<Navigate to="/research-groups" replace />}
            />
            <Route path="/chapters/:slug" element={<LegacyChapterRedirect />} />
            <Route
              path="/apply"
              element={<Navigate to="/fellowship" replace />}
            />

            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  );
}

/** 404. */
function NotFound() {
  return (
    <div className="mx-auto max-w-2xl px-6 py-32 text-center">
      <p className="meta-label text-muted">404</p>
      <h1 className="mt-5 font-display text-4xl md:text-5xl">
        That page isn't here.
      </h1>
      <p className="mt-5 text-muted leading-relaxed">
        The link may be out of date. The research group directory and the
        Journal are both reachable from the navigation above.
      </p>
      <a
        href="/"
        className="mt-8 inline-flex items-center gap-2 rounded-control bg-navy text-white pl-5 pr-4 py-2.5 text-sm hover:bg-navy-hi transition-colors"
      >
        Back to the homepage
        <span aria-hidden>→</span>
      </a>
    </div>
  );
}
