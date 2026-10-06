/* Fieldmark Talent Group — DEMO TEMPLATE (fictional). No tracking, no payment, no backend. */
(function () {
  "use strict";
  var doc = document.documentElement;
  doc.classList.add("js");
  var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- Condensing header ---------- */
  var header = document.querySelector(".site-header");
  if (header && !header.hasAttribute("data-compact")) {
    var onScroll = function () { header.classList.toggle("is-condensed", window.scrollY > 120); };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  /* ---------- Mobile drawer ---------- */
  var menuBtn = document.querySelector(".menu-btn");
  var drawer = document.getElementById("drawer");
  if (menuBtn && drawer) {
    var setMenu = function (open) {
      document.body.classList.toggle("menu-open", open);
      menuBtn.setAttribute("aria-expanded", String(open));
      drawer.setAttribute("aria-hidden", String(!open));
      drawer.inert = !open;
      if (open) { var first = drawer.querySelector("a"); if (first) first.focus(); }
    };
    drawer.inert = true;
    menuBtn.addEventListener("click", function () { setMenu(!document.body.classList.contains("menu-open")); });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && document.body.classList.contains("menu-open")) { setMenu(false); menuBtn.focus(); }
    });
    drawer.addEventListener("click", function (e) { if (e.target.closest("a")) setMenu(false); });
  }

  /* ---------- Hero wipe ---------- */
  var hero = document.querySelector(".hero");
  if (hero) {
    hero.querySelectorAll(".ln").forEach(function (ln, i) { ln.style.setProperty("--i", i); });
    requestAnimationFrame(function () { requestAnimationFrame(function () { hero.classList.add("is-in"); }); });
  }

  /* ---------- Scroll reveals, staggered within [data-stagger] groups ---------- */
  document.querySelectorAll("[data-stagger]").forEach(function (group) {
    group.querySelectorAll(":scope > [data-reveal]").forEach(function (el, i) { el.style.setProperty("--i", i); });
  });
  var revealEls = document.querySelectorAll("[data-reveal]");
  if (reduced || !("IntersectionObserver" in window)) {
    revealEls.forEach(function (el) { el.classList.add("is-in"); });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add("is-in"); io.unobserve(en.target); }
      });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.08 });
    revealEls.forEach(function (el) { io.observe(el); });
  }

  /* ---------- Roster filter (URL-driven, e.g. roster.html?division=women) ---------- */
  var grid = document.getElementById("roster-grid");
  if (grid) {
    var cards = Array.prototype.slice.call(grid.querySelectorAll(".tcard"));
    var pills = document.querySelectorAll(".pill[data-division]");
    var selects = document.querySelectorAll(".filterbar select");
    var countEl = document.getElementById("roster-count");
    var emptyEl = document.getElementById("roster-empty");
    var loadBtn = document.getElementById("load-more");
    var PAGE = 40, shown = PAGE;
    var params = new URLSearchParams(location.search);
    var state = { division: params.get("division") || "all" };
    selects.forEach(function (s) { state[s.name] = params.get(s.name) || "any"; s.value = state[s.name]; if (s.value !== state[s.name]) { s.value = "any"; state[s.name] = "any"; } });

    var matches = function (c) {
      if (state.division !== "all" && c.dataset.division !== state.division) return false;
      for (var k in state) {
        if (k === "division" || state[k] === "any") continue;
        if (c.dataset[k] !== state[k]) return false;
      }
      return true;
    };

    var syncUrl = function () {
      var q = new URLSearchParams();
      Object.keys(state).forEach(function (k) { if (state[k] !== "all" && state[k] !== "any") q.set(k, state[k]); });
      var s = q.toString();
      history.replaceState(null, "", location.pathname + (s ? "?" + s : ""));
    };

    var apply = function (animate) {
      pills.forEach(function (p) { p.setAttribute("aria-pressed", String(p.dataset.division === state.division)); });
      var visible = cards.filter(matches);
      var limited = visible.slice(0, shown);
      var n = 0;
      cards.forEach(function (c) {
        var on = limited.indexOf(c) > -1;
        var isHidden = c.hidden;
        if (!animate || reduced) { c.hidden = !on; c.classList.remove("is-leaving", "is-entering"); return; }
        if (on && isHidden) {
          c.hidden = false; c.classList.add("is-entering");
          var delay = (n++) * 40;
          setTimeout(function () { c.classList.remove("is-entering"); }, 20 + delay);
        } else if (!on && !isHidden) {
          c.classList.add("is-leaving");
          setTimeout(function () { if (c.classList.contains("is-leaving")) { c.hidden = true; c.classList.remove("is-leaving"); } }, 240);
        } else if (on) {
          c.classList.remove("is-leaving");
        }
      });
      if (countEl) countEl.textContent = "[" + visible.length + "] ARTISTS";
      if (emptyEl) emptyEl.classList.toggle("show", visible.length === 0);
      if (loadBtn) loadBtn.parentElement.hidden = visible.length <= shown;
      syncUrl();
    };

    pills.forEach(function (p) {
      p.addEventListener("click", function () { state.division = p.dataset.division; shown = PAGE; apply(true); });
    });
    selects.forEach(function (s) {
      s.addEventListener("change", function () { state[s.name] = s.value; shown = PAGE; apply(true); });
    });
    document.querySelectorAll("[data-reset]").forEach(function (b) {
      b.addEventListener("click", function () {
        state.division = "all"; selects.forEach(function (s) { s.value = "any"; state[s.name] = "any"; });
        shown = PAGE; apply(true);
      });
    });
    if (loadBtn) loadBtn.addEventListener("click", function () { shown += PAGE; apply(true); });
    apply(false);
  }

  /* ---------- Talent gallery (keyboard arrows, aria-live) ---------- */
  var strip = document.querySelector(".strip");
  if (strip) {
    var thumbs = Array.prototype.slice.call(strip.querySelectorAll("button"));
    var mainLabel = document.getElementById("gallery-main-label");
    var pos = document.getElementById("gallery-pos");
    var select = function (i, focus) {
      thumbs.forEach(function (t, j) {
        t.setAttribute("aria-selected", String(i === j));
        t.tabIndex = i === j ? 0 : -1;
      });
      if (mainLabel) mainLabel.textContent = "[TALENT PHOTO " + (i + 1) + " — client to supply, with signed release]";
      if (pos) pos.textContent = "FRAME " + (i + 1) + " OF " + thumbs.length;
      if (focus) thumbs[i].focus();
    };
    thumbs.forEach(function (t, i) {
      t.addEventListener("click", function () { select(i, false); });
      t.addEventListener("keydown", function (e) {
        var k = e.key, next = null;
        if (k === "ArrowRight" || k === "ArrowDown") next = (i + 1) % thumbs.length;
        if (k === "ArrowLeft" || k === "ArrowUp") next = (i - 1 + thumbs.length) % thumbs.length;
        if (k === "Home") next = 0;
        if (k === "End") next = thumbs.length - 1;
        if (next !== null) { e.preventDefault(); select(next, true); }
      });
    });
    select(0, false);
  }

  /* ---------- Client enquiry: pre-fill talent from ?talent= ---------- */
  var talentField = document.getElementById("cf-talent");
  if (talentField) {
    var t = new URLSearchParams(location.search).get("talent");
    if (t) talentField.value = t;
  }

  /* ---------- Submission form: age gate + file count (demo validation only) ---------- */
  var subForm = document.getElementById("submission-form");
  if (subForm) {
    var dob = document.getElementById("sf-dob");
    var files = document.getElementById("sf-photos");
    var dobErr = document.getElementById("sf-dob-error");
    var fileErr = document.getElementById("sf-photos-error");
    var age = function (v) {
      var d = new Date(v + "T00:00:00"); if (isNaN(d)) return null;
      var now = new Date(); var a = now.getFullYear() - d.getFullYear();
      var m = now.getMonth() - d.getMonth();
      if (m < 0 || (m === 0 && now.getDate() < d.getDate())) a--;
      return a;
    };
    subForm.addEventListener("submit", function (e) {
      var ok = true;
      var a = dob && dob.value ? age(dob.value) : null;
      if (a !== null && a < 18) {
        ok = false;
        dobErr.textContent = "This form is for adults (18+) only. Under-18 submissions need a separate guardian-consent path, which is not part of this demo.";
        dob.setAttribute("aria-invalid", "true");
      } else { dobErr.textContent = ""; dob && dob.removeAttribute("aria-invalid"); }
      var n = files && files.files ? files.files.length : 0;
      if (files && (n < 4 || n > 6)) {
        ok = false; fileErr.textContent = "Please attach between 4 and 6 photos."; files.setAttribute("aria-invalid", "true");
      } else if (fileErr) { fileErr.textContent = ""; files.removeAttribute("aria-invalid"); }
      e.preventDefault();
      if (!ok) { (dob.getAttribute("aria-invalid") ? dob : files).focus(); return; }
      demoMsg(subForm);
    });
  }

  var clientForm = document.getElementById("client-form");
  if (clientForm) clientForm.addEventListener("submit", function (e) { e.preventDefault(); demoMsg(clientForm); });

  function demoMsg(form) {
    var msg = form.querySelector(".form-msg");
    if (!msg) return;
    msg.classList.add("show");
    msg.focus();
  }
})();
