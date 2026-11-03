# Deep Learning Intelligence — 2027 site (prototype-derived)

Production source for `www.DeepLearningIntelligence.com`.

## What is deployed

`site/` is the production site, built from the approved `DLI Homepage 2027` prototype
(`DLI Homepage 2027.dc.html` + `support.js` + `assets/`), with these additions:

- **Typewriter philosophy statement** — "AI is not the outcome. What it makes possible is."
  typed line-by-line with natural cadence, blinking cursor and reduced-motion fallback.
- **Real lead capture** — the deployment brief posts to `https://api.deeplearningintelligence.com/api/leads`
  with honeypot + submit-timing spam guards, validation, sending state and error handling.
- **Free resources** — two research PDFs delivered by email, with a direct download after submission.
- **SEO metadata** — canonical, OG/Twitter, favicon.

## Deploy

```bash
docker build -t dli-landing .
docker run -p 8080:80 dli-landing
```

The Dockerfile serves `site/` with nginx (SPA-safe fallback, asset caching).

## Lead API

Separate service: `damuw/dli-lead-api` (Express + Nodemailer). Configure via Coolify env vars:

- `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`
- `MAIL_FROM`, `LEAD_TO` (defaults to `damu@DeepLearningIntelligence.com`)
- `ALLOWED_ORIGINS`

## Legacy

`app/` is the earlier React/Vite baseline (V3.1 brand strip). It is kept for reference and is
not served by the current Dockerfile.
