const assert = require("node:assert/strict");
const fs = require("node:fs/promises");
const path = require("node:path");
const { chromium } = require("playwright");
const { createPreview } = require("../scripts/preview.cjs");

(async () => {
  const server = await createPreview(0);
  const origin = "http://127.0.0.1:" + server.address().port;
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1440, height: 1000 },
    reducedMotion: "reduce",
  });
  const page = await context.newPage();
  const errors = [];
  page.on("pageerror", (error) => errors.push(error.message));
  const sent = [];
  await context.route("**/api/contact", async (route) => {
    sent.push(route.request().postDataJSON());
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: '{"ok":true}',
    });
  });
  const artifacts = path.join(__dirname, "../docs/preview");
  await fs.mkdir(artifacts, { recursive: true });
  try {
    const pages = [
      "/",
      "/expertise/ai-strategy",
      "/expertise/fintech-product",
      "/expertise/partnerships",
      "/expertise/security-posture",
      "/ai-readiness",
      "/fintech-readiness",
      "/security-check",
      "/privacy",
      "/terms",
      "/404",
    ];
    const checkedLinks = new Set();
    for (const url of pages) {
      await page.goto(origin + url, { waitUntil: "domcontentloaded" });
      assert.equal(
        await page.locator("h1").count(),
        1,
        url + " has one main heading",
      );
      const links = await page
        .locator("a[href]")
        .evaluateAll((nodes) =>
          nodes
            .map((n) => n.getAttribute("href"))
            .filter((u) => u.startsWith("/") || u.startsWith("#")),
        );
      for (const href of links) {
        const target = new URL(href, origin + url);
        if (checkedLinks.has(target.href)) continue;
        checkedLinks.add(target.href);
        const response = await page.request.get(target.href);
        assert.equal(response.status(), 200, "Link resolves: " + target.href);
        if (target.hash) {
          const html = await response.text();
          const exists = await page.evaluate(
            ({ html, id }) =>
              new DOMParser()
                .parseFromString(html, "text/html")
                .getElementById(id) !== null,
            { html, id: target.hash.slice(1) },
          );
          assert.equal(exists, true, "Anchor exists: " + target.href);
        }
      }
      for (const width of [390, 768, 1440]) {
        await page.setViewportSize({ width, height: 900 });
        const overflow = await page.evaluate(
          () => document.documentElement.scrollWidth > innerWidth + 1,
        );
        assert.equal(overflow, false, url + " fits viewport " + width);
      }
    }
    await page.goto(origin, { waitUntil: "networkidle" });
    assert.deepEqual(
      await page
        .locator("main > section")
        .evaluateAll((nodes) => nodes.map((n) => n.id)),
      ["outputs", "services", "method", "checks", "contact"],
      "Homepage presents deliverables before services, process, tools and enquiry",
    );
    await page.screenshot({
      path: path.join(artifacts, "homepage-desktop.png"),
      fullPage: true,
    });
    await page.setViewportSize({ width: 390, height: 844 });
    await page.screenshot({
      path: path.join(artifacts, "homepage-mobile.png"),
      fullPage: true,
    });
    await page.getByRole("button", { name: "Menu", exact: true }).click();
    await page
      .getByRole("navigation", { name: "Site" })
      .getByRole("link", { name: "How we work" })
      .click();
    assert.equal(
      await page.locator("#menuBtn").getAttribute("aria-expanded"),
      "false",
    );

    await page.goto(origin + "/ai-readiness");
    await page.locator('input[value="pilot"]').check();
    await page.getByRole("button", { name: "Continue", exact: true }).click();
    let guard = 0;
    while (
      !(await page.getByRole("button", { name: "Read my summary" }).count())
    ) {
      assert.ok(guard++ < 25, "Flow reaches answer review");
      const input = page.locator(".inst .answer-input:visible");
      if (await input.count())
        await input.fill("Review payment exception triage <example>");
      else {
        const radios = page.locator(".inst input[type=radio]");
        const name = await radios.first().getAttribute("name");
        const value =
          name === "ai_results"
            ? "missed"
            : name === "ai_delivery"
              ? "vendor"
              : null;
        await (
          value
            ? page.locator('.inst input[value="' + value + '"]')
            : radios.first()
        ).check();
      }
      await page.locator(".inst .nav .pri").click();
    }
    await page
      .getByRole("button", {
        name: "Edit: Which decision are you preparing for?",
        exact: true,
      })
      .click();
    await page.locator('input[value="investment"]').check();
    await page.getByRole("button", { name: "Save and review answers" }).click();
    assert.equal(
      await page
        .getByRole("button", {
          name: "Edit: How did the pilot perform against its objective?",
          exact: true,
        })
        .count(),
      0,
    );
    await page.getByRole("button", { name: "Read my summary" }).click();
    assert.equal(
      await page.locator(".inst script,.inst img").count(),
      0,
      "Free text is not interpreted as markup",
    );
    await page
      .getByRole("button", { name: "Include summary in an enquiry" })
      .click();
    assert.equal(sent.length, 0, "Including summary does not submit it");
    const enquiry = page.locator("textarea[name=problem]");
    const summary = await enquiry.inputValue();
    assert.match(summary, /Evaluate an AI investment/);
    assert.doesNotMatch(summary, /It did not meet the agreed measure/);
    await enquiry.fill(summary + "\nMy additional context.");
    await page
      .getByRole("button", { name: "Include summary in an enquiry" })
      .click();
    const updatedEnquiry = await enquiry.inputValue();
    assert.match(
      updatedEnquiry,
      /My additional context\./,
      "Updating a summary preserves the additional enquiry text",
    );
    assert.equal(
      updatedEnquiry.split("[Self-assessment summary]").length,
      2,
      "Only one current summary is included",
    );
    await page.locator("input[name=name]").fill("Browser verification");
    await page.locator("input[name=company]").fill("Local test");
    await page.locator("input[name=email]").fill("test@example.com");
    await page.getByRole("button", { name: "Send enquiry" }).click();
    await page
      .getByRole("status")
      .filter({ hasText: "Your enquiry has been sent" })
      .waitFor();
    assert.equal(sent.length, 1);
    assert.equal(sent[0].problem, updatedEnquiry);

    await page.goto(origin + "/security-check");
    for (let i = 0; i < 4; i++)
      await page
        .getByRole("button", { name: "Skip for now", exact: true })
        .click();
    await page.locator('input[value="na"]').check();
    assert.equal(
      await page.locator(".inst .nav .pri").isDisabled(),
      true,
      "Applicability reason required",
    );
    await page
      .locator(".reason-label textarea")
      .fill("Out of the agreed example scope.");
    await page.locator(".inst .nav .pri").click();
    guard = 0;
    while (
      !(await page.getByRole("button", { name: "Read my summary" }).count())
    ) {
      assert.ok(guard++ < 20);
      await page
        .getByRole("button", { name: "Skip for now", exact: true })
        .click();
    }
    await page.getByRole("button", { name: "Read my summary" }).click();
    assert.match(
      await page.locator(".res").innerText(),
      /13 unanswered · 1 marked not applicable/,
    );
    await page.screenshot({
      path: path.join(artifacts, "assessment-mobile.png"),
      fullPage: true,
    });
    await page.reload();
    assert.equal(
      await page.locator("input:checked").count(),
      0,
      "Reload clears session answers",
    );
    assert.deepEqual(errors, []);
    console.log(
      "Browser checks passed: 11 pages, 3 viewport widths, " +
        checkedLinks.size +
        " links, editing, branch changes, local summaries and mocked enquiry delivery.",
    );
  } finally {
    await browser.close();
    await new Promise((resolve) => server.close(resolve));
  }
})().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
