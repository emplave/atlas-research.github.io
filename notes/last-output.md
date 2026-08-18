# Consent checkbox now blocks submission

Branch `chapters-rebuild`, PR #2. `tsc --noEmit` clean, `vite build` succeeds, all routes serve
with no dev warnings, **17/17 checks pass**.

---

## Form audit — which forms have a consent checkbox

Two forms exist on the site. **Only one has a consent checkbox.**

| Form | Route | Consent checkbox | Action taken |
| --- | --- | --- | --- |
| Fellowship waitlist | `/fellowship` | **Yes** — `name="privacy"` | Fixed |
| Partnership enquiry | `/partners` | **No** | None needed |

There is one other checkbox in the codebase — "Include archived" in
`components/research-groups/DirectoryFilters.tsx` — but that is a directory filter toggle, not
consent, and is not in a form.

I did **not** add a consent checkbox to the Partners form. You said not to add a second consent
mechanism, and that form is currently rendered visibly disabled anyway (`FORM_ENDPOINT` is
`null`). If it is ever enabled it will need one, but adding it now would be inventing a control
for a form that cannot submit.

## The bug had two independent causes

Either one alone would have let it through:

1. **The form sets `noValidate`.** That was deliberate — it is what lets the error messages be
   ours and be announced at the field rather than in a browser tooltip. But it also makes the
   `required` attribute on the checkbox completely inert. The attribute was there, doing
   nothing.
2. **The JS validation loop only covered the four text fields.** `REQUIRED_FIELDS` listed
   `name`, `email`, `school`, `location`. `privacy` was never checked.

So the checkbox looked required in the markup, looked required to a reader, and was enforced
nowhere.

**A third detail that would have broken a naive fix:** an unchecked checkbox contributes **no
entry at all** to `FormData`. It is absent — not `""`, not `"off"`, not `false`. So a fix
written as `if (data.privacy !== "on")` happens to work, but one written as
`if (!data.privacy.trim())` throws on `undefined`. The check is now explicitly against absence:

```ts
// An UNCHECKED checkbox contributes no entry to FormData at all — it is absent
// rather than empty or "off" — so absence is the signal. A checked box yields "on".
if (!fd.get("privacy")) found.privacy = CONSENT_ERROR;
```

## What changed

**Consent is now a required field like any other**, sharing the same error object, so it gets
the same three treatments you asked for and needed no separate plumbing:

- **Alert-coloured message under the control** — `<p role="alert" className="mt-1.5 text-xs text-alert">`,
  matching the `Field` component's error styling used by the text inputs.
- **`aria-invalid` on the input** — `aria-invalid={Boolean(errors.privacy)}`.
- **Counted in the summary line** — the summary is `{Object.keys(errors).length > 0 && …}`, and
  `privacy` is now a key in that same object, so it is included automatically rather than by a
  second condition that could drift.

The `required` attribute stays on the input for assistive tech, with a comment saying it is not
what enforces the rule. One checkbox. The privacy policy link is untouched.

**I also extracted the rule into a pure exported function**, `validateWaitlist(fd: FormData)`.
That was not cosmetic: without a DOM available I could not otherwise test the actual decision
the submit handler makes, and the handler now does nothing but call it and bail. It is better
structure regardless — the rule is testable and has no React in it.

## Verification

```
=== THE BUG: consent unchecked ===
  errors: {"privacy":"Agree to the privacy policy to continue."}

=== consent checked, everything else valid ===
  errors: {}
```

```
PASS  unchecked consent produces an error
PASS  error text is the consent message
PASS  submission is blocked (non-empty error object)
PASS  no text-field errors falsely raised
PASS  checked consent passes
PASS  nothing blocks submission
PASS  empty-string consent blocks
PASS  consent + blank fields reports BOTH
PASS  whitespace-only text still blocks
PASS  exactly one consent checkbox
PASS  checkbox carries required
PASS  checkbox carries aria-invalid
PASS  privacy policy link retained
PASS  no second consent mechanism
PASS  no error text before submitting
PASS  Partners form has no consent checkbox (nothing to gate)

all 17 checks passed
```

Also asserted: consent and blank text fields reported **together**, not one masking the other;
and no error text rendered before a submit attempt.

## One honest limit on that verification

**I could not literally click the checkbox and press submit.** `jsdom`, `happy-dom`,
`linkedom` and `@testing-library/react` are all absent, and I was not going to add a dependency
for a throwaway test.

What I tested instead is stronger than a markup assertion but weaker than a real click:

- `validateWaitlist` was called with **real `FormData`**, with the `privacy` key genuinely
  omitted, which is exactly what a browser sends for an unchecked box. That is the function the
  handler calls, and it returns a blocking error.
- The rendered markup was asserted for the checkbox, its `required`, its `aria-invalid`, the
  policy link, and that no second checkbox exists.

The single untested link is the three lines wiring the two together:

```ts
const found = validateWaitlist(fd);
if (Object.keys(found).length > 0) { setErrors(found); setState("idle"); return; }
```

That is readable and it is the same early-return that already worked for the four text fields
before this change — those demonstrably blocked submission. So I am confident, but "confirmed by
a real click" is not a claim I can make. **Please tick it off on the preview**: load
`/fellowship`, fill all four fields, leave the box unchecked, submit, and confirm you see the
message under the checkbox, the summary line under the button, and no row in the sheet.

This is now item 2 in `notes/preview-checklist.md`, which already flags the waitlist as the
highest-priority manual check for the separate reason that the `no-cors` POST cannot report
success.
