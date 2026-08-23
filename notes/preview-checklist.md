# Vercel preview test checklist

PR #2 · branch `chapters-rebuild` → `main`. **Do not merge until this passes.**

Items marked **⚠ UNTESTED** could not be exercised locally and are the ones most likely to
fail. Items marked **△ RISK** work locally but have a known reason to be fragile in a real
browser or on a real device.

---

## 1. Routes

Every one should render with no console errors.

| Route | Expect |
| --- | --- |
| `/` | Hero + globe, 6 group cards, events, process track, field wheel, ink proof band, FAQ, ink closing |
| `/research-groups` | Directory, filters, "start one" band above filters |
| `/research-groups/<slug>` | Long-form brief, light reading, sidebar |
| `/events` | Sections in order: Date to be announced → Upcoming → Past sessions |
| `/events/<slug>` | Event detail, Prose body, details sidebar |
| `/journal` | Two tracks: Working Papers, then Peer-Reviewed (empty, with process copy) |
| `/journal/<slug>` | Article page, standing stated on the page itself |
| `/get-involved` | Researchers track first, then Students |
| `/get-involved#researchers` | Jumps to the researchers section |
| `/get-involved#students` | Jumps to the students section |
| `/fellowship` | "Applications closed", waitlist form, guest-sessions line |
| `/partners` | Form rendered **visibly disabled** |
| `/privacy` | Real policy, "Last updated 17 August 2026" |

**Redirects**

- [ ] `/chapters` → `/research-groups`
- [ ] `/chapters/placeholder-transit-reliability` → `/research-groups/placeholder-transit-reliability` (**slug preserved**)
- [ ] `/apply` → `/fellowship`
- [ ] `/apply.html` → signpost page, then `/fellowship`
- [ ] `/privacy.html` → redirects to `/privacy`

**404**

- [ ] `/nonsense` → 404 page with working nav, not a blank screen or the homepage
- [ ] `/research-groups/not-a-real-slug` → "No research group at this address", **not** an empty brief
- [ ] `/events/not-a-real-slug` → "No event at this address"

> Note: on the Vercel preview all of these return HTTP 200 by design — `vercel.json` rewrites
> everything to `index.html` and the router decides. Judge by what renders, not the status code.

---

## 2. Waitlist form — ⚠ UNTESTED, highest priority

`/fellowship`. This is the single most important item on the list.

- [ ] Submit with **all four** required fields filled → success state appears
- [ ] **Open the Apps Script sheet and confirm the row actually landed.** The UI cannot tell
      you this — see below.
- [ ] Submit with **School** blank → inline error under that field, form does **not** submit
- [ ] Submit with **City** blank → same
- [ ] Submit with **Country** blank → same (City and Country are now separate required fields)
- [ ] Submit with a whitespace-only School (just spaces) → still rejected
- [ ] **Submit with the privacy checkbox UNCHECKED** → blocked, with the message under the
      checkbox and the summary line under the button. Confirm **no row** reaches the sheet.
      (Verified by unit-testing the rule with real FormData; the literal click is not something
      I could execute without a DOM.)
- [ ] Tick the box and resubmit → succeeds
- [ ] The research-interest field is optional and submits fine when empty

**Check the console log first.** On the preview the form logs its exact POST body:
`[waitlist] POST body` followed by all fifteen keys. Confirm `school`, `city`, `country`,
`research_desc`, `consent` (`"yes"`) and `referral` (`"Waitlist for next cohort"`) are populated,
and that the seven uncollected keys are empty strings rather than missing. This log is silent on
the live domain.

- [ ] Console shows all fifteen keys with the five collected fields populated
- [ ] **Then check the sheet** and confirm the columns line up rather than shifting by one

**Why the UI cannot confirm success.** The request uses `mode: "no-cors"` because the Apps
Script `/exec` endpoint answers a POST with a 302 to `script.googleusercontent.com`, and that
redirect target sends no `Access-Control-Allow-Origin` header. The response is therefore
opaque: status 0, `res.ok` always false. "You're on the list" means *the request left the
browser*, not *the server accepted it*. **You must check the sheet.**

If the row does not land, the payload shape or content type is the thing to look at, not the
CORS mode.

> While probing this endpoint I sent one test POST containing `{"kind":"probe"}`. Check for and
> delete that row if it is there.

---

## 3. OG image — ⚠ UNTESTED

- [ ] Paste the preview URL into Slack, iMessage, and X/Twitter
- [ ] Card shows the **serif A with the pen nib** and "Atlas Research Institute", white on near-black
- [ ] **No subhead.** The tagline was removed from the brand — a card showing "Student research
      groups in any field." means a crawler is serving a cached copy of the old `og.png`

`og:image` is `/og-image.png`, rasterised from `public/og.svg` by
`scripts/generate-icons.mjs`, so the vector and the served file are the same artwork. Correct at
1200×630 and verified by reading the file back, but no crawler has fetched it. Note that some
crawlers cache aggressively, and the old `/og.png` URL now 404s — if you see a stale card, force a
re-scrape rather than assuming it is broken.

- [ ] Browser tab shows the new mark (not the old two-block letter)
- [ ] `/favicon.ico` loads
- [ ] Add to Home Screen on iOS shows the new mark

---

## 4. Sheet → site

Groups Sheet:

- [ ] Add a row, `Published` = `yes`, all required fields filled
- [ ] Wait **~5 minutes** — Google caches published CSVs; this is not the site being slow
- [ ] Reload `/research-groups`, confirm the new group appears
- [ ] Set `Published` = `no`, wait, reload, confirm it disappears
- [ ] Set `Status` = `Recruiting` and confirm "Apply to join" appears; any other status, gone
- [ ] Put a deliberate typo in `Field` and confirm **only that row** vanishes and the console
      names the row and reason — the rest of the directory should be unaffected

