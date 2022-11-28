import {
  BuildingOffice2Icon,
  BuildingOfficeIcon,
  CodeBracketSquareIcon,
  MapPinIcon,
  UserGroupIcon,
  UserIcon,
} from '@heroicons/react/24/solid';
import React from 'react';
import general from '../../data/general.json';
import InfoSpan from './InfoSpan';

interface Props {
  children?: React.ReactNode;
}

const Info: React.FC<Props> = ({ children }) => {
  return (
    <div className="flex h-full flex-col justify-between space-y-3 px-2 py-4">
      {children}
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
