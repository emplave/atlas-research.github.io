import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { AnnouncementBar, Nav } from "./components/Nav";
import { IntroSplash } from "./components/IntroSplash";
import { Closing } from "./components/Closing";
import { Landing } from "./pages/Landing";
import { Fellowship } from "./pages/Fellowship";
import { Chapters } from "./pages/Chapters";
import { Publish } from "./pages/Publish";
import { Partners } from "./pages/Partners";

/** Scroll to top on route change; honor #hash targets on the landing page. */
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

export default function App() {
  return (
    <BrowserRouter>
      <ScrollManager />
      <div className="min-h-screen bg-cream-100">
        <IntroSplash />
        <AnnouncementBar />
        <Nav />
        <main>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/fellowship" element={<Fellowship />} />
            <Route path="/chapters" element={<Chapters />} />
            <Route path="/publish" element={<Publish />} />
            <Route path="/partners" element={<Partners />} />
            <Route path="*" element={<Landing />} />
          </Routes>
        </main>
        <Closing />
      </div>
    </BrowserRouter>
  );
}
