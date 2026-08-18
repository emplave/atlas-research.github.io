# Phase 8

Branch: `chapters-rebuild`. Prior: `548b701` P0 · `f5c156c` P1 · `b3337f7` P2 · `1ef922e` P3
· `f97a993` P4 · `80ceca5` P5 · `eaf5337` P6 · `a65e778` P7.

Verification: `tsc --noEmit` clean, `vite build` succeeds, `npm run dev` starts clean (200 on
all seven routes, no warnings), **54/54 checks pass**.

---

## Footer

Exact required wording, in `Footer.tsx`, `public/apply.html`, and `public/llms.txt`:

> Atlas Research Institute operates as a project of a California nonprofit public benefit
> corporation. For more information contact admin@atlas-research.org

Asserted per-page. The entity name remains absent from the whole repo.

## 1. Proof band

Rebuilt. Eyebrow "Partners and publication routes" above three larger logos, evenly spaced
and centred on white plates as the primary element. Plate heights are tuned per mark
(`h-9`/`h-11`/`h-14`) so the logos read as optically equal rather than mathematically equal.

One compact relationship line beneath: *IJHSR is a peer-reviewed submission route. Lumiere
Education is a program partner. The Curieux Review is a student research writing partner.*

The institutions line is **gone from this band** — asserted absent.

**Extension point built in:** a `GUEST_RESEARCHERS` array renders a bordered "Guest
researchers" row beneath the logos when populated, and nothing at all while empty. Adding
confirmed names is a data edit, no redesign. It ships empty, with a comment that a named
researcher is an endorsement claim and needs their agreement first.

## Institutions line → Fellowship only

Now a small "Guest sessions" block on the Fellowship page, where guest sessions are already
discussed, in the exact approved wording:

> Fellows learn from researchers at the University of Melbourne, USC, and Stanford.

`"and more"` is in the banned-string list, so it cannot be appended without failing the
suite. Checks assert the line appears on `/fellowship` and on no other route.

## 2. Events moved up

Order is now hero · **01** research groups · **02** events · **03** how the work runs ·
**04** eight fields · **05** proof band · **06** fellowship · FAQ · closing.

Two-column split kept, next event large on the left.

**Tone alternation had to be re-derived, not just renumbered.** Moving events into slot 02
put its surface-coloured cards onto a surface-coloured section — invisible. Every section
whose content is cards now sits on the opposite tone to those cards. Final sequence:

`paper → surface → paper → surface → navy → paper → surface → navy`

so no card ever sits on its own background colour, and the two navy bands still bracket the
page.

## 3. "What fellows get" — no empty cell

Five items in a three-column grid left a visible empty sixth cell. Restructured as a **2 + 3
split**: first row two wider cells with larger type, second row three. Five items divide
cleanly and nothing is empty.

No sixth item was invented — asserted, along with the item count still being exactly five.

## 4. Waitlist required fields

`School or institution` and `City + country` are now required; labels read "required".
`What would you want to research?` stays optional.

Validation runs in JS with `noValidate` on the form, so the messages are ours and are
announced at the field rather than in a browser tooltip. `Field` gained an `error` prop
rendering `role="alert"` text under the control, inputs carry `aria-invalid`, and a summary
line appears below the button. Whitespace-only input does not pass — values are trimmed
before the check.

## 5. Partners contact address

`PARTNERS_EMAIL = "nirav.goenka@atlas-research.org"` in `src/lib/dates.ts`, used only by the
Partners page. One named constant, so the exception exists in one place.

Asserted: the Partners page body uses that address, does not use `admin@`, and the partners
address appears on no other route. The shared footer on `/partners` still shows `admin@`,
which is correct — that scoping caught a bad assertion in my own test rather than a bug.

## 6. Privacy policy

`src/pages/Privacy.tsx` at `/privacy`, linked from the footer and from the waitlist consent
checkbox. `public/privacy.html` becomes a `noindex` redirect (meta refresh plus
`location.replace`) so old links work; `robots.txt` disallows it and the sitemap points at
`/privacy`.

Carried over from the old page: Google Workspace storage, the no-selling commitment, and the
copy/correct/delete rights. Dropped as inaccurate: "youth-led organization" (violates the
org-level rule), the email-only waitlist description, the 12-month retention window, and the
grade-level/application-questions fields the current form does not collect.

Content is specific to what the site does: the five collected fields matching the waitlist
form exactly, use limited to contacting you about that programme, storage in Google Sheets
via Apps Script plus Brevo for email, retention until you ask for removal, and deletion by
emailing `admin@`. Minors section states the minimum-necessary collection, that no date of
birth is asked, and that a parent or guardian may email for removal without involving the
student. `PRIVACY_UPDATED` lives in `dates.ts` so the date cannot go stale silently.

**On cookies, I described what is actually true rather than what the brief assumed.** I
grepped for cookies, `localStorage`, `sessionStorage`, and script tags: the site sets **no
cookies at all**. So the policy says that plainly, then explains that Vercel Web Analytics is
cookieless — no cookie, no persistent identifier, no cross-site tracking. It also discloses
the Google Fonts request, since that does send the reader's IP to Google and is the only
third-party request the site makes. A generic "we use cookies" section would have been false.

---

## The thing you should know about

**Vercel Analytics was not in this branch, and merging would have removed it from
production.**

Your brief said "no analytics beyond Vercel Analytics", which assumes it is present. It is
not — or was not. `@vercel/analytics` and `<Analytics />` exist on `main` (added in
`51e06a0`), but `chapters-rebuild` branched from `42874be`, which predates that commit. The
merge-base confirms it. So this branch has been analytics-free the whole time, and a PR into
`main` would have silently deleted it.

I reinstalled it and restored `<Analytics />` in `main.tsx`, which is both what you clearly
intend and what makes the new privacy copy true. `main.tsx` carries a comment tying the two
together: remove the component or add another provider, and `Privacy.tsx` must change in the
same commit.

Worth a look when this merges — it is the kind of thing a long-lived branch loses quietly.

---

## Verification

```
PASS  /                                               38501b
PASS  /research-groups                                18767b
PASS  /research-groups/placeholder-model-card-review   8430b
PASS  /events                                          6125b
PASS  /journal                                          9482b
PASS  /journal/placeholder-working-paper               6227b
PASS  /fellowship                                     10062b
PASS  /partners                                        6722b
PASS  /privacy                                          7884b
PASS  /nope                                            3496b

all checks passed
```

Every page scanned for 36 banned strings (dead tokens, banned words, ISSN / 501(c) / info@ /
scholarship / 9-12 / education framing / July 24 / apply.html / yourbuddy / "and more") and
asserted to carry the exact footer line. Then 44 behavioural assertions across the proof
band, the institutions line's placement and exact wording, section order and numbering, the
2+3 outcomes layout, required-field validation, email scoping, and every privacy content
requirement.

Three initially failed. Two were bad assertions in my own test — React lowercases
`noValidate` to `novalidate`, and the shared footer legitimately puts `admin@` in the
Partners page HTML. One was real: the storage line said "a Google Sheet" where the brief
names "Google Sheets", now corrected.

Bundle: 305 KB → 315 KB JS (100 KB gzipped). The increase is `@vercel/analytics` plus the
privacy page.

---

## Still open

- **`public/og-globe.png`** — 842 KB, still the `og:image`, still not a picture of anything
  currently on the site. Needs a 1200×630 replacement; generating imagery remains out of
  bounds for me.
- **`public/logo-plate.jpeg`** — unused since Phase 6.
- **`reach.ts`** still asserts a real fellow in each of 20 countries. I cannot verify that
  list, and unlike the stat band it ships visible.
