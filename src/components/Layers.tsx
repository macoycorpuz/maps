import {
  BuildingLibraryIcon,
  HomeIcon,
  MapPinIcon,
} from '@heroicons/react/24/solid';
import { useLocalStorage } from '../hooks/useLocalStorage/useLocalStorage';
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

const Layers = () => {
  const [settings, setSettings] = useLocalStorage<{ [k: string]: boolean }>(
    'layer-settings',
    Object.fromEntries(layers.map(l => [l.id, l.default]))
  );

  const onChange = (layer: string) =>
    setSettings(prev => ({ ...prev, [layer]: !prev[layer] }));

  return (
    <ul className="space-y-2 px-2 py-4 text-sm">
      {layers.map(layer => (
        <li key={layer.id} className="group">
          <button
            className="flex w-full items-center justify-between space-x-2"
            onClick={() => onChange(layer.id)}
          >
            <div className="flex items-center">
              {layer.icon}
              <span className="group-hover:underline">{layer.label}</span>
            </div>
            <Toggle enabled={settings[layer.id]} />
          </button>
        </li>
      ))}
    </ul>
  );
};

export default Layers;
