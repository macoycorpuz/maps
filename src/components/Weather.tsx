import moment from 'moment';
import Image from 'next/image';
import { useWeather } from '../hooks/weather/useWeather';
import Loader from './Loader';

interface Props {
  onClick: () => void;
}

const Weather: React.FC<Props> = ({ onClick }) => {
  const { data, isLoading, isError } = useWeather({
    latitude: 14.843759,
    longitude: 120.8113694,
  });

  if (isLoading) {
    return (
      <div className="flex w-full justify-center py-4">
        <Loader classNames="h-10 w-10 border-3" />
      </div>
    );
  }

  if (isError) {
    return (
      <p className="py-2 text-center font-medium text-red-500">
        Error loading weather. Please contact admin.
      </p>
    );
  }

  return (
    <>
      <div
        className="flex cursor-pointer items-center justify-between px-2 hover:bg-blue-100"
        onClick={onClick}
      >
        <div className="flex items-center space-x-1">
          <Image
            src={`http://openweathermap.org/img/wn/${data.weather[0].icon}@4x.png`}
            height={60}
            width={60}
            alt="Weather Icon"
          />
          <div className="flex">
            <h1 className="text-4xl font-medium">
              {Math.trunc(data.main.temp)}
            </h1>
            <h3>°C</h3>
          </div>
        </div>
        <div className="flex flex-col items-end justify-end text-right">
          <h2 className="text-sm font-medium">Malolos, Bulacan</h2>
          <h3 className="text-xs text-gray-600">
            {moment.unix(data.dt).format('ddd, MMM DD')}
          </h3>
          <h4 className="text-xs text-gray-600">
            {data.weather[0].description.charAt(0).toUpperCase() +
              data.weather[0].description.slice(1)}
          </h4>
        </div>
      </div>
    </>
  );
};

export default Weather;
