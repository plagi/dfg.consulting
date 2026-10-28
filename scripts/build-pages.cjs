/*
 * Builds the homepage and the four expertise pages, and refreshes the shared header,
 * footer and enquiry block on every other page. One registry holds every service name,
 * so a name can only be changed in one place.
 *
 *   npm run build:pages
 *
 * The output is plain static HTML; nothing here runs in production.
 */
const fs = require("node:fs");
const path = require("node:path");

const ROOT = path.join(__dirname, "..");
const SITE = "https://dfg.consulting";
const EMAIL = "hello@dfg.consulting";
const POSITION = "Independent advisory for AI, fintech and cybersecurity.";
const REG =
  "DFG Digital Frontiers FZ-LLC provides independent technology and business advisory services. DFG does not provide regulated financial services, legal opinions, audit opinions or ISO certification.";

/* ---------- registry ---------- */

const DOMAINS = [
  {
    slug: "ai-strategy",
    name: "AI strategy",
    inline: "AI strategy",
    mark: "m-ai",
    tagline: "Investment decisions for AI",
    short:
      "Decide which AI initiatives deserve investment and what a stalled pilot needs.",
    lead: "We help leadership teams decide where AI is worth funding, review pilots that have stalled and check whether the data and systems can support the use case.",
    title: "AI strategy advisory",
    description:
      "Independent AI strategy advice: AI investment assessments, pilot reviews and data readiness reviews for banks, fintechs and technology companies.",
    challenges: [
      [
        "Choose where to invest",
        "Compare candidate use cases on value, feasibility and cost before committing budget.",
      ],
      [
        "Understand a stalled pilot",
        "Find out why a pilot has not reached production and whether more investment would change that.",
      ],
      [
        "Check the data first",
        "Confirm that the data a use case depends on is available, suitable and owned.",
      ],
      [
        "Count the full cost",
        "Include integration, operation and oversight, not only the build.",
      ],
    ],
    services: [
      {
        id: "investment",
        name: "AI investment assessment",
        text: "We review the process you want to improve, compare candidate use cases and examine data, integration and risk requirements. Existing tools and non-AI alternatives are considered alongside build and buy options.",
        receive: [
          "A value case that separates measured inputs from assumptions.",
          "Feasibility and delivery options, with dependencies and cost assumptions.",
          "A recommendation to pursue, test, defer or stop.",
        ],
      },
      {
        id: "pilot-review",
        name: "AI pilot review",
        text: "We start from the pilot’s actual results and the reasons deployment stopped. The review covers success criteria, data and integration constraints, production costs and operating responsibilities.",
        receive: [
          "A findings register linked to the pilot evidence.",
          "Options to continue, change scope or stop.",
          "Where continuation is supported, the dependencies and acceptance criteria for production planning.",
        ],
      },
      {
        id: "data-readiness",
        name: "Data readiness review",
        text: "Scoped to one initiative. We review whether the required datasets are accessible and suitable, how the systems will connect and who owns each dependency.",
        receive: [
          "A dependency map for the use case.",
          "The changes needed before a delivery commitment can be made.",
        ],
      },
    ],
    sample: {
      title: "An investment decision with its assumptions visible",
      rows: [
        ["Proposed use", "Help an operations team triage payment exceptions."],
        [
          "Evidence available",
          "Historical volumes. The handling-time baseline is still to be established.",
        ],
        [
          "Decision to resolve",
          "Would assisted triage improve the process enough to justify integration and operating costs?",
        ],
        [
          "Next evidence",
          "Agree the baseline, review a representative dataset and compare with rules-based automation.",
        ],
      ],
    },
    bring:
      "The business objective, any pilot results or supplier proposals, current cost assumptions and access to the people responsible for the process, data and technology.",
    limits:
      "We advise on the decision and the plan. Your team or the providers you appoint build and run the solution, and we can oversee that work against the agreed plan.",
    check: { href: "/ai-readiness", name: "AI project self-assessment" },
  },
  {
    slug: "it-strategy",
    name: "IT strategy",
    inline: "IT strategy",
    mark: "m-it",
    tagline: "Technology decisions that hold up",
    short:
      "Architecture, vendor and delivery decisions for technology programmes.",
    lead: "We help technology and business leaders review their architecture, choose vendors and platforms, and keep major programmes on the plan that was agreed.",
    title: "IT strategy advisory",
    description:
      "Independent IT strategy advice: architecture and platform reviews, technology vendor selection, execution planning and delivery oversight.",
    challenges: [
      [
        "Decide build, buy or partner",
        "Compare the options on cost, risk, control and the effort of leaving later.",
      ],
      [
        "Choose between vendors",
        "Select against your requirements rather than the vendor’s demonstration.",
      ],
      [
        "Test the architecture",
        "Check that the systems you have can support the product you plan.",
      ],
      [
        "Keep delivery on plan",
        "Get independent reporting on progress, cost and risk while the programme runs.",
      ],
    ],
    services: [
      {
        id: "architecture",
        name: "Architecture and platform review",
        text: "We review how the current systems, integrations and data flows support the planned product or change, and where they will limit it.",
        receive: [
          "A current-state view of the systems in scope.",
          "Constraints, risks and options, with cost and effort assumptions.",
          "A recommended direction and the decisions it depends on.",
        ],
      },
      {
        id: "vendor-selection",
        name: "Technology vendor selection",
        text: "We turn your requirements into evaluation criteria, run the comparison and test vendor claims against references and documentation.",
        receive: [
          "A requirements-based comparison matrix.",
          "A recommended option with its trade-offs and exit considerations.",
          "The questions to resolve before contracting.",
        ],
      },
      {
        id: "execution-planning",
        name: "Execution planning",
        text: "We turn the chosen option into workstreams, responsibilities, dependencies, budget assumptions and acceptance criteria.",
        receive: [
          "A delivery plan your team and providers can work from.",
          "A risk and dependency register with named owners.",
        ],
      },
      {
        id: "delivery-oversight",
        name: "Delivery oversight",
        text: "While your team or providers deliver, we review progress against the plan, test estimates and raise risks early.",
        receive: [
          "Monthly reporting on delivery progress, costs, risks and recommended actions.",
          "Decision support at the agreed checkpoints.",
        ],
      },
    ],
    sample: {
      title: "A vendor comparison that shows its reasoning",
      rows: [
        [
          "Requirement",
          "Real-time card authorisation within a defined response time.",
        ],
        ["Vendor claims", "All three shortlisted vendors state they comply."],
        [
          "What was verified",
          "Two vendors provided production references. One relies on a roadmap item.",
        ],
        [
          "Decision to resolve",
          "Is the third vendor’s lower price worth the delivery risk?",
        ],
      ],
    },
    bring:
      "The objective, the current system landscape, any vendor proposals or contracts in scope and access to the people who run the systems.",
    limits:
      "We do not resell software or take referral fees from vendors. Your team or the providers you appoint carry out the implementation.",
    check: null,
  },
  {
    slug: "fintech-product",
    name: "Fintech and payments",
    inline: "fintech and payments",
    mark: "m-fintech",
    tagline: "From proposition to launch plan",
    short:
      "Business models, market entry and banking partners for financial products.",
    lead: "We help fintechs, banks and payment businesses test the commercial model, choose a market and operating approach, and select the banking and service partners a launch depends on.",
    title: "Fintech and payments advisory",
    description:
      "Independent fintech advice: commercial models, market entry assessments, banking and provider partner selection and launch planning.",
    challenges: [
      [
        "Prove the model works",
        "Test revenue, cost and unit economics before the launch budget is set.",
      ],
      [
        "Choose the next market",
        "Compare markets on demand, operating requirements and partner availability.",
      ],
      [
        "Find the right partners",
        "Select banks, payment and service providers that fit the product and its risk profile.",
      ],
      [
        "Plan the launch",
        "Connect the proposition to the operations, providers and approvals it needs.",
      ],
    ],
    services: [
      {
        id: "commercial-model",
        name: "Business and commercial model",
        text: "We build or review the financial model with you: revenue, cost and unit-economic assumptions, and the sensitivities that would change the decision.",
        receive: [
          "A working commercial model with its assumptions documented.",
          "The sensitivities that matter most and how to test them.",
        ],
      },
      {
        id: "market-entry",
        name: "Market entry assessment",
        text: "We compare target markets on customer demand, operating requirements and partner availability, and identify the questions that need qualified legal or regulatory advice.",
        receive: [
          "A comparison of market and operating options.",
          "A market-entry brief with validation gaps and partner dependencies.",
          "The questions to take to qualified advisers.",
        ],
      },
      {
        id: "partners",
        name: "Banking and provider partner selection",
        text: "We define what the product needs from a banking, payment or service partner, build the shortlist and compare the options on capability, cost, operating responsibilities and exit.",
        receive: [
          "A selection matrix and a supported recommendation.",
          "Onboarding requirements and integration dependencies.",
        ],
      },
      {
        id: "launch-planning",
        name: "Launch planning",
        text: "We connect the customer proposition to the operating model, providers and dependencies the launch requires.",
        receive: [
          "A launch plan with owners, dependencies and decision points.",
        ],
      },
    ],
    sample: {
      title: "A market comparison that exposes the trade-offs",
      rows: [
        [
          "Commercial evidence",
          "Customer access, willingness to pay and expected servicing costs.",
        ],
        [
          "Operating route",
          "Questions for legal advisers, required providers and partner responsibilities.",
        ],
        [
          "Launch dependencies",
          "Integration, onboarding, operational ownership and security evidence.",
        ],
        [
          "Decision",
          "Enter, validate further or defer, with the assumptions recorded.",
        ],
      ],
    },
    bring:
      "The proposition, the target customers, any existing model or plan and the partner conversations already under way.",
    limits:
      "We are not a law firm and do not give legal or regulatory opinions. We prepare the questions and work alongside your qualified advisers. Partners make their own approval decisions.",
    check: {
      href: "/fintech-readiness",
      name: "Fintech launch and expansion self-assessment",
    },
  },
  {
    slug: "security-posture",
    name: "Cybersecurity",
    inline: "cybersecurity",
    mark: "m-security",
    tagline: "Security you can evidence",
    short:
      "Security posture, customer security reviews and incident preparedness.",
    lead: "We help companies understand their security position, answer customer and partner security reviews with evidence and prepare their teams for incidents.",
    title: "Cybersecurity advisory",
    description:
      "Independent cybersecurity advice: security posture reviews, customer security review support and incident preparedness.",
    challenges: [
      [
        "Know where you stand",
        "Get an independent view of your security position and the gaps that matter most.",
      ],
      [
        "Answer customer reviews",
        "Respond to security questionnaires with answers you can support.",
      ],
      [
        "Prioritise the fixes",
        "Order remediation by impact and by what the people asking require.",
      ],
      [
        "Prepare for incidents",
        "Agree roles, escalation and decisions before something happens.",
      ],
    ],
    services: [
      {
        id: "posture-review",
        name: "Security posture review",
        text: "We review policies, controls, supplier responsibilities and technical documentation for the agreed scope, and separate evidence that exists from controls that need work.",
        receive: [
          "A findings register with the evidence behind each finding.",
          "A prioritised remediation plan with owners.",
        ],
      },
      {
        id: "customer-reviews",
        name: "Customer security review support",
        text: "We work from the actual questionnaire or review request, establish the scope and organise the evidence behind each answer.",
        receive: [
          "A scope statement and an evidence register linked to the request.",
          "Questionnaire responses that separate evidence, limitations and open actions.",
          "A prioritised gap plan.",
        ],
      },
      {
        id: "incident-preparedness",
        name: "Incident preparedness",
        text: "We review response roles, escalation and critical-service dependencies, and can run a facilitated exercise that tests how people make decisions under pressure.",
        receive: [
          "Agreed roles and escalation paths.",
          "Exercise findings and the actions that improve the plan.",
        ],
      },
    ],
    sample: {
      title: "An evidence register that separates facts from gaps",
      rows: [
        ["Review question", "How is access removed when someone leaves?"],
        ["Evidence available", "An access-removal procedure."],
        [
          "Still to verify",
          "A recent record showing the procedure was carried out.",
        ],
        [
          "Next action",
          "Ask the system owner to locate the record and confirm the scope it covers.",
        ],
      ],
    },
    bring:
      "The review request, the service boundary, available records and the people responsible for security, technology and suppliers.",
    limits:
      "We do not provide ISO certification, independent audit opinions or emergency incident response. Where technical testing such as a penetration test is needed, we define the scope and help you appoint a specialist.",
    check: {
      href: "/security-check",
      name: "Customer security review readiness check",
    },
  },
];

