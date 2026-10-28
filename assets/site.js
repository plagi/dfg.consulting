/* dfg.consulting — header, contact form, small motion */
(function () {
  document.documentElement.classList.add("js");
  var reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  function el(tag, cls, html) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (html != null) e.innerHTML = html;
    return e;
  }

  /* Menu: full-height panel on phones. Escape or a link closes it; the page does not scroll behind it. */
  var btn = document.getElementById("menuBtn"),
    idx = document.getElementById("idx");
  if (btn && idx) {
    var setMenu = function (open) {
      idx.classList.toggle("open", open);
      btn.setAttribute("aria-expanded", String(open));
      btn.textContent = open ? "Close" : "Menu";
      document.body.classList.toggle("menu-open", open);
    };
    btn.addEventListener("click", function () {
      setMenu(!idx.classList.contains("open"));
    });
    idx.addEventListener("click", function (e) {
      if (e.target.closest("a")) setMenu(false);
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && idx.classList.contains("open")) {
        setMenu(false);
        btn.focus();
      }
    });
    matchMedia("(min-width: 701px)").addEventListener("change", function (m) {
      if (m.matches) setMenu(false);
    });
  }

  /* Stage picker: tabs with arrow-key support. Without JavaScript every stage is listed in full. */
  (function () {
    var list = document.querySelector(".stage-tabs");
    if (!list) return;
    var tabs = [].slice.call(list.querySelectorAll('[role="tab"]'));
    var panels = tabs.map(function (t) {
      return document.getElementById(t.getAttribute("aria-controls"));
    });
    function select(i, focus) {
      tabs.forEach(function (t, j) {
        var on = i === j;
        t.setAttribute("aria-selected", String(on));
        t.tabIndex = on ? 0 : -1;
        panels[j].hidden = !on;
      });
      if (focus) tabs[i].focus();
      tabs[i].scrollIntoView({ block: "nearest", inline: "nearest" });
    }
    tabs.forEach(function (t, i) {
      t.addEventListener("click", function () {
        select(i, false);
      });
      t.addEventListener("keydown", function (e) {
        var k = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 }[e.key];
        if (e.key === "Home") k = -i;
        if (e.key === "End") k = tabs.length - 1 - i;
        if (k === undefined) return;
        e.preventDefault();
        select((i + k + tabs.length) % tabs.length, true);
      });
    });
    list.hidden = false;
    list.parentNode.classList.add("tabs-on");
    panels.forEach(function (p, j) {
      p.hidden = j !== 0;
      p.tabIndex = 0;
    });
  })();

  /* Sections rise into view once. Skipped entirely when the visitor prefers less motion. */
  (function () {
    var items = document.querySelectorAll("[data-reveal]");
    if (reduce || !items.length || !("IntersectionObserver" in window)) return;
    document.documentElement.classList.add("reveal-on");
    var io = new IntersectionObserver(
      function (es) {
        es.forEach(function (e) {
          if (e.isIntersecting) {
            e.target.classList.add("in");
            io.unobserve(e.target);
          }
        });
      },
      { rootMargin: "0px 0px -8% 0px" },
    );
    [].forEach.call(items, function (n) {
      io.observe(n);
    });
  })();

  /* Active section in the nav (home only) */
  (function () {
    var links = [].slice.call(document.querySelectorAll('.idx a[href^="#"]'));
    if (!links.length || !("IntersectionObserver" in window)) return;
    var map = {};
    links.forEach(function (a) {
      var s = document.querySelector(a.getAttribute("href"));
      if (s) map[s.id] = a;
    });
    var io = new IntersectionObserver(
      function (es) {
        es.forEach(function (e) {
          if (e.isIntersecting) {
            links.forEach(function (a) {
              a.classList.remove("on");
            });
            if (map[e.target.id]) map[e.target.id].classList.add("on");
          }
        });
      },
      { rootMargin: "-40% 0px -55% 0px" },
    );
    Object.keys(map).forEach(function (id) {
      io.observe(document.getElementById(id));
    });
  })();

  /* Headline: one rise, word by word */
  (function () {
    var h = document.getElementById("h1");
    if (!h || reduce) return;
    var words = h.textContent.trim().split(/\s+/);
    h.textContent = "";
    words.forEach(function (w, i) {
      var span = document.createElement("span");
      span.className = "w";
      span.style.animationDelay = 0.15 + i * 0.09 + "s";
      span.textContent = w;
      if (i) h.appendChild(document.createTextNode(" "));
      h.appendChild(span);
    });
  })();

  /* Contact form: posts to /api/contact; falls back to composing an email if the endpoint is unavailable */
  var BOOKING_URL = ""; // e.g. 'https://cal.com/dfg/30min'. Empty hides the button.
  var book = document.getElementById("book");
  if (book && BOOKING_URL) {
    book.href = BOOKING_URL;
    book.target = "_blank";
    book.rel = "noopener";
    book.hidden = false;
  }
  var form = document.getElementById("contactForm");
  if (!form) return;
  function note(t) {
    var status = document.getElementById("form-status");
    if (!status) {
      status = el("p", "form-status full");
      status.id = "form-status";
      status.setAttribute("role", "status");
      form.appendChild(status);
    }
    status.textContent = t;
  }
  form.addEventListener("submit", function (e) {
    e.preventDefault();
    var d = new FormData(form),
      LBL = {
        name: "your name",
        company: "your company",
        email: "your email",
        problem: "a short description of your objective",
      };
    var missing = ["name", "company", "email", "problem"].filter(function (k) {
      return !String(d.get(k) || "").trim();
    });
    if (String(d.get("problem") || "").length > 20000) {
      note(
        "Please shorten the enquiry to 20,000 characters or fewer. Your text has been kept.",
      );
      form.querySelector("[name=problem]").focus();
      return;
    }
    var em = String(d.get("email") || "").trim();
    if (em && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(em))
      missing.push("email:format");
    ["name", "company", "email", "problem"].forEach(function (k) {
      var f = form.querySelector("[name=" + k + "]");
      var bad =
        missing.indexOf(k) >= 0 ||
        (k === "email" && missing.indexOf("email:format") >= 0);
      f.classList.toggle("bad", bad);
      f.setAttribute("aria-invalid", bad ? "true" : "false");
    });
    if (missing.length) {
      var parts = missing
        .filter(function (k) {
          return k !== "email:format";
        })
        .map(function (k) {
          return LBL[k];
        });
      var msg = parts.length ? "Still needed: " + parts.join(", ") + "." : "";
      if (missing.indexOf("email:format") >= 0)
        msg += (msg ? " " : "") + "The email address does not look right.";
      note(msg, true);
      form.querySelector(".bad").focus();
      return;
    }
    var body =
      "Name: " +
      d.get("name") +
      "\nCompany: " +
      d.get("company") +
      "\nEmail: " +
      d.get("email") +
      "\n\n" +
      d.get("problem");
    var mailto =
      "mailto:hello@dfg.consulting?subject=" +
      encodeURIComponent("DFG: " + d.get("company")) +
      "&body=" +
      encodeURIComponent(body);
    var sendBtn = form.querySelector(".send .btn");
    function fallback() {
      sendBtn.disabled = false;
      window.location.href = mailto;
      note(
        "Your email client should open with the message ready to send. If it did not, write to hello@dfg.consulting.",
        true,
      );
    }
    if (!window.fetch || !window.Promise) {
      fallback();
      return;
    }
    sendBtn.disabled = true;
    note("Sending your enquiry…");
    fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: d.get("name"),
        company: d.get("company"),
        email: d.get("email"),
        problem: d.get("problem"),
        attached: [],
        website: d.get("website"),
      }),
    })
      .then(function (r) {
        return r.json().then(
          function (j) {
            return r.ok && j.ok;
          },
          function () {
            return false;
          },
        );
      })
      .then(function (ok) {
        if (!ok) {
          fallback();
          return;
        }
        sendBtn.disabled = false;
        form.reset();
        note(
          "Your enquiry has been sent. We will reply to discuss the next step.",
        );
      }, fallback);
  });
})();
