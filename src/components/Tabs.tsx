import { useState } from 'react';
import { classNames } from '../lib/classNames';

interface Props {
  tabs: string[];
  children: React.ReactNode[];
}

const Tabs: React.FC<Props> = ({ tabs, children }) => {
  const [selected, setSelected] = useState(0);

  return (
    <div className="flex flex-col">
      <nav className="border-b border-gray-200">
        <ul className="flex space-x-4 px-2">
          {tabs.map((tab, i) => (
            <li
              key={tab}
              onClick={() => setSelected(i)}
              className={classNames(
                i === selected
                  ? 'text-primary-600 border-primary-500'
                  : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700',
                'cursor-pointer whitespace-nowrap border-b-2 py-2 text-sm font-medium'
              )}
            >
              {tab}
            </li>
          ))}
        </ul>
      </nav>
      {children[selected]}
    </div>
  );
};

export default Tabs;
