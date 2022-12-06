import { ChevronDoubleLeftIcon } from '@heroicons/react/24/solid';
import { useState } from 'react';
import { classNames } from '../lib/classNames';

interface Props {
  children: React.ReactNode[];
}

const Sidebar: React.FC<Props> = ({ children }) => {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div>
      <div
        className={classNames(
          'fixed z-10 flex h-full w-80 flex-col bg-white transition-transform duration-500 ease-in-out',
          isOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        {children[0]}
        <div className="flex flex-1 flex-col justify-between overflow-y-auto">
          {children[1]}
        </div>
        {children[2]}
      </div>

      <button
        onClick={() => setIsOpen(prev => !prev)}
        className={classNames(
          'fixed top-1/2 z-10 rounded-r-lg bg-white py-2 px-1 transition-transform duration-500 ease-in-out hover:bg-gray-300',
          isOpen ? 'translate-x-80' : 'translate-x-0'
        )}
      >
        <ChevronDoubleLeftIcon
          className={classNames(
            'h-5 w-5 transition-transform duration-300 ease-in-out',
            isOpen ? 'rotate-0' : 'rotate-180'
          )}
        />
      </button>
    </div>
  );
};

export default Sidebar;
