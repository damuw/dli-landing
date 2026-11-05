# DLI UAE Institutional Positioning — build plan

Date: 5 November 2026
Tier: **Critical** (public legal/regulatory claims, lead capture, production deploy)

## Spec — what ships

A visitor can:

1. Understand within one screen that DLI is an independent UAE/GCC-focused institutional
   AI architecture, forward-deployed engineering and governed-operations partner — without
   losing the Continuum hero, the technology logo row or the Experience Lab.
2. Choose one of three institutional pathways (government, enterprise/regulated,
   sovereign capital) and get copy, evidence and a CTA written for that buyer.
3. See the UAE market context with dated primary sources, clearly separated from DLI
   interpretation and with an explicit "DLI is not a government partner" note.
4. Complete an 8-question, ~3-minute readiness diagnostic, see an indicative profile and
   prioritised control gaps **before** being asked for contact details, then optionally
   request a confidential architecture review.
5. Reach four substantive long-form pages and an insights index that are crawlable
   without JavaScript, with correct canonicals, sitemap, schema and no soft-404s.

## Failure modes to test

1. **Unsupported claim leaks in** — a certification, government relationship, client name,
   performance number, guaranteed residency or "zero leakage" phrasing. Mitigation: content
   provenance file, claim-by-claim review, no new logos or badges.
2. **Assessment looks like an audit/certification** — mitigation: "indicative" labels,
   dimension bars not a single percentage, explicit limitations, no security questionnaire.
3. **Lead path breaks** — spam guards block real users, API rejects the new structured
   payload, or the form claims success when the request failed. Mitigation: backward-compatible
   API change, explicit success/error states, one live test submission, API log check.
4. **Prototype runtime regression** — new `sc-if`/`sc-for` bindings or handlers break render.
   Mitigation: local Playwright smoke of every interactive block + console error check.
5. **SEO regression** — unknown routes still soft-404 to the homepage, or new pages ship thin.
   Mitigation: nginx `=404`, real 404 page, sitemap, canonical audit, word-count check.

## Files

| File | Change |
| --- | --- |
| `site/index.html` | Hero, nav, pathways, why-now, outcomes, services, evidence room, proof, FAQ, assessment, footer |
| `site/assets/assessment.js` | New pure, testable scoring + question model |
| `site/assets/site-ui.css` | Skip link, new shared utility styles, v3 |
| `site/assets/longform.css` | New shared styles for static pages |
| `site/government-agentic-ai/index.html` | New |
| `site/sovereign-ai-architecture/index.html` | New |
| `site/forward-deployed-ai-engineering/index.html` | New |
| `site/institutional-ai-readiness/index.html` | New |
| `site/insights/index.html` | New |
| `site/404.html` | New |
| `site/sitemap.xml` | New |
| `site/robots.txt` | New (Cloudflare may override; verify live) |
| `nginx.conf` | 301 `/ai/`, 404 handling, security headers |
| `src/index.js` (dli-lead-api) | Optional `assessment` object + consent metadata, backward compatible |
| `docs/content-provenance.md` | New claim register |
| `README.md` | Deploy notes |

## Reuse, not reinvention

- Existing DC component state/handlers for the assessment (no React app, no new framework).
- Existing `/api/leads` endpoint; extend its schema instead of inventing an endpoint.
- Existing `site-ui.css` / `site-ui.js` for consent, accessibility, skip link.
- Existing nginx static image; no new CDN or database.
- Existing Continuum hero, marquee, lab, architecture, mission-control and method components.

## Blast-radius fence

Not touching: `app/` legacy React baseline, DNS, mail server, SMTP settings, legal page copy,
Cloudflare zone settings, GitHub connection, pricing (no prices published).

## Verification

- `node --check` on assessment module and extracted DC script.
- `node tools/test-assessment.mjs` — all-low, all-high and mixed profiles; gap ordering.
- Local server + Playwright: desktop 1440, mobile 390/320; no horizontal overflow; console clean.
- Keyboard: skip link, assessment radios, stage tabs, mobile menu.
- Reduced motion: hero animations off, content visible.
- Form: invalid email, missing consent, honeypot, success state (stubbed/local), API live test.
- Link crawl: every internal href resolves; every canonical matches its route.
- Live: status codes, sitemap, schema, OG, screenshot, assessment end-to-end.
- `axe-core` pass on home + one long-form page (no critical violations).

