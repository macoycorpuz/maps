import MapboxGeocoder from '@mapbox/mapbox-gl-geocoder';
import mapboxgl, { MapboxOptions } from 'mapbox-gl';

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_GL_ACCESS_TOKEN ?? '';

export const initMap = (options: MapboxOptions) => {
  // const style = 'mapbox://styles/mapbox/streets-v12';
  const style =
    'mapbox://styles/minerva-technologies/clajo46q9000l14rybut2m850';

  const map = new mapboxgl.Map({
    style,
    hash: true,
    bearingSnap: 0,
    attributionControl: false,
    center: [121.0736, 14.9828],
    zoom: 9.76,
    maxBounds: [
      [119.5, 13.5],
      [122.5, 16.5],
    ],
    ...options,
  });

  const nav = new mapboxgl.NavigationControl();
  map.addControl(nav);
  return map;
};

export const initSearchBox = () => {
  const geocoder = new MapboxGeocoder({
    accessToken: mapboxgl.accessToken,
    mapboxgl: mapboxgl,
  });
  return geocoder;
};
