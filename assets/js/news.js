/* news.js — enhances the news list page and article pages.
   Renders on its own load (does not depend on the i18n init event) and
   re-renders JS-built content on 'uie:langchange'. */
(function () {
  'use strict';

  var NEWS = window.UIE_NEWS || [];
  var ICON = window.UIE_NEWS_CAT_ICON || {};
  var REDUCE = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- shared helpers ---------- */
  function lang() { return (window.UIE_getLang ? window.UIE_getLang() : (document.documentElement.lang || 'vi')); }
  function dict() { return (window.UIE_I18N && window.UIE_I18N[lang()]) || {}; }
  function t(path) {
    var cur = dict();
    var parts = path.split('.');
    for (var i = 0; i < parts.length && cur != null; i++) cur = cur[parts[i]];
    return typeof cur === 'string' ? cur : '';
  }
  function esc(s) {
    return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }
  function fold(s) {
    return String(s).toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/đ/g, 'd');
  }
  function fmtDate(iso) {
    var d = new Date(iso + 'T00:00:00Z');
    try {
      if (lang() === 'vi') return new Intl.DateTimeFormat('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric', timeZone: 'UTC' }).format(d);
      return new Intl.DateTimeFormat('en-GB', { day: '2-digit', month: 'short', year: 'numeric', timeZone: 'UTC' }).format(d);
    } catch (e) { return iso; }
  }
  function catName(cat) { return (dict().cat && dict().cat[cat]) || cat; }
  function coverHTML(cat) {
    return '<div class="news-cover" data-cat="' + cat + '"><span class="ms" aria-hidden="true">' + (ICON[cat] || 'article') + '</span></div>';
  }
  function metaHTML(a) {
    return '<div class="post-meta"><time datetime="' + a.date + '" data-date="' + a.date + '">' + fmtDate(a.date) + '</time>' +
      '<span class="dot-sep" aria-hidden="true"></span>' +
      '<span class="read-min"><span class="ms" aria-hidden="true">schedule</span>' + a.readMin + ' ' + esc(t('nw.readMin')) + '</span></div>';
  }
  function cardHTML(a) {
    var c = a[lang()] || a.vi;
    return '<a class="post-card" href="' + a.slug + '.html">' +
      coverHTML(a.category) +
      '<div class="post-card-body">' +
        '<div class="post-card-head"><span class="cat-chip" data-cat="' + a.category + '">' + esc(catName(a.category)) + '</span></div>' +
        metaHTML(a) +
        '<h3>' + esc(c.title) + '</h3>' +
        '<p class="excerpt">' + esc(c.excerpt) + '</p>' +
        '<span class="card-link">' + esc(t('common.readMore')) + '<span class="ms" aria-hidden="true">arrow_forward</span></span>' +
      '</div></a>';
  }

  /* ======================================================================
     LIST PAGE
     ====================================================================== */
  function initList() {
    var grid = document.getElementById('news-grid');
    if (!grid) return false;

    var featuredEl = document.getElementById('news-featured');
    var countEl = document.getElementById('news-count');
    var emptyEl = document.getElementById('news-empty');
    var pagerEl = document.getElementById('news-pagination');
    var searchEl = document.getElementById('news-search');
    var clearEl = document.getElementById('news-clear');
    var chips = [].slice.call(document.querySelectorAll('.filter-chip'));
    var PAGE_SIZE = 6;

    var state = { cat: 'all', q: '', page: 1 };

    // read URL
    (function () {
      var p = new URLSearchParams(location.search);
      var cat = p.get('cat'); if (cat) state.cat = cat;
      var q = p.get('q'); if (q) state.q = q;
      var page = parseInt(p.get('page'), 10); if (page > 0) state.page = page;
    })();
    if (searchEl && state.q) searchEl.value = state.q;

    function syncURL() {
      var p = new URLSearchParams();
      if (state.cat && state.cat !== 'all') p.set('cat', state.cat);
      if (state.q) p.set('q', state.q);
      if (state.page > 1) p.set('page', state.page);
      var qs = p.toString();
      history.replaceState(null, '', qs ? ('?' + qs) : location.pathname);
    }

    function filtered() {
      var q = fold(state.q.trim());
      return NEWS.filter(function (a) {
        if (state.cat !== 'all' && a.category !== state.cat) return false;
        if (q) {
          var c = a[lang()] || a.vi;
          if (fold(c.title + ' ' + c.excerpt).indexOf(q) === -1) return false;
        }
        return true;
      });
    }

    function featuredHTML(a) {
      var c = a[lang()] || a.vi;
      return '<div class="post-featured">' +
        coverHTML(a.category) +
        '<div class="post-featured-body">' +
          '<span class="badge-featured"><span class="ms" aria-hidden="true">star</span>' + esc(t('nw.featured')) + '</span>' +
          '<div class="post-card-head"><span class="cat-chip" data-cat="' + a.category + '">' + esc(catName(a.category)) + '</span></div>' +
          metaHTML(a) +
          '<h2>' + esc(c.title) + '</h2>' +
          '<p>' + esc(c.excerpt) + '</p>' +
          '<a class="btn btn--primary" href="' + a.slug + '.html">' + esc(t('nw.readArticle')) + '<span class="ms" aria-hidden="true">arrow_forward</span></a>' +
        '</div></div>';
    }

    function renderPager(totalPages) {
      if (totalPages <= 1) { pagerEl.hidden = true; pagerEl.innerHTML = ''; return; }
      pagerEl.hidden = false;
      var html = '<button type="button" class="page-btn" data-page="' + (state.page - 1) + '"' + (state.page === 1 ? ' disabled' : '') + ' aria-label="Prev"><span class="ms" aria-hidden="true">chevron_left</span></button>';
      for (var i = 1; i <= totalPages; i++) {
        html += '<button type="button" class="page-btn' + (i === state.page ? ' is-active' : '') + '" data-page="' + i + '">' + i + '</button>';
      }
      html += '<button type="button" class="page-btn" data-page="' + (state.page + 1) + '"' + (state.page === totalPages ? ' disabled' : '') + ' aria-label="Next"><span class="ms" aria-hidden="true">chevron_right</span></button>';
      pagerEl.innerHTML = html;
    }

    function render() {
      chips.forEach(function (ch) {
        var on = ch.getAttribute('data-cat') === state.cat;
        ch.classList.toggle('is-active', on);
        ch.setAttribute('aria-pressed', on ? 'true' : 'false');
      });

      var list = filtered();
      var total = list.length;
      var feat = NEWS.filter(function (a) { return a.featured; })[0];
      var showFeatured = feat && state.cat === 'all' && !state.q.trim() && state.page === 1;

      featuredEl.innerHTML = showFeatured ? featuredHTML(feat) : '';
      featuredEl.parentElement.parentElement.hidden = !showFeatured;

      var gridItems = showFeatured ? list.filter(function (a) { return a.slug !== feat.slug; }) : list;
      var totalPages = Math.max(1, Math.ceil(gridItems.length / PAGE_SIZE));
      if (state.page > totalPages) state.page = totalPages;
      var start = (state.page - 1) * PAGE_SIZE;
      var pageItems = gridItems.slice(start, start + PAGE_SIZE);

      grid.innerHTML = pageItems.map(cardHTML).join('');
      countEl.textContent = t('nw.count').replace('{n}', total);
      emptyEl.hidden = total !== 0;
      grid.hidden = total === 0;
      renderPager(totalPages);
    }

    // events
    chips.forEach(function (ch) {
      ch.addEventListener('click', function () {
        state.cat = ch.getAttribute('data-cat'); state.page = 1; syncURL(); render();
      });
    });
    var deb;
    if (searchEl) searchEl.addEventListener('input', function () {
      clearTimeout(deb);
      deb = setTimeout(function () { state.q = searchEl.value; state.page = 1; syncURL(); render(); }, 180);
    });
    if (clearEl) clearEl.addEventListener('click', function () {
      state.cat = 'all'; state.q = ''; state.page = 1; if (searchEl) searchEl.value = ''; syncURL(); render();
    });
    pagerEl.addEventListener('click', function (e) {
      var b = e.target.closest('.page-btn'); if (!b || b.disabled) return;
      var p = parseInt(b.getAttribute('data-page'), 10);
      if (p > 0) { state.page = p; syncURL(); render(); window.scrollTo({ top: document.querySelector('.news-toolbar').offsetTop - 80, behavior: REDUCE ? 'auto' : 'smooth' }); }
    });

    document.addEventListener('uie:langchange', render);
    render();
    return true;
  }

  /* ======================================================================
     ARTICLE PAGE
     ====================================================================== */
  function initArticle() {
    var root = document.querySelector('[data-article]');
    if (!root) return false;
    var slug = root.getAttribute('data-article');

    /* ----- reading progress bar ----- */
    (function () {
      if (REDUCE) return; // spec: disable progress effect under reduced motion
      var content = document.querySelector('.article-content');
      var header = document.querySelector('.site-header');
      if (!content) return;
      var bar = document.createElement('div');
      bar.className = 'read-progress';
      bar.setAttribute('aria-hidden', 'true');
      document.body.appendChild(bar);
      function place() { bar.style.top = (header ? header.offsetHeight : 0) + 'px'; }
      function update() {
        var start = content.offsetTop;
        var end = start + content.offsetHeight - window.innerHeight;
        var pct = end > start ? (window.pageYOffset - start) / (end - start) : 0;
        pct = Math.max(0, Math.min(1, pct));
        bar.style.width = (pct * 100) + '%';
      }
      place(); update();
      window.addEventListener('scroll', update, { passive: true });
      window.addEventListener('resize', function () { place(); update(); }, { passive: true });
    })();

    /* ----- TOC (from the currently visible language block) ----- */
    var tocNav = document.querySelector('.article-aside .toc nav');
    var tocCollapseNav = document.querySelector('.toc-collapse nav');
    var io = null;

    function buildTOC() {
      var visible = [].slice.call(document.querySelectorAll('.article-content [data-lang]')).filter(function (b) { return !b.hidden; })[0];
      if (!visible) return;
      var heads = [].slice.call(visible.querySelectorAll('h2'));
      var links = '';
      heads.forEach(function (h, i) {
        if (!h.id) h.id = 'sec-' + (i + 1);
        links += '<a href="#' + h.id + '" data-toc="' + h.id + '">' + esc(h.textContent) + '</a>';
      });
      if (tocNav) tocNav.innerHTML = links;
      if (tocCollapseNav) tocCollapseNav.innerHTML = links;

      if (io) io.disconnect();
      if (typeof IntersectionObserver !== 'undefined' && heads.length) {
        io = new IntersectionObserver(function (entries) {
          entries.forEach(function (en) {
            if (en.isIntersecting) {
              var id = en.target.id;
              document.querySelectorAll('[data-toc]').forEach(function (a) {
                a.classList.toggle('is-active', a.getAttribute('data-toc') === id);
              });
            }
          });
        }, { rootMargin: '-100px 0px -70% 0px' });
        heads.forEach(function (h) { io.observe(h); });
      }
    }

    /* ----- share ----- */
    (function () {
      var toast = document.createElement('div');
      toast.className = 'toast';
      toast.setAttribute('role', 'status');
      toast.innerHTML = '<span class="ms" aria-hidden="true">check_circle</span><span class="toast-msg"></span>';
      document.body.appendChild(toast);
      var toastT;
      function showToast(msg) {
        toast.querySelector('.toast-msg').textContent = msg;
        toast.classList.add('show');
        clearTimeout(toastT);
        toastT = setTimeout(function () { toast.classList.remove('show'); }, 2200);
      }
      document.querySelectorAll('[data-share]').forEach(function (btn) {
        btn.addEventListener('click', function () {
          var url = (document.querySelector('link[rel=canonical]') || {}).href || location.href;
          var kind = btn.getAttribute('data-share');
          if (kind === 'copy') {
            var done = function () { showToast(t('nw.copied')); };
            if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(url).then(done, done);
            else { try { var ta = document.createElement('textarea'); ta.value = url; document.body.appendChild(ta); ta.select(); document.execCommand('copy'); document.body.removeChild(ta); } catch (e) {} done(); }
            return;
          }
          var share = {
            facebook: 'https://www.facebook.com/sharer/sharer.php?u=' + encodeURIComponent(url),
            linkedin: 'https://www.linkedin.com/sharing/share-offsite/?url=' + encodeURIComponent(url),
            zalo: 'https://sp.zalo.me/plugins/share?u=' + encodeURIComponent(url)
          }[kind];
          if (share) window.open(share, '_blank', 'noopener,width=640,height=560');
        });
      });
    })();

    /* ----- related + prev/next + dates ----- */
    var relatedEl = document.getElementById('related-grid');
    var navEl = document.getElementById('post-nav');

    function buildRelated() {
      if (!relatedEl) return;
      var pool = NEWS.filter(function (a) { return a.slug !== slug; });
      var cur = NEWS.filter(function (a) { return a.slug === slug; })[0];
      pool.sort(function (a, b) {
        var sa = (cur && a.category === cur.category) ? 0 : 1;
        var sb = (cur && b.category === cur.category) ? 0 : 1;
        return sa - sb;
      });
      relatedEl.innerHTML = pool.slice(0, 3).map(cardHTML).join('');
    }

    function buildPrevNext() {
      if (!navEl) return;
      var idx = NEWS.map(function (a) { return a.slug; }).indexOf(slug);
      var prev = idx > 0 ? NEWS[idx - 1] : null;       // newer
      var next = idx < NEWS.length - 1 ? NEWS[idx + 1] : null; // older
      function slot(a, dir, cls, icon) {
        if (!a) return '<span class="placeholder"></span>';
        var c = a[lang()] || a.vi;
        var dirHTML = cls === 'next'
          ? '<span class="dir">' + esc(t('nw.' + dir)) + '<span class="ms" aria-hidden="true">' + icon + '</span></span>'
          : '<span class="dir"><span class="ms" aria-hidden="true">' + icon + '</span>' + esc(t('nw.' + dir)) + '</span>';
        return '<a class="' + cls + '" href="' + a.slug + '.html">' + dirHTML + '<span class="t">' + esc(c.title) + '</span></a>';
      }
      navEl.innerHTML = slot(prev, 'prev', 'prev', 'arrow_back') + slot(next, 'next', 'next', 'arrow_forward');
    }

    function formatDates() {
      document.querySelectorAll('time[data-date]').forEach(function (el) {
        el.textContent = fmtDate(el.getAttribute('data-date'));
      });
    }

    function rebuild() { buildTOC(); buildRelated(); buildPrevNext(); formatDates(); }
    document.addEventListener('uie:langchange', rebuild);
    rebuild();
    return true;
  }

  function init() { if (!initList()) initArticle(); }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