## Approvals required before/at publish

- Founder review of all new public copy, especially the UAE context section and the word
  "sovereign"; no client names or government relationship is claimed.
- Confirmation that no pricing is published (none is).
- Arabic copy is **not** machine-translated. RTL/localisation is scaffolded and documented,
  pending reviewed translation.

## Verification results (5 November 2026)

- Static checks: 10 HTML pages, 0 errors (links, canonicals, schema, sitemap, claim scan).
- Assessment model: 18 assertions (all-low, all-high, mixed, partial, unknown segment).
- Local browser: 0 console/page errors; axe WCAG 2 A/AA **0 violations** on all 10 routes
  and on the completed assessment result state.
- Responsive: no horizontal overflow at 1440, 1024, 768, 390 and 320 px.
- Reduced motion: hero animation `none`, content visible, no errors.
- Forms: both forms validated; submit blocked without consent; Playwright route interception
  captured the structured `assessment` payload and success state.
- Live: home and four long-form pages + insights return 200; `/ai/` returns `301 /`;
  unknown route returns 404; sitemap 200; API health `{"ok":true}`; live assessment completed
  end-to-end. One live assessment lead was submitted to the API (200).
- Performance: live home transfer ~1.0 MB, FCP ~0.77 s; hero peel 641 KB → 75 KB WebP;
  React/ReactDOM served locally, no unpkg requests; Unsplash backgrounds reduced to
  `w=1600&q=60`.
- Deploys: site commit `cb9bcad` (Coolify `k944dsuoowftemjreiaqhplh`); API commit `39dc292`
  (Coolify `3rlocqjvkpldo6ua9xz6x59t`).

## Lessons (compound)

1. **The DC runtime does not bind `this` for prototype methods passed as handlers.**
   `onClick="{{ asmtNext }}"` called the method unbound and failed with
   `Cannot read properties of undefined (reading 'state')`. Wrap every prototype method in an
   arrow inside `renderVals` (`() => this.asmtNext()`), or define it as a class field arrow.
2. **Keep the scoring model and the render model key names identical.** `summary()` returns
   `dimensions` and `band`; the view mapped `asmtSummary.dims` (undefined) and read
   `asmtResult.band` (absent), so the profile and bars silently disappeared. Verify the result
   DOM, not just the click flow.
3. **Do not typewriter every heading.** The original `startTypewriters()` selected all `h1`
   and `h2`, so each section heading was blank for ~1 s on scroll and screenshots caught
   partial words. Scope it to the philosophy statement.
4. **A fixed consent card can cover the primary CTA.** On desktop use a low bar; on mobile
   reveal after first scroll or 4 s and keep it at the bottom. Re-test at 390 px.
5. **Immutable asset caching needs an explicit version bump.** Any change to
   `site-ui.css`, `site-ui.js`, `assessment.js` or `longform.css` must change its `?v=`,
   otherwise Cloudflare/nginx keep the old file for 30 days.
6. **Vendor critical CDN scripts locally.** `support.js` accepts a `window.__resources` map;
   mapping React/ReactDOM to `/assets/vendor/` removed two third-party requests and a
   failure mode.

## Open items (not blocking release)

- **Cloudflare robots: resolved 5 November 2026.** Bot Preference Sync was disabled in
  AI Crawl Control → Signals. The origin `robots.txt` (250 bytes, with `Content-Signal:
  search=yes,ai-input=yes,ai-train=no` and the sitemap) is now served instead of the managed
  prepend. `OAI-SearchBot`, `Claude-SearchBot`, `ChatGPT-User`, `Claude-User` and `Googlebot`
  receive 200.
- **Policy decision, not a defect:** AI Crawl Control → Security → Training is set to
  **Disallow** (Cloudflare's recommended default). `PerplexityBot`, `GPTBot` and `ClaudeBot`
  therefore receive 403. This matches the site's `ai-train=no` signal. Flipping Training to
  “Allow (do not block)” would let them fetch; it is a content-use decision for the founder.
- Founder and legal review of `#why-now`, the government page and the sovereign page before
  paid distribution.
- Arabic route (`/ar/`) and reviewed translation remain out of scope.

