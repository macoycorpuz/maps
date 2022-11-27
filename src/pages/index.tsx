import '@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css';
import 'mapbox-gl/dist/mapbox-gl.css';
import type { NextPage } from 'next';
import Footer from '../components/Footer';
import Info from '../components/Info';
import Layers from '../components/Layers';
import Sidebar from '../components/Sidebar';
import Tabs from '../components/Tabs';
import Weather from '../components/Weather';
import { useAuth } from '../hooks/useAuth/useAuth';
import useMap from '../hooks/useMap/useMap';

const tabs = ['Info', 'Layers'];

const Map: NextPage = () => {
  const { user, logout } = useAuth();
  const { container, searchRef } = useMap();

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

      <div id="map" ref={container} className="fixed h-screen w-screen" />
    </>
  );
};

export default Map;
