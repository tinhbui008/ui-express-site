/* warehouses.js — 11 U&I warehouses in the USA.
   Single source of truth for the map pins. The visible list is written
   directly in the HTML (so it works with JS off); coordinates here feed
   the d3 map in maps.js. `city` strings match the list order in the HTML. */
window.UIE_WAREHOUSES = [
  { city: 'Savannah, GA',    coords: [-81.09, 32.08] },
  { city: 'Carson, CA',      coords: [-118.28, 33.83] },
  { city: 'Los Angeles, CA', coords: [-118.24, 34.05] },
  { city: 'New Jersey',      coords: [-74.17, 40.74] },
  { city: 'Houston, TX',     coords: [-95.37, 29.76] },
  { city: 'Dallas, TX',      coords: [-96.8, 32.78] },
  { city: 'Chicago, IL',     coords: [-87.63, 41.88] },
  { city: 'Atlanta, GA',     coords: [-84.39, 33.75] },
  { city: 'Charlotte, NC',   coords: [-80.84, 35.23] },
  { city: 'Miami, FL',       coords: [-80.19, 25.76] },
  { city: 'Seattle, WA',     coords: [-122.33, 47.61] }
];

/* Global network hubs — routes drawn from HCMC to each destination. */
window.UIE_HUBS = [
  { n: 'TP. Hồ Chí Minh', coords: [106.63, 10.82], home: true },
  { n: 'Los Angeles',     coords: [-118.24, 34.05] },
  { n: 'Savannah',        coords: [-81.09, 32.08] },
  { n: 'New Jersey',      coords: [-74.17, 40.74] },
  { n: 'Houston',         coords: [-95.37, 29.76] },
  { n: 'Frankfurt',       coords: [8.68, 50.11] },
  { n: 'Thượng Hải',      coords: [121.47, 31.23] },
  { n: 'Singapore',       coords: [103.82, 1.35] },
  { n: 'Dubai',           coords: [55.27, 25.2] },
  { n: 'Sydney',          coords: [151.21, -33.87] }
];
