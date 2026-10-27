/* maps.js — real-geometry maps (d3-geo + TopoJSON, no hand-drawn outlines).
   Defines <us-warehouse-map> and <world-network-map>.
   Data comes from data/warehouses.js. If the CDN libraries or atlas fail to
   load, the whole map wrapper is hidden so the warehouse list stands alone. */
(function () {
  'use strict';

  var D3 = { src: 'https://unpkg.com/d3@7.9.0/dist/d3.min.js', integrity: 'sha384-CjloA8y00+1SDAUkjs099PVfnY2KmDC2BZnws9kh8D/lX1s46w6EPhpXdqMfjK6i' };
  var TJ = { src: 'https://unpkg.com/topojson-client@3.1.0/dist/topojson-client.min.js', integrity: 'sha384-Ukv1p/xTma6P4/2bY5KzWBw+ydSpXmhCMtyciIQVDJ1RmOxtCYNMF1uXT9T63H67' };
  var ATLAS = 'https://cdn.jsdelivr.net/npm/world-atlas@2.0.2/countries-110m.json';

  var NAVY = '#1B3A6B', BLUE = '#2E6BB8', RED = '#C81E1E', ORANGE = '#F5820D';

  function reduceMotion() {
    return window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }

  function loadScript(spec) {
    return new Promise(function (res, rej) {
      var existing = document.querySelector('script[data-geo="' + spec.src + '"]');
      if (existing) { existing.__p.then(res, rej); return; }
      var s = document.createElement('script');
      s.src = spec.src; s.integrity = spec.integrity; s.crossOrigin = 'anonymous';
      s.dataset.geo = spec.src;
      s.__p = new Promise(function (a, b) { s.onload = a; s.onerror = b; });
      s.__p.then(res, rej);
      document.head.appendChild(s);
    });
  }

  var libsP = null;
  function libs() {
    if (!libsP) {
      libsP = Promise.all([loadScript(D3), loadScript(TJ)])
        .then(function () { return fetch(ATLAS).then(function (r) { return r.json(); }); })
        .then(function (topo) {
          var fc = window.topojson.feature(topo, topo.objects.countries);
          return { countries: fc.features };
        });
    }
    return libsP;
  }

  function svgEl(n, attrs) {
    var e = document.createElementNS('http://www.w3.org/2000/svg', n);
    for (var k in attrs) if (attrs[k] != null) e.setAttribute(k, attrs[k]);
    return e;
  }

  function BaseMap() {}
  BaseMap.prototype = Object.create(HTMLElement.prototype);

  function defineBase(proto) {
    proto.connectedCallback = function () {
      this.style.display = 'block';
      this.style.width = '100%';
      var self = this;
      this._ro = new ResizeObserver(function () { self._schedule(); });
      this._ro.observe(this);
      if (this.parentElement) this._ro.observe(this.parentElement);
      this._tries = 0;
      libs().catch(function () {});
      this._schedule();
    };
    proto.disconnectedCallback = function () { if (this._ro) this._ro.disconnect(); clearTimeout(this._t); };
    proto._measure = function () {
      var w = Math.round(this.clientWidth || this.getBoundingClientRect().width);
      if (w) return w;
      var p = this.parentElement, guard = 0;
      while (p && guard++ < 4) {
        var pw = p.clientWidth;
        if (pw) {
          var cs = getComputedStyle(p);
          return Math.max(0, Math.round(pw - parseFloat(cs.paddingLeft || 0) - parseFloat(cs.paddingRight || 0)));
        }
        p = p.parentElement;
      }
      return 0;
    };
    proto._schedule = function () {
      var w = this._measure();
      var self = this;
      if (!w) {
        if (this._tries == null) this._tries = 0;
        if (this._tries++ < 30) { setTimeout(function () { self._schedule(); }, this._tries < 6 ? 40 : 250); return; }
        w = 640;
      }
      if (w === this._w && this._drawn) return;
      this._w = w;
      clearTimeout(this._t);
      this._t = setTimeout(function () { self._draw(w); }, 50);
    };
    proto._fail = function () {
      var wrap = this.closest('.wh-map-wrap, .world-map-wrap');
      if (wrap) wrap.style.display = 'none';
      else this.style.display = 'none';
    };
    proto._draw = function (w) {
      var self = this;
      var data;
      libs().then(function (d) {
        data = d;
        if (!self.isConnected) return;
        self.innerHTML = '';
        self.style.overflow = 'hidden';
        self.appendChild(self.build(data, w));
        self._drawn = true;
      }).catch(function () { self._fail(); });
    };
  }
  defineBase(BaseMap.prototype);

  /* ---------- US warehouse map ---------- */
  function UsMap() { return Reflect.construct(HTMLElement, [], UsMap); }
  UsMap.prototype = Object.create(BaseMap.prototype);
  UsMap.prototype.constructor = UsMap;
  UsMap.prototype.build = function (data, w) {
    var d3 = window.d3;
    var whs = window.UIE_WAREHOUSES || [];
    var usa = data.countries.find(function (f) { return f.properties && f.properties.name === 'United States of America'; });
    var h = Math.max(220, Math.round(w * 0.6));
    var proj = d3.geoAlbersUsa().fitExtent([[16, 16], [w - 16, h - 16]], usa);
    var path = d3.geoPath(proj);
    var noAnim = reduceMotion();
    var svg = svgEl('svg', { viewBox: '0 0 ' + w + ' ' + h, preserveAspectRatio: 'xMidYMid meet', role: 'img', 'aria-label': 'Bản đồ 11 kho U&I tại Hoa Kỳ', style: 'display:block;width:100%;height:auto;max-width:100%;overflow:visible' });

    svg.appendChild(svgEl('path', { d: path(usa), fill: '#DCE6F4', stroke: BLUE, 'stroke-width': 1, 'stroke-opacity': 0.55 }));

    whs.forEach(function (p, i) {
      var xy = proj(p.coords);
      if (!xy) return;
      var g = svgEl('g', {});
      var pulse = svgEl('circle', { cx: xy[0], cy: xy[1], r: 4, fill: RED, opacity: 0.28 });
      if (!noAnim) {
        pulse.appendChild(svgEl('animate', { attributeName: 'r', values: '4;13;4', dur: '2.6s', begin: (i * 0.22) + 's', repeatCount: 'indefinite' }));
        pulse.appendChild(svgEl('animate', { attributeName: 'opacity', values: '0.32;0;0.32', dur: '2.6s', begin: (i * 0.22) + 's', repeatCount: 'indefinite' }));
      }
      g.appendChild(pulse);
      g.appendChild(svgEl('circle', { cx: xy[0], cy: xy[1], r: 5, fill: RED, stroke: '#fff', 'stroke-width': 1.8 }));
      if (w > 460) {
        var left = p.city === 'Carson, CA' || p.city === 'Los Angeles, CA';
        var t = svgEl('text', {
          x: xy[0] + (left ? -9 : 9),
          y: xy[1] + (p.city === 'Carson, CA' ? 13 : 3.5),
          'text-anchor': left ? 'end' : 'start',
          fill: NAVY, 'font-size': 11, 'font-weight': 600,
          style: 'font-family:\'Be Vietnam Pro\',sans-serif;paint-order:stroke;stroke:#fff;stroke-width:3px'
        });
        t.textContent = p.city;
        g.appendChild(t);
      }
      svg.appendChild(g);
    });
    return svg;
  };

  /* ---------- World network map ---------- */
  function WorldMap() { return Reflect.construct(HTMLElement, [], WorldMap); }
  WorldMap.prototype = Object.create(BaseMap.prototype);
  WorldMap.prototype.constructor = WorldMap;
  WorldMap.prototype.build = function (data, w) {
    var d3 = window.d3;
    var hubs = window.UIE_HUBS || [];
    var h = Math.max(200, Math.round(w * 0.5));
    var proj = d3.geoNaturalEarth1().fitExtent([[6, 6], [w - 6, h - 6]], { type: 'Sphere' });
    var path = d3.geoPath(proj);
    var noAnim = reduceMotion();
    var svg = svgEl('svg', { viewBox: '0 0 ' + w + ' ' + h, preserveAspectRatio: 'xMidYMid meet', role: 'img', 'aria-label': 'Mạng lưới toàn cầu U&I Express', style: 'display:block;width:100%;height:auto;max-width:100%' });

    svg.appendChild(svgEl('path', { d: path({ type: 'Sphere' }), fill: '#12294F', stroke: 'none' }));
    svg.appendChild(svgEl('path', { d: path({ type: 'FeatureCollection', features: data.countries }), fill: '#22467E', stroke: '#3A6BB0', 'stroke-width': 0.5 }));
    svg.appendChild(svgEl('path', { d: path(d3.geoGraticule10()), fill: 'none', stroke: '#3A6BB0', 'stroke-width': 0.35, 'stroke-opacity': 0.4 }));

    var home = hubs[0];
    if (home) {
      hubs.slice(1).forEach(function (hub, i) {
        var line = { type: 'LineString', coordinates: [home.coords, hub.coords] };
        var p = svgEl('path', { d: path(line), fill: 'none', stroke: ORANGE, 'stroke-width': 1.5, 'stroke-linecap': 'round', 'stroke-opacity': 0.9, 'stroke-dasharray': '10 8' });
        if (!noAnim) {
          p.appendChild(svgEl('animate', { attributeName: 'stroke-dashoffset', values: '2200;0', dur: (14 + i) + 's', repeatCount: 'indefinite' }));
        }
        svg.appendChild(p);
      });
    }

    hubs.forEach(function (hub) {
      var xy = proj(hub.coords);
      if (!xy) return;
      svg.appendChild(svgEl('circle', { cx: xy[0], cy: xy[1], r: hub.home ? 6 : 3.6, fill: hub.home ? RED : '#FFD8A6', stroke: hub.home ? '#fff' : 'none', 'stroke-width': 2 }));
      if (w > 520) {
        var t = svgEl('text', {
          x: xy[0], y: xy[1] - (hub.home ? 12 : 9), 'text-anchor': 'middle',
          fill: hub.home ? '#fff' : '#CFE0F7', 'font-size': hub.home ? 12 : 10, 'font-weight': hub.home ? 700 : 500,
          style: 'font-family:\'Be Vietnam Pro\',sans-serif'
        });
        t.textContent = hub.n;
        svg.appendChild(t);
      }
    });
    return svg;
  };

  if (!customElements.get('us-warehouse-map')) customElements.define('us-warehouse-map', UsMap);
  if (!customElements.get('world-network-map')) customElements.define('world-network-map', WorldMap);
})();
