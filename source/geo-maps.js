/* geo-maps.js — real-geometry maps for U&I Express (d3-geo + TopoJSON, no hand-drawn outlines)
   Defines: <us-warehouse-map>  and  <world-network-map>  */
(function () {
  const D3 = { src: 'https://unpkg.com/d3@7.9.0/dist/d3.min.js', integrity: 'sha384-CjloA8y00+1SDAUkjs099PVfnY2KmDC2BZnws9kh8D/lX1s46w6EPhpXdqMfjK6i' };
  const TJ = { src: 'https://unpkg.com/topojson-client@3.1.0/dist/topojson-client.min.js', integrity: 'sha384-Ukv1p/xTma6P4/2bY5KzWBw+ydSpXmhCMtyciIQVDJ1RmOxtCYNMF1uXT9T63H67' };
  const ATLAS = 'https://cdn.jsdelivr.net/npm/world-atlas@2.0.2/countries-110m.json';

  function loadScript(spec) {
    return new Promise((res, rej) => {
      const existing = document.querySelector('script[data-geo="' + spec.src + '"]');
      if (existing) { existing.__p.then(res, rej); return; }
      const s = document.createElement('script');
      s.src = spec.src; s.integrity = spec.integrity; s.crossOrigin = 'anonymous';
      s.dataset.geo = spec.src;
      s.__p = new Promise((a, b) => { s.onload = a; s.onerror = b; });
      s.__p.then(res, rej);
      document.head.appendChild(s);
    });
  }

  let libsP = null;
  function libs() {
    if (!libsP) {
      libsP = Promise.all([loadScript(D3), loadScript(TJ)])
        .then(() => fetch(ATLAS).then(r => r.json()))
        .then(topo => {
          const fc = window.topojson.feature(topo, topo.objects.countries);
          return { countries: fc.features };
        });
    }
    return libsP;
  }

  const NAVY = '#1B3A6B', BLUE = '#2E6BB8', RED = '#C81E1E', ORANGE = '#F5820D';

  const WAREHOUSES = [
    { n: 'Los Angeles, CA', c: [-118.24, 34.05] },
    { n: 'Carson, CA', c: [-118.28, 33.83] },
    { n: 'Seattle, WA', c: [-122.33, 47.61] },
    { n: 'Houston, TX', c: [-95.37, 29.76] },
    { n: 'Dallas, TX', c: [-96.8, 32.78] },
    { n: 'Chicago, IL', c: [-87.63, 41.88] },
    { n: 'Savannah, GA', c: [-81.09, 32.08] },
    { n: 'Atlanta, GA', c: [-84.39, 33.75] },
    { n: 'Charlotte, NC', c: [-80.84, 35.23] },
    { n: 'New Jersey', c: [-74.17, 40.74] },
    { n: 'Miami, FL', c: [-80.19, 25.76] }
  ];

  const HUBS = [
    { n: 'TP. Hồ Chí Minh', c: [106.63, 10.82], home: true },
    { n: 'Los Angeles', c: [-118.24, 34.05] },
    { n: 'Savannah', c: [-81.09, 32.08] },
    { n: 'New Jersey', c: [-74.17, 40.74] },
    { n: 'Houston', c: [-95.37, 29.76] },
    { n: 'Frankfurt', c: [8.68, 50.11] },
    { n: 'Thượng Hải', c: [121.47, 31.23] },
    { n: 'Singapore', c: [103.82, 1.35] },
    { n: 'Dubai', c: [55.27, 25.2] },
    { n: 'Sydney', c: [151.21, -33.87] }
  ];

  function svgEl(n, attrs) {
    const e = document.createElementNS('http://www.w3.org/2000/svg', n);
    for (const k in attrs) if (attrs[k] != null) e.setAttribute(k, attrs[k]);
    return e;
  }

  class BaseMap extends HTMLElement {
    connectedCallback() {
      this.style.display = 'block';
      this.style.width = '100%';
      this._ro = new ResizeObserver(() => this._schedule());
      this._ro.observe(this);
      if (this.parentElement) this._ro.observe(this.parentElement);
      this._tries = 0;
      libs().catch(() => {});
      this._schedule();
    }
    disconnectedCallback() { if (this._ro) this._ro.disconnect(); clearTimeout(this._t); }
    _measure() {
      let w = Math.round(this.clientWidth || this.getBoundingClientRect().width);
      if (w) return w;
      let p = this.parentElement, guard = 0;
      while (p && guard++ < 4) {
        const pw = p.clientWidth;
        if (pw) {
          const cs = getComputedStyle(p);
          return Math.max(0, Math.round(pw - parseFloat(cs.paddingLeft || 0) - parseFloat(cs.paddingRight || 0)));
        }
        p = p.parentElement;
      }
      return 0;
    }
    _schedule() {
      let w = this._measure();
      if (!w) {
        if (this._tries == null) this._tries = 0;
        if (this._tries++ < 30) { setTimeout(() => this._schedule(), this._tries < 6 ? 40 : 250); return; }
        w = 640;
      }
      if (w === this._w && this._drawn) return;
      this._w = w;
      clearTimeout(this._t);
      this._t = setTimeout(() => this._draw(w), 50);
    }
    async _draw(w) {
      let data;
      try { data = await libs(); } catch (e) { this.textContent = ''; return; }
      if (!this.isConnected) return;
      this.innerHTML = '';
      this.style.overflow = 'hidden';
      this.appendChild(this.build(data, w));
      this._drawn = true;
    }
  }

  class UsWarehouseMap extends BaseMap {
    build(data, w) {
      const d3 = window.d3;
      const usa = data.countries.find(f => f.properties && f.properties.name === 'United States of America');
      const h = Math.max(220, Math.round(w * 0.6));
      const proj = d3.geoAlbersUsa().fitExtent([[16, 16], [w - 16, h - 16]], usa);
      const path = d3.geoPath(proj);
      const svg = svgEl('svg', { viewBox: '0 0 ' + w + ' ' + h, preserveAspectRatio: 'xMidYMid meet', style: 'display:block;width:100%;height:auto;max-width:100%;overflow:visible' });

      svg.appendChild(svgEl('path', { d: path(usa), fill: '#DCE6F4', stroke: BLUE, 'stroke-width': 1, 'stroke-opacity': 0.55 }));

      WAREHOUSES.forEach((p, i) => {
        const xy = proj(p.c);
        if (!xy) return;
        const g = svgEl('g', {});
        const pulse = svgEl('circle', { cx: xy[0], cy: xy[1], r: 4, fill: RED, opacity: 0.28 });
        pulse.appendChild(svgEl('animate', { attributeName: 'r', values: '4;13;4', dur: '2.6s', begin: (i * 0.22) + 's', repeatCount: 'indefinite' }));
        pulse.appendChild(svgEl('animate', { attributeName: 'opacity', values: '0.32;0;0.32', dur: '2.6s', begin: (i * 0.22) + 's', repeatCount: 'indefinite' }));
        g.appendChild(pulse);
        g.appendChild(svgEl('circle', { cx: xy[0], cy: xy[1], r: 5, fill: RED, stroke: '#fff', 'stroke-width': 1.8 }));
        if (w > 460) {
          const t = svgEl('text', {
            x: xy[0] + (p.n === 'Carson, CA' || p.n === 'Los Angeles, CA' ? -9 : 9),
            y: xy[1] + (p.n === 'Carson, CA' ? 13 : 3.5),
            'text-anchor': p.n === 'Carson, CA' || p.n === 'Los Angeles, CA' ? 'end' : 'start',
            fill: NAVY, 'font-size': 11, 'font-weight': 600,
            style: 'font-family:\'Be Vietnam Pro\',sans-serif;paint-order:stroke;stroke:#fff;stroke-width:3px'
          });
          t.textContent = p.n;
          g.appendChild(t);
        }
        svg.appendChild(g);
      });
      return svg;
    }
  }

  class WorldNetworkMap extends BaseMap {
    build(data, w) {
      const d3 = window.d3;
      const h = Math.max(200, Math.round(w * 0.5));
      const proj = d3.geoNaturalEarth1().fitExtent([[6, 6], [w - 6, h - 6]], { type: 'Sphere' });
      const path = d3.geoPath(proj);
      const svg = svgEl('svg', { viewBox: '0 0 ' + w + ' ' + h, preserveAspectRatio: 'xMidYMid meet', style: 'display:block;width:100%;height:auto;max-width:100%' });

      svg.appendChild(svgEl('path', { d: path({ type: 'Sphere' }), fill: '#12294F', stroke: 'none' }));
      svg.appendChild(svgEl('path', { d: path({ type: 'FeatureCollection', features: data.countries }), fill: '#22467E', stroke: '#3A6BB0', 'stroke-width': 0.5 }));
      svg.appendChild(svgEl('path', { d: path(d3.geoGraticule10()), fill: 'none', stroke: '#3A6BB0', 'stroke-width': 0.35, 'stroke-opacity': 0.4 }));

      const home = HUBS[0];
      HUBS.slice(1).forEach((hub, i) => {
        const line = { type: 'LineString', coordinates: [home.c, hub.c] };
        const p = svgEl('path', { d: path(line), fill: 'none', stroke: ORANGE, 'stroke-width': 1.5, 'stroke-linecap': 'round', 'stroke-opacity': 0.9 });
        const len = 2200;
        p.setAttribute('stroke-dasharray', '10 8');
        const a = svgEl('animate', { attributeName: 'stroke-dashoffset', values: len + ';0', dur: (14 + i) + 's', repeatCount: 'indefinite' });
        p.appendChild(a);
        svg.appendChild(p);
      });

      HUBS.forEach(hub => {
        const xy = proj(hub.c);
        if (!xy) return;
        svg.appendChild(svgEl('circle', { cx: xy[0], cy: xy[1], r: hub.home ? 6 : 3.6, fill: hub.home ? RED : '#FFD8A6', stroke: hub.home ? '#fff' : 'none', 'stroke-width': 2 }));
        if (w > 520) {
          const t = svgEl('text', {
            x: xy[0], y: xy[1] - (hub.home ? 12 : 9), 'text-anchor': 'middle',
            fill: hub.home ? '#fff' : '#CFE0F7', 'font-size': hub.home ? 12 : 10, 'font-weight': hub.home ? 700 : 500,
            style: 'font-family:\'Be Vietnam Pro\',sans-serif'
          });
          t.textContent = hub.n;
          svg.appendChild(t);
        }
      });
      return svg;
    }
  }

  if (!customElements.get('us-warehouse-map')) customElements.define('us-warehouse-map', UsWarehouseMap);
  if (!customElements.get('world-network-map')) customElements.define('world-network-map', WorldNetworkMap);
})();
