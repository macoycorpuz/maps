import { XMarkIcon } from '@heroicons/react/24/solid';
import moment from 'moment';
import Image from 'next/image';
import { useState } from 'react';
import useWeather from '../hooks/useWeather/useWeather';
import Loader from './Loader';

const Weather: React.FC = () => {
  const [open, setOpen] = useState(false);
  const { data, isLoading, error } = useWeather('weather', {
    lat: 14.843759,
    lon: 120.8113694,
  });

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
    <>
      <div
        className="flex cursor-pointer items-center justify-between px-2 hover:bg-blue-100"
        onClick={() => setOpen(prev => !prev)}
      >
        <div className="flex items-center space-x-1">
          <Image
            src={`http://openweathermap.org/img/wn/${data.current.weather[0].icon}@4x.png`}
            height={60}
            width={60}
            alt="Weather Icon"
          />
          <div className="flex">
            <h1 className="text-4xl font-medium">
              {Math.trunc(data.current.temp)}
            </h1>
            <h3>°C</h3>
          </div>
        </div>
        <div className="flex flex-col items-end justify-end text-right">
          <h2 className="text-sm font-medium">Malolos, Bulacan</h2>
          <h3 className="text-xs text-gray-600">
            {moment.unix(data.current.dt).format('ddd, MMM DD')}
          </h3>
          <h4 className="text-xs text-gray-600">
            {data.current.weather[0].description.charAt(0).toUpperCase() +
              data.current.weather[0].description.slice(1)}
          </h4>
        </div>
      </div>
      {open && (
        <div className="fixed right-2 bottom-2 flex h-28 rounded-lg bg-white p-2 text-gray-700 shadow-lg">
          <div className="w-1/5 border-r px-2 text-xs ">
            <h4>Feels like: {data.current.feels_like}°C</h4>
            <h4>Humidity: {data.current.humidity}%</h4>
            <h4>Dew point: {data.current.dew_point}°C</h4>
            <h4>Wind: {data.current.wind_speed}m/s</h4>
            <h4>Pressure: {data.current.pressure}hPa</h4>
            <h4>Visibility: {data.current.visibility / 1000}km</h4>
          </div>
          <ul className="flex items-end space-x-4 px-4 text-xs">
            {data.daily.map((day: any) => (
              <li
                key={day.dt}
                className="flex flex-col items-center justify-center"
              >
                <span>{moment.unix(day.dt).format('ddd')}</span>
                <Image
                  src={`http://openweathermap.org/img/wn/${day.weather[0].icon}@4x.png`}
                  height={60}
                  width={60}
                  alt="Weather Icon"
                />
                <span>
                  {Math.trunc(day.temp.min)}° | {Math.trunc(day.temp.max)}°
                </span>
              </li>
            ))}
          </ul>
          <button
            className="absolute right-2 top-2 text-gray-400"
            onClick={() => setOpen(false)}
          >
            <XMarkIcon className="h-4 w-4" />
          </button>
        </div>
      )}
    </>
  );
};

export default Weather;
