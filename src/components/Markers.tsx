export interface Marker {
  id: string | number;
  name: string;
  time: string;
  description: string;
}

interface Props {
  markers: Marker[];
}

const Markers: React.FC<Props> = ({ markers }) => {
  return (
    <div className="px-2 text-sm">
      <ul role="list" className="divide-y divide-gray-200">
        {markers.map(marker => (
          <li key={marker.id} className="py-4">
            <div className="flex space-x-3">
              <div className="flex-1 space-y-1">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-medium">{marker.name}</h3>
                  <p className="text-sm text-gray-500">{marker.time}</p>
                </div>
                <p className="text-sm text-gray-500">
                  {marker.description}
                  <br />
                </p>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Markers;
