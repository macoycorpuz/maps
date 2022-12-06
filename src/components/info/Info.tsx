import React from 'react';
import { Layer } from '../../hooks/layers/useLayers';
import { OneCallRequest } from '../../hooks/weather/types';
import Weather from '../Weather';

interface Props {
  layerId: string;
  layer?: Layer;
  onClickWeather: (_: OneCallRequest) => void;
}

const Info: React.FC<Props> = ({ layerId, layer, onClickWeather }) => {
  if (!layer) {
    return (
      <div className="flex h-full flex-col justify-between">
        <div className="m-auto italic text-gray-500">Select a tile</div>
      </div>
    );
  }

  const location = { q: `${layer?.name},bulacan,ph` };
  return (
    <div className="flex h-full flex-col py-4">
      <div className="flex items-center justify-between border-b px-2 pb-2">
        <div className="flex-1 pb-1 leading-3">
          <h1 className="text-xl font-extrabold">{layer?.name}</h1>
          <span className="font-mono text-xs">Code: {layer?.id}</span>
        </div>
      </div>
      <Weather layerId={layerId} location={location} onClick={onClickWeather} />
      <div className="space-y-2 p-2 text-sm">
        {layer?.metadata.map((d, i) => (
          <span key={i} className="flex items-center">
            {d.name}: {d.value}
          </span>
        ))}
      </div>
    </div>
  );
};

export default Info;