const bySlug = Object.fromEntries(DOMAINS.map((d) => [d.slug, d]));
function svc(slug, id) {
  const s = bySlug[slug].services.find((x) => x.id === id);
  if (!s) throw new Error("Unknown service " + slug + "#" + id);
  return { ...s, domain: bySlug[slug], href: `/expertise/${slug}#${id}` };
}

const STAGES = [
  {
    id: "decide",
    from: "Idea",
    to: "Decision",
    lead: "You have an opportunity and need to know whether it is worth funding.",
    items: [
      [svc("ai-strategy", "investment"), ["Value case", "Recommendation"]],
      [
        svc("fintech-product", "commercial-model"),
        ["Unit economics", "Sensitivities"],
      ],
      [
        svc("fintech-product", "market-entry"),
        ["Market comparison", "Adviser questions"],
      ],
    ],
  },
  {
    id: "plan",
    from: "Decision",
    to: "Plan",
    lead: "The direction is agreed. Now the systems, partners and plan have to support it.",
    items: [
      [
        svc("it-strategy", "architecture"),
        ["Constraints", "Recommended direction"],
      ],
      [
        svc("it-strategy", "vendor-selection"),
        ["Comparison matrix", "Exit terms"],
      ],
      [
        svc("fintech-product", "partners"),
        ["Selection matrix", "Onboarding needs"],
      ],
      [svc("ai-strategy", "data-readiness"), ["Dependency map"]],
      [svc("it-strategy", "execution-planning"), ["Delivery plan", "Owners"]],
    ],
  },
  {
    id: "scale",
    from: "Pilot",
    to: "Scale",
    lead: "Something is running. You need to decide how to grow it and keep delivery honest.",
    items: [
      [svc("ai-strategy", "pilot-review"), ["Findings", "Continue or stop"]],
      [
        svc("fintech-product", "launch-planning"),
        ["Launch plan", "Decision points"],
      ],
      [
        svc("it-strategy", "delivery-oversight"),
        ["Monthly reporting", "Escalation"],
      ],
    ],
  },
  {
    id: "secure",
    from: "Scale",
    to: "Secure",
    lead: "Customers and partners now ask how you protect the service they rely on.",
    items: [
      [
        svc("security-posture", "posture-review"),
        ["Findings register", "Remediation plan"],
      ],
      [
        svc("security-posture", "customer-reviews"),
        ["Evidence register", "Supported answers"],
      ],
      [
        svc("security-posture", "incident-preparedness"),
        ["Escalation paths", "Exercise"],
      ],
    ],
  },
];

