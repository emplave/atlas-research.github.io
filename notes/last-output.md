# Waitlist now sends every field the Apps Script expects

Branch `chapters-rebuild`, PR #2. `tsc --noEmit` clean, `vite build` succeeds, all routes serve
with no dev warnings, **52 checks pass** (45 payload/validation/markup + 7 logging gate).

---

## 1. Location split into City and Country

The single "City + country" input is replaced by two separately required inputs. Both carry
`required`, `aria-invalid`, an inline alert-coloured message, and count toward the summary line —
identical treatment to the other required fields.

Country is its own field because it is the column that feeds `src/data/reach.ts`, and a combined
free-text string cannot be split back apart reliably. `"Lagos, Nigeria"` splits cleanly;
`"Washington, DC, USA"` and `"Cork, Ireland"` do not split the same way. Guessing the country
from the tail of a string is exactly the kind of silent data corruption that would show up later
as a wrong dot on the globe.

Also added matching `autoComplete` hints — `address-level2` and `country-name` — so browsers can
fill both correctly.

## 2. The POST body now carries all fifteen keys

The old body sent `kind`, the raw form fields, and `submittedAt` — none of which matched the
script's key names beyond `name` and `email`. It now sends exactly the keys the script reads, in
the order it appends them:

```json
{
  "name": "Ada Lovelace",
  "email": "ada@example.org",
  "school": "Placeholder School",
  "city": "Kathmandu",
  "country": "Nepal",
  "grade": "",
  "timezone": "",
  "prompt": "",
  "datasource": "",
  "completion": "",
  "research": "",
  "research_desc": "Bus reliability & timetables",
  "consent": "yes",
  "referral": "Waitlist for next cohort",
  "referral_other": ""
}
```

- **Collected:** `name`, `email`, `school`, `city`, `country`, `research_desc` (trimmed).
- **`consent`** is `"yes"`. Submission is already blocked when the box is unchecked, so a posted
  row can only ever represent granted consent — hardcoding it is the honest encoding of that,
  not a shortcut.
- **`referral`** is `"Waitlist for next cohort"`. The stale
  `"Future interest (applications closed)"` is gone, and there is an explicit check asserting it
  never reappears.
- **Seven uncollected fields** — `grade`, `timezone`, `prompt`, `datasource`, `completion`,
  `research`, `referral_other` — are `""`.

**On never sending `undefined`:** you noted a missing key writes a blank. Worth being precise
about why it matters here — `JSON.stringify` **drops** a key whose value is `undefined`
entirely, so it does not arrive as a blank, it does not arrive at all. The payload is built from
an explicitly typed `WaitlistPayload` with all fifteen keys as `string`, so TypeScript will not
compile a missing one, and a test asserts all fifteen survive a JSON round-trip.

Nothing about the `no-cors` handling changed. `mode: "no-cors"`, `application/json`, and the
comment explaining why the response is unreadable are all intact.

`buildWaitlistPayload(fd)` is exported and pure, because the POST response is opaque — that
function is the only place the body can actually be asserted.

## 3. Logging — and a correction to what you asked for

You asked for the body logged **in dev only**, so you could read it on the preview. Those two
things are in conflict: **a Vercel preview is a production build**, so `import.meta.env.DEV` is
`false` there. I built it that way first and confirmed the log was stripped from the production
bundle — which would have left you with nothing to read on the exact environment you plan to
test in.

So the gate is on **hostname** instead: logs on localhost and on any preview URL, silent on the
live domain. That serves the stated intent rather than the literal wording.

```
PASS  localhost            localhost                              logs=true
PASS  127.0.0.1            127.0.0.1                              logs=true
PASS  vercel preview       atlas-abc123-emplave.vercel.app        logs=true
PASS  vercel branch alias  atlas-git-chapters-rebuild.vercel.app  logs=true
PASS  PRODUCTION apex      atlas-research.org                     logs=false
PASS  PRODUCTION www       www.atlas-research.org                 logs=false
PASS  empty hostname       (empty)                                logs=false
```

This matters beyond convenience: the body contains a real person's name, email, and school, so
it must never reach a visitor's console on the live site.

The host rule is split into `isLoggableHost(hostname)` so it can be asserted on its own —
testing `shouldLogWaitlistPayload()` directly is useless, since any test runner runs in dev and
short-circuits on the first line. I only noticed that because the first two production cases
"passed" as `true`, which was the test lying to me rather than the code being wrong.

On the preview, submit the form and you will see:

```
[waitlist] POST body
{ …all fifteen keys… }
```

## 4. Verification

45 checks on the payload, validation, and markup:

```
PASS  has exactly 15 keys
PASS  keys match the script exactly, in order
PASS  no key is undefined
PASS  every value is a string
PASS  survives JSON round-trip with all 15 keys
PASS  city populated and trimmed
PASS  country populated separately
PASS  consent is "yes"
PASS  referral is the new string
PASS  referral is NOT the stale "Future interest" string
PASS  grade/timezone/prompt/datasource/completion/research/referral_other === ""
PASS  research_desc is '' when the field is absent
PASS  blank city blocks          PASS  blank country blocks
PASS  whitespace city blocks     PASS  whitespace country blocks
PASS  absent country blocks      PASS  both reported together
PASS  old 'location' key is gone from validation
PASS  consent still blocks
PASS  old combined location input gone
PASS  "City + country" label gone
PASS  textarea renamed to research_desc
PASS  both new labels marked required

all 45 checks passed
```

## Still not verified by me

**No row has been written by this code.** The POST is opaque, and I did not submit against the
live sheet — sending test rows to a sheet with 85 real entries is not mine to do casually. Two
things to confirm on the preview:

1. **Read the console log** and check all fifteen keys are present and the five collected ones
   are populated.
2. **Then check the sheet** and confirm the columns line up — `school`, `city`, `country`,
   `research_desc`, `consent`, `referral` all landing in the right places rather than shifted.

If a column is off by one, the payload keys are right (asserted) so the thing to look at is
whether the script reads by key name or by position in the received object.

One thing I cannot check from here: **the 85 existing rows will still have blanks** in those
columns. This fixes new submissions only; it does not backfill.

Also still open from before: the `{"kind":"probe"}` row my earlier endpoint probe may have
written.
