const { test } = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs/promises");
const path = require("node:path");
async function middleware() {
  const source = await fs.readFile(
    path.join(__dirname, "../functions/_middleware.js"),
    "utf8",
  );
  return import(
    "data:text/javascript;base64," + Buffer.from(source).toString("base64")
  );
}
for (const [from, to] of [
  ["/expertise/data-and-it", "/expertise/ai-strategy#data-readiness"],
  ["/expertise/data-and-it.html", "/expertise/ai-strategy#data-readiness"],
  [
    "/expertise/incident-response/",
    "/expertise/security-posture#incident-preparedness",
  ],
  [
    "/expertise/incident-response.html",
    "/expertise/security-posture#incident-preparedness",
  ],
  ["/iso-27001", "/expertise/security-posture#scope"],
  ["/bank-onboarding", "/fintech-readiness"],
])
  test("redirects " + from + " to its supported service scope", async () => {
    const { onRequest } = await middleware();
    const r = await onRequest({
      request: new Request("https://dfg.consulting" + from + "?source=test"),
      next: () => null,
    });
    const target = new URL(to, "https://dfg.consulting");
    target.search = "?source=test";
    assert.equal(r.status, 301);
    assert.equal(r.headers.get("location"), target.href);
  });
test("preserves canonical-host routing for other requests", async () => {
  const { onRequest } = await middleware();
  const r = await onRequest({
    request: new Request("http://www.dfg.consulting/privacy?source=test"),
    next: () => null,
  });
  assert.equal(
    r.headers.get("location"),
    "https://dfg.consulting/privacy?source=test",
  );
});
