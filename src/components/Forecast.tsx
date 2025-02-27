import { XMarkIcon } from '@heroicons/react/24/solid';
import moment from 'moment';
import Image from 'next/image';
import { OneCallRequest } from '../hooks/weather/types';
import { useForecast } from '../hooks/weather/useWeather';

interface Props {
  name: string;
  isOpen: boolean;
  location: OneCallRequest;
  onClose: () => void;
}

const Layout: React.FC<React.PropsWithChildren> = ({ children }) => (
  <div className="fixed bottom-2 right-2 z-10 rounded-lg bg-white shadow-lg xs:left-2 md:left-auto">
    {children}
  </div>
);

const Forecast: React.FC<Props> = ({ name, isOpen, location, onClose }) => {
  const { data, isError } = useForecast(location);

  if (!isOpen) {
    return <div className="hidden">Hidden forecast</div>;
  }

  if (data) {
    return (
      <Layout>
        <div className="flex justify-between px-2 pt-2 text-sm font-bold">
          <h2 className="px-2">{name}</h2>
          <button className="text-gray-900" onClick={onClose}>
            <XMarkIcon className="h-4 w-4" />
          </button>
        </div>
        <div className="flex space-x-2 whitespace-nowrap py-2 px-4">
          <div className="border-r pr-4 text-xs">
            <h4>Feels like: {Math.trunc(data.current.feels_like)}°C</h4>
            <h4>Humidity: {data.current.humidity}%</h4>
            <h4>Dew point: {Math.trunc(data.current.dew_point)}°C</h4>
            <h4>Wind: {data.current.wind_speed}m/s</h4>
            <h4>Pressure: {data.current.pressure}hPa</h4>
            <h4>Precipitation: {data.daily[0].pop * 100}%</h4>
          </div>
          <ul className="flex items-center justify-center space-x-4 text-xs xs:flex-wrap">
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
        </div>
      </Layout>
    );
  }

  if (isError) {
    return (
      <Layout>
        <button
          className="absolute right-2 top-2 text-gray-900"
          onClick={onClose}
        >
          <XMarkIcon className="h-4 w-4" />
        </button>
        <p className="p-8 text-center font-medium text-red-500">
          Error loading forecast. Please contact admin.
        </p>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="flex items-center justify-between px-4 pt-2 text-sm font-bold">
        <div className="h-2 w-2/3 animate-pulse rounded bg-gray-300"></div>
        <button className="text-gray-900" onClick={onClose}>
          <XMarkIcon className="h-4 w-4" />
        </button>
      </div>
      <div className="flex animate-pulse py-2 pl-4">
        <div className="w-44 space-y-2 border-r pr-4 text-xs">
          <div className="h-2 rounded bg-gray-300"></div>
          <div className="h-2 w-1/2 rounded bg-gray-300"></div>
          <div className="h-2 rounded bg-gray-300"></div>
          <div className="h-2 rounded bg-gray-300"></div>
          <div className="h-2 w-1/2 rounded bg-gray-300"></div>
          <div className="h-2 rounded bg-gray-300"></div>
        </div>
        <ul className="xs:text-wrap flex items-center justify-center space-x-4 px-4 text-xs">
          {Array.from(Array(7).keys()).map((_, i) => (
            <li key={i} className="flex flex-col items-center space-y-1">
              <div className="h-10 w-10 rounded-full bg-gray-300"></div>
              <div className="h-2 w-full rounded bg-gray-300"></div>
            </li>
          ))}
        </ul>
      </div>
    </Layout>
  );
};

export default Forecast;
