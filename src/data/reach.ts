/**
 * Fellowship reach — THE SINGLE SOURCE OF TRUTH FOR THE GLOBE.
 *
 * Every entry below is the verified location of a current fellowship cohort
 * member. This is a factual claim about real people, not decoration.
 *
 * NEVER ADD A COUNTRY WITHOUT A REAL FELLOW IN IT. A dot on the globe asserts
 * that someone is there.
 *
 * NEVER DISPLAY A COUNT THAT DOES NOT MATCH THIS ARRAY'S LENGTH. Use
 * REACH_COUNT below rather than writing a number in copy — a hardcoded
 * "20 countries" silently becomes a lie the moment this list changes.
 *
 * The globe renders from this file and nothing else. No component may add,
 * hardcode, or interpolate a location.
 *
 * Coordinates are country centroids, which is the correct resolution here:
 * a fellow's precise location is personal data and is not published.
 */
export type ReachCountry = {
  /** Country name as displayed. */
  name: string;
  /** ISO 3166-1 alpha-2, for stable keys. */
  code: string;
  lat: number;
  lng: number;
};

export const REACH_COUNTRIES: ReachCountry[] = [
  { name: "Albania", code: "AL", lat: 41.1533, lng: 20.1683 },
  { name: "Bangladesh", code: "BD", lat: 23.685, lng: 90.3563 },
  { name: "Brazil", code: "BR", lat: -14.235, lng: -51.9253 },
  { name: "Ethiopia", code: "ET", lat: 9.145, lng: 40.4897 },
  { name: "Ghana", code: "GH", lat: 7.9465, lng: -1.0232 },
  { name: "India", code: "IN", lat: 20.5937, lng: 78.9629 },
  { name: "Kazakhstan", code: "KZ", lat: 48.0196, lng: 66.9237 },
  { name: "Lebanon", code: "LB", lat: 33.8547, lng: 35.8623 },
  { name: "Nepal", code: "NP", lat: 28.3949, lng: 84.124 },
  { name: "Nigeria", code: "NG", lat: 9.082, lng: 8.6753 },
  { name: "Pakistan", code: "PK", lat: 30.3753, lng: 69.3451 },
  { name: "Peru", code: "PE", lat: -9.19, lng: -75.0152 },
  { name: "Poland", code: "PL", lat: 51.9194, lng: 19.1451 },
  { name: "Spain", code: "ES", lat: 40.4637, lng: -3.7492 },
  { name: "Thailand", code: "TH", lat: 15.87, lng: 100.9925 },
  { name: "Turkey", code: "TR", lat: 38.9637, lng: 35.2433 },
  { name: "United Arab Emirates", code: "AE", lat: 23.4241, lng: 53.8478 },
  { name: "United Kingdom", code: "GB", lat: 55.3781, lng: -3.436 },
  { name: "United States", code: "US", lat: 37.0902, lng: -95.7129 },
  { name: "Uzbekistan", code: "UZ", lat: 41.3775, lng: 64.5853 },
];

/**
 * The only number that may be shown alongside the globe. Derived, never
 * written by hand, so it cannot drift from the list above.
 */
export const REACH_COUNT = REACH_COUNTRIES.length;

/** Marker tuples in the shape cobe expects: [lat, lng]. */
export function reachMarkers(): [number, number][] {
  return REACH_COUNTRIES.map((c) => [c.lat, c.lng]);
}
