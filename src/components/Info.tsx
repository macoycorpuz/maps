import {
  BuildingOffice2Icon,
  BuildingOfficeIcon,
  CodeBracketSquareIcon,
  MapPinIcon,
  PhoneIcon,
  UserGroupIcon,
  UserIcon,
} from '@heroicons/react/24/solid';
import mapboxgl from 'mapbox-gl';
import React, { useEffect } from 'react';
import general from '../data/general.json';

interface InfoSpanProps {
  children: React.ReactNode;
}

const InfoSpan: React.FC<InfoSpanProps> = ({ children }) => (
  <span className="flex items-center">{children}</span>
);

interface Props {
  map?: mapboxgl.Map;
}

const Info: React.FC<Props> = ({ map }) => {
  useEffect(() => {
    if (!map) return;
    map.on('mousemove', 'municipality-fills', e => {
      console.log('click');
    });
  }, [map]);
  return (
    <div className="flex h-full flex-col justify-between space-y-3 px-2 py-4">
      <div id="barangay-info" className="flex flex-col space-y-2 text-sm">
        <h1 className="text-xl font-extrabold">Banaban</h1>
        <InfoSpan>
          <CodeBracketSquareIcon className="mr-2 h-5 w-5" />
          Barangay Code: PH031401001
        </InfoSpan>
        <InfoSpan>
          <MapPinIcon className="mr-2 h-5 w-5" />
          Municipality: ANGAT
        </InfoSpan>
        <InfoSpan>
          <CodeBracketSquareIcon className="mr-2 h-5 w-5" />
          Municipality Code: PH031401000
        </InfoSpan>
      </div>
      <div id="municipality-info" className="flex flex-col space-y-2 text-sm">
        <h1 className="text-xl font-extrabold">ANGAT</h1>
        <InfoSpan>
          <CodeBracketSquareIcon className="mr-2 h-5 w-5" />
          Municipality Code: PH031401000s
        </InfoSpan>
        <InfoSpan>
          <MapPinIcon className="mr-2 h-5 w-5" />
          Land Area: 6,159 has.
        </InfoSpan>
        <InfoSpan>
          <UserGroupIcon className="mr-2 h-5 w-5" />
          Population: 65,617.00 (2%)
        </InfoSpan>
        <InfoSpan>
          <BuildingOffice2Icon className="mr-2 h-5 w-5" />
          Number of Barangays: 16
        </InfoSpan>
        <InfoSpan>
          <UserIcon className="mr-2 h-5 w-5" />
          Mayor Name: Hon. Reynante S. Bautista
        </InfoSpan>
        <InfoSpan>
          <PhoneIcon className="mr-2 h-5 w-5" />
          Hotline: (044) 7691208 loc 101/102
        </InfoSpan>
      </div>
      <div
        id="general-info"
        className="flex flex-col space-y-2 border-t-2 py-2 text-sm"
      >
        <h1 className="text-lg font-extrabold">{general['Province Name']}</h1>
        <InfoSpan>
          <CodeBracketSquareIcon className="mr-2 h-5 w-5" />
          Province Code: {general.Pro_Code}
        </InfoSpan>
        <InfoSpan>
          <MapPinIcon className="mr-2 h-5 w-5" />
          Region: {general.Region}
        </InfoSpan>
        <InfoSpan>
          <CodeBracketSquareIcon className="mr-2 h-5 w-5" />
          Region Code: {general.Reg_Code}
        </InfoSpan>
        <InfoSpan>
          <MapPinIcon className="mr-2 h-5 w-5" />
          Land Area: {general['Land Area']}
        </InfoSpan>
        <InfoSpan>
          <UserGroupIcon className="mr-2 h-5 w-5" />
          Population: {general.Population}
        </InfoSpan>
        <InfoSpan>
          <BuildingOfficeIcon className="mr-2 h-5 w-5" />
          Number of Municipalities: {general['Number of Municipalities']}
        </InfoSpan>
        <InfoSpan>
          <BuildingOffice2Icon className="mr-2 h-5 w-5" />
          Number of Barangays: {general['Number of Baranggays']}
        </InfoSpan>
        <InfoSpan>
          <UserIcon className="mr-2 h-5 w-5" />
          Governor: {general.Governor}
        </InfoSpan>
        <InfoSpan>
          <UserIcon className="mr-2 h-5 w-5" />
          Vice Governor: {general['Vice Governor']}
        </InfoSpan>
      </div>
    </div>
  );
};

export default Info;
