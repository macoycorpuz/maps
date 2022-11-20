import { FC, ReactNode } from 'react';

export interface IMapInfo {
  children: ReactNode;
}

const MapInfo: FC<IMapInfo> = ({ children }) => {
  return (
    <div className="absolute bottom-0 z-10 m-2 w-3/4 rounded-lg bg-slate-800 bg-opacity-80 px-4 py-2 font-mono text-xs text-white md:right-0 md:bottom-auto md:top-0 md:w-1/4 xl:w-1/5">
      {children}
    </div>
  );
};

export default MapInfo;
