/* Ninth & Coil Strength Club — DEMO TEMPLATE (fictional). No tracking, no backend, no real scheduler. */

// SCHEDULE DATA — replace wholesale from the client's scheduler export
// Shape: { day, time, duration, type, coach, cap, bookUrl }
// Every value is a placeholder. bookUrl is swapped for the real scheduler link per class.
var SCHEDULE = [
  { day: "mon", time: "06:00", duration: "[60] min", type: "Strength", coach: "[Coach 1]", cap: "[0/12]", bookUrl: "[SCHEDULER URL — CONFIRM]" },
  { day: "mon", time: "07:15", duration: "[45] min", type: "Conditioning", coach: "[Coach 2]", cap: "[0/12]", bookUrl: "[SCHEDULER URL — CONFIRM]" },
  { day: "mon", time: "12:15", duration: "[45] min", type: "Small group", coach: "[Coach 3]", cap: "[0/6]", bookUrl: "[SCHEDULER URL — CONFIRM]" },
  { day: "mon", time: "17:30", duration: "[60] min", type: "Strength", coach: "[Coach 1]", cap: "[0/12]", bookUrl: "[SCHEDULER URL — CONFIRM]" },
  { day: "mon", time: "18:45", duration: "[90] min", type: "Open gym", coach: "[Coach 4]", cap: "[0/16]", bookUrl: "[SCHEDULER URL — CONFIRM]" },
  { day: "tue", time: "06:00", duration: "[45] min", type: "Conditioning", coach: "[Coach 2]", cap: "[0/12]", bookUrl: "[SCHEDULER URL — CONFIRM]" },
  { day: "tue", time: "07:15", duration: "[60] min", type: "Strength", coach: "[Coach 3]", cap: "[0/12]", bookUrl: "[SCHEDULER URL — CONFIRM]" },
  { day: "tue", time: "17:30", duration: "[45] min", type: "Mobility", coach: "[Coach 4]", cap: "[0/12]", bookUrl: "[SCHEDULER URL — CONFIRM]" },
  { day: "tue", time: "18:45", duration: "[60] min", type: "Small group", coach: "[Coach 1]", cap: "[0/6]", bookUrl: "[SCHEDULER URL — CONFIRM]" },
  { day: "wed", time: "06:00", duration: "[60] min", type: "Strength", coach: "[Coach 1]", cap: "[0/12]", bookUrl: "[SCHEDULER URL — CONFIRM]" },
  { day: "wed", time: "12:15", duration: "[45] min", type: "Conditioning", coach: "[Coach 2]", cap: "[0/12]", bookUrl: "[SCHEDULER URL — CONFIRM]" },
  { day: "wed", time: "17:30", duration: "[60] min", type: "Strength", coach: "[Coach 3]", cap: "[0/12]", bookUrl: "[SCHEDULER URL — CONFIRM]" },
  { day: "wed", time: "18:45", duration: "[90] min", type: "Open gym", coach: "[Coach 4]", cap: "[0/16]", bookUrl: "[SCHEDULER URL — CONFIRM]" },
  { day: "thu", time: "06:00", duration: "[45] min", type: "Conditioning", coach: "[Coach 2]", cap: "[0/12]", bookUrl: "[SCHEDULER URL — CONFIRM]" },
  { day: "thu", time: "07:15", duration: "[45] min", type: "Small group", coach: "[Coach 3]", cap: "[0/6]", bookUrl: "[SCHEDULER URL — CONFIRM]" },
  { day: "thu", time: "17:30", duration: "[60] min", type: "Strength", coach: "[Coach 1]", cap: "[0/12]", bookUrl: "[SCHEDULER URL — CONFIRM]" },
  { day: "thu", time: "18:45", duration: "[45] min", type: "Mobility", coach: "[Coach 4]", cap: "[0/12]", bookUrl: "[SCHEDULER URL — CONFIRM]" },
  { day: "fri", time: "06:00", duration: "[60] min", type: "Strength", coach: "[Coach 3]", cap: "[0/12]", bookUrl: "[SCHEDULER URL — CONFIRM]" },
  { day: "fri", time: "12:15", duration: "[45] min", type: "Conditioning", coach: "[Coach 2]", cap: "[0/12]", bookUrl: "[SCHEDULER URL — CONFIRM]" },
  { day: "fri", time: "17:30", duration: "[90] min", type: "Open gym", coach: "[Coach 4]", cap: "[0/16]", bookUrl: "[SCHEDULER URL — CONFIRM]" },
  { day: "sat", time: "08:00", duration: "[60] min", type: "Strength", coach: "[Coach 1]", cap: "[0/12]", bookUrl: "[SCHEDULER URL — CONFIRM]" },
  { day: "sat", time: "09:15", duration: "[45] min", type: "Conditioning", coach: "[Coach 2]", cap: "[0/12]", bookUrl: "[SCHEDULER URL — CONFIRM]" },
  { day: "sat", time: "10:30", duration: "[60] min", type: "Small group", coach: "[Coach 3]", cap: "[0/6]", bookUrl: "[SCHEDULER URL — CONFIRM]" },
  { day: "sun", time: "09:15", duration: "[45] min", type: "Mobility", coach: "[Coach 4]", cap: "[0/12]", bookUrl: "[SCHEDULER URL — CONFIRM]" },
  { day: "sun", time: "10:30", duration: "[90] min", type: "Open gym", coach: "[Coach 4]", cap: "[0/16]", bookUrl: "[SCHEDULER URL — CONFIRM]" }
];

