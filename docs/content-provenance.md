# Content provenance and claim register

Last updated: 5 November 2026
Scope: public copy added in the UAE institutional positioning release (home page, four
long-form pages and the insights index), plus the four regional home-page copy packs.

## Rules applied

1. A claim is published only if the issuing body's page can be opened and the date read.
2. Reported fact is separated from DLI interpretation.
3. A national programme, fund or facility is never described as a DLI relationship,
   endorsement, pipeline or procurement opportunity.
4. No certification, accreditation, client name, performance number, guaranteed residency,
   guaranteed determinism or "zero leakage" claim is made.
5. Legal obligations are described as matters to confirm per processing activity, entity,
   sector and jurisdiction.

## Claim register

| # | Public claim | Source | Source date | Status | Used on |
| --- | --- | --- | --- | --- | --- |
| 1 | The UAE set an objective to transition 50% of government services and operations to agentic AI within two years. | UAE Cabinet announcement, `uaecabinet.ae` (URL in brief) | 23 Apr 2026 | **Verified via the 18 May Cabinet read-out**, which restates the 50%/two-year objective. The primary URL returns a Cloudflare 403 to automated fetches from this network; the URL is cited for the reader. | Home `#why-now`; insights; government page |
| 2 | The Cabinet approved a federal framework, a first package of services across four categories, and a programme to train 80,000 federal employees. | Government of Dubai Media Office, `mediaoffice.ae` | 18 May 2026 | **Verified.** Page fetched and read. Categories: Citizens', Residents', Business Sector, General Public. Five occupational categories. Implementation teams headed by the Minister/Head of entity. | Home `#why-now`; insights; government page |
| 3 | Stargate UAE is a planned 1 GW cluster within a 5 GW UAE–US AI campus; first 200 MW expected in 2026. | G42 announcement, `g42.ai` | 22 May 2025 | **Verified.** Page fetched and read. Wording keeps "planned" and "expected"; not described as operational. | Home `#why-now`; insights; sovereign page |
| 4 | Stargate UAE partners are G42, OpenAI, Oracle, NVIDIA, SoftBank Group and Cisco. | G42 announcement | 22 May 2025 | **Verified.** Used only as market context; no DLI relationship implied. | Insights |
| 5 | MGX Fund I final close at $49bn, above its $45bn target, on 1 July 2026; 14 portfolio companies at close. | MGX news release, `mgx.ae` | 1 Jul 2026 | **Verified.** Page fetched and read. Explicitly noted as an investment vehicle, not a procurement budget. | Home `#why-now`; insights |
| 6 | UAE PDPL and sector data-protection rules differ; obligations must be confirmed per processing activity. | UAE data protection portal, `u.ae` | Accessed 5 Nov 2026 | **Verified as an official reference.** The page is linked but no specific legal conclusion is drawn from it. | Sovereign page; insights |
| 7 | A purported 2026 blanket UAE rule requiring all personal-data-derived model weights to reside in-country. | None located | — | **NOT VERIFIED. Deliberately not used as a fact.** The sovereign page names it only to retire it. | Sovereign page (myth-check callout) |
| 8 | UAE Agentic AI Application Lab for Government Services announced 22 Oct 2026, reported by WAM 30 Oct 2026. | WAM URL in the brief | 30 Oct 2026 | **Not used.** The WAM page did not return machine-readable article text from this network, so no sentence depends on it. Add only after a human opens the article and confirms the date. | None |
| 9 | DLI services, method, ventures and Experience Lab status labels. | Existing site source and product URLs | Pre-existing | **Company-supplied.** Status labels retained (Live Demo / Interactive Preview / Prototype / Coming Soon). No client deployment implied. | Home |
| 10 | Saudi Arabia's National Strategy for Data & AI targets the Kingdom among the top 15 countries in AI by 2030. | SDAIA, National Strategy for Data & AI | 2020 | **Verified.** Strategy page and published strategy PDF describe the top-15 ambition. | GCC home pack |
| 11 | Qatar launched its National AI Strategy in 2019, Digital Agenda 2030 in 2024, and formed Qai in 2025 through a $20bn QIA–Brookfield partnership. | US International Trade Administration, Qatar AI market intelligence | 2 Jul 2026 | **Verified.** Page fetched and read. | GCC home pack |
| 12 | The White House released America's AI Action Plan on 23 July 2025, with more than 100 recommended actions. | White House release | 23 Jul 2025 | **Verified.** Release page and plan PDF. | US home pack |
| 13 | The Stargate Project announced a $500bn, four-year investment in US AI infrastructure. | OpenAI announcement | 21 Jan 2025 | **Verified.** Page fetched and read. | US home pack |
| 14 | US private AI investment reached $285.9bn in 2025; China recorded $12.4bn. | Stanford HAI, AI Index 2026 | 2026 | **Verified.** 2026 AI Index economy/top-takeaways page. | US home pack |
| 15 | The EU AI Act entered into force on 1 Aug 2024; GPAI obligations applied 2 Aug 2025; general application 2 Aug 2026. | European Commission, AI Act policy page | Accessed 5 Nov 2026 | **Verified.** Official application timeline. | Global home pack |
| 16 | The Council of Europe Framework Convention on AI opened for signature on 5 Sep 2024. | Council of Europe | 5 Sep 2024 | **Verified.** Treaty page. | Global home pack |
| 17 | The OECD AI Principles were adopted in 2019, updated in 2024, and have 47 adherents. | OECD.AI | Accessed 5 Nov 2026 | **Verified.** OECD AI Principles page and 2024 update release. | Global home pack |

