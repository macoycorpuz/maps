import MapboxGeocoder, { GeocoderOptions } from '@mapbox/mapbox-gl-geocoder';
import mapboxgl, { MapboxOptions } from 'mapbox-gl';

export const init = (options: MapboxOptions) => {
  mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_GL_ACCESS_TOKEN ?? '';

  const geocoderOptions: GeocoderOptions = {
    accessToken: mapboxgl.accessToken,
    mapboxgl: mapboxgl,
  };

  const map = new mapboxgl.Map(options);
  const geocoder = new MapboxGeocoder(geocoderOptions);
  const nav = new mapboxgl.NavigationControl();
  map.addControl(geocoder);
  map.addControl(nav);

  return map;
};
