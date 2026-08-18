# /public/images/

Drop image files here and reference them from the data files. Nothing in this
directory is required — every card has a designed typographic fallback, so a
missing image is a valid state, not a broken one.

## How to add an image

Images are referenced from the data layer, never from a component. Set the
`image` field on the record:

```ts
// src/data/research-groups.ts
{
  slug: "bus-reliability",
  // …
  image: {
    src: "/images/research-groups/bus-reliability.jpg",
    alt: "Students recording arrival times at a bus stop",
  },
}
```

```ts
// src/data/events.ts
{
  slug: "methods-webinar",
  // …
  image: { src: "/images/events/methods-webinar.jpg", alt: "…" },
}
```

Paths are absolute from the site root and start with `/images/`. A file at
`public/images/events/foo.jpg` is served at `/images/events/foo.jpg`.

Leave `image: null` when there is no photograph. The card then renders a navy
typographic block carrying the field name. That is the intended default.

## Required dimensions

| Use | Aspect | Minimum | Recommended | Format |
| --- | --- | --- | --- | --- |
| Research group card | **16:9** | 960 × 540 | 1600 × 900 | JPEG or WebP |
| Event card | **16:9** | 960 × 540 | 1600 × 900 | JPEG or WebP |
| Open Graph / social | 1.91:1 | 1200 × 630 | 1200 × 630 | PNG or JPEG |

Cards crop with `object-cover`, so the subject must sit near the centre. Anything
important in the outer 10% may be cut on narrow screens.

Keep each file under **300 KB**. Resize before committing rather than relying on
the browser to scale a large original — these are loaded lazily but still
downloaded in full.

## Suggested layout

```
public/images/
  research-groups/    one file per group, named after the slug
  events/             one file per event, named after the slug
  og/                 social preview images
```

Naming a file after the record's `slug` makes it obvious which image belongs to
which entry and which are orphaned.

## Alt text

`alt` is required whenever `src` is set. Describe what is in the frame, not the
project — "students recording arrival times at a bus stop", not "transit
research". Do not start with "Image of".

## Rules

- **Only use images Atlas has the right to publish.** Own photographs, or
  licensed stock with the licence recorded. No image pulled from a search result.
- **No photographs of identifiable minors without consent on file.** Prefer
  wide shots, hands, equipment, or the work itself.
- **No stock photography that implies something untrue** — no staged laboratory
  shots for a group doing survey work, no university buildings Atlas has no
  relationship with.
- **Never hotlink.** Every file is committed here and served from this origin.
