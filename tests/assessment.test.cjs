const { test } = require("node:test");
const assert = require("node:assert/strict");
const model = require("../assets/assessment-model.js");
const a = (value) => ({ value });
const ids = (rows) => rows.map((row) => row.id);

test("keeps business ownership established when a technical leader runs the review", () => {
  const r = model.result("ai", {
    ai_goal: a("investment"),
    ai_lead: a("technology"),
    ai_owner: a("yes"),
  });
  assert.ok(ids(r.strengths).includes("ai_owner"));
  assert.ok(!ids(r.gaps).includes("ai_owner"));
  assert.ok(!ids(r.actions).includes("ai_lead"));
});
test("does not infer an operating gap from a provider-built pilot", () => {
  const r = model.result("ai", {
    ai_goal: a("pilot"),
    ai_delivery: a("vendor"),
    ai_operator: a("yes"),
  });
  assert.ok(ids(r.strengths).includes("ai_operator"));
  assert.ok(!ids(r.gaps).includes("ai_delivery"));
  assert.ok(!ids(r.gaps).includes("ai_operator"));
});
test("reports unresolved risks without inventing a missing review process", () => {
  const r = model.result("ai", { ai_goal: a("pilot"), ai_risk: a("blocked") });
  assert.equal(
    r.gaps.find((x) => x.id === "ai_risk").answer,
    "A defined review identified unresolved risks",
  );
  assert.match(
    r.actions.find((x) => x.id === "ai_risk").text,
    /documented risk findings/,
  );
  assert.doesNotMatch(
    r.actions.find((x) => x.id === "ai_risk").text,
    /Define|missing|undefined/,
  );
});
test("does not treat portfolio size as a governance deficiency", () => {
  const r = model.result("ai", {
    ai_goal: a("portfolio"),
    ai_count: a("large"),
    ai_reporting: a("yes"),
    ai_approval: a("yes"),
    ai_monitor: a("yes"),
  });
  assert.deepEqual(r.gaps, []);
  assert.ok(!ids(r.actions).includes("ai_count"));
});
test("offers investment evidence work when funding has not been approved", () => {
  const r = model.result("ai", {
    ai_goal: a("investment"),
    ai_budget: a("case"),
  });
  assert.ok(!ids(r.gaps).includes("ai_budget"));
  assert.match(
    r.actions.find((x) => x.id === "ai_budget").text,
    /investment assessment/,
  );
});
test("allows changing scope or stopping when pilot results miss the target", () => {
  const r = model.result("ai", {
    ai_goal: a("pilot"),
    ai_results: a("missed"),
  });
  assert.match(
    r.actions.find((x) => x.id === "ai_results").text,
    /changing scope or stopping/,
  );
});
test("records commercial uncertainty even when customers are paying", () => {
  const r = model.result("fin", {
    fin_goal: a("launch"),
    fin_demand: a("paid"),
    fin_economics: a("assumed"),
  });
  assert.ok(ids(r.strengths).includes("fin_demand"));
  assert.ok(ids(r.gaps).includes("fin_economics"));
  assert.doesNotMatch(model.summary(r), /commercially viable|ready to launch/);
});
test("distinguishes a pending application from permissions reported as held", () => {
  const get = (value) =>
    model
      .result("fin", { fin_goal: a("launch"), fin_route: a(value) })
      .actions.find((x) => x.id === "fin_route");
  assert.match(get("application").text, /pending decision/);
  assert.match(get("held").text, /cover this activity and market/);
  assert.notEqual(get("application").text, get("held").text);
});
test("avoids expansion questions when the decision concerns current operations", () => {
  const r = model.result("fin", { fin_goal: a("operations") });
  assert.ok(!ids(r.rows).includes("fin_current_market"));
  assert.doesNotMatch(
    r.actions.map((x) => x.text).join(" "),
    /next market|new market|expansion/,
  );
});
test("routes provider selection to the focused partner engagement", () => {
  assert.equal(
    model.result("fin", { fin_goal: a("partners") }).service,
    "/expertise/partnerships",
  );
});
test("separates missing information from confirmed security gaps", () => {
  const r = model.result("sec", {
    sec_policy: a("unknown"),
    sec_risk: a("absent"),
  });
  assert.deepEqual(ids(r.gaps), ["sec_risk"]);
  assert.equal(r.coverage.unknown, 1);
  assert.equal(r.coverage.unanswered, 12);
  assert.equal(r.coverage.applicableAnswered, 1);
});
test("reports all-positive security answers as unverified coverage only", () => {
  const answers = Object.fromEntries(
    model
      .steps("sec")
      .filter((q) => q.options?.some((o) => o.value === "present"))
      .map((q) => [q.id, a("present")]),
  );
  const r = model.result("sec", answers);
  assert.deepEqual(r.coverage, {
    evidenced: 14,
    applicableAnswered: 14,
    unknown: 0,
    unanswered: 0,
    excluded: 0,
    total: 14,
  });
  assert.match(r.boundary, /does not verify readiness/);
  assert.doesNotMatch(
    model.summary(r),
    /will pass|ready for approval|everything.*in place/i,
  );
});
test("does not generate a delivery schedule for absent security controls", () => {
  const answers = Object.fromEntries(
    model
      .steps("sec")
      .filter((q) => q.options?.some((o) => o.value === "absent"))
      .map((q) => [q.id, a("absent")]),
  );
  const r = model.result("sec", answers);
  assert.equal(r.gaps.length, 14);
  assert.doesNotMatch(
    model.summary(r),
    /\d+\s*(weeks?|months?|days?)|on time|margin/i,
  );
});
test("requires an applicability reason before excluding an item from coverage", () => {
  const missing = model.result("sec", { sec_cloud: a("na") });
  assert.equal(missing.coverage.excluded, 0);
  assert.equal(missing.coverage.unanswered, 14);
  const explained = model.result("sec", {
    sec_cloud: {
      value: "na",
      reason: "The scoped service has no cloud components.",
    },
  });
  assert.equal(explained.coverage.excluded, 1);
  assert.equal(explained.coverage.unanswered, 13);
  assert.match(
    model.summary(explained),
    /The scoped service has no cloud components/,
  );
});
test("clears irrelevant pilot evidence when switching to an investment decision", () => {
  const next = model.update(
    "ai",
    {
      ai_goal: a("pilot"),
      ai_results: a("missed"),
      ai_blocker: a("Example"),
      ai_owner: a("yes"),
    },
    "ai_goal",
    a("investment"),
  );
  assert.equal(next.ai_results, undefined);
  assert.equal(next.ai_blocker, undefined);
  assert.deepEqual(next.ai_owner, a("yes"));
  assert.doesNotMatch(
    model.summary(model.result("ai", next)),
    /Example|did not meet the agreed measure/,
  );
});
test("includes the supporting answer for every generated next action", () => {
  for (const kind of ["ai", "fin", "sec"]) {
    const r = model.result(
      kind,
      kind === "ai"
        ? { ai_goal: a("pilot") }
        : kind === "fin"
          ? { fin_goal: a("launch") }
          : {},
    );
    for (const action of r.actions) {
      const row = r.rows.find((x) => x.id === action.id);
      assert.equal(action.basis, row.question + ": " + row.answer);
    }
  }
});
