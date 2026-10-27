/* counter.js — count-up figures when the stats block enters the viewport.
   The final value is already in the HTML, so with JS off or reduced motion
   the correct number is shown without animation. */
(function () {
  'use strict';

  function run() {
    var els = document.querySelectorAll('[data-count]');
    if (!els.length) return;

    var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce || typeof IntersectionObserver === 'undefined') return; // leave static HTML value

    var animate = function (el) {
      var to = parseInt(el.getAttribute('data-count'), 10);
      var suffix = el.getAttribute('data-suffix') || '';
      if (!to) return;
      var start = performance.now(), dur = 1200;
      var tick = function (now) {
        var p = Math.min(1, (now - start) / dur);
        var e = 1 - Math.pow(1 - p, 3);
        el.textContent = Math.round(to * e) + (p === 1 ? suffix : '');
        if (p < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    };

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) { animate(entry.target); io.unobserve(entry.target); }
      });
    }, { threshold: 0.4 });

    els.forEach(function (el) { io.observe(el); });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', run);
  else run();
})();
