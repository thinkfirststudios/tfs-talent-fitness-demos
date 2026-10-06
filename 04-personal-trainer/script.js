/* Vantrell Strength — DEMO TEMPLATE (fictional). No tracking, no checkout, no backend. */
(function () {
  "use strict";
  document.documentElement.classList.add("js");
  var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* Header: 92 → 60 past 140px */
  var header = document.querySelector(".site-header");
  if (header && !header.hasAttribute("data-compact")) {
    if (reduced) header.classList.add("is-condensed");
    else { var onS = function () { header.classList.toggle("is-condensed", window.scrollY > 140); }; onS(); window.addEventListener("scroll", onS, { passive: true }); }
  }

  /* Menu overlay */
  var menu = document.getElementById("menu"), menuBtn = document.querySelector(".menu-btn");
  if (menu && menuBtn) {
    var closeBtn = menu.querySelector(".menu-close");
    var set = function (o) { menu.classList.toggle("is-open", o); menuBtn.setAttribute("aria-expanded", String(o)); document.body.style.overflow = o ? "hidden" : ""; (o ? closeBtn : menuBtn).focus(); };
    menuBtn.addEventListener("click", function () { set(true); });
    closeBtn.addEventListener("click", function () { set(false); });
    menu.addEventListener("keydown", function (e) { if (e.key === "Escape") set(false); });
  }

  /* Diagonal rule draws once */
  document.querySelectorAll(".diag.draw").forEach(function (d) {
    if (reduced) { d.classList.add("is-in"); return; }
    requestAnimationFrame(function () { requestAnimationFrame(function () { d.classList.add("is-in"); }); });
  });

  /* Reveals */
  document.querySelectorAll("[data-stagger]").forEach(function (g) {
    g.querySelectorAll(":scope > [data-reveal]").forEach(function (el, i) { el.style.setProperty("--i", i); });
  });
  var els = document.querySelectorAll("[data-reveal]");
  if (reduced || !("IntersectionObserver" in window)) els.forEach(function (el) { el.classList.add("is-in"); });
  else {
    var io = new IntersectionObserver(function (en) { en.forEach(function (x) { if (x.isIntersecting) { x.target.classList.add("is-in"); io.unobserve(x.target); } }); }, { rootMargin: "0px 0px -6% 0px", threshold: 0.05 });
    els.forEach(function (el) { io.observe(el); });
  }

  /* Training week: day chips → single-day panel on mobile; height reserved for the tallest day */
  document.querySelectorAll("[data-week]").forEach(function (week) {
    var mosaic = week.querySelector(".mosaic");
    var tiles = Array.prototype.slice.call(mosaic.querySelectorAll(".tile.copy"));
    var chips = week.querySelectorAll(".day-chip");
    mosaic.classList.remove("no-js");
    var reserve = function () {
      if (window.innerWidth >= 900) { mosaic.style.removeProperty("--mosaic-h"); return; }
      var max = 0;
      tiles.forEach(function (t) { t.style.position = "relative"; t.style.visibility = "hidden"; max = Math.max(max, t.offsetHeight); t.style.position = ""; t.style.visibility = ""; });
      mosaic.style.setProperty("--mosaic-h", max + "px");
    };
    var show = function (day) {
      tiles.forEach(function (t) { t.classList.toggle("is-current", t.dataset.day === day); });
      chips.forEach(function (c) { c.setAttribute("aria-pressed", String(c.dataset.day === day)); });
    };
    chips.forEach(function (c) { c.addEventListener("click", function () { show(c.dataset.day); }); });
    show(tiles[0].dataset.day); reserve();
    window.addEventListener("resize", reserve);
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(reserve);
  });

  /* Sticky apply bar after the hero */
  var bar = document.querySelector(".apply-bar"), hero = document.querySelector(".hero");
  if (bar) {
    if (reduced || !hero || !("IntersectionObserver" in window)) bar.classList.add("is-shown");
    else new IntersectionObserver(function (en) { bar.classList.toggle("is-shown", !en[0].isIntersecting); }).observe(hero);
  }

  /* Application: four fieldsets revealed in sequence, mint progress rail, ?tier= prefill */
  var form = document.getElementById("apply-form");
  if (form) {
    var sets = Array.prototype.slice.call(form.querySelectorAll("fieldset"));
    var rail = document.querySelector(".rail span");
    var progress = document.getElementById("apply-progress");
    var tier = new URLSearchParams(location.search).get("tier");
    var tierSel = document.getElementById("ap-tier");
    if (tier && tierSel && tierSel.querySelector('option[value="' + tier + '"]')) tierSel.value = tier;
    var shown = reduced ? sets.length : 1;
    var paint = function () {
      sets.forEach(function (s, i) { s.classList.toggle("is-hidden", i >= shown); });
      if (rail) rail.style.width = (Math.min(shown, sets.length) / sets.length * 100) + "%";
      if (progress) progress.textContent = "Section " + Math.min(shown, sets.length) + " of " + sets.length;
    };
    var valid = function (fs) {
      var bad = Array.prototype.slice.call(fs.querySelectorAll("input, select, textarea")).filter(function (el) { return !el.checkValidity(); });
      if (bad.length) { bad[0].reportValidity(); return false; }
      return true;
    };
    form.querySelectorAll(".continue").forEach(function (b, i) {
      b.addEventListener("click", function () {
        if (!valid(sets[i])) return;
        if (shown <= i + 1) { shown = i + 2; paint(); var nx = sets[i + 1]; if (nx) { if (!reduced) nx.classList.add("is-entering"); var f = nx.querySelector("input, select, textarea"); if (f) f.focus(); } }
      });
    });
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      form.hidden = true; if (rail) rail.style.width = "100%";
      var ok = document.getElementById("apply-success"); ok.classList.add("show"); ok.focus();
    });
    paint();
  }

  /* Contact form — demo only */
  var cf = document.getElementById("contact-form");
  if (cf) cf.addEventListener("submit", function (e) { e.preventDefault(); var m = document.getElementById("contact-ok"); m.classList.add("show"); m.focus(); });
})();
