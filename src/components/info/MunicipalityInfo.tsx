import {
  BuildingOffice2Icon,
  MapPinIcon,
  PhoneIcon,
  UserGroupIcon,
  UserIcon,
} from '@heroicons/react/24/solid';
import moment from 'moment';
import Image from 'next/image';
import { useEffect, useMemo, useState } from 'react';
import municipality from '../../data/municipality.json';
import { fetchGeo, fetchWeather } from '../../hooks/useWeather/useWeather';
import InfoSpan from './InfoSpan';

interface Props {
  code: string;
}

const MunicipalityInfo: React.FC<Props> = ({ code }) => {
  const [weather, setWeather] = useState<any>();
  const data = useMemo(
    () => municipality.find(m => m.Mun_Code === code),
    [code]
  );

  useEffect(() => {
    if (!data) return;
    const fetchData = async () => {
      const location = await fetchGeo(data['Municipal Name']);
      const result = await fetchWeather({ queryKey: [, location] });
      setWeather(result);
    };

    fetchData();
  }, [data]);

  if (!code) return null;

  return (
    <div id="municipality-info" className="flex flex-col space-y-1 text-sm">
      <div className="flex items-center justify-between border-b pb-2">
        <div className="flex-1 pb-1 leading-3">
          <h1 className="text-lg font-extrabold">{data?.['Municipal Name']}</h1>
          <span className="font-mono text-xs">Code: {data?.Mun_Code}</span>
        </div>
        {weather && (
          <div className="flex flex-col items-end justify-end text-right text-xs text-gray-600">
            <div className="h-12 w-12">
              <Image
                src={`http://openweathermap.org/img/wn/${weather.current.weather[0].icon}@4x.png`}
                height={60}
                width={60}
                objectFit="cover"
                alt="Weather Icon"
              />
            </div>
            <span>
              {weather.current.weather[0].description.charAt(0).toUpperCase() +
                weather.current.weather[0].description.slice(1)}{' '}
              - {Math.trunc(weather.current.temp)}°C
            </span>
            <span>{moment.unix(weather.current.dt).format('LT')}</span>
          </div>
        )}
      </div>
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