const PRINCIPLES = [
  [
    "Senior advisors throughout",
    "The advisor who scopes the engagement stays involved until it is complete. Any specialists and their responsibilities are named in the scope.",
  ],
  [
    "Independent recommendations",
    "We take no referral fees from the vendors or providers we recommend. Existing tools and internal options are considered alongside new ones.",
  ],
  [
    "Scope and fees in writing",
    "Outputs, responsibilities, fees and completion criteria are agreed before work begins.",
  ],
  [
    "Reasoning you can test",
    "You receive the evidence and assumptions behind each recommendation, so your team can challenge it and carry the work forward.",
  ],
  [
    "Confidentiality",
    "Confidentiality arrangements are agreed before sensitive documents are exchanged.",
  ],
];

const FORMATS = [
  [
    "Assessment",
    "Review the agreed evidence, set out the options and recommend the next decision.",
    "Findings, options and a recommendation.",
  ],
  [
    "Implementation planning",
    "Turn the chosen option into responsibilities, dependencies, budget assumptions and acceptance criteria.",
    "An agreed plan for the work.",
  ],
  [
    "Delivery oversight",
    "Follow the work your team or providers deliver, test progress against the plan and raise risks early.",
    "Monthly reporting on delivery progress, costs, risks and recommended actions.",
  ],
];

