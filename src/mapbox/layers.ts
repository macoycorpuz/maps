import mapboxgl from 'mapbox-gl';

export const sourceLayerMunicipality = 'Admin_Boundaries_3_Shapefile-a5bhpn';

export const fillLayerMunicipality: mapboxgl.AnyLayer = {
  id: 'municipality-fills',
  type: 'fill',
  source: 'composite',
  'source-layer': sourceLayerMunicipality,
  minzoom: 9.3,
  maxzoom: 12,
  filter: ['match', ['get', 'ADM2_EN'], ['Bulacan'], true, false],
  layout: {},
  paint: {
    'fill-color': 'hsl(216, 94%, 55%)',
    'fill-opacity': [
      'case',
      ['boolean', ['feature-state', 'hover'], false],
      0.5,
      0,
    ],
  },
};

export const sourceLayerBarangay = 'Baranggay_Repo-3f47b9';

export const fillLayerBarangay: mapboxgl.AnyLayer = {
  id: 'barangay-fills',
  type: 'fill',
  source: 'composite',
  'source-layer': sourceLayerBarangay,
  minzoom: 12,
  maxzoom: 16,
  filter: ['match', ['get', 'Pro_Name'], ['BULACAN'], true, false],
  layout: {},
  paint: {
    'fill-color': 'hsl(42, 100%, 85%)',
    'fill-opacity': [
      'case',
      ['boolean', ['feature-state', 'hover'], false],
      0.5,
      0,
    ],
  },
};
