import {
  ChevronDoubleLeftIcon,
  ChevronDoubleRightIcon,
} from '@heroicons/react/24/solid';
import { useState } from 'react';
import { useAuth } from '../hooks/useAuth/useAuth';
import { classNames } from '../lib/classNames';
import Areas from './Areas';
import Footer from './Footer';
import GeneralInfo from './GeneralInfo';
import Layers from './Layers';
import Tabs from './Tabs';
import Weather from './Weather';

interface Props {
  children?: React.ReactNode;
}

const tabs = ['Layers', 'Areas', 'General Info'];

const Sidebar: React.FC<Props> = ({ children }) => {
  const { user, logout } = useAuth();
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
          <Layers />
          <Areas areas={[]} />
          <GeneralInfo />
        </Tabs>
        <div>
          <Weather />
          <Footer name={user?.attributes.name} logout={logout} />
        </div>
      </div>

      <button
        id="toggle-sidebar"
        onClick={toggle}
        className={classNames(
          'fixed top-1/2 z-20 rounded-r-lg bg-white py-2 px-1 hover:bg-gray-300',
          isOpen ? 'left-72' : 'left-0'
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
