import { useQuery } from '@tanstack/react-query';
import moment from 'moment';
import Image from 'next/image';
import { useEffect } from 'react';
import Loader from './Loader';

interface Props {}

const fetchCurrentWeather = async () => {
  const domain = 'https://api.openweathermap.org/data/2.5';
  const appid = `&appid=${process.env.NEXT_PUBLIC_WEATHER_API_KEY}`;
  const url = `${domain}/weather?units=metric&q=bulacan,ph${appid}`;
  const currentWeather = await fetch(url).then(r => r.json());
  return currentWeather;
};

const Weather: React.FC<Props> = () => {
  const { data, isLoading, error } = useQuery(['weather'], fetchCurrentWeather);

  useEffect(() => {
    console.log(data);
  }, [data]);
  if (isLoading) {
    return (
      <div className="flex w-full justify-center py-4">
        <Loader classNames="h-12 w-12 border-4" />
      </div>
    );
  }

  if (error) {
    return (
      <p className="py-2 text-center font-medium text-red-500">
        Error loading Weather. Please contact admin.
      </p>
    );
  }

  return (
    <div className="flex items-center justify-between p-2">
      <div className="flex items-center space-x-1">
        <Image
          src={`http://openweathermap.org/img/wn/${data.weather[0].icon}.png`}
          height={50}
          width={50}
          alt="Weather Icon"
        />
        <div className="flex">
          <h1 className="text-4xl font-medium">{Math.trunc(data.main.temp)}</h1>
          <h3>°C</h3>
        </div>
      </div>
      <div className="flex flex-col items-end justify-end text-right">
        <h2 className="text-sm font-medium">Bulacan, PH</h2>
        <h3 className="text-xs text-gray-600">{moment().format('dddd')}</h3>
        <h4 className="text-xs text-gray-600">
          {data.weather[0].description.charAt(0).toUpperCase() +
            data.weather[0].description.slice(1)}
        </h4>
      </div>
    </div>
  );
};

export default Weather;
