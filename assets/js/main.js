/* main.js — shared behaviour: mobile drawer toggle.
   Smooth scroll + anchor offset are handled in CSS (scroll-behavior +
   scroll-margin-top), so cross-page links like ../index.html#services
   also land correctly. */
(function () {
  'use strict';

  function init() {
    var header = document.querySelector('.site-header');
    if (!header) return;

    var toggle = header.querySelector('[data-menu-toggle]');
    var icon = toggle && toggle.querySelector('.ms');

    function setOpen(open) {
      header.classList.toggle('is-open', open);
      if (toggle) toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
      if (icon) icon.textContent = open ? 'close' : 'menu';
    }

    if (toggle) {
      toggle.addEventListener('click', function () {
        setOpen(!header.classList.contains('is-open'));
      });
    }

    // Close the drawer when a link inside it is clicked.
    var drawer = header.querySelector('.mobile-drawer');
    if (drawer) {
      drawer.addEventListener('click', function (e) {
        if (e.target.closest('a, button')) setOpen(false);
      });
    }

    // Reset when returning to desktop width.
    var mq = window.matchMedia('(min-width: 1061px)');
    (mq.addEventListener ? mq.addEventListener.bind(mq, 'change') : mq.addListener.bind(mq))(function () {
      if (mq.matches) setOpen(false);
    });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
