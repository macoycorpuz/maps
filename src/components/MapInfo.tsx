import { FC, ReactNode } from 'react';

export interface IMapInfo {
  children: ReactNode;
  lng: string | number;
  lat: string | number;
  zoom: string | number;
}

const MapInfo: FC<IMapInfo> = ({ children, lng, lat, zoom }) => {
  return (
    <div className="absolute right-0 bottom-auto top-0 z-10 m-2 w-1/2 rounded-lg bg-slate-800 bg-opacity-80 px-4 py-2 font-mono text-xs text-white md:w-1/4 xl:w-1/5">
      <div className="flex flex-col">
        <p>
          Center: {lng}, {lat}
        </p>
        <p>Zoom: {zoom}</p>
      </div>
      {children}
    </div>
  );
};

export default MapInfo;
