/* ==========================================================================
   DLI institutional readiness assessment
   Pure data + scoring. No DOM, no network, no storage.
   Loaded before the Design Component runtime and unit-tested with Node.
   ========================================================================== */
(function (root) {
  "use strict";

  var SEGMENTS = [
    {
      id: "government",
      label: "Government & public sector",
      short: "Government",
      headline: "From national AI mandates to governed public services.",
      problem: "You are accountable for a service outcome, a governance position and a procurement trail — not a demo.",
      outcomes: [
        "One service journey redesigned around the resident, not the org chart",
        "Identity, consent, exception and appeal paths designed before build",
        "Arabic and English service quality tested with real case types",
        "Procurement-ready architecture and decision artifacts"
      ],
      governance: "Accessibility, information governance and human decision rights are treated as design inputs.",
      cta: "Assess Government AI Readiness",
      plan: [
        "Decision sprint (2 weeks): name the service owner, baseline the journey, map identity/consent/exception paths and produce a procurement-ready opportunity brief.",
        "First governed service (6–12 weeks, scoped): one journey, shadow mode, Arabic/English evaluation set, human approval where rights or eligibility are affected.",
        "Operate and extend: monthly outcome reporting, change control, then a second journey only when the first is stable."
      ]
    },
    {
      id: "enterprise",
      label: "Enterprise & regulated operations",
      short: "Enterprise",
      headline: "Move beyond pilots. Own the operating advantage.",
      problem: "You have experiments, but the workflow, unit economics and control story are not yet production-grade.",
      outcomes: [
        "One P&L-owned workflow with a measured baseline",
        "Integration with the systems where work actually happens",
        "Bounded actions, approvals and tested rollback",
        "Cost, latency and model-spend visibility"
      ],
      governance: "Controls mirror existing roles; every action is attributable and reviewable.",
      cta: "Assess Enterprise Deployment Readiness",
      plan: [
        "Decision sprint (2 weeks): choose one workflow, agree the baseline, map integrations and failure paths, size the unit economics.",
        "First governed deployment (6–12 weeks, scoped): build in your environment, evaluate on historical and synthetic cases, run shadow mode before action.",
        "Operate and scale: managed operations or handover, with monthly outcome and cost reporting."
      ]
    },
    {
      id: "capital",
      label: "Sovereign capital & family offices",
      short: "Sovereign capital",
      headline: "Turn intelligence infrastructure into investment advantage.",
      problem: "You need diligence on AI operating models, portfolio-level data control and a credible path from capex to operating value.",
      outcomes: [
        "AI diligence questions that separate capability from theatre",
        "Portfolio intelligence without surrendering data control",
        "Compute, model and vendor economics translated into operating plans",
        "Governance and management ownership defined before capital is committed"
      ],
      governance: "Selective, jurisdiction-reviewed architecture. DLI does not present tokenisation or any structure as automatically desirable or legally ready.",
      cta: "Review Institutional AI Architecture",
      plan: [
        "Architecture review (2 weeks): map the investment thesis, data-control constraints, operating model and decision rights across the portfolio.",
        "Portfolio pilot (6–12 weeks, scoped): one operating workflow or diligence process, with a measured baseline and a clear stop rule.",
        "Operating cadence: quarterly value and risk review; build only where the operating evidence supports it."
      ]
    }
  ];

  var BASE_QUESTIONS = [
    {
      id: "data",
      dim: "Data & classification",
      q: "How well understood is the data the system would use?",
      why: "Data classification determines access, residency, logging and what can be evaluated.",
      opts: [
        { label: "Classified, with owners and documented access rules", score: 3 },
        { label: "Mostly known, but permissions are inconsistent", score: 2 },
        { label: "Mixed or unclassified sources", score: 1 },
        { label: "We do not know yet", score: 0 }
      ]
    },
    {
      id: "hosting",
      dim: "Deployment & residency",
      q: "What is your current position on where the system runs?",
      why: "Residency is one variable among latency, cost, resilience, vendor portability and the obligations attached to each processing activity.",
      opts: [
        { label: "In-country or in-region today, with a documented position", score: 3 },
        { label: "Hybrid, with a residency review under way", score: 2 },
        { label: "Global cloud, residency not yet reviewed", score: 1 },
        { label: "No position yet", score: 0 }
      ]
    },
    {
      id: "autonomy",
      dim: "Action boundaries",
      q: "What level of autonomous action is on the table?",
      why: "The safe unit is not 'an agent'; it is a specific action with an owner, a permission and a reversal path.",
      opts: [
        { label: "Draft-only, with a person approving any action", score: 3 },
        { label: "Bounded actions, with limits, approvals and rollback", score: 3 },
        { label: "Read-only insight for now", score: 2 },
        { label: "Fully autonomous, no human approval defined", score: 1 },
        { label: "Not decided", score: 0 }
      ]
    },
    {
      id: "integration",
      dim: "Integration & exceptions",
      q: "How accessible are the core systems this would touch?",
      why: "Most failures live in permissions, exception paths and the queue where work actually happens.",
      opts: [
        { label: "Documented APIs, test environments and named system owners", score: 3 },
        { label: "Partial API access; some manual steps", score: 2 },
        { label: "Legacy or screen-based systems; access unclear", score: 1 },
        { label: "Not mapped yet", score: 0 }
      ]
    },
    {
      id: "controls",
      dim: "Evaluation & controls",
      q: "What exists today for evaluation, logging and change control?",
      why: "LLM output is probabilistic. Tool actions can be bounded, permissioned and tested; the control evidence has to exist before production.",
      opts: [
        { label: "Evaluation sets, audit logs and release gates in place", score: 3 },
        { label: "Some logging and review, but ad hoc", score: 2 },
        { label: "Early or project-specific controls", score: 1 },
        { label: "Nothing defined for AI systems yet", score: 0 }
      ]
    },
    {
      id: "baseline",
      dim: "Outcome baseline",
      q: "How will you know the change worked?",
      why: "Without a baseline and an owner, a deployment cannot be evaluated against anything except opinion.",
      opts: [
        { label: "Measured baseline, named owner and acceptance criteria", score: 3 },
        { label: "A baseline exists, but ownership is shared", score: 2 },
        { label: "Anecdotal or partial measures", score: 1 },
        { label: "No baseline yet", score: 0 }
      ]
    },
    {
      id: "timeframe",
      dim: "Procurement & sequencing",
      q: "Where are you in the decision and procurement process?",
      why: "The right first step differs when budget is approved versus when a business case is still being formed.",
      opts: [
        { label: "Budget route identified and a decision date agreed", score: 3 },
        { label: "Business case in progress; sponsor engaged", score: 2 },
        { label: "Exploring; no decision date", score: 1 },
        { label: "No active timeline", score: 0 }
      ]
    }
  ];

  var MANDATE = {
    government: {
      id: "mandate",
      dim: "Mandate & ownership",
      q: "Who owns the service outcome you want to change?",
      why: "A ministry-wide mandate is not a delivery unit. One accountable service owner is.",
      opts: [
        { label: "A named service owner with an executive sponsor", score: 3 },
        { label: "A transformation programme, but no single service owner", score: 2 },
        { label: "An exploratory mandate", score: 1 },
        { label: "No agreed owner yet", score: 0 }
      ]
    },
    enterprise: {
      id: "mandate",
      dim: "Mandate & ownership",
      q: "Who owns the workflow outcome you want to change?",
      why: "A pilot without a P&L owner rarely survives the first operating review.",
      opts: [
        { label: "A P&L owner with an executive sponsor", score: 3 },
        { label: "A function or transformation team, without P&L ownership", score: 2 },
        { label: "An innovation or exploration mandate", score: 1 },
        { label: "No agreed owner yet", score: 0 }
      ]
    },
    capital: {
      id: "mandate",
      dim: "Mandate & ownership",
      q: "Who owns the investment or operating decision?",
      why: "AI diligence is only useful if it maps to an investment committee decision and an operating owner.",
      opts: [
        { label: "An investment or operating partner with a defined mandate", score: 3 },
        { label: "A portfolio company leadership team, with sponsor oversight", score: 2 },
        { label: "Exploratory thesis work", score: 1 },
        { label: "No agreed owner yet", score: 0 }
      ]
    }
  };

  function questions(segment) {
    var first = MANDATE[segment] || MANDATE.enterprise;
    return [first].concat(BASE_QUESTIONS);
  }

  function segment(id) {
    for (var i = 0; i < SEGMENTS.length; i++) if (SEGMENTS[i].id === id) return SEGMENTS[i];
    return SEGMENTS[1];
  }

  function score(answers) {
    answers = answers || {};
    var dims = [];
    for (var i = 0; i < BASE_QUESTIONS.length; i++) {
      var q = BASE_QUESTIONS[i];
      var raw = answers[q.id];
      var value = typeof raw === "number" ? Math.max(0, Math.min(3, raw)) : 0;
      dims.push({ id: q.id, label: q.dim, value: value, max: 3, pct: Math.round((value / 3) * 100) });
    }
    var mandateRaw = answers.mandate;
    var mandate = typeof mandateRaw === "number" ? Math.max(0, Math.min(3, mandateRaw)) : 0;
    dims.unshift({ id: "mandate", label: "Mandate & ownership", value: mandate, max: 3, pct: Math.round((mandate / 3) * 100) });
    var total = 0;
    for (var j = 0; j < dims.length; j++) total += dims[j].value;
    var avg = total / dims.length;
    var band;
    if (avg < 1.3) band = { key: "early", label: "Early", note: "Foundations need to be established before a build." };
    else if (avg < 2.1) band = { key: "forming", label: "Forming", note: "A first scoped workflow is viable if ownership and controls are tightened." };
    else if (avg < 2.7) band = { key: "operational", label: "Operational", note: "Ready for a governed first deployment; focus on evidence and scale." };
    else band = { key: "advanced", label: "Advanced", note: "Ready to scale across workflows; focus on assurance and unit economics." };
    return { dims: dims, avg: Math.round(avg * 100) / 100, band: band, answered: Object.keys(answers).length };
  }

  var GAP_COPY = {
    mandate: {
      title: "Name one accountable owner and one workflow",
      why: "Shared ownership is the most common reason a pilot never reaches operations.",
      next: "Agree the accountable executive, the service or workflow owner and the first bounded workflow. Put all three in the opportunity brief.",
      artifact: "Opportunity brief with owner, baseline and stop rule"
    },
    data: {
      title: "Classify data before connecting it",
      why: "Access, residency and evaluation all depend on what the data is and who owns it.",
      next: "Classify each source per processing activity, map permissions and identify what must not enter a public form or a shared model context.",
      artifact: "Data-flow and residency map"
    },
    hosting: {
      title: "Document the deployment and residency position",
      why: "Residency is not a single national rule; obligations differ by activity, sector, entity and jurisdiction.",
      next: "Write down the requirements per processing activity, then compare in-country, regional and global options on control, latency, cost and portability.",
      artifact: "Deployment options and residency note"
    },
    autonomy: {
      title: "Bound the actions before scaling autonomy",
      why: "An agent without a permission boundary is an unowned risk.",
      next: "Define draft-only versus execute actions, who approves irreversible steps, and how rollback works. Deny anything without an owner.",
      artifact: "Tool permission and approval matrix"
    },
    integration: {
      title: "Map systems, exceptions and manual fallbacks",
      why: "The demo works on clean data; the operation fails on the exception path.",
      next: "Map every system, API, test environment and manual step. Design the exception queue and the human handoff before build.",
      artifact: "Integration and exception map"
    },
    controls: {
      title: "Stand up evaluation and change control",
      why: "Probabilistic output needs a test set, an audit trail and a release gate — not a promise of determinism.",
      next: "Build an evaluation set from historical and synthetic cases, define unsafe actions, add logging and require re-evaluation before changes ship.",
      artifact: "Evaluation scorecard and control register"
    },
    baseline: {
      title: "Measure the baseline you intend to move",
      why: "Without a baseline, success becomes a matter of opinion at the first review.",
      next: "Agree 90 days of historical baseline, the acceptance criteria and the owner who signs the result.",
      artifact: "Baseline and acceptance criteria"
    },
    timeframe: {
      title: "Clarify the procurement route and sequencing",
      why: "The right first step depends on whether budget is approved or a business case is still forming.",
      next: "Identify the budget route, decision date and pilot scope. If the route is unclear, start with a paid decision sprint rather than a build.",
      artifact: "Procurement and sequencing plan"
    }
  };

  var RESERVE_GAPS = [
    {
      id: "scale",
      dimension: "Scale readiness",
      severity: "Opportunity",
      title: "Move from a workflow to an operating capability",
      why: "The foundations are in place; the next risk is scaling without evidence or cost discipline.",
      next: "Select a second workflow only after the first has a monthly outcome report, a stable evaluation set and a named operator.",
      artifact: "Operating review and scale plan"
    },
    {
      id: "economics",
      dimension: "Unit economics",
      severity: "Opportunity",
      title: "Make cost and model spend visible per workflow",
      why: "A working system can still fail an operating review if cost per case is invisible or unbounded.",
      next: "Instrument usage, set a per-workflow envelope and review cost per resolved request alongside quality.",
      artifact: "Unit-economics model and cost review"
    },
    {
      id: "assurance",
      dimension: "Assurance cadence",
      severity: "Opportunity",
      title: "Turn evaluation into a standing control",
      why: "A one-off evaluation decays as data, models and processes change.",
      next: "Schedule re-evaluation on material change, keep a release decision log and review failures monthly with the owner.",
      artifact: "Evaluation calendar and decision log"
    }
  ];

  function gaps(answers) {
    var s = score(answers);
    var ranked = s.dims.slice().sort(function (a, b) {
      if (a.value !== b.value) return a.value - b.value;
      return a.label < b.label ? -1 : 1;
    });
    var out = [];
    for (var i = 0; i < ranked.length && out.length < 5; i++) {
      var d = ranked[i];
      if (d.value >= 3) continue;
      var copy = GAP_COPY[d.id];
      if (!copy) continue;
      out.push({
        id: d.id,
        dimension: d.label,
        value: d.value,
        severity: d.value <= 1 ? "High" : "Medium",
        title: copy.title,
        why: copy.why,
        next: copy.next,
        artifact: copy.artifact
      });
    }
    for (var r = 0; r < RESERVE_GAPS.length && out.length < 3; r++) {
      var reserve = RESERVE_GAPS[r];
      var exists = false;
      for (var k = 0; k < out.length; k++) if (out[k].id === reserve.id) exists = true;
      if (!exists) out.push(Object.assign({ value: 3 }, reserve));
    }
    return out.slice(0, 5);
  }

  function summary(answers, segmentId) {
    var s = score(answers);
    var g = gaps(answers);
    var seg = segment(segmentId);
    return {
      segment: seg.id,
      segmentLabel: seg.label,
      profile: s.band.label,
      profileNote: s.band.note,
      average: s.avg,
      dimensions: s.dims,
      gaps: g,
      nextSteps: seg.plan
    };
  }

  var api = {
    SEGMENTS: SEGMENTS,
    questions: questions,
    segment: segment,
    score: score,
    gaps: gaps,
    summary: summary
  };

  if (typeof module !== "undefined" && module.exports) module.exports = api;
  if (root) root.DLI_ASSESSMENT = api;
})(typeof window !== "undefined" ? window : null);
