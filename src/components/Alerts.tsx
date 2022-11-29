import { useState } from 'react';

export interface Markers {
  id: string | number;
  name: string;
  time: string;
  description: string;
}

const Markers: React.FC = () => {
  const [markers, setMarkers] = useState([
    {
      id: 1,
      name: 'Some Marker',
      time: '1h',
      description: 'Custom Marker here',
    },
  ]);

  // Create custom markers
  // const marker = new mapboxgl.Marker();
  // map.current.on('click', event => {
  //   if (!map.current) return;
  //   const coordinates = event.lngLat;
  //   console.log('Lng:', coordinates.lng, 'Lat:', coordinates.lat);
  //   marker.setLngLat(coordinates).addTo(map.current);
  // });

  return (
    <div className="flex h-full items-center justify-center text-xl font-bold text-gray-800">
      Coming soon... 🏗️
    </div>
  );

  // return (
  //   <div className="px-2 text-sm">
  //     <ul role="list" className="divide-y divide-gray-200">
  //       {markers.map(marker => (
  //         <li key={marker.id} className="py-4">
  //           <div className="flex space-x-3">
  //             <div className="flex-1 space-y-1">
  //               <div className="flex items-center justify-between">
  //                 <h3 className="text-sm font-medium">{marker.name}</h3>
  //                 <p className="text-sm text-gray-500">{marker.time}</p>
  //               </div>
  //               <p className="text-sm text-gray-500">
  //                 {marker.description}
  //                 <br />
  //               </p>
  //             </div>
  //           </div>
  //         </li>
  //       ))}
  //     </ul>
  //   </div>
  // );
};

export default Markers;
