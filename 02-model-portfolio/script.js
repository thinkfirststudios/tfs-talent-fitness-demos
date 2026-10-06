/* Wren Castellane — DEMO TEMPLATE (fictional). No tracking, no analytics, no backend. */
(function () {
  "use strict";
  document.documentElement.classList.add("js");
  var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* Header condenses 64 → 48 */
  var header = document.querySelector(".site-header");
  if (header) {
    var onScroll = function () { header.classList.toggle("is-condensed", window.scrollY > 40); };
    onScroll(); window.addEventListener("scroll", onScroll, { passive: true });
  }

  /* Name: per-word mask reveal */
  var name = document.querySelector(".comp-name");
  if (name) {
    name.querySelectorAll(".w > span").forEach(function (s, i) { s.style.setProperty("--i", i); });
    requestAnimationFrame(function () { requestAnimationFrame(function () { name.classList.add("is-in"); }); });
  }

  /* Reveals (text + image wipes) */
  document.querySelectorAll("[data-stagger]").forEach(function (g) {
    g.querySelectorAll(":scope > [data-reveal], :scope > [data-img]").forEach(function (el, i) { el.style.setProperty("--i", i); });
  });
  var els = document.querySelectorAll("[data-reveal], [data-img]");
  if (reduced || !("IntersectionObserver" in window)) {
    els.forEach(function (el) { el.classList.add("is-in"); });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add("is-in"); io.unobserve(en.target); } });
    }, { rootMargin: "0px 0px -6% 0px", threshold: 0.06 });
    els.forEach(function (el) { io.observe(el); });
  }

  /* Right-rail section index */
  var idx = document.querySelectorAll(".sec-index a");
  if (idx.length && "IntersectionObserver" in window) {
    var map = {};
    idx.forEach(function (a) { map[a.getAttribute("href").slice(1)] = a; });
    var secIO = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) {
          idx.forEach(function (a) { a.classList.remove("is-active"); a.removeAttribute("aria-current"); });
          var a = map[en.target.id];
          if (a) { a.classList.add("is-active"); a.setAttribute("aria-current", "true"); }
        }
      });
    }, { rootMargin: "-45% 0px -50% 0px" });
    Object.keys(map).forEach(function (id) { var s = document.getElementById(id); if (s) secIO.observe(s); });
  }

  /* Work filters (ALL / EDITORIAL / …), URL-synced: work.html?type=campaign */
  var filterBtns = document.querySelectorAll(".filters button");
  if (filterBtns.length) {
    var series = document.querySelectorAll(".series");
    var apply = function (type, push) {
      filterBtns.forEach(function (b) { b.setAttribute("aria-pressed", String(b.dataset.type === type)); });
      series.forEach(function (s) { s.hidden = !(type === "all" || s.dataset.type === type); });
      if (push) {
        var q = type === "all" ? "" : "?type=" + type;
        history.replaceState(null, "", location.pathname + q + location.hash);
      }
    };
    filterBtns.forEach(function (b) { b.addEventListener("click", function () { apply(b.dataset.type, true); }); });
    var t = new URLSearchParams(location.search).get("type");
    apply(t && document.querySelector('.filters [data-type="' + t + '"]') ? t : "all", false);
  }

  /* Lightbox: Parchment scrim, arrows, Escape, focus trap + return, credit carried in */
  var lb = document.getElementById("lightbox");
  if (lb) {
    var thumbs = Array.prototype.slice.call(document.querySelectorAll("[data-lb]"));
    var stage = lb.querySelector(".lb-stage");
    var capT = lb.querySelector("[data-lb-title]");
    var capC = lb.querySelector("[data-lb-credit]");
    var capN = lb.querySelector("[data-lb-count]");
    var current = 0, opener = null;
    var visibleThumbs = function () { return thumbs.filter(function (t) { return !t.closest("[hidden]"); }); };
    var show = function (i) {
      var list = visibleThumbs(); if (!list.length) return;
      current = (i + list.length) % list.length;
      var t = list[current];
      var ratio = t.dataset.ratio || "";
      stage.innerHTML = '<div class="frame ' + ratio + '" role="img" aria-label="Model photo placeholder"><span class="frame-label">[MODEL PHOTO — client to supply, with signed release and photographer licence]</span></div>';
      capT.textContent = t.dataset.title || "";
      capC.textContent = "PH. [CREDIT — CONFIRM]";
      capN.textContent = "[" + String(current + 1).padStart(2, "0") + "] / [" + String(list.length).padStart(2, "0") + "]";
    };
    var focusables = function () { return lb.querySelectorAll("button"); };
    var open = function (t) {
      opener = t; show(visibleThumbs().indexOf(t));
      lb.classList.add("is-open"); lb.setAttribute("aria-hidden", "false");
      document.body.style.overflow = "hidden";
      requestAnimationFrame(function () { lb.classList.add("is-visible"); });
      lb.querySelector(".lb-close").focus();
    };
    var close = function () {
      lb.classList.remove("is-visible");
      var done = function () { lb.classList.remove("is-open"); lb.setAttribute("aria-hidden", "true"); document.body.style.overflow = ""; if (opener) opener.focus(); };
      reduced ? done() : setTimeout(done, 240);
    };
    thumbs.forEach(function (t) { t.addEventListener("click", function () { open(t); }); });
    lb.querySelector(".lb-close").addEventListener("click", close);
    lb.querySelector(".lb-prev").addEventListener("click", function () { show(current - 1); });
    lb.querySelector(".lb-next").addEventListener("click", function () { show(current + 1); });
    lb.addEventListener("keydown", function (e) {
      if (e.key === "Escape") { e.preventDefault(); close(); }
      else if (e.key === "ArrowRight") { e.preventDefault(); show(current + 1); }
      else if (e.key === "ArrowLeft") { e.preventDefault(); show(current - 1); }
      else if (e.key === "Tab") {
        var f = focusables(), first = f[0], last = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    });
  }

  /* Contact form — demo only */
  var form = document.getElementById("direct-form");
  if (form) form.addEventListener("submit", function (e) {
    e.preventDefault(); var m = form.querySelector(".form-msg"); m.classList.add("show"); m.focus();
  });
})();
