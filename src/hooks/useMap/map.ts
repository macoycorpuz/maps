import MapboxGeocoder from '@mapbox/mapbox-gl-geocoder';
import mapboxgl, { MapboxOptions } from 'mapbox-gl';

// const style = 'mapbox://styles/mapbox/streets-v12';
const style = 'mapbox://styles/minerva-technologies/clajo46q9000l14rybut2m850';
mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_GL_ACCESS_TOKEN ?? '';

export const initMap = (options: MapboxOptions) => {
  const map = new mapboxgl.Map({
    style,
    hash: true,
    bearingSnap: 0,
    attributionControl: false,
    maxBounds: [
      [119.4, 13.5],
      [122, 16],
    ],
    ...options,
  });

  const nav = new mapboxgl.NavigationControl();
  map.addControl(nav, 'bottom-right');
  map.on('load', () => onLoad(map));
  map.on('idle', () => onIdle(map));
  return map;
};

export const initSearchBox = () => {
  const geocoder = new MapboxGeocoder({
    accessToken: mapboxgl.accessToken,
    mapboxgl: mapboxgl,
  });
  return geocoder;
};

const onLoad = (map: mapboxgl.Map) => {
  municipalityHoverLayer(map);
  barangayHoverLayer(map);
};

const onIdle = (map: mapboxgl.Map) => {
  toggleSwitch(map);
};

const toggleSwitch = (map: mapboxgl.Map) => {
  const items = document.querySelectorAll('#layer-settings li');
  items.forEach(item => {
    item.addEventListener('click', (event: Event) => {
      const element = <HTMLElement>event.target;
      const isChecked = element.getAttribute('data-headlessui-state');
      const visiblity = isChecked != 'checked' ? 'visible' : 'none';
      map.setLayoutProperty(item.id, 'visibility', visiblity);
      if (item.id.includes('municipality')) {
        map.setLayoutProperty('municipality-fills', 'visibility', visiblity);
      }
      if (item.id.includes('barangay')) {
        map.setLayoutProperty('barangay-fills', 'visibility', visiblity);
      }
    });
  });
};

const municipalityHoverLayer = (map: mapboxgl.Map) => {
  const layerId = 'municipality-fills';
  const source = 'composite';
  const sourceLayer = 'Admin_Boundaries_3_Shapefile-a5bhpn';
  const filter = ['match', ['get', 'ADM2_EN'], ['Bulacan'], true, false];

  const fillColor = 'hsl(216, 94%, 55%)';
  const minzoom = 9.3;
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
