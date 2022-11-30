import '@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css';
import 'mapbox-gl/dist/mapbox-gl.css';
import type { NextPage } from 'next';
import { useState } from 'react';
import Alerts from '../components/Alerts';
import Controls from '../components/Controls';
import Footer from '../components/Footer';
import Forecast from '../components/Forecast';
import BarangayInfo from '../components/info/BarangayInfo';
import Info from '../components/info/Info';
import MunicipalityInfo from '../components/info/MunicipalityInfo';
import Sidebar from '../components/Sidebar';
import Studio from '../components/Studio';
import Tabs from '../components/Tabs';
import Weather from '../components/Weather';
import { useAuth } from '../hooks/useAuth/useAuth';
import useMap from '../hooks/useMap/useMap';
import { OneCallRequest } from '../hooks/weather/types/Request';

const tabs = ['Info', 'Controls', 'Alerts', 'Studio'];

const Map: NextPage = () => {
  const { user, logout } = useAuth();
  const [forecastRequest, setForecastRequest] = useState<OneCallRequest>({
    latitude: 14.843759,
    longitude: 120.8113694,
  });
  const [isForecastOpen, setIsForecastOpen] = useState(false);
  const { mapRef, searchRef, municipalityCode, barangayCode, idleMap } =
    useMap();

  const onOpenForecast = () => {
    setIsForecastOpen(true);
  };

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
              <MunicipalityInfo code={municipalityCode} />
              <BarangayInfo code={barangayCode} />
            </Info>
            <Controls map={idleMap} />
            <Alerts />
            <Studio />
          </Tabs>
          <div>
            <Weather onClick={onOpenForecast} />
            <Footer name={user?.attributes.name} logout={logout} />
          </div>
        </div>
      </Sidebar>

      <div ref={mapRef} className="fixed h-screen w-screen" />
      {isForecastOpen && (
        <Forecast
          request={forecastRequest}
          onClose={() => setIsForecastOpen(false)}
        />
      )}
    </>
  );
};

export default Map;
