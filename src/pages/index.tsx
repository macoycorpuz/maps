import type { NextPage } from 'next';

import '@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css';
import 'mapbox-gl/dist/mapbox-gl.css';
import CenterInfo from '../components/CenterInfo';
import useMap from '../hooks/useMap';

const Map: NextPage = () => {
  const { container, lng, lat, zoom } = useMap();

  return (
    <main className="h-screen w-screen">
      <CenterInfo lng={lng} lat={lat} zoom={zoom} />
      <div ref={container} className="h-full w-full" />
    </main>
  );
};

export default Map;
