import { useEffect, useRef, useState } from 'react';
import { init } from './map';

const useMap = () => {
  const container = useRef<any>(null);
  const map = useRef<any>(null);
  const [lng, setLng] = useState(121.0736);
  const [lat, setLat] = useState(14.9828);
  const [zoom, setZoom] = useState(9.76);

  useEffect(() => {
    if (map.current || !container?.current) return;
    map.current = init({
      container: container.current,
      style: 'mapbox://styles/minerva-technologies/clajo46q9000l14rybut2m850',
      center: [lng, lat],
      zoom: zoom,
      hash: true,
      bearingSnap: 0,
    });

    map.current.on('move', () => {
      setLng(map.current.getCenter().lng.toFixed(4));
      setLat(map.current.getCenter().lat.toFixed(4));
      setZoom(map.current.getZoom().toFixed(2));
    });
  });

  return { container, lng, lat, zoom };
};

export default useMap;
