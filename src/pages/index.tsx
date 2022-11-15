import type { NextPage } from 'next';
import { useEffect, useRef, useState } from 'react';

import MapboxGeocoder from '@mapbox/mapbox-gl-geocoder';
import '@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import CenterInfo from '../components/CenterInfo';

const Map: NextPage = () => {
  const mapContainer = useRef<any>(null);
  const map = useRef<mapboxgl.Map | any>(null);
  const [lng, setLng] = useState(120.8114);
  const [lat, setLat] = useState(14.8437);
  const [zoom, setZoom] = useState(10);

  mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_GL_ACCESS_TOKEN ?? '';

  useEffect(() => {
    if (map.current || !mapboxgl.accessToken) return;

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
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

  if (!mapboxgl.accessToken) {
    return <div>You don&apos;t have access to mapbox</div>;
  }

  return (
    <main className="h-screen w-screen">
      <CenterInfo lng={lng} lat={lat} zoom={zoom} />
      <div ref={mapContainer} className="h-full w-full" />
    </main>
  );
};

export default Map;
