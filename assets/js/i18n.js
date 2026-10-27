/* i18n.js — VN/EN switch.
   HTML ships Vietnamese so the page is complete with JS off; this only
   swaps strings when the user chooses EN and remembers the choice. */
(function () {
  'use strict';
  var STORE = 'uie-lang';
  var DEFAULT = 'vi';

  function dict(lang) { return (window.UIE_I18N && window.UIE_I18N[lang]) || null; }

  function resolve(obj, path) {
    var parts = path.split('.'), cur = obj;
    for (var i = 0; i < parts.length; i++) {
      if (cur == null) return undefined;
      cur = cur[parts[i]];
    }
    return cur;
  }

  function apply(lang) {
    var d = dict(lang);
    if (!d) return;

    document.querySelectorAll('[data-i18n]').forEach(function (el) {
      var val = resolve(d, el.getAttribute('data-i18n'));
      if (typeof val === 'string') el.textContent = val;
    });

    // data-i18n-attr="placeholder:key" or "aria-label:key,title:key2"
    document.querySelectorAll('[data-i18n-attr]').forEach(function (el) {
      el.getAttribute('data-i18n-attr').split(',').forEach(function (pair) {
        var bits = pair.split(':');
        if (bits.length !== 2) return;
        var val = resolve(d, bits[1].trim());
        if (typeof val === 'string') el.setAttribute(bits[0].trim(), val);
      });
    });

    // Show/hide bilingual content blocks: <div data-lang="vi"> / <div data-lang="en">.
    // (Language toggle buttons use <button data-lang> and are excluded here.)
    document.querySelectorAll('[data-lang]:not(button)').forEach(function (el) {
      el.hidden = el.getAttribute('data-lang') !== lang;
    });

    document.documentElement.lang = lang;
    updateToggles(lang);
  }

  function updateToggles(lang) {
    document.querySelectorAll('button[data-lang]').forEach(function (btn) {
      btn.classList.toggle('is-active', btn.getAttribute('data-lang') === lang);
      btn.setAttribute('aria-pressed', btn.getAttribute('data-lang') === lang ? 'true' : 'false');
    });
    document.querySelectorAll('[data-lang-toggle]').forEach(function (btn) {
      btn.textContent = lang === 'vi' ? 'VN' : 'EN';
    });
  }

  function setLang(lang) {
    if (lang !== 'vi' && lang !== 'en') lang = DEFAULT;
    try { localStorage.setItem(STORE, lang); } catch (e) {}
    apply(lang);
    // Notify enhancers (e.g. news.js) so they can re-render JS-built content.
    try { document.dispatchEvent(new CustomEvent('uie:langchange', { detail: { lang: lang } })); } catch (e) {}
  }

  function current() {
    try { return localStorage.getItem(STORE) || DEFAULT; } catch (e) { return DEFAULT; }
  }

  function init() {
    document.querySelectorAll('button[data-lang]').forEach(function (btn) {
      btn.addEventListener('click', function () { setLang(btn.getAttribute('data-lang')); });
    });
    document.querySelectorAll('[data-lang-toggle]').forEach(function (btn) {
      btn.addEventListener('click', function () { setLang(current() === 'vi' ? 'en' : 'vi'); });
    });
    setLang(current());
  }

  window.UIE_setLang = setLang;
  window.UIE_getLang = current;

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
