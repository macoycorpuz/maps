import { Switch } from '@headlessui/react';
import {
  BuildingLibraryIcon,
  HomeIcon,
  MapPinIcon,
} from '@heroicons/react/24/solid';
import mapboxgl from 'mapbox-gl';
import { useLocalStorage } from '../hooks/useLocalStorage/useLocalStorage';
import { setVisibility } from '../mapbox/map';
import Loader from './Loader';
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
    label: 'Municipality Boundaries',
    default: true,
  },
  {
    id: 'barangay-boundaries',
    icon: <HomeIcon className="mr-2 h-5 w-5" />,
    label: 'Barangay Boundaries',
    default: true,
  },
];

interface Props {
  map?: mapboxgl.Map;
}

type Settings = { [k: string]: boolean };

const Layers: React.FC<Props> = ({ map }) => {
  const [settings, setSettings] = useLocalStorage<Settings>(
    'layer-settings',
    Object.fromEntries(layers.map(l => [l.id, l.default]))
  );

  if (!map) {
    return (
      <div className="flex w-full justify-center py-4">
        <Loader classNames="h-12 w-12 border-4" />
      </div>
    );
  }

  const onChange = (layer: any, isVisible: any) => {
    setSettings(prev => ({ ...prev, [layer]: isVisible }));
    setVisibility(layer, isVisible, map);
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