const CHECKS = [
  [
    "/ai-readiness",
    "AI project self-assessment",
    "An investment decision, a stalled pilot or an operating portfolio.",
  ],
  [
    "/fintech-readiness",
    "Fintech launch and expansion self-assessment",
    "A product, a market and the commercial or partner dependencies.",
  ],
  [
    "/security-check",
    "Customer security review readiness check",
    "A customer request and the evidence available for its scope.",
  ],
];

/* ---------- drawing ---------- */

const C30 = Math.cos(Math.PI / 6);
const r2 = (n) => Math.round(n * 100) / 100;
function iso(x, y, z, s, ox, oy) {
  return [r2(ox + (x - y) * C30 * s), r2(oy + (x + y) * 0.5 * s - z * s)];
}
const pts = (a) => a.map((p) => p.join(",")).join(" ");

/* Small marks: one per expertise area, drawn in the hero's axonometric language. */
function markSymbols() {
  const S = 1;
  const P = (x, y, z, cx, cy) => iso(x, y, z, S, cx, cy);
  const cube = (s, cx, cy, hidden) => {
    const top = [P(0, 0, s, cx, cy), P(s, 0, s, cx, cy), P(s, s, s, cx, cy), P(0, s, s, cx, cy)];
    const left = [P(0, s, s, cx, cy), P(s, s, s, cx, cy), P(s, s, 0, cx, cy), P(0, s, 0, cx, cy)];
    const right = [P(s, s, s, cx, cy), P(s, 0, s, cx, cy), P(s, 0, 0, cx, cy), P(s, s, 0, cx, cy)];
    let o = `<polygon points="${pts(top)}"/><polygon points="${pts(left)}"/><polygon points="${pts(right)}"/>`;
    if (hidden) {
      const h = P(0, 0, 0, cx, cy), a = P(0, 0, s, cx, cy), b = P(s, 0, 0, cx, cy), c = P(0, s, 0, cx, cy);
      o += `<path stroke-dasharray="1.5 1.5" d="M${a} L${h} L${b} M${h} L${c}"/>`;
    }
    return o;
  };
  const plate = (s, cx, cy, z) =>
    `<polygon points="${pts([P(0, 0, z, cx, cy), P(s, 0, z, cx, cy), P(s, s, z, cx, cy), P(0, s, z, cx, cy)])}"/>`;
  const ai = cube(9, 16, 16, true) + '<path stroke-dasharray="2 2" d="M3,13.5 H29"/>';
  const it =
    cube(6, 10, 13) + cube(6, 20.4, 19) + '<path stroke-dasharray="2 2" d="M13,16.5 L17.4,19"/>';
  const top = P(4.5, 4.5, 8, 16, 15.5);
  const fin =
    plate(9, 16, 15.5, 0) + plate(9, 16, 15.5, 4) + plate(9, 16, 15.5, 8) +
    `<path d="M${top[0]},${top[1]} v-6 m-2.5,2.5 l2.5,-2.5 l2.5,2.5"/>`;
  const ring = [P(-6, -6, 0, 16, 15), P(13, -6, 0, 16, 15), P(13, 13, 0, 16, 15), P(-6, 13, 0, 16, 15)];
  const sec = `<polygon stroke-dasharray="2 2" points="${pts(ring)}"/>` + cube(7, 16, 15);
  return `<svg class="sprite" aria-hidden="true" xmlns="http://www.w3.org/2000/svg">
      <symbol id="m-ai" viewBox="0 0 32 32">${ai}</symbol>
      <symbol id="m-it" viewBox="0 0 32 32">${it}</symbol>
      <symbol id="m-fintech" viewBox="0 0 32 32">${fin}</symbol>
      <symbol id="m-security" viewBox="0 0 32 32">${sec}</symbol>
    </svg>`;
}
function mark(id, cls = "mark") {
  return `<svg class="${cls}" aria-hidden="true" focusable="false"><use href="#${id}"></use></svg>`;
}

/*
 * Stage drawings: the same district at four moments, matching the hero's story.
 * 1 a surveyed plot, 2 wireframes, 3 the first buildings, 4 the finished district inside a perimeter.
 */
