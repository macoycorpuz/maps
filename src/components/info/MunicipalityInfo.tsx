import {
  BuildingOffice2Icon,
  CodeBracketSquareIcon,
  MapPinIcon,
  PhoneIcon,
  UserGroupIcon,
  UserIcon,
} from '@heroicons/react/24/solid';
import { useMemo } from 'react';
import municipality from '../../data/municipality.json';
import InfoSpan from './InfoSpan';

interface Props {
  code: string;
}

const MunicipalityInfo: React.FC<Props> = ({ code }) => {
  const data = useMemo(
    () => municipality.find(m => m.Mun_Code === code),
    [code]
  );

  if (!code) return null;

  return (
    <div id="municipality-info" className="flex flex-col space-y-2 text-sm">
      <h1 className="text-xl font-extrabold">{data?.['Municipal Name']}</h1>
      <InfoSpan>
        <CodeBracketSquareIcon className="mr-2 h-5 w-5" />
        Municipality Code: {data?.Mun_Code}
      </InfoSpan>
      <InfoSpan>
        <MapPinIcon className="mr-2 h-5 w-5" />
        Land Area: {data?.['Land Area']}
      </InfoSpan>
      <InfoSpan>
        <UserGroupIcon className="mr-2 h-5 w-5" />
        Population: {data?.Population} ({data?.['% Population']})
      </InfoSpan>
      <InfoSpan>
        <BuildingOffice2Icon className="mr-2 h-5 w-5" />
        Number of Barangays: {data?.['Number of Baranggays']}
      </InfoSpan>
      <InfoSpan>
        <UserIcon className="mr-2 h-5 w-5" />
        Mayor Name: {data?.['Mayor Name']}
      </InfoSpan>
      <InfoSpan>
        <PhoneIcon className="mr-2 h-5 w-5" />
        Hotline: {data?.['Hotline 1']}
      </InfoSpan>
    </div>
  );
};

export default MunicipalityInfo;
