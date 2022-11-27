import { Switch } from '@headlessui/react';
import {
  BuildingLibraryIcon,
  HomeIcon,
  MapPinIcon,
} from '@heroicons/react/24/solid';
import { useState } from 'react';
import Toggle from './Toggle';

const layers = [
  {
    id: 'poi-label',
    icon: <MapPinIcon className="mr-2 h-5 w-5" />,
    label: 'Point of Interest',
    default: true,
  },
  {
    id: 'municipality-boundaries',
    icon: <BuildingLibraryIcon className="mr-2 h-5 w-5" />,
    label: 'Municipality',
    default: true,
  },
  {
    id: 'barangay-boundaries',
    icon: <HomeIcon className="mr-2 h-5 w-5" />,
    label: 'Barangay',
    default: true,
  },
];

const Layers: React.FC = () => {
  const [settings, setSettings] = useState<{ [k: string]: boolean }>(
    Object.fromEntries(layers.map(l => [l.id, l.default]))
  );

  const onChange = (layer: string, isVisible: boolean) => {
    setSettings(prev => ({ ...prev, [layer]: isVisible }));
  };

  return (
    <ul id="layer-settings" className="space-y-3 px-2 py-4 text-sm">
      {layers.map(layer => (
        <Switch.Group
          as="li"
          id={layer.id}
          key={layer.id}
          className="group flex w-full items-center justify-between space-x-2"
        >
          <Switch.Label className="flex w-full cursor-pointer items-center">
            {layer.icon}
            <span className="group-hover:underline">{layer.label}</span>
          </Switch.Label>
          <Toggle
            enabled={settings[layer.id]}
            onChange={checked => onChange(layer.id, checked)}
          />
        </Switch.Group>
      ))}
    </ul>
  );
};

export default Layers;
