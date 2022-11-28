import { CodeBracketSquareIcon, MapPinIcon } from '@heroicons/react/24/solid';
import { useMemo } from 'react';
import barangay from '../../data/barangay.json';
import InfoSpan from './InfoSpan';

interface Props {
  code: string;
}

const BarangayInfo: React.FC<Props> = ({ code }) => {
  const data = useMemo(() => barangay.find(m => m.Bgy_Code === code), [code]);

  if (!code) return null;

  return (
    <div id="barangay-info" className="flex flex-col space-y-2 text-sm">
      <h1 className="text-xl font-extrabold">{data?.['Baranggay Name']}</h1>
      <InfoSpan>
        <CodeBracketSquareIcon className="mr-2 h-5 w-5" />
        Barangay Code: {data?.Bgy_Code}
      </InfoSpan>
      <InfoSpan>
        <MapPinIcon className="mr-2 h-5 w-5" />
        Municipality: {data?.Municipality}
      </InfoSpan>
      <InfoSpan>
        <CodeBracketSquareIcon className="mr-2 h-5 w-5" />
        Municipality Code: {data?.Mun_Code}
      </InfoSpan>
    </div>
  );
};

export default BarangayInfo;
