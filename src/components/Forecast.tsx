import { XMarkIcon } from '@heroicons/react/24/solid';
import moment from 'moment';
import Image from 'next/image';

interface Props {
  data: any;
  onClose: () => void;
}

const Forecast: React.FC<Props> = ({ data, onClose }) => {
  return (
    <div className="fixed right-2 bottom-2 z-10 flex h-28 rounded-lg bg-white p-2 text-gray-700 shadow-lg">
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
        onClick={onClose}
      >
        <XMarkIcon className="h-4 w-4" />
      </button>
    </div>
  );
};

export default Forecast;