(function () {
  "use strict";
  document.documentElement.classList.add("js");
  var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var DAYS = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"];
  var DAY_NAME = { mon: "Monday", tue: "Tuesday", wed: "Wednesday", thu: "Thursday", fri: "Friday", sat: "Saturday", sun: "Sunday" };
  var TYPE_COLOR = { "Strength": "#1F3FD8", "Conditioning": "#132A8F", "Small group": "#6B7CF0", "Open gym": "#4A5056", "Mobility": "#E8475F" };
  var TYPES = SCHEDULE.reduce(function (a, c) { if (a.indexOf(c.type) < 0) a.push(c.type); return a; }, []);
  var esc = function (s) { return String(s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); };
  var ph = function (s) { return /^\[.*\]$/.test(s) || /\[/.test(s) ? '<span class="ph">' + esc(s) + "</span>" : esc(s); };
  var slug = function (s) { return s.toLowerCase().replace(/[^a-z]+/g, "-"); };
  var bookLink = function (c, label) {
    return '<a class="btn btn-trial btn-sm" href="#scheduler-url-confirm" data-scheduler-target="' + esc(c.bookUrl) + '" aria-label="' + esc(label || "Book") + ": " + esc(c.type) + " " + esc(DAY_NAME[c.day]) + " " + c.time + '">Book</a>';
  };

  /* ---------- Header ---------- */
  var header = document.querySelector(".site-header");
  if (header && !header.hasAttribute("data-compact")) {
    if (reduced) header.classList.add("is-condensed");
    else {
      var onScroll = function () { header.classList.toggle("is-condensed", window.scrollY > 120); };
      onScroll(); window.addEventListener("scroll", onScroll, { passive: true });
    }
  }

  /* ---------- Menu overlay ---------- */
  var menu = document.getElementById("menu");
  var menuBtn = document.querySelector(".menu-btn");
  if (menu && menuBtn) {
    var closeBtn = menu.querySelector(".menu-close");
    var setMenu = function (open) {
      menu.classList.toggle("is-open", open); menuBtn.setAttribute("aria-expanded", String(open));
      document.body.style.overflow = open ? "hidden" : "";
      if (open) closeBtn.focus(); else menuBtn.focus();
    };
    menuBtn.addEventListener("click", function () { setMenu(true); });
    closeBtn.addEventListener("click", function () { setMenu(false); });
    menu.addEventListener("keydown", function (e) { if (e.key === "Escape") setMenu(false); });
  }

  /* ---------- Reveals ---------- */
  document.querySelectorAll("[data-stagger]").forEach(function (g) {
    g.querySelectorAll(":scope > [data-reveal]").forEach(function (el, i) { el.style.setProperty("--i", i); });
  });
  var observeReveals = function (root) {
    var els = (root || document).querySelectorAll("[data-reveal]:not(.is-in)");
    if (reduced || !("IntersectionObserver" in window)) { els.forEach(function (el) { el.classList.add("is-in"); }); return; }
    var io = new IntersectionObserver(function (en) {
      en.forEach(function (x) { if (x.isIntersecting) { x.target.classList.add("is-in"); io.unobserve(x.target); } });
    }, { rootMargin: "0px 0px -6% 0px", threshold: 0.05 });
    els.forEach(function (el) { io.observe(el); });
  };
  observeReveals();

  /* ---------- Programme cards: + expands in place ---------- */
  document.querySelectorAll(".prog .plus").forEach(function (b) {
    b.addEventListener("click", function () {
      var card = b.closest(".prog"), open = !card.classList.contains("is-open");
      card.classList.toggle("is-open", open); b.setAttribute("aria-expanded", String(open));
    });
  });
  // quick-index chips open the matching programme card
  if (location.hash.indexOf("#prog-") === 0) {
    var target = document.querySelector(location.hash);
    if (target && target.querySelector(".plus")) target.querySelector(".plus").click();
  }
  document.querySelectorAll(".qchip[href^='#prog-']").forEach(function (a) {
    a.addEventListener("click", function () {
      var t = document.querySelector(a.getAttribute("href"));
      if (t && !t.classList.contains("is-open")) t.querySelector(".plus").click();
    });
  });

  /* ---------- Facility tour ---------- */
  var track = document.querySelector(".tour-track");
  if (track) {
    var step = function (dir) { var item = track.querySelector(".tour-item"); track.scrollBy({ left: dir * (item.getBoundingClientRect().width + 14), behavior: reduced ? "auto" : "smooth" }); };
    document.querySelector(".tour-prev").addEventListener("click", function () { step(-1); });
    document.querySelector(".tour-next").addEventListener("click", function () { step(1); });
    track.addEventListener("keydown", function (e) {
      if (e.key === "ArrowRight") { e.preventDefault(); step(1); }
      if (e.key === "ArrowLeft") { e.preventDefault(); step(-1); }
    });
  }

  /* ---------- Timetable ---------- */
  var chipRow = function (el, items, current, attr) {
    el.innerHTML = items.map(function (it) {
      return '<button type="button" class="chip" data-' + attr + '="' + it.v + '" aria-pressed="' + (it.v === current) + '">' + esc(it.l) + "</button>";
    }).join("");
  };
  var listHTML = function (days, list) {
    return days.map(function (d) {
      var rows = list.filter(function (c) { return c.day === d; }).sort(function (a, b) { return a.time < b.time ? -1 : 1; });
      return '<div class="tt-day" data-day="' + d + '"><h3>' + DAY_NAME[d] + "</h3>" +
        (rows.length ? rows.map(function (c) {
          return '<div class="tt-row" data-type="' + slug(c.type) + '" style="--c:' + TYPE_COLOR[c.type] + '"><span class="t">' + c.time + '</span><span class="n"><span class="type-dot" aria-hidden="true"></span>' + esc(c.type) +
            '<span class="m">' + ph(c.coach) + " · " + ph(c.duration) + " · " + ph(c.cap) + " spots</span></span>" + bookLink(c) + "</div>";
        }).join("") : '<p class="tt-empty">No classes scheduled.</p>') + "</div>";
    }).join("");
  };
  var gridHTML = function (list) {
    var times = list.map(function (c) { return c.time; }).filter(function (t, i, a) { return a.indexOf(t) === i; }).sort();
    var h = '<div class="hd" aria-hidden="true"></div>' + DAYS.map(function (d) { return '<div class="hd" data-day="' + d + '">' + DAY_NAME[d].slice(0, 3) + "</div>"; }).join("");
    times.forEach(function (t) {
      h += '<div class="time">' + t + "</div>";
      DAYS.forEach(function (d) {
        var c = list.filter(function (x) { return x.day === d && x.time === t; })[0];
        h += c ? '<div class="slot" data-day="' + d + '" data-type="' + slug(c.type) + '"><div class="cell" style="--c:' + TYPE_COLOR[c.type] + '"><span class="n">' + esc(c.type) + "</span><span>" + t + " · " + ph(c.duration) + "</span><span>" + ph(c.coach) + "</span><span>" + ph(c.cap) + " spots</span>" + bookLink(c) + "</div></div>"
          : '<div class="slot empty" data-day="' + d + '" aria-label="No class"></div>';
      });
    });
    return h;
  };

  var tt = document.querySelector("[data-timetable]");
  if (tt) {
    var mode = tt.getAttribute("data-timetable"); // "full" | "preview"
    var listEl = tt.querySelector(".tt-list");
    var gridEl = tt.querySelector(".tt-grid");
    var dayChips = tt.querySelector(".chips-day");
    var typeChips = tt.querySelector(".chips-type");
    var legend = tt.querySelector(".legend");
    var params = new URLSearchParams(location.search);
    var state = { day: "all", type: "all" };
    var days = DAYS;
    if (mode === "preview") {
      var today = (new Date().getDay() + 6) % 7; // Mon=0
      days = [0, 1, 2].map(function (k) { return DAYS[(today + k) % 7]; });
    } else {
      if (DAYS.indexOf(params.get("day")) > -1) state.day = params.get("day");
      if (TYPES.map(slug).indexOf(params.get("type")) > -1) state.type = params.get("type");
    }
    if (legend) legend.innerHTML = TYPES.map(function (t) { return '<span style="--c:' + TYPE_COLOR[t] + '">' + esc(t) + "</span>"; }).join("");
    if (dayChips) chipRow(dayChips, [{ v: "all", l: "All week" }].concat(DAYS.map(function (d) { return { v: d, l: DAY_NAME[d].slice(0, 3) }; })), state.day, "day");
    chipRow(typeChips, [{ v: "all", l: "All classes" }].concat(TYPES.map(function (t) { return { v: slug(t), l: t }; })), state.type, "type");
    listEl.innerHTML = listHTML(days, SCHEDULE);
    if (gridEl) { gridEl.innerHTML = gridHTML(SCHEDULE); gridEl.classList.add("on"); listEl.classList.add("has-grid"); }

    var apply = function (push) {
      tt.querySelectorAll(".chip[data-day]").forEach(function (b) { b.setAttribute("aria-pressed", String(b.dataset.day === state.day)); });
      tt.querySelectorAll(".chip[data-type]").forEach(function (b) { b.setAttribute("aria-pressed", String(b.dataset.type === state.type)); });
      tt.querySelectorAll(".tt-row, .slot:not(.empty)").forEach(function (r) {
        var dayOk = state.day === "all" || (r.dataset.day || r.closest("[data-day]").dataset.day) === state.day;
        var typeOk = state.type === "all" || r.dataset.type === state.type;
        r.classList.toggle("is-filtered", !(dayOk && typeOk));
      });
      tt.querySelectorAll(".tt-day").forEach(function (d) { d.classList.toggle("is-filtered", state.day !== "all" && d.dataset.day !== state.day); });
      tt.querySelectorAll(".tt-grid .hd[data-day]").forEach(function (h) { h.classList.toggle("is-dim", state.day !== "all" && h.dataset.day !== state.day); });
      if (push && mode === "full") {
        var q = new URLSearchParams();
        if (state.day !== "all") q.set("day", state.day);
        if (state.type !== "all") q.set("type", state.type);
        history.replaceState(null, "", location.pathname + (q.toString() ? "?" + q : ""));
      }
    };
    tt.addEventListener("click", function (e) {
      var b = e.target.closest(".chip"); if (!b) return;
      if (b.dataset.day) state.day = b.dataset.day;
      if (b.dataset.type) state.type = b.dataset.type;
      apply(true);
    });
    apply(false);
  }

  /* ---------- Footer: timetable at a glance (from SCHEDULE) ---------- */
  var glance = document.querySelector("[data-glance]");
  if (glance) glance.innerHTML = DAYS.map(function (d) {
    var t = SCHEDULE.filter(function (c) { return c.day === d; }).map(function (c) { return c.time; }).sort();
    return "<li><span>" + DAY_NAME[d].slice(0, 3) + "</span><span class='tnum'>" + (t.length ? t.join(" · ") : "—") + "</span></li>";
  }).join("");

  /* ---------- About: each coach's classes (from SCHEDULE) ---------- */
  document.querySelectorAll("[data-coach-classes]").forEach(function (ul) {
    var who = ul.getAttribute("data-coach-classes");
    var mine = SCHEDULE.filter(function (c) { return c.coach === who; });
    ul.innerHTML = mine.map(function (c) { return "<li><span>" + DAY_NAME[c.day].slice(0, 3) + " " + c.time + "</span><span>" + esc(c.type) + "</span></li>"; }).join("") || "<li>—</li>";
  });

  /* ---------- Scheduler handoff notice (demo) ---------- */
  var notice = document.createElement("div");
  notice.className = "notice"; notice.setAttribute("role", "status");
  document.body.appendChild(notice);
  var noticeTimer;
  document.addEventListener("click", function (e) {
    var a = e.target.closest("[data-scheduler-target]"); if (!a) return;
    e.preventDefault();
    notice.textContent = "DEMO — booking hands off to the gym's own scheduler: " + a.getAttribute("data-scheduler-target");
    notice.classList.add("show"); clearTimeout(noticeTimer);
    noticeTimer = setTimeout(function () { notice.classList.remove("show"); }, 3200);
  });

  /* ---------- Sticky mobile trial bar (after the hero leaves) ---------- */
  var bar = document.querySelector(".trial-bar");
  var heroEl = document.querySelector(".hero");
  if (bar) {
    if (reduced || !heroEl || !("IntersectionObserver" in window)) bar.classList.add("is-shown");
    else new IntersectionObserver(function (en) { bar.classList.toggle("is-shown", !en[0].isIntersecting); }).observe(heroEl);
  }

  /* ---------- Trial flow ---------- */
  var tf = document.getElementById("trial-form");
  if (tf) {
    var pickList = document.getElementById("pick-list");
    var start = (new Date().getDay() + 6) % 7;
    var order = [0, 1, 2, 3, 4, 5, 6].map(function (k) { return DAYS[(start + k) % 7]; });
    pickList.innerHTML = order.map(function (d) {
      var rows = SCHEDULE.filter(function (c) { return c.day === d; }).sort(function (a, b) { return a.time < b.time ? -1 : 1; });
      return '<p class="pick-day">' + DAY_NAME[d] + "</p>" + rows.map(function (c, i) {
        var id = "pk-" + d + "-" + i;
        return '<label class="pick" for="' + id + '"><input type="radio" name="class" id="' + id + '" value="' + esc(DAY_NAME[d] + " " + c.time + " · " + c.type) + '" required><span class="t">' + c.time + "</span><span><strong>" + esc(c.type) + '</strong><br><span class="hint">' + esc(c.coach) + " · " + esc(c.duration) + "</span></span></label>";
      }).join("");
    }).join("");
    var steps = document.querySelectorAll(".steps li");
    var panes = document.querySelectorAll(".step");
    var sumEl = document.getElementById("summary-class");
    var waiver = document.getElementById("waiver-ok");
    var setStep = function () {
      var picked = tf.querySelector("input[name=class]:checked");
      var s = !picked ? 0 : !waiver.checked ? 1 : 2;
      steps.forEach(function (li, i) { li.classList.toggle("is-active", i === s); li.classList.toggle("is-done", i < s); if (i === s) li.setAttribute("aria-current", "step"); else li.removeAttribute("aria-current"); });
      panes.forEach(function (p, i) { p.classList.toggle("is-active", i === s); p.classList.toggle("is-locked", i > s); });
      if (sumEl) sumEl.innerHTML = picked ? esc(picked.value) : '<span class="hint">No class picked yet.</span>';
    };
    tf.addEventListener("change", setStep);
    tf.addEventListener("submit", function (e) {
      e.preventDefault();
      tf.hidden = true;
      var ok = document.getElementById("trial-success"); ok.classList.add("show"); ok.focus();
      document.querySelectorAll(".steps li").forEach(function (li) { li.classList.add("is-done"); });
    });
    setStep();
  }

  /* ---------- Contact form (demo) ---------- */
  var cf = document.getElementById("contact-form");
  if (cf) cf.addEventListener("submit", function (e) { e.preventDefault(); var m = document.getElementById("contact-ok"); m.classList.add("show"); m.focus(); });
})();
