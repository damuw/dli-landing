# Localization and RTL foundations

Status: scaffolded, not published. There is **no Arabic route** yet, and no public copy has
been machine-translated.

## Why no auto-translation

The site makes claims about UAE government programmes, data protection and procurement.
Machine translation can change the force of a legal or regulatory statement (for example
"must", "may", "confirmed" and "reported"). Arabic copy for these pages requires a human
translator with review by someone accountable for the claim.

## What is already in place

- `<html lang="en" dir="ltr">` on the home page and every long-form page.
- Long-form layout uses flow layout, flexbox and grid; there are no fixed-width text columns
  that break when the writing direction changes.
- The assessment question and option text is isolated in `site/assets/assessment.js` as data,
  not embedded in markup, so a translated question set can be supplied without touching the
  component.
- Typography stack includes Manrope, which has an Arabic companion; the Arabic route should
  add an Arabic-first stack rather than force Latin metrics.
- Date and number formats are written out (for example "18 May 2026"), not numeric-only.

## When an `/ar/` route is added

1. Create `/ar/` mirrors of `/`, `/government-agentic-ai/`, `/sovereign-ai-architecture/`,
   `/forward-deployed-ai-engineering/`, `/institutional-ai-readiness/` and `/insights/`.
2. Set `<html lang="ar" dir="rtl">`.
3. Add reciprocal `hreflang` tags on both language versions:
   `en`, `ar`, and `x-default` pointing at the English page.
4. Translate the assessment data in `assessment.js`; keep the scoring model identical so
   profiles are comparable.
5. Review every regulatory sentence against the English source and the primary source.
6. Run RTL QA at 320, 390, 768 and 1440 px: navigation order, icon direction, table reading
   order, focus rings, form labels and the assessment progress bar.
7. Do not translate brand names, product names or legal page titles without approval.

## RTL CSS checklist

The long-form pages are close to direction-agnostic. The following need attention when the
Arabic route is built:

- `.lf-callout` uses `border-left`; use `border-inline-start` in the RTL stylesheet.
- `.lf-article ul, .lf-article ol` use `padding-left`; use `padding-inline-start`.
- `.lf-aside` is a sticky column; confirm the grid order reads correctly in RTL.
- Home-page inline styles use `left`, `right`, `margin-left` and `padding-left` in the hero,
  navigation and stage panels. These are not yet converted to logical properties.
- Directional arrows (`→`, `←`, `↗`) should be mirrored or replaced with neutral icons where
  they imply reading direction.

## Non-negotiables

- No Arabic page ships with an unreviewed regulatory claim.
- No automatic redirect based on browser language; the language choice must be explicit.
- No mixed-direction paragraph without `dir="auto"` on the containing element.
