import {
  ChevronDoubleLeftIcon,
  ChevronDoubleRightIcon,
} from '@heroicons/react/24/solid';
import { useState } from 'react';
import { classNames } from '../lib/classNames';
import Areas from './Areas';
import Footer from './Footer';
import GeneralInfo from './GeneralInfo';
import Markers from './Markers';
import Tabs from './Tabs';

interface Props {
  children?: React.ReactNode;
}

const tabs = ['Markers', 'Areas', 'General Info'];

const Sidebar: React.FC<Props> = ({ children }) => {
  const [isOpen, setIsOpen] = useState(true);

  const toggle = () => setIsOpen(!isOpen);

  return (
    <div
      className={classNames(
        'fixed z-10 flex h-full min-h-full flex-col overflow-y-auto bg-white',
        isOpen ? 'w-72' : 'w-0'
      )}
    >
      {children}
      <div className="flex flex-1 flex-col justify-between">
        <Tabs tabs={tabs}>
          <Areas areas={[]} />
          <Markers markers={[]} />
          <GeneralInfo />
        </Tabs>
        <Footer name="Marcuz Corpuz" />
      </div>

      <button
        className={classNames(
          'fixed top-1/2 z-20 rounded-r-lg bg-white py-2 px-1 hover:bg-gray-300',
          isOpen ? 'left-72' : 'left-0'
        )}
        onClick={toggle}
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
