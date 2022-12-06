import '@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css';
import 'mapbox-gl/dist/mapbox-gl.css';
import type { NextPage } from 'next';
import { useCallback, useState } from 'react';
import Alerts from '../components/Alerts';
import Controls from '../components/Controls';
import Footer from '../components/Footer';
import Forecast from '../components/Forecast';
import BulacanInfo from '../components/info/BulacanInfo';
import Info from '../components/info/Info';
import Loader from '../components/Loader';
import Sidebar from '../components/Sidebar';
import Studio from '../components/Studio';
import Tabs from '../components/Tabs';
import { useAuth } from '../hooks/useAuth/useAuth';
import useMap from '../hooks/useMap/useMap';
import { OneCallRequest } from '../hooks/weather/types';

const tabs = ['Info', 'Controls', 'Alerts', 'Studio'];

const Map: NextPage = () => {
  const { user, logout } = useAuth();

  const [code, setCode] = useState('');
  const [isForecastOpen, setIsForecastOpen] = useState(false);
  const [forecastRequest, setForecastRequest] = useState<OneCallRequest>({
    latitude: 14.843759,
    longitude: 120.8113694,
  });

  const { mapRef, searchRef, idleMap } = useMap({
    onClick: useCallback(event => {
      if (!event.features || !event.features.length) return;
      const { properties } = event.features[0];
      const mapCode = properties?.Bgy_Code || properties?.ADM3_PCODE;
      setCode(mapCode);
    }, []),
  });

  const onShowForecast = (request: OneCallRequest) => {
    setForecastRequest(request);
    setIsForecastOpen(true);
  };

  if (!user) {
    return (
      <div className="flex w-full justify-center py-4">
        <Loader classNames="h-12 w-12 border-4" />
      </div>
    );
  }

  return (
    <>
      <Sidebar>
        <div ref={searchRef} className="m-2 rounded-lg" />
        <Tabs tabs={tabs}>
          <Info code={code} onClickWeather={onShowForecast}></Info>
          <Controls map={idleMap} />
          <Alerts />
          <Studio />
        </Tabs>
        <div className="sticky bottom-0 w-full bg-white">
          <BulacanInfo onClickWeather={onShowForecast} />
          <Footer name={user?.attributes.name} logout={logout} />
        </div>
      </Sidebar>

      <div ref={mapRef} className="fixed h-screen w-screen" />
      <Forecast
        code={code}
        isOpen={isForecastOpen}
        request={forecastRequest}
        onClose={() => setIsForecastOpen(false)}
      />
    </>
  );
};

export default Map;