## Explicitly absent (do not add without evidence)

- SOC 2, ISO 27001, ISO 42001 or any accreditation.
- Government partnership, approval, endorsement or procurement status.
- Client names, logos, case studies or outcome metrics.
- Founder performance metrics or prior-employer claims beyond "engineering leadership,
  described within confidentiality limits".
- Guaranteed residency, cross-border prohibition, zero leakage, deterministic output or
  guaranteed returns.
- Fixed delivery timelines for complex mandates, or public pricing.
- Any implication that MGX, G42, OpenAI, Oracle, NVIDIA, SoftBank or Cisco is a DLI partner.

## Review status

- Automated source check: complete (see table).
- Founder/legal review before external promotion: **pending**. The text is written to be
  defensible without that review, but the founder should still read `#why-now`, the
  government page and the sovereign page before paid distribution.
- Arabic translation: not machine-translated. RTL and localization foundations are
  documented in `docs/localization.md`; reviewed translation is required before an `/ar/`
  route is published.

## Dynamic home-page cards — 120-day rule

Implemented 5 November 2026. Every signal in `site/assets/regions.js` carries a
`publishedAt` date, and `filterSignals()` removes anything older than **120 days** at
render time. If every card for a region ages out, the page shows a refresh card linking to
`/insights/` rather than stale news.

Current home-page cards (as of 5 November 2026):

| Region | Signal | Source | Date |
| --- | --- | --- | --- |
| UAE | Agentic AI Application Lab for Government Services | WAM | 30 Oct 2026 |
| UAE | Control-tower operating model for the 50% mandate | Dark Reading | 22 Oct 2026 |
| UAE | AIP/MGX/GIP close the ~$40bn Aligned Data Centers acquisition | Aligned Data Centers | 21 Jul 2026 |
| GCC | UAE Agentic AI Application Lab | WAM | 30 Oct 2026 |
| GCC | HUMAIN plans a $2.5bn fund for 250 MW of Saudi data-center capacity | Bloomberg | 3 Sep 2026 |
| GCC | Scale AI expands its long-term presence in Qatar | The Peninsula | 29 Oct 2026 |
| US | Executive Order 14434 and the White House Accord on Super Intelligence | White House | 29 Sep 2026 |
| US | Databricks closes $5bn at a $190bn valuation | Databricks | 13 Aug 2026 |
| Global | EU AI Act becomes generally applicable | European Commission | 2 Aug 2026 |
| Global | UN Global Dialogue on AI Governance publishes its Co-Chairs' Summary | UN | Sep 2026 |

The older rows in the claim register above remain useful archive context for long-form
pages, but they are **not rendered** in the dynamic home-page cards. Stargate UAE (22 May
2025), the MGX Fund I close (1 Jul 2026) and the original AI Action Plan (23 Jul 2025) were
removed from the landing page for exceeding the 120-day window.
