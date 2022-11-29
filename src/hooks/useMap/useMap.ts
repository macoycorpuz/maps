import mapboxgl from 'mapbox-gl';
import { useEffect, useRef, useState } from 'react';
import { onHover } from './hover';
import {
  fillLayerBarangay,
  fillLayerMunicipality,
  sourceLayerBarangay,
  sourceLayerMunicipality,
} from './layers';
import { initMap, initSearchBox, setVisibility } from './map';

const useMap = () => {
  const map = useRef<mapboxgl.Map>();
  const mapRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);

  const [municipalityCode, setMunicipalityCode] = useState('');
  const [barangayCode, setBarangayCode] = useState('');
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

      map.current.on('click', fillLayerMunicipality.id, e => {
        if (!e.features || !e.features.length) return;
        setBarangayCode('');
        setMunicipalityCode(e.features[0].properties?.ADM3_PCODE);
      });

      map.current.on('click', fillLayerBarangay.id, e => {
        if (!e.features || !e.features.length) return;
        setMunicipalityCode('');
        setBarangayCode(e.features[0].properties?.Bgy_Code);
      });

      const defaults = localStorage.getItem('layer-settings');
      if (defaults) {
        Object.entries(JSON.parse(defaults)).forEach(s =>
          setVisibility(s[0], s[1] as boolean, map.current)
        );
      }
    });

    map.current.on('idle', () => setIdleMap(map.current));
  }, []);

  return {
    map,
    mapRef,
    searchRef,
    municipalityCode,
    barangayCode,
    idleMap,
  };
};

export default useMap;
