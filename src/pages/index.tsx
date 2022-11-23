import '@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css';
import 'mapbox-gl/dist/mapbox-gl.css';
import type { NextPage } from 'next';
import MapInfo from '../components/MapInfo';
import Sidebar from '../components/Sidebar';
import useMap from '../hooks/useMap/useMap';

const Map: NextPage = () => {
  const { container, lng, lat, zoom, searchRef } = useMap();

  return (
    <>
      <Sidebar>
        <div ref={searchRef} className="m-2 rounded-lg" />
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
