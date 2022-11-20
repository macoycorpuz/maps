import mapboxgl from 'mapbox-gl';
import { useEffect, useRef, useState } from 'react';
import { init } from './map';

const useMap = () => {
  const container = useRef<any>(null);
  const map = useRef<mapboxgl.Map>();
  const [lng, setLng] = useState(121.0736);
  const [lat, setLat] = useState(14.9828);
  const [zoom, setZoom] = useState(9.76);

  useEffect(() => {
    if (map.current || !container?.current) return;
    map.current = init({
      container: container.current,
      center: [lng, lat],
      zoom: zoom,
    });

    map.current.on('move', () => {
      setLng(Number(map.current?.getCenter().lng.toFixed(4)));
      setLat(Number(map.current?.getCenter().lat.toFixed(4)));
      setZoom(Number(map.current?.getZoom().toFixed(2)));
    });
  });

  return { container, lng, lat, zoom };
};

export default useMap;
