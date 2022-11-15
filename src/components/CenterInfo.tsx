import { FC } from 'react';

export interface ICenterInfo {
  lng: number;
  lat: number;
  zoom: number;
}

const CenterInfo: FC<ICenterInfo> = ({ lng, lat, zoom }) => {
  return (
    <div className="absolute left-0 bottom-0 z-10 m-4 rounded-lg bg-slate-800 px-4 py-2 font-mono text-xs text-white">
      Longitude: {lng} | Latitude: {lat} | Zoom: {zoom}
    </div>
  );
};

export default CenterInfo;
