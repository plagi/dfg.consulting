/* Browser interface for the local, rule-based self-assessments. */
(function () {
  "use strict";
  const model = window.DFGAssessment;
  if (!model) return;
  function el(tag, cls, text) {
    const node = document.createElement(tag);
    if (cls) node.className = cls;
    if (text !== undefined) node.textContent = text;
    return node;
  }
  function button(text, fn, cls = "") {
    const node = el("button", cls, text);
    node.type = "button";
    node.addEventListener("click", fn);
    return node;
  }
  document.querySelectorAll("[data-check]").forEach((root) => {
    const kind = root.dataset.check;
    const definition = model.definitions[kind];
    let answers = {},
      index = 0,
      view = "question",
      returnToReview = false;
    function save(id, value, reason = "") {
      answers = model.update(kind, answers, id, { value, reason });
    }
    function focusHeading() {
      const heading = root.querySelector("[data-focus]");
      if (heading) heading.focus({ preventScroll: true });
      root.scrollIntoView({ block: "start", behavior: "auto" });
    }
    function transition(nextView) {
      view = nextView;
      render();
      focusHeading();
    }
    function header(label) {
      const bar = el("div", "bar");
      bar.append(
        el("span", "name", definition.name),
        el("span", "step", label),
      );
      root.append(bar);
    }
    function heading(body, text) {
      const h = el("h2", "q", text);
      h.tabIndex = -1;
      h.dataset.focus = "";
      body.append(h);
    }
    function renderQuestion() {
      const steps = model.steps(kind, answers),
        q = steps[index];
      const first = definition.goal && q.id === definition.goal;
      header(
        first
          ? "Choose your starting point"
          : "Question " + (index + 1) + " of " + steps.length,
      );
      const body = el("div", "body");
      heading(body, q.title);
      if (q.help) body.append(el("p", "hint", q.help));
      const answer = answers[q.id] || { value: "", reason: "" };
      const fieldset = el("fieldset", "opts");
      const legend = el("legend", "sr-only", q.title);
      fieldset.append(legend);
      const reasonLabel = el(
        "label",
        "reason-label",
        "Why is this area not applicable?",
      );
      const reasonInput = el("textarea", "answer-input");
      reasonInput.maxLength = 500;
      reasonInput.value = answer.reason || "";
      reasonInput.required = true;
      reasonLabel.append(reasonInput);
      reasonLabel.hidden = answer.value !== "na";
      let next;
      function selected(value) {
        save(q.id, value, reasonInput.value);
        reasonLabel.hidden = value !== "na";
        fieldset
          .querySelectorAll("label.opt")
          .forEach((label) =>
            label.classList.toggle("sel", label.querySelector("input").checked),
          );
        if (next) next.disabled = !model.answered(q, answers[q.id]);
      }
      if (q.type === "text") {
        const label = el("label", "answer-label", "Your answer");
        const input = el("textarea", "answer-input");
        input.maxLength = 600;
        input.rows = 3;
        input.value = answer.value;
        input.addEventListener("input", () => {
          save(q.id, input.value);
          next.disabled = !input.value.trim();
        });
        label.append(input);
        body.append(label);
      } else {
        q.options.forEach((o) => {
          const label = el(
            "label",
            "opt" + (o.value === answer.value ? " sel" : ""),
          );
          const input = document.createElement("input");
          input.type = "radio";
          input.name = q.id;
          input.value = o.value;
          input.checked = o.value === answer.value;
          input.addEventListener("change", () => selected(o.value));
          label.append(input, el("span", "", o.label));
          fieldset.append(label);
        });
        body.append(fieldset, reasonLabel);
        reasonInput.addEventListener("input", () => {
          save(q.id, "na", reasonInput.value);
          next.disabled = !model.answered(q, answers[q.id]);
        });
      }
      root.append(body);
      const foot = el("div", "foot");
      const actions = el("div", "nav");
      const back = button(
        returnToReview ? "Back to answer review" : "Back",
        () => {
          if (returnToReview) transition("review");
          else {
            index--;
            transition("question");
          }
        },
      );
      back.disabled = index === 0 && !returnToReview;
      const go = () => {
        if (returnToReview) {
          returnToReview = false;
          transition("review");
          return;
        }
        if (index + 1 >= model.steps(kind, answers).length)
          transition("review");
        else {
          index++;
          transition("question");
        }
      };
      next = button(
        returnToReview
          ? "Save and review answers"
          : first
            ? "Continue"
            : index === steps.length - 1
              ? "Review answers"
              : "Next question",
        go,
        "pri",
      );
      next.disabled = !model.answered(q, answers[q.id]);
      actions.append(back, next);
      if (!first)
        foot.append(
          button(
            "Skip for now",
            () => {
              save(q.id, "");
              go();
            },
            "skip-question",
          ),
        );
      else
        foot.append(
          el("span", "note", "Your choice determines the questions."),
        );
      foot.append(actions);
      root.append(foot);
    }
    function renderReview() {
      const r = model.result(kind, answers);
      header("Review your answers");
      const body = el("div", "body");
      heading(body, "Check the facts before reading the summary.");
      body.append(
        el(
          "p",
          "hint",
          "You can edit any answer. Skipped and uncertain items stay separate from reported gaps.",
        ),
      );
      const rows = el("dl", "answer-review");
      r.rows.forEach((row, i) => {
        const div = el("div");
        div.append(el("dt", "", row.question));
        const dd = el(
          "dd",
          "",
          row.answer + (row.reason ? " — " + row.reason : ""),
        );
        dd.append(
          button(
            "Edit",
            () => {
              index = i;
              returnToReview = true;
              transition("question");
            },
            "edit-answer",
          ),
        );
        dd.lastChild.setAttribute("aria-label", "Edit: " + row.question);
        div.append(dd);
        rows.append(div);
      });
      body.append(rows);
      root.append(body);
      const foot = el("div", "foot"),
        actions = el("div", "nav");
      actions.append(
        button("Read my summary", () => transition("result"), "pri"),
      );
      foot.append(
        el("span", "note", "No information has been submitted."),
        actions,
      );
      root.append(foot);
    }
    function group(body, title, rows, empty) {
      const section = el("div", "result-section");
      section.append(el("h3", "", title));
      if (!rows.length) section.append(el("p", "", empty));
      else {
        const list = el("ul", "result-list");
        rows.forEach((row) => {
          const li = el("li");
          li.append(
            el("strong", "", row.question),
            el("span", "", row.answer + (row.reason ? " — " + row.reason : "")),
          );
          list.append(li);
        });
        section.append(list);
      }
      body.append(section);
    }
    function renderResult() {
      const r = model.result(kind, answers);
      header("Your summary");
      const body = el("div", "body res");
      heading(body, "Your next questions, based on your answers.");
      body.append(el("p", "result-boundary", r.boundary));
      body.append(el("h3", "", "Your objective"), el("p", "", r.objective));
      if (r.coverage) {
        const c = r.coverage;
        body.append(
          el(
            "p",
            "coverage",
            "You report current evidence for " +
              c.evidenced +
              " of " +
              c.applicableAnswered +
              " applicable items with a known status.",
          ),
        );
        body.append(
          el(
            "p",
            "",
            c.unknown +
              " not sure · " +
              c.unanswered +
              " unanswered · " +
              c.excluded +
              " marked not applicable · " +
              c.total +
              " areas in this check.",
          ),
        );
        body.append(
          el(
            "p",
            "",
            "This describes your responses, not a security score. Applicability and supporting evidence still need review.",
          ),
        );
      }
      const reported = document.createElement("details");
      reported.className = "reported";
      reported.append(el("summary", "", "What you reported"));
      const list = el("dl", "answer-review");
      r.rows.forEach((row) => {
        const div = el("div");
        div.append(
          el("dt", "", row.question),
          el("dd", "", row.answer + (row.reason ? " — " + row.reason : "")),
        );
        list.append(div);
      });
      reported.append(list);
      body.append(reported);
      group(
        body,
        "Reported strengths",
        r.strengths,
        "None recorded in the completed answers.",
      );
      group(
        body,
        "Reported gaps",
        r.gaps,
        "None reported. Uncertain and skipped items are shown separately.",
      );
      group(
        body,
        "Still to clarify",
        r.unknowns,
        "No unanswered or uncertain items in this summary. The underlying evidence has not been verified.",
      );
      const excluded = r.rows.filter((row) => row.kind === "excluded");
      if (excluded.length) group(body, "Marked not applicable", excluded, "");
      const actionSection = el("div", "result-section");
      actionSection.append(el("h3", "", "Suggested next actions"));
      actionSection.append(
        el(
          "p",
          "",
          "Organised by topic, not by risk ranking or delivery sequence. Agree priorities against the actual scope and impact.",
        ),
      );
      if (r.unknowns.length)
        actionSection.append(
          el(
            "p",
            "",
            "Clarify the uncertain and unanswered items above with the responsible people before drawing conclusions.",
          ),
        );
      if (!r.actions.length && !r.unknowns.length)
        actionSection.append(
          el(
            "p",
            "",
            "These limited rules identified no further actions. Review supporting evidence and the actual requirements before relying on the answers.",
          ),
        );
      r.actions.forEach((action) => {
        const item = el("article", "result-action");
        item.append(
          el("p", "", action.text),
          el("p", "basis", "Based on your answer — " + action.basis),
        );
        actionSection.append(item);
      });
      body.append(actionSection);
      const support = el("div", "foryou");
      support.append(
        el("h3", "", "If you want a closer review"),
        el("p", "", r.support),
      );
      const a = el("a", "text-link", "Explore the relevant engagement →");
      a.href = r.service;
      support.append(a);
      body.append(support);
      const actions = el("div", "acts");
      actions.append(
        button("Review or edit answers", () => transition("review")),
      );
      actions.append(
        button(
          "Include summary in an enquiry",
          () => {
            const field = document.querySelector(
              '#contactForm textarea[name="problem"]',
            );
            if (!field) return;
            field.value = field.value
              .replace(
                /\n*\[Self-assessment summary\][\s\S]*?\n\[End self-assessment summary\]/,
                "",
              )
              .trimEnd();
            field.value +=
              (field.value ? "\n\n" : "") +
              "[Self-assessment summary]\n" +
              model.summary(r) +
              "\n[End self-assessment summary]";
            document
              .getElementById("contact")
              .scrollIntoView({ block: "start" });
            field.focus({ preventScroll: true });
          },
          "pri",
        ),
      );
      actions.append(
        button("Start a new assessment", () => {
          answers = {};
          index = 0;
          returnToReview = false;
          transition("question");
        }),
      );
      body.append(
        actions,
        el(
          "p",
          "sample-note",
          "Including a summary only fills the enquiry below. You can edit it before pressing Send enquiry.",
        ),
      );
      root.append(body);
    }
    function render() {
      root.replaceChildren();
      if (view === "review") renderReview();
      else if (view === "result") renderResult();
      else renderQuestion();
    }
    render();
  });
})();