const PLOTS = [
  [0, 0, 1.1], [1, 0, 1.7], [2, 0, 0.9],
  [0, 1, 1.4], [1, 1, 2.3], [2, 1, 1.2],
  [0, 2, 0.8], [1, 2, 1.5], [2, 2, 1.0],
];
function stageArt(stage) {
  const s = 46, U = 1.36, B = 1, ox = 160, oy = 70;
  const P = (x, y, z) => iso(x, y, z, s, ox, oy);
  const out = [];
  const plot = (x0, y0, cls, z = 0) =>
    `<polygon class="${cls}" points="${pts([P(x0, y0, z), P(x0 + B, y0, z), P(x0 + B, y0 + B, z), P(x0, y0 + B, z)])}"/>`;
  const box = (x0, y0, h, kind, seed) => {
    const a = 0.12, x1 = x0 + B - a, y1 = y0 + B - a;
    x0 += a; y0 += a;
    const top = [P(x0, y0, h), P(x1, y0, h), P(x1, y1, h), P(x0, y1, h)];
    const left = [P(x0, y1, h), P(x1, y1, h), P(x1, y1, 0), P(x0, y1, 0)];
    const right = [P(x1, y1, h), P(x1, y0, h), P(x1, y0, 0), P(x1, y1, 0)];
    if (kind === "wire") {
      const hb = [P(x0, y0, 0), P(x0, y0, h)];
      return `<g class="wire"><path class="hid" d="M${P(x0, y0, 0)} L${P(x1, y0, 0)} M${P(x0, y0, 0)} L${P(x0, y1, 0)} M${hb[0]} L${hb[1]}"/><polygon points="${pts(top)}"/><polygon points="${pts(left)}"/><polygon points="${pts(right)}"/></g>`;
    }
    let g = `<g class="solid"><polygon class="f-top" points="${pts(top)}"/><polygon class="f-left" points="${pts(left)}"/><polygon class="f-right" points="${pts(right)}"/>`;
    const rows = Math.max(1, Math.floor(h / 0.32));
    let k = seed * 7 + 3;
    for (let r = 0; r < rows; r++)
      for (let c = 0; c < 3; c++) {
        k = (k * 37 + 11) % 101;
        const on = k % 3 === 0;
        const z0 = 0.16 + r * 0.32, u = 0.12 + c * 0.24;
        const wl = [P(x0 + u, y1, z0 + 0.14), P(x0 + u + 0.12, y1, z0 + 0.14), P(x0 + u + 0.12, y1, z0), P(x0 + u, y1, z0)];
        const wr = [P(x1, y1 - u, z0 + 0.14), P(x1, y1 - u - 0.12, z0 + 0.14), P(x1, y1 - u - 0.12, z0), P(x1, y1 - u, z0)];
        g += `<polygon class="${on ? "win on" : "win"}" points="${pts(wl)}"/>`;
        k = (k * 37 + 11) % 101;
        g += `<polygon class="${k % 4 === 0 ? "win on" : "win"}" points="${pts(wr)}"/>`;
      }
    return g + "</g>";
  };
  const order = PLOTS.map((p, i) => ({ x: p[0] * U, y: p[1] * U, h: p[2] * 0.8, i })).sort(
    (a, b) => a.x + a.y - (b.x + b.y),
  );
  const ground = [];
  for (const p of order) {
    let cls = "plot";
    if (stage === 0) cls = p.i === 4 ? "plot sel" : "plot dash";
    ground.push(plot(p.x, p.y, cls));
  }
  out.push(`<g class="ground">${ground.join("")}</g>`);
  if (stage === 0) {
    const c = P(U + 0.5, U + 0.5, 0), t = P(U + 0.5, U + 0.5, 1.15);
    const l0 = P(-0.4, U * 2 + 1.4, 0), l1 = P(U * 2 + 1.4, -0.4, 0);
    out.push(`<path class="scan" d="M${l0} L${l1}"/>`);
    out.push(`<path class="pin" d="M${c} L${t}"/><circle class="pin-head" cx="${t[0]}" cy="${t[1]}" r="4"/>`);
  }
  if (stage === 3) {
    const m = 0.38, E = U * 2 + B;
    out.push(
      `<polygon class="ring" points="${pts([P(-m, -m, 0), P(E + m, -m, 0), P(E + m, E + m, 0), P(-m, E + m, 0)])}"/>`,
    );
  }
  const wireSet = new Set([1, 3, 4, 5, 7]);
  for (const p of order) {
    if (stage === 1 && wireSet.has(p.i)) out.push(box(p.x, p.y, p.h, "wire", p.i));
    if (stage === 2) {
      if (p.i === 4 || p.i === 3) out.push(box(p.x, p.y, p.h, "solid", p.i));
      else if (wireSet.has(p.i)) out.push(box(p.x, p.y, p.h * 0.6, "wire", p.i));
    }
    if (stage === 3 && p.i !== 6) out.push(box(p.x, p.y, p.h, "solid", p.i));
  }
  return `<svg class="stage-svg" viewBox="0 0 320 300" aria-hidden="true" focusable="false">${out.join("")}</svg>`;
}

/* ---------- partials ---------- */

const esc = (s) =>
  String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

