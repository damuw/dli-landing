# Deep Learning Intelligence — institutional site (2027)

Production source for `https://deeplearningintelligence.com`.

## What is deployed

`site/` is the production site, built from the approved `DLI Homepage 2027` prototype
(`DLI Homepage 2027.dc.html` + `support.js` + `assets/`), extended for the November 2026
UAE institutional positioning release:

- **Living Continuum hero** — preserved, with the institutional thesis
  “Sovereign by design. Accountable in execution.”
- **Technology ecosystem strip** — preserved directly below “Scroll to explore”.
- **Three institutional pathways** — government, enterprise/regulated, sovereign capital.
- **Why now** — dated primary sources for the UAE agentic mandate, sovereign compute and
  institutional capital, separated from DLI interpretation.
- **Outcomes and controls** — executive measures paired with engineering mechanisms;
  illustrative KPIs, not achieved results.
- **Evidence room** — the existing five-stage delivery demo plus an illustrative artifact
  library (synthetic data).
- **Readiness assessment** — eight questions, progress, results before contact, up to five
  prioritised gaps and a tailored next-step plan. Scoring is pure and testable in
  `site/assets/assessment.js`.
- **Long-form pages** — `/government-agentic-ai/`, `/sovereign-ai-architecture/`,
  `/forward-deployed-ai-engineering/`, `/institutional-ai-readiness/`, `/insights/`.
- **SEO** — sitemap, static crawlable pages, canonical URLs, Article/Service/FAQPage JSON-LD,
  real 404s, legacy `/ai/` redirects.
- **Legal and accessibility** — existing privacy/terms/cookies, consent, accessibility menu,
  skip link, reduced-motion handling.

## Deploy

```bash
docker build -t dli-landing .
docker run -p 8080:80 dli-landing
```

The Dockerfile serves `site/` with nginx. `nginx.conf` redirects `/ai/` to `/`, returns real
404s, sets security headers and caches hashed/static assets for 30 days. **Any change to
`site-ui.css`, `site-ui.js` or `longform.css` needs a `?v=` bump in the HTML.**

## Lead API

Separate service: `damuw/dli-lead-api` (Express + Nodemailer), deployed at
`https://api.deeplearningintelligence.com`. Configure in Coolify:

- `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`
- `MAIL_FROM`, `LEAD_TO` (defaults to `damu@DeepLearningIntelligence.com`)
- `ALLOWED_ORIGINS`

The site posts to `POST /api/leads`. Assessment requests add an optional `assessment`
object (segment, profile, dimensions, gaps, answers, consent metadata) and a `consent`
flag. The API validates and bounds those fields, then includes a structured
`READINESS ASSESSMENT` block in the notification email. Unknown fields are ignored, so
older clients keep working.

## Checks

```bash
python3 tools/validate-site.py      # links, canonicals, schema, sitemap, claim scan
node tools/test-assessment.mjs      # 18 assertions on the scoring model
```

Manual/browser checks are described in `docs/2026-11-05-uae-institutional-positioning.md`.
Claims and sources are tracked in `docs/content-provenance.md`. Localization/RTL notes are in
`docs/localization.md`.

## Legacy

`app/` is the earlier React/Vite baseline (V3.1 brand strip). It is kept for reference and is
not served by the Dockerfile.
