import MapboxGeocoder, { GeocoderOptions } from '@mapbox/mapbox-gl-geocoder';
import mapboxgl, { MapboxOptions } from 'mapbox-gl';

// const style = 'mapbox://styles/mapbox/streets-v12';
const style = 'mapbox://styles/minerva-technologies/clajo46q9000l14rybut2m850';
mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_GL_ACCESS_TOKEN ?? '';

// Vector Sources
// barangay source: minerva-technologies.200xi30f
// municipalities: minerva-technologies.diprsdmg
// mapbox://mapbox.mapbox-bathymetry-v2
// mapbox.mapbox-streets-v8
// mapbox.country-boundaries-v1
// mapbox.mapbox-terrain-v2

export const init = (options: MapboxOptions) => {
  const geocoderOptions: GeocoderOptions = {
    accessToken: mapboxgl.accessToken,
    mapboxgl: mapboxgl,
  };

  const map = new mapboxgl.Map({
    style,
    hash: true,
    bearingSnap: 0,
    attributionControl: false,
    ...options,
  });
  const geocoder = new MapboxGeocoder(geocoderOptions);
  const nav = new mapboxgl.NavigationControl();
  map.addControl(geocoder, 'top-left');
  map.addControl(nav, 'bottom-right');
  map.on('load', () => {
    municipalityHoverLayer(map);
    barangayHoverLayer(map);
  });

  return map;
};

const municipalityHoverLayer = (map: mapboxgl.Map) => {
  const layerId = 'municipality-fills';
  const source = 'composite';
  const sourceLayer = 'Admin_Boundaries_3_Shapefile-a5bhpn';
  const filter = ['match', ['get', 'ADM2_EN'], ['Bulacan'], true, false];

  const fillColor = 'hsl(216, 94%, 55%)';
  const minzoom = 8;
  const maxzoom = 12;
  let hoveredStateId: any = null;

  map.addLayer({
    id: layerId,
    type: 'fill',
    source,
    'source-layer': sourceLayer,
    minzoom,
    maxzoom,
    filter,
    layout: {},
    paint: {
      'fill-color': fillColor,
      'fill-opacity': [
        'case',
        ['boolean', ['feature-state', 'hover'], false],
        0.5,
        0,
      ],
    },
  });

  map.on('mousemove', layerId, e => {
    if (!e.features || !e.features.length) return;
    if (hoveredStateId !== null) {
      map.setFeatureState(
        { source, sourceLayer, id: hoveredStateId },
        { hover: false }
      );
    }
    hoveredStateId = e.features[0].id;
    map.setFeatureState(
      { source, sourceLayer, id: hoveredStateId },
      { hover: true }
    );
  });

  map.on('mouseleave', layerId, () => {
    if (hoveredStateId !== null) {
      map.setFeatureState(
        { source, sourceLayer, id: hoveredStateId },
        { hover: false }
      );
    }
    hoveredStateId = null;
  });
};

const barangayHoverLayer = (map: mapboxgl.Map) => {
  const layerId = 'barangay-fills';
  const source = 'composite';
  const sourceLayer = 'Baranggay_Repo-3f47b9';
  const filter = ['match', ['get', 'Pro_Name'], ['BULACAN'], true, false];

  const fillColor = 'hsl(42, 100%, 85%)';
  const minzoom = 12;
  const maxzoom = 16;
  let hoveredStateId: any = null;

  map.addLayer({
    id: layerId,
    type: 'fill',
    source,
    'source-layer': sourceLayer,
    minzoom,
    maxzoom,
    filter,
    layout: {},
    paint: {
      'fill-color': fillColor,
      'fill-opacity': [
        'case',
        ['boolean', ['feature-state', 'hover'], false],
        0.4,
        0,
      ],
    },
  });

  map.on('mousemove', layerId, e => {
    if (!e.features || !e.features.length) return;
    if (hoveredStateId !== null) {
      map.setFeatureState(
        { source, sourceLayer, id: hoveredStateId },
        { hover: false }
      );
    }
    hoveredStateId = e.features[0].id;
    map.setFeatureState(
      { source, sourceLayer, id: hoveredStateId },
      { hover: true }
    );
  });

  map.on('mouseleave', layerId, () => {
    if (hoveredStateId !== null) {
      map.setFeatureState(
        { source, sourceLayer, id: hoveredStateId },
        { hover: false }
      );
    }
    hoveredStateId = null;
  });
};
