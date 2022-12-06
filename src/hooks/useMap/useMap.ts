import mapboxgl, { MapLayerMouseEvent } from 'mapbox-gl';
import { useEffect, useRef, useState } from 'react';
import { onHover } from './hover';
import {
  fillLayerBarangay,
  fillLayerMunicipality,
  sourceLayerBarangay,
  sourceLayerMunicipality,
} from './layers';
import { initMap, initSearchBox, setVisibility } from './map';

interface Request {
  onClick: (_: MapLayerMouseEvent) => void;
}

const useMap = ({ onClick }: Request) => {
  const map = useRef<mapboxgl.Map>();
  const mapRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);
  const [idleMap, setIdleMap] = useState<mapboxgl.Map>();

  useEffect(() => {
    if (map.current || !mapRef?.current) return;
    map.current = initMap({ container: mapRef.current });

    if (searchRef.current) {
      const geocoder = initSearchBox();
      searchRef.current?.appendChild(geocoder.onAdd(map.current));
    }

    map.current.on('load', () => {
      if (!map.current) return;

      map.current.addLayer(fillLayerMunicipality);
      onHover(map.current, fillLayerMunicipality, sourceLayerMunicipality);

      map.current.addLayer(fillLayerBarangay);
      onHover(map.current, fillLayerBarangay, sourceLayerBarangay);

      map.current.on('click', fillLayerMunicipality.id, onClick);
      map.current.on('click', fillLayerBarangay.id, onClick);

      const defaults = localStorage.getItem('layer-settings');
      if (defaults) {
        Object.entries(JSON.parse(defaults)).forEach(s =>
          setVisibility(s[0], s[1] as boolean, map.current)
        );
      }
    });

    map.current.on('idle', () => setIdleMap(map.current));
  }, [onClick]);

  return {
    map,
    mapRef,
    searchRef,
    idleMap,
  };
};

export default useMap;
