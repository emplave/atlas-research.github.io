import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { Analytics } from "@vercel/analytics/react";
import "./index.css";

/**
 * Vercel Web Analytics is the ONLY analytics on this site.
 *
 * It is cookieless: no cookie is set, no persistent identifier is stored, and
 * there is no cross-site tracking. The privacy policy at /privacy describes it
 * in exactly those terms — if this component is ever removed or another
 * analytics provider added, update src/pages/Privacy.tsx in the same change.
 */
ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
    <Analytics />
  </React.StrictMode>
);