function head({ title, description, url, ogTitle }) {
  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>${esc(title)}</title>
    <meta name="description" content="${esc(description)}" />
    <link rel="canonical" href="${SITE}${url}" />
    <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
    <meta name="theme-color" content="#0A0C10" />
    <meta property="og:type" content="website" />
    <meta property="og:url" content="${SITE}${url}" />
    <meta property="og:title" content="${esc(ogTitle || title)}" />
    <meta property="og:description" content="${esc(description)}" />
    <meta property="og:site_name" content="DFG. Digital Frontiers Group" />
    <meta property="og:image" content="${SITE}/og.png" />
    <meta property="og:image:width" content="1200" />
    <meta property="og:image:height" content="630" />
    <meta property="og:image:alt" content="DFG. ${esc(POSITION)}" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:image" content="${SITE}/og.png" />
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link
      rel="stylesheet"
      href="https://fonts.googleapis.com/css2?family=Unbounded:wght@500;600&family=Geist:wght@400;500;600&family=Geist+Mono:wght@400;500&display=swap"
    />
    <link rel="stylesheet" href="/assets/site.css" />
  </head>`;
}

/* where: "home", "expertise", or "other". hasContact: the page has its own enquiry block. */
function header(where, hasContact) {
  const p = where === "home" ? "" : "/";
  const cur = (k) => (where === k ? ' aria-current="true"' : "");
  return `<header class="top page" id="top-bar">
      <span class="prog" id="prog" aria-hidden="true"></span>
      <div class="grid">
        <a class="brand" href="/" aria-label="DFG, home"><span class="wm">DFG</span><span class="desc">Digital Frontiers Group</span></a>
        <nav class="idx" id="idx" aria-label="Site">
          <a href="${p}#stages">Stages</a><a href="${p}#expertise"${cur("expertise")}>Expertise</a><a href="${p}#approach">How we work</a><a href="${p}#checks">Self-assessments</a><a class="go" href="${hasContact ? "" : "/"}#contact">Discuss your project</a>
        </nav>
        <button class="menu" id="menuBtn" type="button" aria-expanded="false" aria-controls="idx">Menu</button>
      </div>
    </header>`;
}

function footer() {
  return `<footer class="page">
      <div class="grid">
        <div class="f-brand">
          <span class="wm">DFG</span>
          <p>Digital Frontiers Group. ${POSITION}</p>
          <!--email_off--><a href="mailto:${EMAIL}">${EMAIL}</a><!--/email_off-->
        </div>
        <nav class="f-links" aria-label="Expertise">
          <b>Expertise</b>${DOMAINS.map((d) => `<a href="/expertise/${d.slug}">${d.name}</a>`).join("")}
        </nav>
        <nav class="f-links" aria-label="Company">
          <b>Company</b><a href="/#approach">How we work</a><a href="/#checks">Self-assessments</a><a href="/privacy">Privacy notice</a><a href="/terms">Terms of use</a>
        </nav>
        <div class="reg"><p>${REG} &copy; 2026 DFG Digital Frontiers FZ-LLC.</p></div>
      </div>
    </footer>`;
}

function contact(no, title, sub = "Start with the decision you need to make.") {
  return `<section id="contact" class="page">
        <div class="grid">
          <div class="sh">
            <span class="no">${no}</span>
            <h2>${title}</h2>
            <p>${sub}</p>
          </div>
          <div class="sb" data-reveal>
            <p class="lead">Tell us what you want to achieve, where things stand and any important deadline.</p>
            <p class="contact-intro">We’ll discuss whether DFG is a fit, the information needed and a suitable scope. You receive a written proposal before any work begins.</p>
            <form class="form" id="contactForm" novalidate>
              <label>Name<input name="name" autocomplete="name" required maxlength="120" /></label>
              <label>Company<input name="company" autocomplete="organization" required maxlength="160" /></label>
              <label class="full">Email<input type="email" name="email" autocomplete="email" spellcheck="false" required maxlength="200" /></label>
              <label class="full">What are you planning or trying to improve?<textarea name="problem" required aria-describedby="enquiry-help"></textarea></label>
              <p class="full form-help" id="enquiry-help">An objective, current stage and deadline are enough. Please leave out confidential documents and sensitive customer data.</p>
              <label class="hp" aria-hidden="true">Website<input name="website" tabindex="-1" autocomplete="off" /></label>
              <div class="send">
                <button class="btn" type="submit">Send enquiry <span aria-hidden="true">→</span></button><a class="btn ghost" id="book" href="#" hidden>Book an introductory call</a><small>Or <!--email_off--><a href="mailto:${EMAIL}">email us</a><!--/email_off-->. Read how we handle your enquiry in our <a href="/privacy">privacy notice</a>.</small>
              </div>
              <p id="form-status" class="form-status full" role="status" aria-live="polite"></p>
            </form>
          </div>
        </div>
      </section>`;
}

const scripts = (extra = []) =>
  ["/assets/site.js", ...extra].map((s) => `    <script src="${s}" defer></script>`).join("\n");

/* ---------- homepage ---------- */

function stagesSection() {
  const tabs = STAGES.map(
    (st, i) =>
      `<button class="stage-tab" type="button" role="tab" id="tab-${st.id}" aria-controls="stage-${st.id}" aria-selected="${i === 0}"${i ? ' tabindex="-1"' : ""}><span class="st-no">0${i + 1}</span><span class="st-name">${st.from} <span aria-hidden="true">→</span> ${st.to}</span></button>`,
  ).join("");
  const panels = STAGES.map(
    (st, i) => `<div class="stage-panel frame" id="stage-${st.id}" role="tabpanel" aria-labelledby="tab-${st.id}">
              <div class="stage-art">${stageArt(i)}</div>
              <div class="stage-body">
                <h3 class="stage-title"><span class="st-no">0${i + 1}</span> ${st.from} <span aria-hidden="true">→</span> ${st.to}</h3>
                <p class="stage-lead">${st.lead}</p>
                <ul class="stage-list">
                  ${st.items
                    .map(
                      ([s, tags]) =>
                        `<li><a href="${s.href}"><span class="sl-name">${s.name}</span><span class="sl-area">${s.domain.name}</span></a><span class="tags">${tags.map((t) => `<span>${t}</span>`).join("")}</span></li>`,
                    )
                    .join("\n                  ")}
                </ul>
              </div>
            </div>`,
  ).join("\n            ");
  return `<section id="stages" class="page">
        <div class="grid">
          <div class="sh">
            <span class="no">01 / Stages</span>
            <h2>Which stage are you at?</h2>
            <p>Choose the stage closest to where your project is. Each stage lists the services that apply to it.</p>
          </div>
          <div class="sb" data-reveal>
            <div class="stage-tabs" role="tablist" aria-label="Project stage" hidden>${tabs}</div>
            ${panels}
          </div>
        </div>
      </section>`;
}

function domainCard(d, headingTag = "h3") {
  return `<article class="domain-card frame">
                <div class="dc-head">${mark(d.mark)}<${headingTag}><a href="/expertise/${d.slug}">${d.name}</a></${headingTag}></div>
                <p class="dc-short">${d.short}</p>
                <ul class="dc-list">${d.services.map((s) => `<li>${s.name}</li>`).join("")}</ul>
                <span class="text-link dc-go" aria-hidden="true">Explore ${d.inline} →</span>
              </article>`;
}

function home() {
  const body = `
  <body>
    <a class="skip" href="#main">Skip to content</a>
    ${header("home", true)}
    <main id="main">
      ${markSymbols()}
      <div class="hero page">
        <canvas id="scan" aria-hidden="true"></canvas>
        <div class="grid">
          <div class="copy">
            <p class="eyebrow">Digital Frontiers Group / Technology advisory</p>
            <h1 class="d" id="h1">${POSITION}</h1>
            <p class="sub">Senior advisors for banks, fintechs and technology companies, from the first investment decision to a secure, scaled operation.</p>
            <p class="hero-audience">Assessment, implementation planning and delivery oversight.</p>
            <div class="hero-actions">
              <a class="btn" href="#contact">Discuss your project <span aria-hidden="true">→</span></a><a class="text-link" href="#stages">Which stage are you at?</a>
            </div>
          </div>
        </div>
        <button class="motion-toggle" id="motion-toggle" type="button" aria-pressed="false">Pause illustration</button>
      </div>
      ${stagesSection()}
      <section id="expertise" class="page">
        <div class="grid">
          <div class="sh">
            <span class="no">02 / Expertise</span>
            <h2>Four areas of expertise</h2>
            <p>Each area has its own page with the services, deliverables and limits of the work.</p>
          </div>
          <div class="sb" data-reveal>
            <div class="domains">
              ${DOMAINS.map((d) => domainCard(d)).join("\n              ")}
            </div>
          </div>
        </div>
      </section>
      <section id="approach" class="page">
        <div class="grid">
          <div class="sh">
            <span class="no">03 / How we work</span>
            <h2>What to expect from every engagement</h2>
            <p>The same commitments apply whichever service you choose.</p>
          </div>
          <div class="sb" data-reveal>
            <dl class="rows principles">
              ${PRINCIPLES.map(([t, d]) => `<div><dt>${t}</dt><dd>${d}</dd></div>`).join("\n              ")}
            </dl>
            <h3 class="sub-h">Engagement formats</h3>
            <dl class="rows formats">
              ${FORMATS.map(([t, d, o]) => `<div><dt>${t}</dt><dd><p>${d}</p><p class="output-line"><span>Output</span> ${o}</p></dd></div>`).join("\n              ")}
            </dl>
            <p class="method-note">You can commission any format on its own. Scope, access and stakeholder availability determine the schedule.</p>
          </div>
        </div>
      </section>
      <section id="checks" class="page">
        <div class="grid">
          <div class="sh">
            <span class="no">04 / Self-assessments</span>
            <h2>Not sure where to start?</h2>
            <p>A short self-assessment organises what you know before the first conversation.</p>
          </div>
          <div class="sb" data-reveal>
            <ul class="rows check-rows">
              ${CHECKS.map(([h, n, d]) => `<li><a href="${h}"><span class="cr-name">${n}</span><span class="cr-desc">${d}</span><span class="cr-go" aria-hidden="true">Start →</span></a></li>`).join("\n              ")}
            </ul>
            <p class="method-note">Free, with no email required to see your result. The summaries reflect your answers. They do not verify readiness or predict approval, cost or delivery time.</p>
          </div>
        </div>
      </section>
      ${contact("05 / Contact", "Discuss your project")}
    </main>
    ${footer()}
${scripts(["/assets/city.js"])}
  </body>
</html>
`;
  return (
    head({
      title: "DFG | Independent advisory for AI, fintech and cybersecurity",
      description:
        "DFG advises banks, fintechs and technology companies on AI strategy, IT strategy, fintech and payments, and cybersecurity, from the first investment decision to a secure, scaled operation.",
      url: "/",
    }) + body
  );
}

/* ---------- expertise pages ---------- */

function expertise(d) {
  const others = DOMAINS.filter((x) => x !== d);
  const checkLink = d.check
    ? `<a class="text-link" href="${d.check.href}">${d.check.name} <span aria-hidden="true">→</span></a>`
    : "";
  const body = `
  <body>
    <a class="skip" href="#main">Skip to content</a>
    ${header("expertise", true)}
    <main id="main">
      ${markSymbols()}
      <div class="th page domain-hero">
        <div class="grid">
          <div class="crumb"><a href="/#expertise">Expertise</a> <span aria-hidden="true">/</span> ${d.name}</div>
          <div class="dh-copy">
            <p class="eyebrow">${d.tagline}</p>
            <h1 class="d">${d.name}</h1>
            <p class="lead">${d.lead}</p>
            <div class="hero-actions">
              <a class="btn" href="#contact">Discuss your project <span aria-hidden="true">→</span></a>${checkLink}
            </div>
          </div>
          <div class="dh-art" aria-hidden="true">${mark(d.mark, "mark mark-lg")}</div>
        </div>
      </div>
      <section id="challenges" class="page">
        <div class="grid">
          <div class="sh">
            <span class="no">01 / Challenges</span>
            <h2>What we help with</h2>
          </div>
          <div class="sb" data-reveal>
            <ol class="challenges">
              ${d.challenges.map(([t, p], i) => `<li><span class="ch-no">0${i + 1}</span><h3>${t}</h3><p>${p}</p></li>`).join("\n              ")}
            </ol>
          </div>
        </div>
      </section>
      <section id="services" class="page">
        <div class="grid">
          <div class="sh">
            <span class="no">02 / Services</span>
            <h2>Services</h2>
            <p>Each service can be commissioned on its own.</p>
          </div>
          <div class="sb">
            ${d.services
              .map(
                (s) => `<article class="svc" id="${s.id}" data-reveal>
              <div class="svc-text">
                <h3>${s.name}</h3>
                <p>${s.text}</p>
              </div>
              <div class="svc-out frame">
                <span class="eyebrow">You receive</span>
                <ul>${s.receive.map((r) => `<li>${r}</li>`).join("")}</ul>
              </div>
            </article>`,
              )
              .join("\n            ")}
          </div>
        </div>
      </section>
      <section id="example" class="page">
        <div class="grid">
          <div class="sh">
            <span class="no">03 / Example</span>
            <h2>What a deliverable looks like</h2>
            <p>An illustrative format, not a client engagement.</p>
          </div>
          <div class="sb" data-reveal>
            <div class="work-sample frame">
              <span class="eyebrow">Illustrative work sample</span>
              <h3>${d.sample.title}</h3>
              <dl class="sample-rows">
                ${d.sample.rows.map(([t, v]) => `<div><dt>${t}</dt><dd>${v}</dd></div>`).join("\n                ")}
              </dl>
              <p class="sample-note">Example format only. This is not a client engagement or an assessed recommendation for your organisation.</p>
            </div>
          </div>
        </div>
      </section>
      <section id="scope" class="page">
        <div class="grid">
          <div class="sh">
            <span class="no">04 / Scope</span>
            <h2>Scope and limits</h2>
          </div>
          <div class="sb" data-reveal>
            <dl class="rows">
              <div><dt>What to bring</dt><dd>${d.bring}</dd></div>
              <div><dt>What we do not do</dt><dd>${d.limits}</dd></div>
              <div><dt>When the work is complete</dt><dd>When the agreed deliverables have been reviewed with your sponsor. Completion never depends on you buying further work from DFG.</dd></div>
            </dl>
          </div>
        </div>
      </section>
      <section id="more" class="page">
        <div class="grid">
          <div class="sh">
            <span class="no">05 / Other expertise</span>
            <h2>Related areas</h2>
          </div>
          <div class="sb" data-reveal>
            <ul class="related">
              ${others.map((o) => `<li><a href="/expertise/${o.slug}">${mark(o.mark)}<span class="rl-name">${o.name}</span><span class="rl-short">${o.short}</span><span class="rl-go" aria-hidden="true">→</span></a></li>`).join("\n              ")}
            </ul>
          </div>
        </div>
      </section>
      ${contact("06 / Contact", "Discuss your project")}
    </main>
    ${footer()}
${scripts()}
  </body>
</html>
`;
  return (
    head({
      title: `${d.title} | DFG`,
      description: d.description,
      url: `/expertise/${d.slug}`,
    }) + body
  );
}

/* ---------- other pages: refresh the shared blocks in place ---------- */

function refresh(file, { contactTitle, closerReview } = {}) {
  const p = path.join(ROOT, file);
  let s = fs.readFileSync(p, "utf8");
  const hasContact = /<section id="contact"/.test(s);
  s = s.replace(/<header class="top page"[\s\S]*?<\/header>/, header("other", hasContact));
  s = s.replace(/<footer class="page">[\s\S]*?<\/footer>/, footer());
  if (hasContact) {
    const t = contactTitle || (s.match(/<section id="contact"[\s\S]*?<h2>([^<]+)<\/h2>/) || [])[1] || "Discuss your project";
    s = s.replace(/<section id="contact"[\s\S]*?<\/section>/, contact("Contact", t.trim()));
  }
  if (closerReview) {
    const d = bySlug[closerReview];
    s = s.replace(
      /(<h2>When you need a closer review<\/h2>\s*)<a class="text-link" href="[^"]*"\s*>[\s\S]*?<\/a\s*>/,
      `$1<a class="text-link" href="/expertise/${d.slug}">${d.name} →</a>`,
    );
  }
  s = s.replace(/Independent advice(?: and implementation)? for AI investment, fintech launches and customer security reviews\./g, POSITION);
  s = s.replace(/consulting and implementation work is governed by the written\s+scope/, "advisory work is governed by the written scope");
  fs.writeFileSync(p, s);
}

function notFound() {
  const p = path.join(ROOT, "404.html");
  let s = fs.readFileSync(p, "utf8");
  s = s.replace(
    /<ul>[\s\S]*?<\/ul>/,
    `<ul>\n              ${DOMAINS.map((d) => `<li><a href="/expertise/${d.slug}">${d.name}</a></li>`).join("\n              ")}\n            </ul>`,
  );
  s = s.replace("Explore our services or return to the\n              homepage.", "Choose an area of expertise or return to the homepage.");
  fs.writeFileSync(p, s);
}

function sitemap() {
  const urls = [
    "/",
    ...DOMAINS.map((d) => `/expertise/${d.slug}`),
    "/ai-readiness",
    "/fintech-readiness",
    "/security-check",
    "/privacy",
    "/terms",
  ];
  fs.writeFileSync(
    path.join(ROOT, "sitemap.xml"),
    `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.map((u) => `  <url><loc>${SITE}${u}</loc></url>`).join("\n")}\n</urlset>\n`,
  );
}

/* ---------- run ---------- */

if (require.main === module) {
  fs.writeFileSync(path.join(ROOT, "index.html"), home());
  for (const d of DOMAINS) fs.writeFileSync(path.join(ROOT, "expertise", d.slug + ".html"), expertise(d));
  refresh("ai-readiness.html", { closerReview: "ai-strategy" });
  refresh("fintech-readiness.html", { closerReview: "fintech-product" });
  refresh("security-check.html", { closerReview: "security-posture" });
  refresh("privacy.html");
  refresh("terms.html");
  refresh("404.html");
  notFound();
  sitemap();
  console.log("Built index, " + DOMAINS.length + " expertise pages; refreshed 6 pages and the sitemap.");
}

module.exports = { DOMAINS, STAGES, stageArt, markSymbols };
