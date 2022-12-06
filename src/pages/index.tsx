import '@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css';
import { MapLayerMouseEvent } from 'mapbox-gl';
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
import { useLayers } from '../hooks/layers/useLayers';
import { useAuth } from '../hooks/useAuth/useAuth';
import useMap from '../hooks/useMap/useMap';
import { OneCallRequest } from '../hooks/weather/types';

const geo = { lat: 14.843759, lon: 120.8113694 };
const tabs = ['Info', 'Controls', 'Alerts', 'Studio'];

const Map: NextPage = () => {
  const [code, setCode] = useState('');
  const [layerId, setLayerId] = useState('');
  const [isForecastOpen, setIsForecastOpen] = useState(false);
  const [forecastLocation, setForecastLocation] = useState<OneCallRequest>(geo);

  const onClick = useCallback((event: MapLayerMouseEvent) => {
    if (!event.features || !event.features.length) return;
    const { lat, lng } = event.lngLat;
    const { properties, layer } = event.features[0];
    const mapCode = properties?.Bgy_Code || properties?.ADM3_PCODE;
    setCode(mapCode);
    setLayerId(layer.id);
    setForecastLocation({ lat, lon: lng });
  }, []);

  const onShowForecast = (location: OneCallRequest) => {
    setForecastLocation(location);
    setIsForecastOpen(true);
  };

  const { user, logout } = useAuth();
  const { data: layer } = useLayers({ id: code });
  const { mapRef, searchRef, idleMap } = useMap({ onClick });

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
          <Info
            layerId={layerId}
            layer={layer}
            onClickWeather={onShowForecast}
          />
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
        name={layer?.name || 'Malolos Bulacan'}
        isOpen={isForecastOpen}
        location={forecastLocation}
        onClose={() => setIsForecastOpen(false)}
      />
    </>
  );
};

export default Map;
