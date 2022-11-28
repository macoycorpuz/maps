import '@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import type { NextPage } from 'next';
import { useEffect, useRef } from 'react';
import Footer from '../components/Footer';
import Info from '../components/Info';
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
  const mapRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map>();

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
    });
  }, []);

  return (
    <>
      <Sidebar>
        <div ref={searchRef} className="m-2 rounded-lg" />
        <div className="flex flex-1 flex-col justify-between">
          <Tabs tabs={tabs}>
            <Info />
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
