import '@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css';
import 'mapbox-gl/dist/mapbox-gl.css';
import type { NextPage } from 'next';
import Areas from '../components/Areas';
import Footer from '../components/Footer';
import GeneralInfo from '../components/GeneralInfo';
import Layers from '../components/Layers';
import MapInfo from '../components/MapInfo';
import Sidebar from '../components/Sidebar';
import Tabs from '../components/Tabs';
import Weather from '../components/Weather';
import { useAuth } from '../hooks/useAuth/useAuth';
import useMap from '../hooks/useMap/useMap';

const tabs = ['Layers', 'Areas', 'General Info'];

const Map: NextPage = () => {
  const { user, logout } = useAuth();
  const { container, lng, lat, zoom, searchRef } = useMap();

  return (
    <>
      <Sidebar>
        <div ref={searchRef} className="m-2 rounded-lg" />
        <div className="flex flex-1 flex-col justify-between">
          <Tabs tabs={tabs}>
            <Layers />
            <Areas areas={[]} />
            <GeneralInfo />
          </Tabs>
          <div>
            <Weather />
            <Footer name={user?.attributes.name} logout={logout} />
          </div>
        </div>
      </Sidebar>

      <MapInfo>
        Center: {lng}, {lat}
        <br />
        Zoom: {zoom}
        <br />
      </MapInfo>

      <div id="map" ref={container} className="fixed h-screen w-screen" />
    </>
  );
};

export default Map;
