# Partnership enquiry form wired up

Branch `chapters-rebuild`. `tsc --noEmit` clean, `vite build` succeeds, all routes serve with no
dev warnings, **55 checks pass** (47 partnership, 4 nulled-endpoint, 4 waitlist regression).

---

## The exact payload — verify this against your sheet columns

```json
{
  "name": "Dr Ada Lovelace",
  "email": "ada@example.edu",
  "titleorg": "Professor of Computing, Example University",
  "interest": "Guest session on methods & analysis",
  "consent": "yes"
}
```

Against your contract — `new Date(), name, email, titleorg, interest, consent, 'New', '', ''`:

| Column | Source | Sent? |
| --- | --- | --- |
| 1 timestamp | `new Date()` in the script | no |
| 2 `name` | form input | **yes** |
| 3 `email` | form input | **yes** |
| 4 `titleorg` | form input, now required | **yes** |
| 5 `interest` | textarea, optional, `""` when blank | **yes** |
| 6 `consent` | always `"yes"` | **yes** |
| 7 `'New'` | script literal | **no** |
| 8 `''` | script literal | **no** |
| 9 `''` | script literal | **no** |

Five keys, all strings, in the script's order. Asserted: `Status`, `Reviewer` and `Notes` are
**not** sent, and neither is the old `kind` / `submittedAt` pair the previous helper added.

## 1. Endpoint

`FORM_ENDPOINT` in `src/lib/dates.ts`, next to `WAITLIST_ENDPOINT`, with a DO NOT DELETE comment
identifying it as the live partnership backend, recording its column contract, and stating that
it is a different deployment and a different sheet that must never be consolidated with the
waitlist. Asserted that the two constants differ and the waitlist one is untouched.

Kept as `string | null` so nulling it restores the disabled form with no other edit.

## 2. Submit path

Identical to the waitlist: `POST`, `mode: "no-cors"`, `Content-Type: application/json`, then
`setState("sent")` without reading `res.ok`. The full comment explaining the opaque response —
the 302 to `script.googleusercontent.com` with no CORS header — is carried over, along with the
warning not to "fix" it.

## 3. Required fields and validation

Required: `name`, `email`, `titleorg`. Optional: `interest`.

"Title and organisation" is now required and its label reads **required**, not optional, with a
comment on why: an enquiry with no affiliation cannot be evaluated.

Same pattern as the waitlist throughout — `noValidate` on the form, JS validation, inline
alert-coloured messages under each control, `aria-invalid` on the inputs, and a summary line
below the button that counts keys on the same error object. `validatePartnership(fd)` is pure and
exported, mirroring `validateWaitlist`, so it tests without a DOM.

## 4. Consent

One required checkbox linking to `/privacy`, worded and styled exactly as the waitlist's.
Submission is blocked when unchecked; `consent` posts as `"yes"`. Asserted there is exactly one
checkbox on the page — no second consent mechanism.

## 5. Disabled state removed, mechanism kept

Gone while the endpoint exists: the "This form is not open yet" panel, the `opacity-60` wrapper,
and the "Form not open" button. The `fieldset` still exists but is no longer disabled.

`isFormEndpointConfigured()` is retained as the gate. I verified this rather than assuming — by
temporarily nulling `FORM_ENDPOINT` and re-rendering:

```
FORM_ENDPOINT = null (temporarily nulled)
PASS  disabled panel returns
PASS  fieldset disabled returns
PASS  contact address shown as plain text
PASS  still no mailto
```

## 6. Logging

Reused rather than duplicated — but that required a move. `isLoggableHost` lived inside
`src/pages/Fellowship.tsx`, and importing a page from a page to reuse it would have been the
wrong shape. It now lives in **`src/lib/payloadLog.ts`** with a `logPayload(label, payload)`
helper, and both forms import it. Grep confirms the host rule and the production-host list exist
in exactly one place.

On localhost and previews the console shows `[partnership] POST body` with the five keys; silent
on `atlas-research.org`, since the body carries a real name and email.

---

## Two things I changed beyond the brief

**Deleted the orphaned `submitApplication()` from `forms.tsx`.** Wiring the form inline left it
with zero callers, and it was not harmless dead code — it POSTed in CORS mode and read `res.ok`,
which is exactly the pattern that provably fails against these endpoints: the fetch rejects
*after* the row is written, so the sender is told it failed when it had not. Leaving a shared
helper that looks correct and silently loses submissions is a trap. A comment in its place
records why it went and says not to reintroduce one. `isFormEndpointConfigured()` stays.

**Renamed two form fields.** `title_group` → `titleorg` and `message` → `interest`, to match the
script's key names. Without this the payload keys would not have matched the columns.

## Not verified by me

**No row has been written.** The POST is opaque and I did not submit against your live sheet.
On the preview: submit once, read the `[partnership] POST body` log to confirm all five keys, then
check the sheet and confirm the columns line up — particularly that `consent` lands in column 6
and that `New` appears in column 7 from the script rather than from anything the client sent.

Also unchanged and still true from before: this work is on `chapters-rebuild`, and
`origin/main` is at `0c2f838`. See the note below.

## On pushing to main

You asked me to commit and push to main. I have committed to `chapters-rebuild` and **not**
pushed to main, because the last attempt to write to main was blocked by the permission
classifier — it is the production branch and Vercel deploys it.

`chapters-rebuild` is now two commits ahead of main: the Working Papers flag (`83c2616`) and this
one. Merging it into main brings both. The merge is clean — 0 conflicts against `origin/main`.

Tell me to go ahead and I will retry the merge and push, or run it yourself:

```
git checkout main && git pull && git merge chapters-rebuild && git push
```
