/* ==========================================================================
   DLI regional copy packs
   Four packs, one page, one canonical URL. The region is resolved from
   Cloudflare's country header by the Worker at /region.js, then overridable
   with ?region=ae|gcc|us|global or the footer selector.
   Dynamic news cards are limited to 120 days at render time.
   ========================================================================== */
(function (root) {
  "use strict";

  var MAX_AGE_DAYS = 120;
  var DAY = 24 * 60 * 60 * 1000;

  function filterSignals(signals, now) {
    var cutoff = (now || Date.now()) - MAX_AGE_DAYS * DAY;
    return (signals || []).filter(function (s) {
      var t = Date.parse(s && s.publishedAt);
      return Number.isFinite(t) && t >= cutoff;
    });
  }

  var REGIONS = {
    ae: {
      id: "ae",
      label: "United Arab Emirates",
      short: "UAE",
      heroSupport: "We architect, deploy and operate mission-critical AI systems for governments, institutional investors and enterprises — turning strategic mandates into secure, governed, measurable capabilities.",
      heroMicro: "Independent · Vendor-neutral · UAE · GCC · International",
      whyEyebrow: "UAE & GCC · Why now",
      whyTitle: "The mandate is here. Delivery is the constraint.",
      whyIntro: "Recent signals define the current window: a live agentic-government lab, a control-tower model for the 50% mandate, and a frontier-model energy partnership. Each raises the same question — who can turn it into a governed operating capability?",
      whyNote: "These references are market context, not endorsements. DLI is not a government partner, holds no regulatory approvals, and is not an investor in the entities named.",
      whyFooter: "Only signals published in the last 120 days are shown. Sources and dates are listed with each card; older context lives in the sourced archive.",
      pathwayOrder: ["government", "enterprise", "capital"],
      signals: [
        {
          tag: "01 · AGENTIC GOVERNMENT",
          badge: "30 OCT 2026",
          publishedAt: "2026-10-30",
          title: "A live lab for agentic government services.",
          lead: "On 22 October 2026 the UAE Government launched the Agentic AI Application Lab for Government Services.",
          body: "The lab gives ministries and government entities a working environment to design, test and scale agentic services against the 50% mandate, with service owners and governance teams in the room.",
          delivers: "Service-journey discovery, identity and consent design, exception and appeal paths, Arabic/English evaluation, and procurement-ready artifacts.",
          sources: [
            { label: "WAM, 30 Oct 2026", url: "https://www.wam.ae/en/article/17i0i1c-uae-harnesses-deliver-proactive-autonomous" }
          ]
        },
        {
          tag: "02 · OPERATING MODEL",
          badge: "22 OCT 2026",
          publishedAt: "2026-10-22",
          title: "The 50% target now has a control tower.",
          lead: "The UAE is operating the agentic transition with a control-tower agent, human and agent audits, and monitoring for trust.",
          body: "That shifts the delivery question from pilots to operating evidence: which actions are bounded, who approves them, and what is logged when an agent is wrong.",
          delivers: "Bounded tool permissions, human approvals, audit trails and release gates.",
          sources: [
            { label: "Dark Reading, 22 Oct 2026", url: "https://www.darkreading.com/cybersecurity-operations/uae-transitions-50-government-services-agentic-ai" }
          ]
        },
        {
          tag: "03 · ENERGY × AI",
          badge: "2 NOV 2026",
          publishedAt: "2026-11-02",
          title: "Energy, compute and frontier models are being contracted together.",
          lead: "ADNOC, G42 and OpenAI signed an agreement on 2 November 2026 to deploy OpenAI’s frontier technology across ADNOC’s operations.",
          body: "The deal was announced at ADIPEC as Sam Altman met Abu Dhabi Crown Prince Sheikh Khaled bin Mohamed bin Zayed Al Nahyan. OpenAI also signed arrangements with Mubadala and G42 unit Inception42 for investment analysis, opportunity identification and risk assessment. ADNOC said it is the first energy company to deploy OpenAI’s frontier technology.",
          delivers: "Operating-model design, integration, data-flow and residency mapping, evaluation and human approvals for high-consequence workflows.",
          sources: [
            { label: "Reuters, 2 Nov 2026", url: "https://www.reuters.com/business/energy/abu-dhabis-adnoc-g42-sign-deal-with-openai-sam-altman-travels-uae-2026-11-02/" },
            { label: "CNBC, 2 Nov 2026", url: "https://www.cnbc.com/2026/11/02/openai-abu-dhabi-ai-deals.html" }
          ]
        }
      ]
    },

    gcc: {
      id: "gcc",
      label: "GCC",
      short: "GCC",
      heroSupport: "We architect, deploy and operate mission-critical AI systems for governments, institutional investors and enterprises across the GCC — turning national strategies into secure, governed, measurable capabilities.",
      heroMicro: "Independent · Vendor-neutral · GCC · International",
      whyEyebrow: "GCC · Why now",
      whyTitle: "The region is investing. Delivery is the constraint.",
      whyIntro: "Recent GCC signals show the shift from strategy to operating infrastructure: a UAE energy–AI partnership, Saudi compute capital, and Qatar’s expanding AI partnership. Each raises the same question — who can turn it into a governed operating capability?",
      whyNote: "These references are market context, not endorsements. DLI is not a government partner, holds no regulatory approvals, and is not an investor in the entities named.",
      whyFooter: "Only signals published in the last 120 days are shown. Regional strategies differ by entity, sector and procurement route; the delivery questions are shared.",
      pathwayOrder: ["government", "enterprise", "capital"],
      signals: [
        {
          tag: "01 · UAE × ENERGY",
          badge: "2 NOV 2026",
          publishedAt: "2026-11-02",
          title: "Energy, compute and frontier models are being contracted together.",
          lead: "ADNOC, G42 and OpenAI signed an agreement on 2 November 2026 to deploy OpenAI’s frontier technology across ADNOC’s operations.",
          body: "The deal was announced at ADIPEC as Sam Altman met Abu Dhabi Crown Prince Sheikh Khaled bin Mohamed bin Zayed Al Nahyan. OpenAI also signed arrangements with Mubadala and G42 unit Inception42 for investment analysis, opportunity identification and risk assessment. ADNOC said it is the first energy company to deploy OpenAI’s frontier technology.",
          delivers: "Operating-model design, integration, data-flow and residency mapping, evaluation and human approvals for high-consequence workflows.",
          sources: [
            { label: "Reuters, 2 Nov 2026", url: "https://www.reuters.com/business/energy/abu-dhabis-adnoc-g42-sign-deal-with-openai-sam-altman-travels-uae-2026-11-02/" },
            { label: "CNBC, 2 Nov 2026", url: "https://www.cnbc.com/2026/11/02/openai-abu-dhabi-ai-deals.html" }
          ]
        },
        {
          tag: "02 · SAUDI ARABIA",
          badge: "3 SEP 2026",
          publishedAt: "2026-09-03",
          title: "Compute capital is being raised, not assumed.",
          lead: "HUMAIN is planning an initial $2.5 billion fund to finance 250 MW of data-center capacity in Saudi Arabia.",
          body: "The fund is designed to attract global and domestic investors into AI infrastructure. For entities, the constraint is turning capacity into governed services and measurable operating value.",
          delivers: "Architecture options, data-flow and residency mapping, unit economics.",
          sources: [
            { label: "Bloomberg, 3 Sep 2026", url: "https://www.bloomberg.com/news/articles/2026-09-03/saudi-firm-humain-eyes-2-5-billion-fund-to-build-data-centers" }
          ]
        },
        {
          tag: "03 · QATAR",
          badge: "29 OCT 2026",
          publishedAt: "2026-10-29",
          title: "A longer-term AI presence, not a one-off pilot.",
          lead: "Scale AI signed an agreement with UDC to establish a long-term home at UDC Tower, The Pearl Island, announced 28–29 October 2026.",
          body: "Its Doha team works with MCIT across healthcare, justice, education and higher education. The signal is operating integration, not another strategy document.",
          delivers: "Operating-model design, integration, evaluation and managed operations.",
          sources: [
            { label: "The Peninsula, 29 Oct 2026", url: "https://m.thepeninsulaqatar.com/article/29/10/2026/scale-ai-expands-long-term-presence-in-qatar-with-home-in-udc-tower-at-the-pearl-island" }
          ]
        }
      ]
    },

    us: {
      id: "us",
      label: "United States",
      short: "US",
      heroSupport: "We architect, deploy and operate mission-critical AI systems for enterprises, public institutions and investors across the United States — turning AI capital into secure, governed, measurable operating capability.",
      heroMicro: "Independent · Vendor-neutral · US · International",
      whyEyebrow: "United States · Why now",
      whyTitle: "The capital is moving. Delivery is the constraint.",
      whyIntro: "Recent US signals define the current window: a federal reframing of frontier AI and a $5 billion private-capital round at a $190 billion valuation. The constraint is integration, evidence and accountable operation.",
      whyNote: "These references are market context, not endorsements. DLI is not a US government contractor, does not hold federal approvals, and is not an investor in the companies named.",
      whyFooter: "Only signals published in the last 120 days are shown. Policy and capital signals are national; the operating questions are per workflow and per institution.",
      pathwayOrder: ["enterprise", "government", "capital"],
      signals: [
        {
          tag: "01 · FEDERAL POLICY",
          badge: "29 SEP 2026",
          publishedAt: "2026-09-29",
          title: "Frontier AI gets a new federal frame.",
          lead: "Executive Order 14434, signed 29 September 2026, replaces “artificial intelligence” with “super intelligence” across executive-branch communications.",
          body: "The same day, the White House and six technology leaders signed a voluntary accord on frontier responsibilities and audits. For operators, the practical question is how voluntary commitments become evidence.",
          delivers: "Evaluation evidence, audit trails, approval paths and change control.",
          sources: [
            { label: "White House, 29 Sep 2026", url: "https://www.whitehouse.gov/presidential-actions/2026/09/inaugurating-the-era-of-super-intelligence/" }
          ]
        },
        {
          tag: "02 · PRIVATE CAPITAL",
          badge: "13 AUG 2026",
          publishedAt: "2026-08-13",
          title: "Capital is concentrating at operating scale.",
          lead: "Databricks closed a $5 billion strategic funding round at a $190 billion valuation on 13 August 2026.",
          body: "The round was led by Coatue with Blackstone, MGX, T. Rowe Price and Sixth Street Growth. For operators, the question is which workflows convert capital into measurable operating value.",
          delivers: "AI diligence, unit economics and operating-value plans.",
          sources: [
            { label: "Databricks, 13 Aug 2026", url: "https://www.databricks.com/company/newsroom/press-releases/databricks-grows-80-yoy-surpasses-7b-revenue-run-rate-scales" }
          ]
        }
      ]
    },

    global: {
      id: "global",
      label: "Global",
      short: "Global",
      heroSupport: "We architect, deploy and operate mission-critical AI systems for governments, institutional investors and enterprises worldwide — turning strategic mandates into secure, governed, measurable capabilities.",
      heroMicro: "Independent · Vendor-neutral · International",
      whyEyebrow: "Global · Why now",
      whyTitle: "The rules are forming. Delivery is the constraint.",
      whyIntro: "Recent governance signals define the global window: the EU AI Act’s general application and the UN’s first global AI governance dialogue. Each raises the same question — who can turn principle into evidence?",
      whyNote: "These references are market context, not legal advice or an endorsement. DLI does not provide legal opinions or certify compliance; obligations are confirmed with your counsel and the relevant authority.",
      whyFooter: "Only signals published in the last 120 days are shown. Regulatory scope differs by jurisdiction and activity; we design for evidence and portability, not for a single legal regime.",
      pathwayOrder: ["enterprise", "government", "capital"],
      signals: [
        {
          tag: "01 · EUROPEAN UNION",
          badge: "2 AUG 2026",
          publishedAt: "2026-08-02",
          title: "The EU AI Act is now generally applicable.",
          lead: "The EU AI Act entered into force on 1 August 2024 and became generally applicable on 2 August 2026.",
          body: "General-purpose AI obligations applied from 2 August 2025. Providers and deployers need evidence, not just policy statements.",
          delivers: "AI system inventory, risk-classification inputs, evaluation evidence, logging and change control. We do not provide legal advice.",
          sources: [
            { label: "European Commission · AI Act", url: "https://digital-strategy.ec.europa.eu/en/policies/regulatory-framework-ai" }
          ]
        },
        {
          tag: "02 · UNITED NATIONS",
          badge: "SEP 2026",
          publishedAt: "2026-09-01",
          title: "The first global AI governance dialogue has a summary.",
          lead: "The inaugural UN Global Dialogue on AI Governance met in Geneva on 6–7 July 2026 and published its Co-Chairs’ Summary in September 2026.",
          body: "It is the first UN platform where member states and stakeholders convene on AI governance. The practical question for institutions is how to produce evidence that travels across jurisdictions.",
          delivers: "Governance-by-design, evaluation, transparency and accountability artifacts.",
          sources: [
            { label: "UN Global Dialogue, Sep 2026", url: "https://www.un.org/global-dialogue-ai-governance/en" }
          ]
        }
      ]
    }
  };

  REGIONS.filterSignals = filterSignals;
  REGIONS.MAX_AGE_DAYS = MAX_AGE_DAYS;

  var api = { REGIONS: REGIONS, allowed: ["ae", "gcc", "us", "global"], filterSignals: filterSignals, MAX_AGE_DAYS: MAX_AGE_DAYS };
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  if (root) root.DLI_REGIONS = REGIONS;
})(typeof window !== "undefined" ? window : null);
