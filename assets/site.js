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

  /* Menu */
  var btn = document.getElementById("menuBtn"),
    idx = document.getElementById("idx");
  if (btn && idx) {
    btn.addEventListener("click", function () {
      var o = idx.classList.toggle("open");
      btn.setAttribute("aria-expanded", o);
    });
    idx.addEventListener("click", function (e) {
      if (e.target.tagName === "A") {
        idx.classList.remove("open");
        btn.setAttribute("aria-expanded", "false");
      }
    });
  }

  /* Reading progress line */
  (function () {
    var prog = document.getElementById("prog");
    if (!prog) return;
    var tick = false;
    function upd() {
      var y = window.scrollY || 0;
      var max = document.documentElement.scrollHeight - window.innerHeight;
      prog.style.width = (max > 0 ? Math.min(100, (y / max) * 100) : 0) + "%";
      tick = false;
    }
    window.addEventListener(
      "scroll",
      function () {
        if (!tick) {
          tick = true;
          requestAnimationFrame(upd);
        }
      },
      { passive: true },
    );
    upd();
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
    h.innerHTML = words
      .map(function (w, i) {
        return (
          '<span class="w" style="animation-delay:' +
          (0.15 + i * 0.09) +
          's">' +
          w +
          "</span>"
        );
      })
      .join(" ");
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