Events Sheet:

- [ ] Add a row with `DateStatus` = `tbd` and a blank `Date` → appears under "Date to be
      announced", **never** a blank date and never "Invalid Date"
- [ ] Give it a real date, set `DateStatus` = `confirmed` → moves to Upcoming, in date order
- [ ] Add a past-dated row → appears under Past sessions with no Register button

---

## 5. Member application prefill — ⚠ UNTESTED

- [ ] On a **Recruiting** group, click "Apply to join"
- [ ] Google Form opens with **question 1 already filled** with that group's exact title
- [ ] Try a group whose title contains `&` or `:` and confirm the whole title arrives, not a
      truncated fragment

URL encoding is verified structurally — `%3A`, `%26`, exact round-trip through
`searchParams.get()`. What is **not** verified is that Google accepts entry ID `244092308`
against the live form. If question 1 was ever deleted and re-added, that ID is stale and the
field will fill **silently empty** — the form still opens, so this fails quietly.

Also confirm the two forms are not crossed:

- [ ] "Start a research group" (hero, nav, closing, directory band) → the **start** form
- [ ] "Apply to join" (on a specific group) → the **member** form, prefilled

---

## 6. Mobile at 375px

Use a real device if you can; DevTools misses WebGL and touch issues.

**Globe** — △ RISK. cobe is WebGL, sized from `offsetWidth`, and has never been seen on a real
device in this build.
- [ ] Renders at all — not a blank square
- [ ] Correctly sized and not overflowing
- [ ] Rotates slowly; check it does not pin the CPU or drain battery
- [ ] "Fellows in 20 countries" caption sits under it
- [ ] With **Reduce Motion** on: renders but does **not** rotate

**Field wheel** — △ RISK.
- [ ] At 375px you should see a **plain vertical list**, not a cramped radial diagram. A
      squeezed wheel means the `md` breakpoint failed.
- [ ] Each row taps through to the directory pre-filtered to that field

**Citation network** — expected behaviour worth knowing:
- [ ] Shows a **cropped fragment** of the graph, not the whole thing scaled down. It uses
      `preserveAspectRatio="slice"`, so cropping is intended, not a bug.
- [ ] With Reduce Motion on: completely still

**Marginal spine** — △ RISK, the most fragile layout piece.
- [ ] At 375px: **absent**, with section numbers inline above headings
- [ ] At 1024px: check the switch-on. It is absolutely positioned against an inner column, so
      this is where misalignment would show — numerals should sit on a single continuous
      vertical hairline running 01→06
- [ ] At ~1023px vs ~1025px, confirm nothing jumps badly

**Event cards**
- [ ] Stack cleanly, no horizontal scroll
- [ ] Long titles wrap rather than overflow
- [ ] Register / Watch the recording buttons full-width or sensibly placed
- [ ] Title tap → detail page; button tap → registration. **They must not be nested** — one tap
      target inside another means one of them is unreachable.

**General at 375px**
- [ ] No horizontal page scroll anywhere
- [ ] Hero headline does not overflow (clamps to 44px)
- [ ] Ink bands run full-bleed with no white sliver at either edge
- [ ] Group card headers legible; project title not clipped

---

## 7. Content that is wrong right now — fix before anyone sees this

- [ ] **The events Sheet is publishing a fake speaker name:**
      `"EXAMPLE NAME — replace or leave blank"`, live on `/events` and
      `/events/example-methods-webinar`. A name on the site reads as a claim that the person is
      appearing. **Clear it or delete the row.**
- [ ] Both Sheets hold the **template example rows**, not real content — two `placeholder-`
      groups and three `example-` events, with PLACEHOLDER/EXAMPLE text in their bodies.
- [ ] **`src/data/reach.ts` claims a real fellow in each of 20 countries**, rendered on the
      homepage as "Fellows in 20 countries". I have no way to verify this. If any country is
      aspirational, remove it — the count is derived, so it follows automatically.

---

## 8. Known behaviour that is not a bug

- **Events sometimes show different content between reloads.** Google's events endpoint is
  intermittently slow — measured 0.56s typical, but one response at 5.5s and one full hang past
  30s. The app's 8-second timeout then serves the **fallback** events instead. It fails safe and
  logs to console. Timeout is `SHEET_FETCH_TIMEOUT_MS` in `src/lib/csv.ts` if you want to raise
  it, but a 20-second blank wait is worse than a stale card.
- **The stat band renders nothing.** Every value in `src/lib/stats.ts` is `null` on purpose.
  Fill one in and the band appears.
- **The Partners form is disabled.** `FORM_ENDPOINT` is `null` and there is deliberately no
  mailto fallback.
- **Group cards show a navy-grey typographic block, not a photo.** Every seeded record has
  `image: null`; that block is the designed fallback.
- **Group card header tints vary across four greys.** Deterministic by field, not random.

---

## 9. Merge notes for when this passes

- PR reports `MERGEABLE` / `CLEAN` as of the merge commit `0c5c152`.
- `main.tsx` was verified to render `<Analytics />` identically on both sides before choosing;
  the branch version was kept for its privacy-policy comment.
- `ApplyBox`, `Pathways`, `WorldSection`, `Publish` stay deleted — main's edits to them were to
  components this rebuild removed deliberately.
- `public/favicon.png` came in from main as a silent add during the merge (no conflict, because
  the branch had no file by that name). It was the old logo and unreferenced, so it was removed.
  Worth re-checking after any future merge from main.
