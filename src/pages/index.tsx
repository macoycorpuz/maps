import '@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import type { NextPage } from 'next';
import { useEffect, useRef, useState } from 'react';
import Footer from '../components/Footer';
import BarangayInfo from '../components/info/BarangayInfo';
import Info from '../components/info/Info';
import MunicipalityInfo from '../components/info/MunicipalityInfo';
import Layers from '../components/Layers';
import Sidebar from '../components/Sidebar';
import Tabs from '../components/Tabs';
import Weather from '../components/Weather';
import { useAuth } from '../hooks/useAuth/useAuth';
import { hover } from '../mapbox/hover';
import {
  fillLayerBarangay,
  fillLayerMunicipality,
  sourceLayerBarangay,
  sourceLayerMunicipality,
} from '../mapbox/layers';
import { initMap, initSearchBox } from '../mapbox/map';

const tabs = ['Info', 'Layers'];

const Map: NextPage = () => {
  const { user, logout } = useAuth();

  const map = useRef<mapboxgl.Map>();
  const mapRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);

  const [municipalityCode, setMunicipalityCode] = useState('');
  const [barangayCode, setBarangayCode] = useState('');

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
      hover(map.current, fillLayerMunicipality, sourceLayerMunicipality);

      map.current.addLayer(fillLayerBarangay);
      hover(map.current, fillLayerBarangay, sourceLayerBarangay);

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
    });
  }, []);

  return (
    <>
      <Sidebar>
        <div ref={searchRef} className="m-2 rounded-lg" />
        <div className="flex flex-1 flex-col justify-between">
          <Tabs tabs={tabs}>
            <Info>
              {!barangayCode && !municipalityCode && (
                <div className="m-auto italic text-gray-500">Select a tile</div>
              )}
              {municipalityCode && <MunicipalityInfo code={municipalityCode} />}
              {barangayCode && <BarangayInfo code={barangayCode} />}
            </Info>
            <Layers />
          </Tabs>
          <div>
            <Weather />
            <Footer name={user?.attributes.name} logout={logout} />
          </div>
        </div>
      </Sidebar>

      <div ref={mapRef} className="fixed h-screen w-screen" />
    </>
  );
};

export default Map;
