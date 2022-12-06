import React, { useMemo } from 'react';
import { data } from '../../data';
import { OneCallRequest } from '../../hooks/weather/types';
import Weather from '../Weather';

interface Props {
  code: string | number;
  onClickWeather: (_: OneCallRequest) => void;
}

const Info: React.FC<Props> = ({ code, onClickWeather }) => {
  const view = useMemo(() => data.find(m => m.id === code), [code]);

  if (!code) {
    return (
      <div className="flex h-full flex-col justify-between">
        <div className="m-auto italic text-gray-500">Select a tile</div>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col py-4">
      <div className="flex items-center justify-between border-b px-2 pb-2">
        <div className="flex-1 pb-1 leading-3">
          <h1 className="text-xl font-extrabold">{view?.name}</h1>
          <span className="font-mono text-xs">Code: {view?.id}</span>
        </div>
      </div>
      <Weather
        request={{ location: `${view?.name},bulacan,ph` }}
        onClick={onClickWeather}
      />
      <div className="space-y-2 p-2 text-sm">
        {view?.metadata.map((d, i) => (
          <span key={i} className="flex items-center">
            {d.name}: {d.value}
          </span>
        ))}
      </div>
    </div>
  );
};

export default Info;
