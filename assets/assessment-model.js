/* Assessment content and inference rules. No scores, external calls or persistence. */
(function (root, factory) {
  if (typeof module === "object" && module.exports) module.exports = factory();
  else root.DFGAssessment = factory();
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
  "use strict";
  const option = (value, label, kind = "context", action = "") => ({
    value,
    label,
    kind,
    action,
  });
  const choice = (id, title, options, help = "") => ({
    id,
    title,
    options,
    help,
    type: "choice",
  });
  const context = (id, title, help) => ({ id, title, help, type: "text" });
  const unknown = option("unknown", "Not sure", "unknown");
  const fact = (id, title, yes, no, next, help = "") =>
    choice(
      id,
      title,
      [option("yes", yes, "strength"), option("no", no, "gap", next), unknown],
      help,
    );
  const questions = {
    ai_goal: choice(
      "ai_goal",
      "Which decision are you preparing for?",
      [
        option("investment", "Evaluate an AI investment or explore its value"),
        option("pilot", "Decide what to do with a stalled pilot"),
        option("portfolio", "Review an operating portfolio"),
      ],
      "The questions that follow will reflect this decision. This choice is context, not a readiness rating.",
    ),
    ai_objective: context(
      "ai_objective",
      "What business process or outcome is in scope?",
      "For example: reduce the time spent reviewing payment exceptions. Leave out sensitive business or customer data.",
    ),
    ai_lead: choice("ai_lead", "Who is leading the review?", [
      option("technology", "CIO, CTO or technology lead"),
      option("business", "Business or product lead"),
      option("committee", "A committee"),
      option("other", "Another role"),
      unknown,
    ]),
    ai_owner: fact(
      "ai_owner",
      "Is someone accountable for the business outcome?",
      "Yes, a business sponsor is named",
      "No business sponsor is named",
      "Identify who can own the business outcome and investment decision.",
    ),
    ai_value: choice("ai_value", "What supports the expected business value?", [
      option("measured", "Measured results or a tested baseline", "strength"),
      option(
        "estimated",
        "Estimates that still need testing",
        "gap",
        "Separate assumptions from observations and identify the evidence needed before committing more budget.",
      ),
      option(
        "none",
        "The expected value has not been assessed",
        "gap",
        "Define the expected improvement and compare it with the cost of the initiative and alternative approaches.",
      ),
      unknown,
    ]),
    ai_target: fact(
      "ai_target",
      "Is there an agreed measure of success?",
      "Yes, with a baseline and target",
      "The measure or baseline is not yet agreed",
      "Agree the baseline and success criteria before interpreting pilot results.",
    ),
    ai_budget: choice("ai_budget", "What funding decision is needed?", [
      option(
        "case",
        "Build the case for an initial investment",
        "context",
        "Use the investment assessment to establish the evidence needed for a funding decision.",
      ),
      option("approved", "Decide how to use approved funding"),
      option("further", "Decide whether to fund further work"),
      option("explore", "Explore options before a funding request"),
      unknown,
    ]),
    ai_data: choice(
      "ai_data",
      "What is known about the data this use case needs?",
      [
        option(
          "reviewed",
          "Access, permitted use and suitability have been reviewed",
          "strength",
        ),
        option(
          "blocked",
          "There is a documented access or quality constraint",
          "gap",
          "Review the documented constraint with the relevant data owner; establish its impact on this use case.",
        ),
        option(
          "unreviewed",
          "Suitability or access has not been reviewed",
          "unknown",
          "Check which datasets are required and whether access, permitted use and quality support the proposed use.",
        ),
        unknown,
      ],
    ),
    ai_integration: fact(
      "ai_integration",
      "Are the required system integrations understood?",
      "Yes, dependencies have been reviewed",
      "Integration requirements remain unresolved",
      "Identify required interfaces, system owners and integration dependencies before fixing the delivery scope.",
    ),
    ai_delivery: choice("ai_delivery", "Who would build the solution?", [
      option("internal", "An internal team"),
      option("vendor", "A provider"),
      option("mixed", "Internal and provider teams"),
      option("undecided", "Build and buy options are still being compared"),
      unknown,
    ]),
    ai_operator: fact(
      "ai_operator",
      "Are production operating responsibilities agreed?",
      "Yes, the responsible team and handover are agreed",
      "Operational responsibility or handover remains unresolved",
      "Agree who operates and supports the service, including access, handover and escalation arrangements.",
    ),
    ai_risk: choice(
      "ai_risk",
      "What is the status of the relevant risk review?",
      [
        option(
          "complete",
          "The review is complete for the current scope",
          "strength",
        ),
        option(
          "blocked",
          "A defined review identified unresolved risks",
          "gap",
          "Examine the documented risk findings and the options for addressing them. Further investment may need to pause while those issues are resolved.",
        ),
        option(
          "pending",
          "A defined review is in progress",
          "context",
          "Confirm what evidence the current review needs and how its findings affect the next decision.",
        ),
        option(
          "undefined",
          "Required reviews or criteria have not been established",
          "gap",
          "Identify proportionate review criteria and the people responsible for applying them.",
        ),
        unknown,
      ],
    ),
    ai_results: choice(
      "ai_results",
      "How did the pilot perform against its objective?",
      [
        option("met", "It met the agreed measure", "strength"),
        option(
          "missed",
          "It did not meet the agreed measure",
          "gap",
          "Review the observed shortfall and consider changing scope or stopping if further investment is not justified.",
        ),
        option(
          "unmeasured",
          "Its result was not measured against an agreed target",
          "unknown",
          "Establish what the pilot evidence can support before deciding whether to continue.",
        ),
        unknown,
      ],
    ),
    ai_blocker: context(
      "ai_blocker",
      "What is documented about why the pilot stopped?",
      "Describe the known blocker. If the cause has not been established, say so; this tool will not infer it.",
    ),
    ai_options: choice(
      "ai_options",
      "Have alternatives to continuing the current pilot been considered?",
      [
        option(
          "compared",
          "Yes, including changes to scope or stopping",
          "strength",
        ),
        option(
          "notyet",
          "Not yet",
          "gap",
          "Compare continuation with a smaller scope, another approach and stopping before requesting further funding.",
        ),
        unknown,
      ],
    ),
    ai_cost: fact(
      "ai_cost",
      "Are operating costs understood for the intended use?",
      "Yes, costs are documented for the intended volume",
      "Production cost assumptions remain unresolved",
      "Check operating costs at the intended volume, including support and integration, before the next funding decision.",
    ),
    ai_count: choice(
      "ai_count",
      "How many use cases are operating?",
      [
        option("small", "One to three"),
        option("medium", "Four to six"),
        option("large", "More than six"),
        unknown,
      ],
      "The number gives context. It does not determine whether governance is adequate.",
    ),
    ai_problem: choice("ai_problem", "What prompted the portfolio review?", [
      option("cost", "Cost concerns"),
      option("quality", "Quality or incidents"),
      option("vendor", "Provider delivery"),
      option("approval", "Approval process"),
      option("routine", "A routine review with no specific problem"),
      unknown,
    ]),
    ai_reporting: fact(
      "ai_reporting",
      "Is cost, risk and provider performance reviewed across the portfolio?",
      "Yes, reporting and review responsibilities are in place",
      "There is no agreed portfolio reporting arrangement",
      "Agree the information and review responsibilities needed to make portfolio decisions.",
    ),
    ai_monitor: fact(
      "ai_monitor",
      "Are quality monitoring and incident responsibilities in place?",
      "Yes, for the use cases in scope",
      "Monitoring or incident responsibilities are incomplete",
      "Identify the missing monitoring or incident arrangements for the affected use cases.",
    ),
    ai_approval: fact(
      "ai_approval",
      "Are approval responsibilities and criteria defined?",
      "Yes, they are defined for the portfolio",
      "Responsibilities or criteria are not defined",
      "Define how new and changed use cases are reviewed, in proportion to their impact.",
    ),

    fin_goal: choice("fin_goal", "Which decision are you preparing for?", [
      option("validation", "Validate a product proposition"),
      option("launch", "Plan a first launch"),
      option("expansion", "Enter another market"),
      option("operations", "Improve the business in its current market"),
      option("partners", "Select or replace a partner or provider"),
    ]),
    fin_activity: context(
      "fin_activity",
      "What does the product do?",
      "Describe the activity, for example payments, lending or software for financial services. Product type alone does not establish authorisation requirements.",
    ),
    fin_customer: context(
      "fin_customer",
      "Who is the target customer?",
      "Describe the customer group and the need the product addresses.",
    ),
    fin_market: context(
      "fin_market",
      "Which market does this decision concern?",
      "Name the current or proposed market. This gives context; the result is not jurisdiction-specific advice.",
    ),
    fin_current_market: context(
      "fin_current_market",
      "Where does the product operate today?",
      "This distinguishes your existing operation from the proposed expansion.",
    ),
    fin_demand: choice(
      "fin_demand",
      "What evidence supports customer demand?",
      [
        option("paid", "Paying customers", "strength"),
        option("tested", "Structured research or trials", "context"),
        option(
          "assumed",
          "Interest or assumptions without structured validation",
          "gap",
          "Test the customer need and willingness to pay before treating demand as established.",
        ),
        unknown,
      ],
      "Revenue or interest alone does not establish sustainable unit economics.",
    ),
    fin_economics: choice(
      "fin_economics",
      "How much of the commercial model is supported by measured inputs?",
      [
        option("measured", "Key revenues and costs are measured", "strength"),
        option(
          "mixed",
          "A mix of measured inputs and assumptions",
          "gap",
          "Identify the assumptions with the greatest effect on the model and test them.",
        ),
        option(
          "assumed",
          "Inputs are mainly assumptions",
          "gap",
          "Use sensitivity analysis and targeted validation before judging the model’s commercial viability.",
        ),
        option(
          "none",
          "A commercial model has not been prepared",
          "gap",
          "Set out pricing, acquisition and servicing costs, separating assumptions from observations.",
        ),
        unknown,
      ],
    ),
    fin_requirements: fact(
      "fin_requirements",
      "Have the operating requirements been documented?",
      "Yes, for the proposed activity and market",
      "Requirements are not yet documented",
      "Identify operational, security and financial-crime responsibilities for the proposed model with relevant specialists.",
    ),
    fin_advice: choice(
      "fin_advice",
      "What is known about the relevant authorisation requirements?",
      [
        option(
          "obtained",
          "Qualified advice has established the requirements",
          "strength",
        ),
        option(
          "pending",
          "Qualified advice is being obtained",
          "context",
          "Record unresolved questions and incorporate the advice into the operating plan when available.",
        ),
        option(
          "none",
          "The requirements have not been assessed",
          "unknown",
          "Obtain appropriate advice on the proposed activity and market before relying on an operating route.",
        ),
        unknown,
      ],
    ),
    fin_route: choice(
      "fin_route",
      "What is the status of the proposed operating route?",
      [
        option(
          "held",
          "Relevant permissions are held",
          "context",
          "Check that the documented permissions cover this activity and market; the tool has not verified their scope.",
        ),
        option(
          "application",
          "An application is in progress",
          "context",
          "Keep the pending decision as an unresolved launch dependency; this tool cannot predict its outcome.",
        ),
        option(
          "planned",
          "An application is planned",
          "context",
          "Establish the preparation requirements with qualified advisers before committing to a launch sequence.",
        ),
        option(
          "partner",
          "A partner arrangement is being evaluated",
          "context",
          "Clarify the partner’s permissions, onboarding requirements and the responsibilities of each party with appropriate advisers.",
        ),
        option(
          "notrequired",
          "Advice indicates permissions are not required for the proposed activity",
          "context",
          "Keep the advice and its assumptions linked to the proposed activity and market.",
        ),
        unknown,
      ],
    ),
    fin_partners: choice(
      "fin_partners",
      "What is the status of required partners?",
      [
        option("agreed", "Required arrangements are agreed", "strength"),
        option(
          "open",
          "Required partners or terms remain unresolved",
          "gap",
          "Identify the unresolved partner decisions, their requirements and their effect on the plan.",
        ),
        option(
          "notneeded",
          "No external partner is needed for the current scope",
        ),
        unknown,
      ],
    ),
    fin_selection: fact(
      "fin_selection",
      "Are provider requirements and comparison criteria agreed?",
      "Yes, including cost and operating responsibilities",
      "Criteria have not yet been agreed",
      "Define capabilities, total cost, assurance, integration and exit requirements before comparing providers.",
    ),
    fin_integration: fact(
      "fin_integration",
      "Are integration and operational responsibilities agreed?",
      "Yes, responsibilities and dependencies are documented",
      "Responsibilities or dependencies remain unresolved",
      "Agree who integrates, operates and supports each service and record the dependencies.",
    ),
    fin_plan: fact(
      "fin_plan",
      "Are the next decision points and responsibilities documented?",
      "Yes, with owners and budget assumptions",
      "They are not yet documented",
      "Set out the next decisions, their evidence requirements and the people responsible.",
    ),

    sec_reviewer: choice("sec_reviewer", "Who is asking for the review?", [
      option("customer", "A customer"),
      option("partner", "A bank or other partner"),
      option("internal", "Our own leadership"),
      option("other", "Another reviewer"),
      unknown,
    ]),
    sec_scope: context(
      "sec_scope",
      "Which service or system is in scope?",
      "Name the service and the type of information involved. Do not include sensitive records or security details.",
    ),
    sec_request: choice(
      "sec_request",
      "Do you have the actual request or questionnaire?",
      [
        option("yes", "Yes, the review requirements are available", "strength"),
        option(
          "no",
          "Not yet",
          "unknown",
          "Obtain the reviewer’s requirements before treating this checklist as the review scope.",
        ),
        unknown,
      ],
    ),
    sec_deadline: context(
      "sec_deadline",
      "Is there an important review date?",
      "Optional context only. This tool does not estimate completion time or whether a deadline can be met.",
    ),
  };

  const securityAreas = [
    [
      "policy",
      "Security ownership and policy",
      "Who owns security responsibilities, and what current policy records support them?",
    ],
    [
      "risk",
      "Risk assessment and treatment",
      "What risks have been assessed, and what treatment or acceptance decisions are recorded?",
    ],
    [
      "mfa",
      "Authentication controls",
      "What evidence covers authentication controls for the systems in scope?",
    ],
    [
      "access",
      "Access changes and removal",
      "Can you evidence how access is granted, changed and removed?",
    ],
    [
      "privileged",
      "Privileged access",
      "What records identify privileged access and its review?",
    ],
    [
      "inventory",
      "System and information ownership",
      "What records identify relevant systems, information and responsible owners?",
    ],
    [
      "encryption",
      "Data protection and keys",
      "What evidence explains data protection and key-management responsibilities?",
    ],
    [
      "suppliers",
      "Supplier assurance",
      "What evidence covers suppliers that support the service or hold relevant information?",
    ],
    [
      "cloud",
      "Cloud responsibilities",
      "Are responsibilities recorded for the cloud services in scope?",
    ],
    [
      "vulnerabilities",
      "Vulnerability management",
      "What records show how identified vulnerabilities are assessed and addressed?",
    ],
    [
      "changes",
      "Production changes",
      "What evidence shows how production changes are authorised and recorded?",
    ],
    [
      "logging",
      "Logging and review",
      "What evidence covers logging, protection of records and review responsibilities?",
    ],
    [
      "recovery",
      "Backup and recovery",
      "What records show backup arrangements and the recovery tests actually performed?",
    ],
    [
      "incidents",
      "Incident preparedness",
      "What evidence covers response roles, escalation and exercises?",
    ],
  ];
  securityAreas.forEach(([id, title, help]) => {
    questions["sec_" + id] = choice(
      "sec_" + id,
      title,
      [
        option("present", "Implemented with current evidence", "strength"),
        option(
          "evidence",
          "Implemented, but evidence is incomplete",
          "gap",
          "Locate or complete supporting evidence for this area before making a claim in the review.",
        ),
        option(
          "partial",
          "Partly implemented",
          "gap",
          "Establish what remains incomplete and its impact on the service and review requirements.",
        ),
        option(
          "absent",
          "Not implemented",
          "gap",
          "Assess this gap against the actual service risk and reviewer requirements before agreeing treatment.",
        ),
        unknown,
        option("na", "Not applicable to this scope", "excluded"),
      ],
      help +
        " Select the state you can currently support. Not applicable requires a reason.",
    );
  });
  const aiCommon = ["ai_objective", "ai_lead", "ai_owner"];
  const branches = {
    ai: {
      investment: [
        ...aiCommon,
        "ai_value",
        "ai_target",
        "ai_budget",
        "ai_data",
        "ai_integration",
        "ai_delivery",
        "ai_operator",
        "ai_risk",
      ],
      pilot: [
        ...aiCommon,
        "ai_results",
        "ai_blocker",
        "ai_target",
        "ai_data",
        "ai_integration",
        "ai_delivery",
        "ai_operator",
        "ai_cost",
        "ai_risk",
        "ai_options",
      ],
      portfolio: [
        ...aiCommon,
        "ai_count",
        "ai_problem",
        "ai_cost",
        "ai_reporting",
        "ai_monitor",
        "ai_approval",
        "ai_risk",
      ],
    },
    fin: {
      validation: [
        "fin_activity",
        "fin_customer",
        "fin_market",
        "fin_demand",
        "fin_economics",
        "fin_advice",
        "fin_plan",
      ],
      launch: [
        "fin_activity",
        "fin_customer",
        "fin_market",
        "fin_demand",
        "fin_economics",
        "fin_requirements",
        "fin_advice",
        "fin_route",
        "fin_partners",
        "fin_integration",
        "fin_plan",
      ],
      expansion: [
        "fin_activity",
        "fin_customer",
        "fin_current_market",
        "fin_market",
        "fin_demand",
        "fin_economics",
        "fin_requirements",
        "fin_advice",
        "fin_route",
        "fin_partners",
        "fin_integration",
        "fin_plan",
      ],
      operations: [
        "fin_activity",
        "fin_customer",
        "fin_market",
        "fin_demand",
        "fin_economics",
        "fin_requirements",
        "fin_partners",
        "fin_integration",
        "fin_plan",
      ],
      partners: [
        "fin_activity",
        "fin_customer",
        "fin_market",
        "fin_requirements",
        "fin_advice",
        "fin_route",
        "fin_selection",
        "fin_partners",
        "fin_integration",
        "fin_plan",
      ],
    },
  };
  const definitions = {
    ai: {
      name: "AI project self-assessment",
      goal: "ai_goal",
      service: "/expertise/ai-strategy",
      support:
        "An AI investment assessment or focused pilot review can examine the supporting evidence. Portfolio oversight is separately scoped where it addresses an agreed need.",
    },
    fin: {
      name: "Fintech launch and expansion self-assessment",
      goal: "fin_goal",
      service: "/expertise/fintech-product",
      support:
        "A scoped commercial or market-entry review can investigate these dependencies. Partner selection can be commissioned as a focused engagement.",
    },
    sec: {
      name: "Customer security review readiness check",
      service: "/expertise/security-posture",
      support:
        "Customer security review support can review the actual request, examine evidence and help prepare accurate responses. DFG does not provide ISO certification or independent audit opinions.",
    },
  };
  const boundary =
    "This automated summary is based on your answers. It identifies topics to investigate; it does not verify readiness or predict approval, implementation cost or delivery time.";
  function steps(kind, answers = {}) {
    if (!definitions[kind]) throw new Error("Unknown assessment");
    if (kind === "sec")
      return [
        "sec_reviewer",
        "sec_scope",
        "sec_request",
        "sec_deadline",
        ...securityAreas.map(([id]) => "sec_" + id),
      ].map((id) => questions[id]);
    const goal = definitions[kind].goal;
    const selected = answers[goal] && answers[goal].value;
    return [goal, ...(branches[kind][selected] || [])].map(
      (id) => questions[id],
    );
  }
  function selectedOption(q, answer) {
    return (
      q.options && q.options.find((o) => o.value === (answer && answer.value))
    );
  }
  function answered(q, answer) {
    if (q.type === "text")
      return !!(
        answer &&
        typeof answer.value === "string" &&
        answer.value.trim()
      );
    const o = selectedOption(q, answer);
    return (
      !!o &&
      (o.kind !== "excluded" || !!(answer.reason && answer.reason.trim()))
    );
  }
  function update(kind, answers, id, answer) {
    if (!steps(kind, answers).some((q) => q.id === id))
      throw new Error("Question outside current branch");
    const next = { ...answers, [id]: answer };
    const active = new Set(steps(kind, next).map((q) => q.id));
    return Object.fromEntries(
      Object.entries(next).filter(([key]) => active.has(key)),
    );
  }
  function result(kind, answers = {}) {
    const def = definitions[kind];
    const rows = steps(kind, answers).map((q) => {
      const a = answers[q.id];
      const valid = answered(q, a);
      const o = selectedOption(q, a);
      return {
        id: q.id,
        question: q.title,
        answer: !valid
          ? "Not answered"
          : q.type === "text"
            ? a.value.trim()
            : o.label,
        kind: !valid ? "unanswered" : q.type === "text" ? "context" : o.kind,
        reason: valid && o && o.kind === "excluded" ? a.reason.trim() : "",
        action: valid && o && o.action ? o.action : "",
      };
    });
    const strengths = rows.filter((r) => r.kind === "strength");
    const gaps = rows.filter((r) => r.kind === "gap");
    const unknowns = rows.filter(
      (r) => r.kind === "unknown" || r.kind === "unanswered",
    );
    const actions = rows
      .filter((r) => r.action)
      .map((r) => ({
        id: r.id,
        basis: r.question + ": " + r.answer,
        text: r.action,
      }));
    const controls = rows.filter((r) =>
      securityAreas.some(([id]) => "sec_" + id === r.id),
    );
    const coverage =
      kind === "sec"
        ? {
            evidenced: controls.filter((r) => r.kind === "strength").length,
            applicableAnswered: controls.filter(
              (r) => r.kind === "strength" || r.kind === "gap",
            ).length,
            unknown: controls.filter((r) => r.kind === "unknown").length,
            unanswered: controls.filter((r) => r.kind === "unanswered").length,
            excluded: controls.filter((r) => r.kind === "excluded").length,
            total: controls.length,
          }
        : null;
    const goalRow = rows.find((r) => r.id === def.goal);
    const objective = goalRow
      ? goalRow.answer
      : "Prepare evidence for the review scope you described";
    const service =
      kind === "fin" &&
      answers.fin_goal &&
      answers.fin_goal.value === "partners"
        ? "/expertise/partnerships"
        : def.service;
    const support =
      service === "/expertise/partnerships"
        ? "A focused partner-selection engagement can define comparison criteria, examine alternatives and prepare onboarding requirements."
        : def.support;
    return {
      name: def.name,
      objective,
      rows,
      strengths,
      gaps,
      unknowns,
      actions,
      coverage,
      service,
      support,
      boundary,
    };
  }
  function summary(r) {
    const lines = [
      r.name,
      "Objective: " + r.objective,
      r.boundary,
      "",
      "Your answers:",
    ];
    r.rows.forEach((x) =>
      lines.push(
        "- " +
          x.question +
          ": " +
          x.answer +
          (x.reason ? " — Reason: " + x.reason : ""),
      ),
    );
    lines.push(
      "",
      "Suggested next actions (not a delivery schedule or risk ranking):",
    );
    r.actions.forEach((x) => lines.push("- " + x.text + " Basis: " + x.basis));
    if (r.unknowns.length)
      lines.push(
        "Clarify the uncertain and unanswered items with the responsible people before drawing conclusions.",
      );
    if (!r.actions.length && !r.unknowns.length)
      lines.push(
        "No further actions were identified by these limited rules. Review the supporting evidence and actual scope before relying on the answers.",
      );
    return lines.join("\n");
  }
  return {
    definitions,
    questions,
    steps,
    update,
    answered,
    result,
    summary,
    boundary,
  };
});
