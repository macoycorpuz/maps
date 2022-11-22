export interface Area {
  id: string | number;
  name: string;
  time: string;
  description: string;
}

interface Props {
  areas: Area[];
}

const Areas: React.FC<Props> = ({ areas }) => {
  return (
    <div className="px-2 text-sm">
      <ul role="list" className="divide-y divide-gray-200">
        {areas.map(area => (
          <li key={area.id} className="py-4">
            <div className="flex space-x-3">
              <div className="flex-1 space-y-1">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-medium">{area.name}</h3>
                  <p className="text-sm text-gray-500">{area.time}</p>
                </div>
                <p className="text-sm text-gray-500">
                  {area.description}
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

export default Areas;
