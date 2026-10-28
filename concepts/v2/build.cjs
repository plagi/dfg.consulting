/*
 * Concept v2: DFG landing page in a studio card language inspired by elaya.design,
 * with large Swiss-style type, numbers as visuals and one cobalt accent.
 * Builds concepts/v2/index.html. Reuses the site's stage drawings and service names.
 *   node concepts/v2/build.cjs
 */
const fs = require("node:fs");
const path = require("node:path");
const { STAGES, stageArt } = require("../../scripts/build-pages.cjs");

const CTA = "Request a consultation";
const ph = (name, extra = "") => `<i class="ph${extra} ph-${name}" aria-hidden="true"></i>`;

const stageTabs = STAGES.map(
  (st, i) =>
    `<button class="pill" type="button" role="tab" id="t-${st.id}" aria-controls="p-${st.id}" aria-selected="${i === 0}"${i ? ' tabindex="-1"' : ""}>${st.from} <span aria-hidden="true">→</span> ${st.to}</button>`,
).join("");
const stagePanels = STAGES.map(
  (st, i) => `<div class="stage" id="p-${st.id}" role="tabpanel" aria-labelledby="t-${st.id}">
          <div class="stage-art">${stageArt(i)}</div>
          <div>
            <p class="stage-lead">${st.lead}</p>
            <ul class="svc-list">
              ${st.items
                .map(
                  ([s]) =>
                    `<li><a href="${s.href}"><span class="svc-name">${s.name}</span><span class="svc-area">${s.domain.name}</span>${ph("arrow-up-right")}</a></li>`,
                )
                .join("\n              ")}
            </ul>
          </div>
        </div>`,
).join("\n        ");

const TILES = [
  ["t-accent wide", "01", "Invest where the return is", "Find out whether an AI initiative is likely to pay back before the budget is committed.", "/expertise/ai-strategy", "AI strategy"],
  ["t-white", "02", "Choose suppliers on cost and fit", "Total cost, delivery risk and exit terms compared before you sign.", "/expertise/it-strategy", "IT strategy"],
  ["t-dark", "03", "Bring new products to market", "Test the commercial model and line up the banking and payment partners your launch depends on.", "/expertise/fintech-product", "Fintech and payments"],
  ["t-white wide", "04", "Answer customers’ security questions", "Prepare answers to customer and partner security reviews from the evidence you hold, and know which gaps to close first.", "/expertise/security-posture", "Cybersecurity"],
];
const tiles = TILES.map(
  ([cls, n, h, p, href, area]) => `<a class="tile ${cls}" href="${href}" data-r>
          <span class="num">${n}</span>
          <div><h3>${h}</h3><p>${p}</p></div>
          <span class="area">${area} ${ph("arrow-right")}</span>
        </a>`,
).join("\n        ");

const STEPS = [
  ["Tell us the goal", "Describe what you want to achieve, where things stand and any deadline. A free online check can help you prepare."],
  ["Agree the scope in writing", "We send a written proposal. Work starts only when you accept it."],
  ["Decide with the evidence", "A business case, a launch or implementation plan, or monthly delivery reports, reviewed with your leadership team."],
];

const FAQ = [
  ["What does DFG do?", "We help leadership teams make business decisions about technology: where to invest in AI, which vendors and partners to choose, how to launch financial products and how to answer customer security reviews."],
  ["Who do you work with?", "Banks, fintechs, payment businesses and technology companies with a technology decision that affects revenue, cost or customer trust."],
  ["Do you build or implement the solution?", "No. We advise on the decision and the plan. Your team or the providers you appoint build and run the solution, and we can oversee that work against the agreed plan."],
  ["How does an engagement start?", "You tell us the goal and the decision in front of you. We discuss whether DFG is a fit and what information is needed, then send a written proposal."],
  ["Who works on the engagement?", "The advisor who scopes the engagement stays involved until it is complete. Any specialists and their responsibilities are named in the scope."],
  ["Can we commission one service on its own?", "Yes. Every service can be commissioned on its own, and an assessment never obliges you to buy further work from DFG."],
  ["Do you provide ISO certification, audits or legal opinions?", "No. DFG does not provide ISO certification, independent audit opinions, legal opinions or regulated financial services."],
  ["How do you handle confidential information?", "Confidentiality arrangements are agreed before sensitive documents are exchanged. Please leave confidential material out of your first enquiry."],
];

