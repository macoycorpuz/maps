import { InformationCircleIcon } from '@heroicons/react/24/outline';
import { ChevronUpIcon } from '@heroicons/react/24/solid';
import { useState } from 'react';
import { general } from '../../data/general';
import { classNames } from '../../lib/classNames';

interface Props {}

const BulacanInfo: React.FC<Props> = () => {
  const [open, setOpen] = useState(false);
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
      <div className={`space-y-1 px-2 py-2 text-xs ${!open && 'hidden'}`}>
        {general[0].metadata.map((d, i) => (
          <span key={i} className="flex items-center">
            {d.name}: {d.value}
          </span>
        ))}
      </div>
    </div>
  );
};

export default BulacanInfo;
