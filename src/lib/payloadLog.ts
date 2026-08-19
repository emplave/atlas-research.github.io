/**
 * Host-gated logging of outgoing form payloads.
 *
 * Both form submissions on this site POST with `mode: "no-cors"`, so their
 * responses are unreadable. Logging the body is the only way to confirm what
 * actually left the browser.
 *
 * Shared by /fellowship and /partners. There is ONE host rule — do not write a
 * second copy of this in a page.
 */

/** The live domain. Everything else — localhost, Vercel previews — is not it. */
const PRODUCTION_HOSTS = ["atlas-research.org", "www.atlas-research.org"];

/**
 * Whether a given hostname may log payloads.
 *
 * Split out from the wrapper below so it can be asserted directly. Testing the
 * wrapper is useless: a test runner runs in dev, so it short-circuits on the
 * first line and every case returns true.
 */
export function isLoggableHost(hostname: string): boolean {
  return hostname !== "" && !PRODUCTION_HOSTS.includes(hostname);
}

/**
 * Whether to log the outgoing POST body.
 *
 * NOT gated on `import.meta.env.DEV` alone. A Vercel preview is a PRODUCTION
 * build, so DEV is false there and the log would be missing from precisely the
 * environment it exists to be read in.
 *
 * Gated on hostname instead: logs on localhost and on any preview URL, silent
 * on the live domain. The body contains what the visitor just typed — a name,
 * an email — so it must never appear in a real user's console.
 */
export function shouldLogPayload(): boolean {
  if (import.meta.env.DEV) return true;
  if (typeof window === "undefined") return false;
  return isLoggableHost(window.location.hostname);
}

/** Log a form payload when the host allows it. No-op on the live domain. */
export function logPayload(label: string, payload: unknown): void {
  if (!shouldLogPayload()) return;
  console.log(`[${label}] POST body\n` + JSON.stringify(payload, null, 2));
}
