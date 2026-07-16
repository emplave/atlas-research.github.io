/**
 * Applicant countries shown on the cohort globe (dots + connecting arcs).
 *
 * ⚠️ SEED DATA: the real list lives in the applications Google Sheet, which
 * is private (login-walled) and could not be read this session. This seed
 * uses the countries named in the org context. To sync with reality:
 * set the Sheet to "anyone with link can view" (or paste the country column
 * to Claude) and regenerate this list — one edit, everything updates.
 */
export type CohortCountry = {
  name: string;
  lat: number;
  lng: number;
  applicants?: number; // fill from sheet when available
};

export const APPLICANT_COUNTRIES: CohortCountry[] = [
  { name: "Nepal", lat: 27.7172, lng: 85.324 },
  { name: "Bangladesh", lat: 23.8103, lng: 90.4125 },
  { name: "Bolivia", lat: -16.4897, lng: -68.1193 },
  { name: "India", lat: 28.6139, lng: 77.209 },
  { name: "United States", lat: 40.7128, lng: -74.006 },
  { name: "Canada", lat: 43.6532, lng: -79.3832 },
  { name: "China", lat: 39.9042, lng: 116.4074 },
  { name: "Nigeria", lat: 6.5244, lng: 3.3792 },
  { name: "Kenya", lat: -1.2921, lng: 36.8219 },
  { name: "Brazil", lat: -23.5505, lng: -46.6333 },
  { name: "United Kingdom", lat: 51.5074, lng: -0.1278 },
  { name: "Indonesia", lat: -6.2088, lng: 106.8456 },
  { name: "Türkiye", lat: 41.0082, lng: 28.9784 },
  { name: "Japan", lat: 35.6762, lng: 139.6503 },
  { name: "Mexico", lat: 19.4326, lng: -99.1332 },
];

/**
 * Arc network: a clean ring — every applicant country connects to exactly
 * one other applicant country on each side. No cross-hatching clutter.
 */
export function buildArcs(countries: CohortCountry[]): Array<[CohortCountry, CohortCountry]> {
  const arcs: Array<[CohortCountry, CohortCountry]> = [];
  const n = countries.length;
  if (n < 2) return arcs;
  for (let i = 0; i < n; i++) {
    arcs.push([countries[i], countries[(i + 1) % n]]);
  }
  return arcs;
}
