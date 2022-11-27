import {
  ChevronDoubleLeftIcon,
  ChevronDoubleRightIcon,
} from '@heroicons/react/24/solid';
import { useState } from 'react';
import { classNames } from '../lib/classNames';

interface Props {
  children?: React.ReactNode;
}

const Sidebar: React.FC<Props> = ({ children }) => {
  const [isOpen, setIsOpen] = useState(true);
  return (
    <div
      className={classNames(
        'fixed z-10 flex h-full min-h-full flex-col overflow-y-auto bg-white',
        isOpen ? 'w-80' : 'w-0'
      )}
    >
      {children}

      <button
        id="toggle-sidebar"
        onClick={() => setIsOpen(prev => !prev)}
        className={classNames(
          'fixed top-1/2 z-10 rounded-r-lg bg-white py-2 px-1 hover:bg-gray-300',
          isOpen ? 'left-80' : 'left-0'
        )}
      >
        {isOpen ? (
          <ChevronDoubleLeftIcon className="h-5 w-5" />
        ) : (
          <ChevronDoubleRightIcon className="h-5 w-5" />
        )}
      </button>
    </div>
  );
};

export default Sidebar;
