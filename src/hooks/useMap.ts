import MapboxGeocoder from '@mapbox/mapbox-gl-geocoder';
import mapboxgl from 'mapbox-gl';
import { useEffect, useRef, useState } from 'react';

interface UseMap {}

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_GL_ACCESS_TOKEN ?? '';

const useMap: UseMap = ({}) => {
  const container = useRef<any>(null);
  const map = useRef<mapboxgl.Map | any>(null);
  const [lng, setLng] = useState(120.8114);
  const [lat, setLat] = useState(14.8437);
  const [zoom, setZoom] = useState(10);

  useEffect(() => {
    if (map.current || !mapboxgl.accessToken) return;

    map.current = new mapboxgl.Map({
      container: container.current,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [lng, lat],
      zoom: zoom,
    });

    const geocoder = new MapboxGeocoder({
      accessToken: mapboxgl.accessToken,
      mapboxgl: mapboxgl,
    });
    const nav = new mapboxgl.NavigationControl();

    map.current.addControl(geocoder);
    map.current.addControl(nav);
  });

  useEffect(() => {
    if (!map.current) return;
    map.current.on('move', () => {
      setLng(map.current.getCenter().lng.toFixed(4));
      setLat(map.current.getCenter().lat.toFixed(4));
      setZoom(map.current.getZoom().toFixed(2));
    });
  });

  return {};
};

export default useMap;
