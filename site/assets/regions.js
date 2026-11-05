/* ==========================================================================
   DLI regional copy packs
   Four packs, one page, one canonical URL. The region is resolved from
   Cloudflare's country header by the Worker at /region.js, then overridable
   with ?region=ae|gcc|us|global or the footer selector.
   ========================================================================== */
(function (root) {
  "use strict";

  var REGIONS = {
    ae: {
      id: "ae",
      label: "United Arab Emirates",
      short: "UAE",
      heroSupport: "We architect, deploy and operate mission-critical AI systems for governments, institutional investors and enterprises — turning strategic mandates into secure, governed, measurable capabilities.",
      heroMicro: "Independent · Vendor-neutral · UAE · GCC · International",
      whyEyebrow: "UAE & GCC · Why now",
      whyTitle: "The mandate is here. Delivery is the constraint.",
      whyIntro: "Three signals define the current window: a national agentic-AI mandate, sovereign compute being built, and institutional capital moving into AI operating infrastructure. Each one raises the same question — who can turn it into a governed operating capability?",
      whyNote: "These references are market context, not endorsements. DLI is not a government partner, holds no regulatory approvals, and is not an MGX portfolio company. The MGX fund is an investment vehicle, not a procurement budget available to DLI.",
      whyFooter: "Sources and dates are listed with each signal. Every page that cites a public claim carries a review date and links to the primary source.",
      pathwayOrder: ["government", "enterprise", "capital"],
      signals: [
        {
          tag: "01 · AGENTIC GOVERNMENT",
          badge: "APR–MAY 2026",
          title: "From ambition to a federal implementation framework.",
          lead: "In April 2026 the UAE set an objective to transition 50% of government services and operations to agentic AI within two years.",
          body: "On 18 May 2026 the Cabinet approved a federal framework, a first package of services across four categories, and a programme to train 80,000 federal employees.",
          delivers: "Service-journey discovery, identity and consent design, exception and appeal paths, Arabic/English evaluation, and procurement-ready decision artifacts.",
          sources: [
            { label: "UAE Cabinet, 23 Apr 2026", url: "https://uaecabinet.ae/en/news/under-directives-of-uae-president-and-in-world-first-mohammed-bin-rashid-reveals-new-uae-government-framework-to-deploy-agentic-ai-across-50-of-government-sectors-operations-within-two-years" },
            { label: "Government of Dubai Media Office, 18 May 2026", url: "https://www.mediaoffice.ae/en/news/2026/may/18-05/mohammed-bin-rashid-chairs-uae-cabinet-meeting" }
          ]
        },
        {
          tag: "02 · SOVEREIGN COMPUTE",
          badge: "PLANNED",
          title: "Capacity is being built. Portability still matters.",
          lead: "Stargate UAE is announced as a 1 GW cluster within a 5 GW UAE–US AI campus, with the first 200 MW expected to come online in 2026.",
          body: "It is planned infrastructure, not an operational claim. More capacity changes the build/buy calculus; it does not remove the need for cost, latency and exit discipline.",
          delivers: "Deployment options across in-country, regional and global environments; model routing and fallback; unit-economics modelling; vendor-portability reviews.",
          sources: [
            { label: "G42, 22 May 2025", url: "https://www.g42.ai/resources/news/global-tech-alliance-launches-stargate-uae" }
          ]
        },
        {
          tag: "03 · INSTITUTIONAL CAPITAL",
          badge: "1 JUL 2026",
          title: "The question moves from models to operating models.",
          lead: "MGX confirmed the final close of Fund I at $49 billion in total commitments on 1 July 2026, above its $45 billion target.",
          body: "For institutional investors, diligence now has to cover data control, compute economics, management ownership and the path from capex to operating value — not only model capability.",
          delivers: "AI diligence frameworks, portfolio-intelligence architecture, data-control reviews and operating-value plans.",
          sources: [
            { label: "MGX, 1 Jul 2026", url: "https://www.mgx.ae/news-insights/mgx-pleased-confirm-final-close-mgx-fund-i-49-billion-total-commitments-significantly" }
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
      whyIntro: "Three GCC signals define the current window: national data and AI strategies, a new wave of AI infrastructure and capital, and the UAE’s agentic government mandate. Each raises the same question — who can turn strategy into a governed operating capability?",
      whyNote: "These references are market context, not endorsements. DLI is not a government partner, holds no regulatory approvals, and is not an investor in the entities named.",
      whyFooter: "Sources and dates are listed with each signal. Regional strategies differ by entity, sector and procurement route; the delivery questions are shared.",
      pathwayOrder: ["government", "enterprise", "capital"],
      signals: [
        {
          tag: "01 · SAUDI ARABIA",
          badge: "2020 · VISION 2030",
          title: "A national strategy with a 2030 target.",
          lead: "Saudi Arabia’s National Strategy for Data & AI, developed by SDAIA, targets the Kingdom among the top 15 countries in AI by 2030.",
          body: "The strategy sits under Vision 2030 and covers skills, open data, legislation and sector adoption. For entities, the delivery question is which service or operating workflow proves the model first.",
          delivers: "Service and workflow discovery, governance, Arabic/English evaluation, and procurement-ready artifacts.",
          sources: [
            { label: "SDAIA · National Strategy for Data & AI", url: "https://sdaia.gov.sa/en/SDAIA/SdaiaStrategies/Pages/NationalStrategyForDataAndAI.aspx" }
          ]
        },
        {
          tag: "02 · QATAR",
          badge: "2019 · 2024 · 2025",
          title: "Strategy, digital agenda, and a national AI company.",
          lead: "Qatar launched its National AI Strategy in 2019, published Digital Agenda 2030 in 2024, and in 2025 formed Qai through a $20 billion QIA–Brookfield partnership.",
          body: "The sequence shows a shift from strategy to operating infrastructure. The constraint is integrating that capability into services, with data control and measurable outcomes.",
          delivers: "Architecture options, data-flow and residency mapping, evaluation and managed operations.",
          sources: [
            { label: "US ITA, 2 Jul 2026", url: "https://www.trade.gov/market-intelligence/qatar-artificial-intelligence-ai-and-technology-developments" }
          ]
        },
        {
          tag: "03 · UAE",
          badge: "APR–MAY 2026",
          title: "The agentic mandate is now an implementation framework.",
          lead: "The UAE set an objective to move 50% of government services and operations to agentic AI within two years.",
          body: "In May 2026 the Cabinet approved a federal framework, a first package of services and a programme to train 80,000 federal employees. The GCC now has a live reference for governed agentic delivery.",
          delivers: "Service-journey discovery, identity and consent design, human approvals and assurance evidence.",
          sources: [
            { label: "UAE Cabinet, 23 Apr 2026", url: "https://uaecabinet.ae/en/news/under-directives-of-uae-president-and-in-world-first-mohammed-bin-rashid-reveals-new-uae-government-framework-to-deploy-agentic-ai-across-50-of-government-sectors-operations-within-two-years" },
            { label: "Dubai Media Office, 18 May 2026", url: "https://www.mediaoffice.ae/en/news/2026/may/18-05/mohammed-bin-rashid-chairs-uae-cabinet-meeting" }
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
      whyIntro: "US AI policy, compute investment and private capital are scaling faster than most operating models can absorb. The constraint is no longer access to a model; it is integration, evidence and accountable operation.",
      whyNote: "These references are market context, not endorsements. DLI is not a US government contractor, does not hold federal approvals, and is not an investor in the companies named.",
      whyFooter: "Policy and capital signals are national; the operating questions are per workflow and per institution.",
      pathwayOrder: ["enterprise", "government", "capital"],
      signals: [
        {
          tag: "01 · FEDERAL POLICY",
          badge: "23 JUL 2025",
          title: "A federal action plan, not a single programme.",
          lead: "The White House released America’s AI Action Plan on 23 July 2025.",
          body: "It sets out more than 100 recommended actions across innovation, infrastructure, and diplomacy and security. For enterprise and agency leaders, the practical question is how to turn policy direction into governed deployments.",
          delivers: "AI architecture, procurement-ready artifacts, evaluation and assurance.",
          sources: [
            { label: "White House, 23 Jul 2025", url: "https://www.whitehouse.gov/releases/2025/07/white-house-unveils-americas-ai-action-plan/" }
          ]
        },
        {
          tag: "02 · COMPUTE",
          badge: "21 JAN 2025",
          title: "Private compute is being built at national scale.",
          lead: "The Stargate Project announced a $500 billion, four-year investment in US AI infrastructure.",
          body: "Planned capacity changes the build/buy calculus; it does not remove the need for portability, cost visibility and an exit plan.",
          delivers: "Deployment options, model routing, unit economics and vendor-portability reviews.",
          sources: [
            { label: "OpenAI, 21 Jan 2025", url: "https://openai.com/index/announcing-the-stargate-project/" }
          ]
        },
        {
          tag: "03 · PRIVATE CAPITAL",
          badge: "AI INDEX 2026",
          title: "The investment lead is widening.",
          lead: "US private AI investment reached $285.9 billion in 2025.",
          body: "Stanford HAI’s AI Index 2026 puts that more than 23 times the $12.4 billion recorded in China. For operators, the question is which workflows convert capital into measurable operating value.",
          delivers: "AI diligence, portfolio intelligence and operating-value plans.",
          sources: [
            { label: "Stanford HAI, AI Index 2026", url: "https://hai.stanford.edu/ai-index/2026-ai-index-report" }
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
      whyIntro: "Three governance signals define the global window: the EU AI Act’s phased obligations, the first international AI treaty, and the OECD principles now endorsed by 47 jurisdictions. Each raises the same question — who can turn principle into evidence?",
      whyNote: "These references are market context, not legal advice or an endorsement. DLI does not provide legal opinions or certify compliance; obligations are confirmed with your counsel and the relevant authority.",
      whyFooter: "Regulatory scope differs by jurisdiction and activity. We design for evidence and portability, not for a single legal regime.",
      pathwayOrder: ["enterprise", "government", "capital"],
      signals: [
        {
          tag: "01 · EUROPEAN UNION",
          badge: "2024–2026",
          title: "A phased, risk-based regime is now applicable.",
          lead: "The EU AI Act entered into force on 1 August 2024.",
          body: "General-purpose AI obligations applied from 2 August 2025 and the Act became generally applicable from 2 August 2026. Providers and deployers need evidence, not just policy statements.",
          delivers: "AI system inventory, risk-classification inputs, evaluation evidence, logging and change control. We do not provide legal advice.",
          sources: [
            { label: "European Commission · AI Act", url: "https://digital-strategy.ec.europa.eu/en/policies/regulatory-framework-ai" }
          ]
        },
        {
          tag: "02 · INTERNATIONAL",
          badge: "5 SEP 2024",
          title: "The first legally binding AI treaty.",
          lead: "The Council of Europe Framework Convention on AI opened for signature on 5 September 2024.",
          body: "It covers the lifecycle of AI systems against human rights, democracy and the rule of law, and is a global reference point for cross-border assurance.",
          delivers: "Human-rights-aware design reviews, approval and escalation paths, and auditability.",
          sources: [
            { label: "Council of Europe", url: "https://www.coe.int/en/web/artificial-intelligence/the-framework-convention-on-artificial-intelligence" }
          ]
        },
        {
          tag: "03 · POLICY CONVERGENCE",
          badge: "2019 · UPDATED 2024",
          title: "47 jurisdictions, one set of principles.",
          lead: "The OECD AI Principles were adopted in 2019 and updated in 2024.",
          body: "They now have 47 adherents, including the EU. They are a common reference for trustworthy AI, but they are principles, not a certificate.",
          delivers: "Governance-by-design, evaluation, transparency and accountability artifacts.",
          sources: [
            { label: "OECD AI Principles", url: "https://oecd.ai/en/ai-principles" }
          ]
        }
      ]
    }
  };

  var api = { REGIONS: REGIONS, allowed: ["ae", "gcc", "us", "global"] };
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  if (root) root.DLI_REGIONS = REGIONS;
})(typeof window !== "undefined" ? window : null);
