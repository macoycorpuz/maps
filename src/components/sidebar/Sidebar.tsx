import { classNames } from '../../lib/classNames';
import Toggle from '../Toggle';
import NavFooter from './NavFooter';

interface Props {
  isOpen: boolean;
}

const Sidebar: React.FC<Props> = ({ isOpen }) => {
  const tabs = [
    { name: 'Controls', href: '#', current: true },
    { name: 'General Info', href: '#', current: false },
  ];

  return (
    <div
      className={
        'w-1/4 flex-col bg-white ' + (isOpen ? 'md:flex' : 'md:hidden')
      }
    >
      <div className="relative flex flex-1 flex-col justify-between overflow-y-auto">
        <div className="flex flex-col">
          <div className="hidden sm:block">
            <div className="border-b border-gray-200">
              <nav className="-mb-px flex space-x-4 px-2" aria-label="Tabs">
                {tabs.map(tab => (
                  <a
                    key={tab.name}
                    href={tab.href}
                    className={classNames(
                      tab.current
                        ? 'border-indigo-500 text-indigo-600'
                        : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700',
                      'whitespace-nowrap border-b-2 py-2 text-sm font-medium'
                    )}
                    aria-current={tab.current ? 'page' : undefined}
                  >
                    {tab.name}
                  </a>
                ))}
              </nav>
            </div>
          </div>

          <div className="flex flex-col space-y-2 py-4 px-2 text-sm">
            <div className="flex items-center space-x-2">
              <Toggle /> <span>Show Municipalities</span>
            </div>
            <div className="flex items-center space-x-2">
              <Toggle /> <span>Show Barangays</span>
            </div>
            <div className="flex items-center space-x-2">
              <Toggle /> <span>Show Hospitals</span>
            </div>
            <div className="flex items-center space-x-2">
              <Toggle /> <span>Show Borders</span>
            </div>
          </div>
        </div>

        <div className="mx-2 rounded-md border-2 border-slate-600 py-2 px-4 text-xs">
          <span className="font-bold">Map Info:</span>
          <br />
          Region: Region III (Central Luzon)
          <br />
          Province: Bulacan
          <br />
          Land Area: 278,369 has.
          <br />
          Population: 3,708,890.00
          <br />
          Number of Municipalities: 24 (3 Cities)
          <br />
          Number of Barangays: 569
          <br />
          Governor: Hon. Daniel R. Fernando
          <br />
          Vice Governor: Hon. Alex C. Castro
        </div>
      </div>
      <NavFooter name="Marcuz Corpuz" />
    </div>
  );
};

export default Sidebar;
