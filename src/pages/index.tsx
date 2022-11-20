import '@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css';
import 'mapbox-gl/dist/mapbox-gl.css';
import type { NextPage } from 'next';
import MapInfo from '../components/MapInfo';
import useMap from '../hooks/useMap/useMap';

const Map: NextPage = () => {
  const { container, lng, lat, zoom } = useMap();

  return (
    <main className="flex h-screen w-screen">
      <div ref={container} className="h-full w-full" />

      <MapInfo>
        Center: {lng}, {lat}
        <br />
        Zoom: {zoom}
        <br />
      </MapInfo>
    </main>
  );
};

export default Map;
