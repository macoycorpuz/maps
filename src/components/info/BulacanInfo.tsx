import { InformationCircleIcon } from '@heroicons/react/24/outline';
import { ChevronUpIcon } from '@heroicons/react/24/solid';
import { useState } from 'react';
import { general } from '../../data/general';
import { OneCallRequest } from '../../hooks/weather/types';
import { classNames } from '../../lib/classNames';
import Weather from '../Weather';

interface Props {
  onClickWeather: (_: OneCallRequest) => void;
}

const BulacanInfo: React.FC<Props> = ({ onClickWeather }) => {
  const [open, setOpen] = useState(false);
  const location = 'Malolos, Bulacan';

  return (
    <div className="border-t">
      <button
        className="flex w-full cursor-pointer items-center justify-between py-1 px-2 text-base font-extrabold hover:bg-gray-200"
        onClick={() => setOpen(prev => !prev)}
      >
        <div className="flex items-center">
          <InformationCircleIcon className="mr-2 h-5 w-5" />
          {general[0].name}
        </div>
        <ChevronUpIcon
          className={classNames(
            'h-5 w-5 transition-transform duration-300 ease-in-out',
            !open ? 'rotate-0' : '-rotate-180'
          )}
        />
      </button>
      <div className={classNames(!open && 'hidden')}>
        <ul className="space-y-1 p-2 text-xs">
          {general[0].metadata.map((d, i) => (
            <li key={i} className="flex items-center">
              {d.name}: {d.value}
            </li>
          ))}
        </ul>
        <Weather
          name={location}
          location={{ q: `${location},ph` }}
          onClick={onClickWeather}
        />
      </div>
    </div>
  );
};

export default BulacanInfo;