const COMMIT = [
  ["Fixed scope and fee", "The written proposal states the outputs, responsibilities, fee and completion criteria."],
  ["Senior advisor throughout", "The advisor who scopes the work stays on it until it is complete."],
  ["No referral fees", "We take nothing from the vendors or providers we recommend."],
  ["One service at a time", "Commission an assessment on its own. Further work is never a condition."],
];

const html = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>DFG | Independent advisory that helps your business grow</title>
    <meta name="description" content="Independent advisory for AI, fintech and cybersecurity. DFG helps banks, fintechs and technology companies fund what pays back, launch products and answer customer security reviews." />
    <meta name="robots" content="noindex" />
    <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&display=swap" />
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@phosphor-icons/web@2.1.2/src/regular/style.css" />
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@phosphor-icons/web@2.1.2/src/bold/style.css" />
    <style>
      /* Design read: B2B advisory landing for bank, fintech and technology leadership.
         Studio card language after elaya.design, Swiss scale type and numbers, one cobalt accent.
         Dials: variance 7, motion 5, density 4. Light theme only, locked page wide.
         Shape lock: cards 20px, buttons and inner panels 12px, tabs fully round. */
      :root {
        --canvas: #ebebeb;
        --card: #ffffff;
        --ink: #141414;
        --muted: #5c5c5c;
        --line: #e2e2e2;
        --dark: #161616;
        --accent: #2f55e4;
        --accent-soft: #e9eefd;
        --ease: cubic-bezier(0.22, 1, 0.36, 1);
        --font: "Space Grotesk", ui-sans-serif, system-ui, sans-serif;
      }
      *, *::before, *::after { box-sizing: border-box; margin: 0; }
      [hidden] { display: none !important; }
      html { scroll-behavior: smooth; scroll-padding-top: 24px; }
      body { background: var(--canvas); color: var(--ink); font: 400 16px/24px var(--font); -webkit-font-smoothing: antialiased; }
      a { color: inherit; text-decoration: none; }
      button, input, textarea { font: inherit; color: inherit; }
      h1, h2, h3 { font-weight: 600; text-wrap: balance; letter-spacing: -0.02em; }
      p, li, dd { text-wrap: pretty; }
      :focus-visible { outline: 2px solid var(--accent); outline-offset: 3px; border-radius: 12px; }
      ::selection { background: var(--accent); color: #fff; }
      .skip { position: fixed; left: 12px; top: -64px; z-index: 30; background: var(--ink); color: #fff; padding: 8px 12px; border-radius: 12px; }
      .skip:focus { top: 12px; }
      .page { max-width: 1400px; margin-inline: auto; padding: 12px; display: grid; gap: 12px; }
      .card { background: var(--card); border-radius: 20px; padding: 40px; }
      .ph-asterisk { color: var(--accent); }

      /* buttons */
      .btn { display: inline-flex; align-items: center; gap: 8px; padding: 12px 16px; border-radius: 12px; background: var(--accent); color: #fff; font-weight: 600; border: 0; cursor: pointer; transition: background-color 300ms var(--ease), transform 300ms var(--ease); white-space: nowrap; }
      .btn:hover { background: #2445c4; }
      .btn:active { transform: scale(0.98); }
      .btn .ph { transition: transform 500ms var(--ease); }
      .btn:hover .ph { transform: translateX(4px); }
      .btn[disabled] { background: #d6d6d6; color: #555; cursor: progress; }
      .link { display: inline-flex; align-items: center; gap: 8px; font-weight: 500; border-bottom: 1px solid currentColor; padding-bottom: 2px; transition: color 300ms var(--ease); }
      .link:hover { color: var(--accent); }

      /* hero */
      .hero { display: grid; grid-template-columns: minmax(0, 7fr) minmax(0, 5fr); gap: 12px; min-height: min(680px, calc(100dvh - 24px)); }
      .hero-copy { display: flex; flex-direction: column; justify-content: space-between; gap: 48px; }
      .nav { display: flex; align-items: center; gap: 32px; }
      .wordmark { font-weight: 700; font-size: 24px; letter-spacing: -0.02em; }
      .nav-links { display: flex; gap: 24px; margin-left: auto; color: var(--muted); font-size: 15px; }
      .nav-links a:hover { color: var(--ink); }
      .eyebrow { display: flex; align-items: center; gap: 8px; color: var(--muted); font-weight: 500; }
      .hero h1 { margin-top: 24px; font-size: 56px; line-height: 1.02; letter-spacing: -0.04em; max-width: 13em; }
      .hero .sub { margin-top: 24px; font-size: 20px; line-height: 30px; color: var(--muted); max-width: 32em; }
      .hero-actions { margin-top: 32px; display: flex; flex-wrap: wrap; align-items: center; gap: 24px; }
      .visual { position: relative; border-radius: 20px; overflow: hidden; background: var(--accent); min-height: 420px; }
      .visual canvas { position: absolute; inset: 0; width: 100%; height: 100%; display: block; }

      /* stage picker */
      .head { display: flex; flex-wrap: wrap; align-items: end; justify-content: space-between; gap: 16px 32px; margin-bottom: 32px; }
      .h2 { font-size: 40px; line-height: 1.05; letter-spacing: -0.035em; max-width: 16em; }
      .lede { color: var(--muted); max-width: 40em; margin-top: 12px; font-size: 18px; line-height: 28px; }
      .tabs { display: flex; flex-wrap: wrap; gap: 8px; }
      .pill { border: 1px solid var(--line); background: #f6f6f6; border-radius: 999px; padding: 10px 16px; font-weight: 500; cursor: pointer; transition: background-color 300ms var(--ease), color 300ms var(--ease), border-color 300ms var(--ease), transform 300ms var(--ease); }
      .pill:hover { border-color: #c9c9c9; }
      .pill:active { transform: scale(0.98); }
      .pill[aria-selected="true"] { background: var(--accent); border-color: var(--accent); color: #fff; }
      .stage { display: grid; grid-template-columns: minmax(0, 5fr) minmax(0, 7fr); gap: 48px; align-items: center; }
      .stage + .stage { margin-top: 32px; }
      .tabs-on .stage { margin-top: 0; }
      .stage-art { background: #f6f6f6; border-radius: 12px; padding: 24px; }
      .stage-svg { width: 100%; height: auto; display: block; }
      .stage-svg .plot { fill: none; stroke: #cfcfcf; stroke-width: 1; }
      .stage-svg .plot.dash { stroke-dasharray: 3 3; }
      .stage-svg .plot.sel { stroke: var(--accent); fill: var(--accent-soft); }
      .stage-svg .scan { stroke: var(--accent); stroke-dasharray: 2 4; opacity: 0.7; }
      .stage-svg .pin { stroke: var(--accent); stroke-width: 1.2; }
      .stage-svg .pin-head { fill: var(--accent); }
      .stage-svg .wire polygon { fill: rgba(255, 255, 255, 0.86); }
      .stage-svg .wire polygon, .stage-svg .wire .hid { stroke: var(--accent); stroke-width: 1; stroke-linejoin: round; }
      .stage-svg .wire .hid { fill: none; stroke-dasharray: 2 3; opacity: 0.5; }
      .stage-svg .solid polygon { stroke: #8e8e8e; stroke-width: 1; stroke-linejoin: round; }
      .stage-svg .f-top { fill: #ffffff; }
      .stage-svg .f-left { fill: #e4e4e4; }
      .stage-svg .f-right { fill: #d2d2d2; }
      .stage-svg .solid .win { fill: #c4c4c4; stroke: none; }
      .stage-svg .solid .win.on { fill: var(--accent); }
      .stage-svg .ring { fill: none; stroke: var(--accent); stroke-dasharray: 4 4; stroke-width: 1; }
      .stage-lead { font-size: 22px; line-height: 30px; font-weight: 500; letter-spacing: -0.01em; max-width: 26em; }
      .svc-list { list-style: none; padding: 0; margin-top: 24px; }
      .svc-list li + li { border-top: 1px solid var(--line); }
      .svc-list a { display: grid; grid-template-columns: minmax(0, 1fr) auto auto; align-items: center; gap: 16px; padding-block: 14px; }
      .svc-name { font-weight: 600; }
      .svc-area { color: var(--muted); font-size: 14px; }
      .svc-list .ph { color: var(--muted); transition: transform 500ms var(--ease), color 300ms var(--ease); }
      .svc-list a:hover .svc-name, .svc-list a:hover .ph { color: var(--accent); }
      .svc-list a:hover .ph { transform: translate(2px, -2px); }

      /* bento of outcomes */
      .bento { display: grid; grid-template-columns: repeat(6, minmax(0, 1fr)); gap: 12px; }
      .bento-head { grid-column: 1 / -1; padding: 40px 40px 8px; }
      .tile { border-radius: 20px; padding: 32px; min-height: 320px; display: flex; flex-direction: column; justify-content: space-between; gap: 32px; grid-column: span 2; transition: transform 500ms var(--ease); }
      .tile.wide { grid-column: span 4; }
      .tile:hover { transform: translateY(-4px); }
      .tile .num { font-size: 96px; line-height: 0.85; font-weight: 600; letter-spacing: -0.06em; }
      .tile h3 { font-size: 26px; line-height: 1.15; letter-spacing: -0.025em; max-width: 16em; }
      .tile p { margin-top: 10px; max-width: 34em; }
      .tile .area { display: inline-flex; align-items: center; gap: 8px; font-weight: 600; }
      .tile .area .ph { transition: transform 500ms var(--ease); }
      .tile:hover .area .ph { transform: translateX(4px); }
      .t-accent { background: var(--accent); color: #fff; }
      .t-accent p { color: rgba(255, 255, 255, 0.86); }
      .t-white { background: var(--card); }
      .t-white .num { color: var(--accent); }
      .t-white p { color: var(--muted); }
      .t-dark { background: var(--dark); color: #fff; }
      .t-dark .num { color: #fff; }
      .t-dark p { color: rgba(255, 255, 255, 0.72); }

      /* tagline reveal */
      .tagline { padding: 96px 40px; }
      .tagline p { font-size: 72px; line-height: 1; font-weight: 600; letter-spacing: -0.05em; max-width: 12em; }
      .tagline .w { opacity: 0.22; transition: opacity 700ms var(--ease); }
      .tagline .w.on { opacity: 1; }

      /* steps */
      .steps { list-style: none; padding: 0; display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 40px; counter-reset: s; }
      .steps li { counter-increment: s; border-top: 2px solid var(--ink); padding-top: 20px; }
      .steps li::before { content: counter(s, decimal-leading-zero); display: block; font-size: 48px; line-height: 1; font-weight: 600; letter-spacing: -0.05em; color: var(--accent); margin-bottom: 24px; }
      .steps h3 { font-size: 22px; line-height: 28px; }
      .steps p { color: var(--muted); margin-top: 8px; }

      /* sample deliverable */
      .sample { display: grid; grid-template-columns: minmax(0, 5fr) minmax(0, 7fr); gap: 48px; align-items: start; }
      .sample .links { display: flex; flex-direction: column; align-items: flex-start; gap: 12px; margin-top: 32px; }
      .doc { background: #f6f6f6; border-radius: 12px; padding: 32px; }
      .doc-head { display: flex; flex-wrap: wrap; justify-content: space-between; align-items: center; gap: 12px; }
      .doc h3 { font-size: 22px; line-height: 28px; }
      .tag { font-size: 13px; color: var(--muted); background: #fff; border: 1px solid var(--line); border-radius: 999px; padding: 4px 10px; }
      .doc dl { margin-top: 24px; }
      .doc dl div { display: grid; grid-template-columns: minmax(0, 4fr) minmax(0, 8fr); gap: 24px; padding-block: 14px; }
      .doc dl div + div { border-top: 1px solid var(--line); }
      .doc dt { font-weight: 600; }
      .doc dd { color: var(--muted); }

      /* questions */
      .faq { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 32px 64px; }
      .faq dt { font-weight: 600; font-size: 18px; line-height: 26px; }
      .faq dd { color: var(--muted); margin-top: 8px; }

      /* commitment and enquiry, a light and a dark card side by side */
      .close { display: grid; grid-template-columns: minmax(0, 5fr) minmax(0, 7fr); gap: 12px; }
      .dark-card { background: var(--dark); color: #fff; border-radius: 20px; padding: 40px; display: flex; flex-direction: column; gap: 32px; }
      .dark-card .h2 { font-size: 36px; }
      .checks { list-style: none; padding: 0; display: grid; gap: 20px; }
      .checks li { display: grid; grid-template-columns: 24px minmax(0, 1fr); gap: 12px; }
      .checks .ph { font-size: 22px; color: #fff; margin-top: 2px; }
      .checks b { display: block; font-weight: 600; }
      .checks span { color: rgba(255, 255, 255, 0.72); }
      .free { margin-top: auto; color: rgba(255, 255, 255, 0.72); font-size: 15px; }
      .free a { color: #fff; border-bottom: 1px solid rgba(255, 255, 255, 0.5); }
      form { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-top: 32px; }
      .field { display: flex; flex-direction: column; gap: 8px; }
      .field.full, form .actions, form .status { grid-column: 1 / -1; }
      label { font-weight: 500; font-size: 14px; }
      input, textarea { background: #f6f6f6; border: 1px solid var(--line); border-radius: 12px; padding: 12px 14px; min-width: 0; transition: border-color 300ms var(--ease), background-color 300ms var(--ease); }
      textarea { min-height: 132px; resize: vertical; }
      input:hover, textarea:hover { border-color: #c9c9c9; }
      input:focus, textarea:focus { outline: none; border-color: var(--accent); background: #fff; }
      [aria-invalid="true"] { border-color: #c4281c; }
      .err { color: #b3261e; font-size: 14px; }
      .err:empty { display: none; }
      .hint { color: var(--muted); font-size: 14px; }
      .hp { position: absolute; left: -9999px; }
      .actions { display: flex; flex-wrap: wrap; align-items: center; gap: 16px; margin-top: 8px; }
      .actions small { color: var(--muted); font-size: 14px; }
      .actions small a { border-bottom: 1px solid currentColor; }
      .status { background: var(--accent-soft); border-radius: 12px; padding: 12px 14px; font-size: 15px; }
      .status:empty { display: none; }

      footer { display: flex; flex-wrap: wrap; justify-content: space-between; gap: 16px 32px; padding: 24px 40px 40px; color: var(--muted); font-size: 14px; }
      footer nav { display: flex; flex-wrap: wrap; gap: 20px; }
      footer a:hover { color: var(--ink); }
      footer .reg { flex-basis: 100%; max-width: 60em; font-size: 13px; }

      /* reveals */
      .rv [data-r] { opacity: 0; transform: translateY(24px); transition: opacity 700ms var(--ease), transform 700ms var(--ease); }
      .rv [data-r].in { opacity: 1; transform: none; }
      .rv .tile[data-r].in:hover { transform: translateY(-4px); }

      @media (max-width: 1100px) {
        .hero { grid-template-columns: 1fr; min-height: 0; }
        .visual { min-height: 380px; }
        .hero h1 { font-size: 48px; }
        .tagline p { font-size: 60px; }
      }
      @media (max-width: 900px) {
        .stage, .sample, .close { grid-template-columns: 1fr; gap: 24px; }
        .stage-art { max-width: 420px; }
        .bento { grid-template-columns: 1fr 1fr; }
        .tile, .tile.wide { grid-column: span 2; min-height: 0; }
        .steps { grid-template-columns: 1fr; gap: 32px; }
        .faq { grid-template-columns: 1fr; }
      }
      @media (max-width: 640px) {
        .page { padding: 8px; gap: 8px; }
        .card, .dark-card { padding: 24px; }
        .nav-links { display: none; }
        .nav .btn { margin-left: auto; padding: 8px 12px; font-size: 14px; }
        .hero h1 { font-size: 36px; line-height: 40px; }
        .hero .sub { font-size: 18px; line-height: 28px; }
        .visual { min-height: 300px; }
        .h2, .dark-card .h2 { font-size: 30px; }
        .bento-head { padding: 24px 24px 0; }
        .tile { padding: 24px; }
        .tile .num { font-size: 64px; }
        .tagline { padding: 64px 16px; }
        .tagline p { font-size: 30px; line-height: 1.05; }
        .svc-list a { grid-template-columns: minmax(0, 1fr) auto; }
        .svc-area { grid-row: 2; }
        .doc { padding: 20px; }
        .doc dl div { grid-template-columns: 1fr; gap: 4px; }
        form { grid-template-columns: 1fr; }
        footer { padding: 16px 24px 32px; }
      }
      @media (prefers-reduced-motion: reduce) {
        html { scroll-behavior: auto; }
        .rv [data-r] { transform: none !important; }
        .tile:hover, .btn:hover .ph, .tile:hover .area .ph, .svc-list a:hover .ph { transform: none; }
      }
    </style>
  </head>
  <body>
    <a class="skip" href="#main">Skip to content</a>
    <main id="main" class="page">
      <section class="hero" aria-labelledby="hero-h">
        <div class="card hero-copy">
          <nav class="nav" aria-label="Site">
            <a class="wordmark" href="#main" aria-label="DFG, top of page">DFG</a>
            <div class="nav-links"><a href="#stages">Stages</a><a href="#outcomes">Services</a><a href="#questions">Questions</a></div>
            <a class="btn" href="#contact">${CTA}</a>
          </nav>
          <div>
            <p class="eyebrow">${ph("asterisk", "-bold")} Independent advisory for AI, fintech and cybersecurity</p>
            <h1 id="hero-h">Technology decisions that grow your business.</h1>
            <p class="sub">We help banks, fintechs and technology companies fund what pays back, launch products and answer security reviews.</p>
            <div class="hero-actions">
              <a class="btn" href="#contact">${CTA} ${ph("arrow-right")}</a>
              <a class="link" href="#stages">Which stage are you at?</a>
            </div>
          </div>
        </div>
        <div class="visual" aria-hidden="true"><canvas id="district"></canvas></div>
      </section>

      <section class="card" id="stages" aria-labelledby="stages-h">
        <div class="head">
          <div>
            <h2 class="h2" id="stages-h">Which stage are you at?</h2>
            <p class="lede">Pick the stage closest to your project to see the services that apply.</p>
          </div>
          <div class="tabs" role="tablist" aria-label="Project stage" hidden>${stageTabs}</div>
        </div>
        ${stagePanels}
      </section>

      <section class="bento" id="outcomes" aria-labelledby="outcomes-h">
        <div class="bento-head"><h2 class="h2" id="outcomes-h">What changes for your business</h2></div>
        ${tiles}
      </section>

      <section class="tagline" aria-label="Our promise">
        <p id="tagline">Our advice comes<br />with a business case.</p>
      </section>

      <section class="card" id="how" aria-labelledby="how-h" data-r>
        <div class="head"><h2 class="h2" id="how-h">From goal to decision in three steps</h2></div>
        <ol class="steps">
          ${STEPS.map(([h, p]) => `<li><h3>${h}</h3><p>${p}</p></li>`).join("\n          ")}
        </ol>
      </section>

      <section class="card sample" aria-labelledby="sample-h" data-r>
        <div>
          <h2 class="h2" id="sample-h">See the format before you commit</h2>
          <p class="lede">The structure of an AI business case. The example is invented to show the format.</p>
          <div class="links">
            <a class="link" href="/expertise/it-strategy#example">A vendor comparison ${ph("arrow-right")}</a>
            <a class="link" href="/expertise/fintech-product#example">A market comparison ${ph("arrow-right")}</a>
            <a class="link" href="/expertise/security-posture#example">An evidence register ${ph("arrow-right")}</a>
          </div>
        </div>
        <article class="doc" aria-label="Illustrative AI business case">
          <div class="doc-head"><h3>AI business case</h3><span class="tag">Illustrative example</span></div>
          <dl>
            <div><dt>Business goal</dt><dd>Reduce the cost and delay of handling payment exceptions.</dd></div>
            <div><dt>Evidence available</dt><dd>Historical volumes. The handling time baseline is still to be established.</dd></div>
            <div><dt>Decision to resolve</dt><dd>Will assisted triage save more than it costs to integrate and run?</dd></div>
            <div><dt>Next evidence</dt><dd>Agree the baseline, review a representative dataset and compare with automation based on rules.</dd></div>
            <div><dt>Recommendation</dt><dd>Test before funding: a scoped trial on one exception type, with the baseline measured first.</dd></div>
          </dl>
        </article>
      </section>

      <section class="card" id="questions" aria-labelledby="faq-h" data-r>
        <div class="head"><h2 class="h2" id="faq-h">Questions before the first call</h2></div>
        <dl class="faq">
          ${FAQ.map(([q, a]) => `<div><dt>${q}</dt><dd>${a}</dd></div>`).join("\n          ")}
        </dl>
      </section>

      <section class="close" id="contact" aria-labelledby="contact-h">
        <div class="dark-card" data-r>
          <h2 class="h2">Start small, with the cost agreed in advance</h2>
          <ul class="checks">
            ${COMMIT.map(([b, s]) => `<li>${ph("check", "-bold")}<p><b>${b}</b><span>${s}</span></p></li>`).join("\n            ")}
          </ul>
          <p class="free">Not ready to talk? Try the free <a href="/ai-readiness">AI</a>, <a href="/fintech-readiness">fintech</a> or <a href="/security-check">security</a> check. No email required.</p>
        </div>
        <div class="card" data-r>
          <h2 class="h2" id="contact-h">${CTA}</h2>
          <p class="lede">Describe the decision in a few sentences. We reply by email to arrange a first conversation.</p>
          <form id="enquiry" novalidate>
            <div class="field"><label for="f-name">Name</label><input id="f-name" name="name" autocomplete="name" required maxlength="120" aria-describedby="e-name" /><p class="err" id="e-name"></p></div>
            <div class="field"><label for="f-company">Company</label><input id="f-company" name="company" autocomplete="organization" required maxlength="160" aria-describedby="e-company" /><p class="err" id="e-company"></p></div>
            <div class="field full"><label for="f-email">Work email</label><input id="f-email" name="email" type="email" autocomplete="email" spellcheck="false" required maxlength="200" aria-describedby="e-email" /><p class="err" id="e-email"></p></div>
            <div class="field full"><label for="f-problem">What decision are you facing?</label><textarea id="f-problem" name="problem" required maxlength="20000" aria-describedby="h-problem e-problem"></textarea><p class="hint" id="h-problem">The goal, where things stand and any deadline are enough.</p><p class="err" id="e-problem"></p></div>
            <div class="hp" aria-hidden="true"><label>Website<input name="website" tabindex="-1" autocomplete="off" /></label></div>
            <div class="actions"><button class="btn" type="submit">${CTA} ${ph("arrow-right")}</button><small>Or email <a href="mailto:hello@dfg.consulting">hello@dfg.consulting</a>. See our <a href="/privacy">privacy notice</a>.</small></div>
            <p class="status" id="status" role="status" aria-live="polite"></p>
          </form>
        </div>
      </section>

      <footer>
        <span>DFG Digital Frontiers FZ-LLC, United Arab Emirates</span>
        <nav aria-label="Footer"><a href="/expertise/ai-strategy">AI strategy</a><a href="/expertise/it-strategy">IT strategy</a><a href="/expertise/fintech-product">Fintech and payments</a><a href="/expertise/security-posture">Cybersecurity</a><a href="/privacy">Privacy notice</a><a href="/terms">Terms of use</a></nav>
        <p class="reg">DFG provides independent technology and business advisory services. DFG does not provide regulated financial services, legal opinions, audit opinions or ISO certification. © 2026 DFG Digital Frontiers FZ-LLC.</p>
      </footer>
    </main>

    <script src="/assets/city.js" defer></script>
    <script>
      document.addEventListener("DOMContentLoaded", function () {
        var reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;

        /* hero visual: DFG's district, drawn on the cobalt tile */
        var c = document.getElementById("district");
        if (c && window.DFGWorld) {
          var mob = c.clientWidth < 520;
          var w = new DFGWorld.World(c, { bx: mob ? 5 : 6, by: mob ? 4 : 5, seed: 7, bg: "#2f55e4", fit: 0.92, tx: 0.5, ty: 0.52, fitMobile: 0.92 });
          w.setScript(DFGWorld.heroScript(w, mob));
          w.play();
        }

        /* stage picker: tabs, arrow keys; every stage listed when scripts are off */
        var list = document.querySelector('[role="tablist"]');
        var tabs = [].slice.call(list.querySelectorAll('[role="tab"]'));
        var panels = tabs.map(function (t) { return document.getElementById(t.getAttribute("aria-controls")); });
        function select(i, focus) {
          tabs.forEach(function (t, j) { t.setAttribute("aria-selected", String(i === j)); t.tabIndex = i === j ? 0 : -1; panels[j].hidden = i !== j; });
          if (focus) tabs[i].focus();
        }
        tabs.forEach(function (t, i) {
          t.addEventListener("click", function () { select(i, false); });
          t.addEventListener("keydown", function (e) {
            var k = { ArrowRight: 1, ArrowLeft: -1 }[e.key];
            if (k === undefined) return;
            e.preventDefault();
            select((i + k + tabs.length) % tabs.length, true);
          });
        });
        list.hidden = false;
        list.closest("section").classList.add("tabs-on");
        select(0, false);

        /* reveals once, as sections enter */
        if (!reduce && "IntersectionObserver" in window) {
          document.documentElement.classList.add("rv");
          var io = new IntersectionObserver(function (es) {
            es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } });
          }, { rootMargin: "0px 0px -8% 0px" });
          document.querySelectorAll("[data-r]").forEach(function (n) { io.observe(n); });
        }

        /* tagline: words light up as they cross a line at 60% of the viewport */
        var tag = document.getElementById("tagline");
        var lines = tag.innerHTML.split(/<br\\s*\\/?>/i);
        tag.textContent = "";
        lines.forEach(function (line, li) {
          line.trim().split(/\\s+/).forEach(function (word, wi) {
            var s = document.createElement("span"); s.className = "w"; s.textContent = word;
            if (wi) tag.appendChild(document.createTextNode(" "));
            tag.appendChild(s);
          });
          if (li < lines.length - 1) tag.appendChild(document.createElement("br"));
        });
        var wio = new IntersectionObserver(function (es) {
          es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add("on"); wio.unobserve(e.target); } });
        }, { rootMargin: "0px 0px -40% 0px", threshold: 1 });
        tag.querySelectorAll(".w").forEach(function (s) { wio.observe(s); });

        /* enquiry: inline validation, sending state, email fallback */
        var f = document.getElementById("enquiry"), status = document.getElementById("status");
        var rules = {
          name: function (v) { return v ? "" : "Enter your name."; },
          company: function (v) { return v ? "" : "Enter your company."; },
          email: function (v) { return !v ? "Enter your work email." : /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/.test(v) ? "" : "Enter an email address like name@company.com."; },
          problem: function (v) { return v ? "" : "Describe the decision you are facing."; },
        };
        function check(el) {
          var msg = rules[el.name](el.value.trim());
          el.setAttribute("aria-invalid", msg ? "true" : "false");
          document.getElementById("e-" + el.name).textContent = msg;
          return !msg;
        }
        Object.keys(rules).forEach(function (n) { f.elements[n].addEventListener("blur", function () { if (this.value) check(this); }); });
        f.addEventListener("submit", function (e) {
          e.preventDefault();
          var bad = Object.keys(rules).filter(function (n) { return !check(f.elements[n]); });
          if (bad.length) { f.elements[bad[0]].focus(); return; }
          var data = {};
          ["name", "company", "email", "problem", "website"].forEach(function (n) { data[n] = f.elements[n].value.trim(); });
          var btn = f.querySelector("button[type=submit]"), label = btn.innerHTML;
          btn.disabled = true; btn.textContent = "Sending your request"; status.textContent = "";
          fetch("/api/contact", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(data) })
            .then(function (r) { if (!r.ok) throw new Error(String(r.status)); })
            .then(function () { f.reset(); status.textContent = "Request sent. We will reply to " + data.email + " to arrange a first conversation."; })
            .catch(function () {
              status.textContent = "The form could not send your request. Your email app will open with it filled in; send it to hello@dfg.consulting.";
              location.href = "mailto:hello@dfg.consulting?subject=" + encodeURIComponent("Consultation request from " + data.company) + "&body=" + encodeURIComponent(data.problem + "\\n\\n" + data.name + ", " + data.company + "\\n" + data.email);
            })
            .finally(function () { btn.disabled = false; btn.innerHTML = label; });
        });
      });
    </script>
  </body>
</html>
`;

fs.writeFileSync(path.join(__dirname, "index.html"), html);
console.log("Built concepts/v2/index.html");
