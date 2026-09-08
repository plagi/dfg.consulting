const { test } = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs/promises");
const path = require("node:path");
async function api() {
  const source = await fs.readFile(
    path.join(__dirname, "../functions/api/contact.js"),
    "utf8",
  );
  return import(
    "data:text/javascript;base64," + Buffer.from(source).toString("base64")
  );
}
function request(problem) {
  return new Request("https://dfg.consulting/api/contact", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      name: "Test",
      company: "Example",
      email: "test@example.com",
      problem,
    }),
  });
}
test("preserves an editable summary longer than the former 5000-character limit", async () => {
  const { onRequest } = await api();
  const originalFetch = global.fetch;
  let payload;
  global.fetch = async (url, init) => {
    payload = JSON.parse(init.body);
    return new Response("{}", { status: 200 });
  };
  const problem = "Summary " + "x".repeat(6500) + " End of reviewed evidence.";
  try {
    const response = await onRequest({
      request: request(problem),
      env: { RESEND_API_KEY: "test-only" },
    });
    assert.equal(response.status, 200);
    assert.ok(payload.text.includes(problem));
  } finally {
    global.fetch = originalFetch;
  }
});
test("rejects oversized enquiries without sending a truncated summary", async () => {
  const { onRequest } = await api();
  const originalFetch = global.fetch;
  let sent = false;
  global.fetch = async () => {
    sent = true;
    throw new Error("Unexpected send");
  };
  try {
    const response = await onRequest({
      request: request("x".repeat(20001)),
      env: { RESEND_API_KEY: "test-only" },
    });
    assert.equal(response.status, 400);
    assert.deepEqual(await response.json(), {
      ok: false,
      error: "message_too_long",
    });
    assert.equal(sent, false);
  } finally {
    global.fetch = originalFetch;
  }
});
