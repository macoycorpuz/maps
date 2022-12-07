import moment from 'moment';
import Image from 'next/image';
import { CurrentRequest, OneCallRequest } from '../hooks/weather/types';
import { useWeather } from '../hooks/weather/useWeather';

interface Props {
  name?: string;
  location: CurrentRequest;
  onClick: (_: OneCallRequest) => void;
}

const Weather: React.FC<Props> = ({ name, location, onClick }) => {
  const { data, isError } = useWeather(location);

  if (data) {
    return (
      <>
        <div
          className="flex cursor-pointer items-center justify-between px-2 hover:bg-blue-100"
          onClick={() => onClick(data.coord)}
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
            <h2 className="text-sm font-medium">{name}</h2>
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
  }

  if (isError) {
    return (
      <p className="py-2 text-center font-medium text-red-500">
        Error loading weather. Please contact admin.
      </p>
    );
  }

  return (
    <div className="mx-auto w-full max-w-sm p-2">
      <div className="flex animate-pulse items-center space-x-4">
        <div className="h-10 w-10 rounded-full bg-gray-300"></div>
        <div className="flex-1 space-y-2 py-1">
          <div className="h-2 w-1/2 rounded bg-gray-300"></div>
          <div className="h-2 w-1/3 rounded bg-gray-300"></div>
        </div>
        <div className="flex flex-1 flex-col items-end justify-center space-y-2 py-1">
          <div className="h-2 w-2/3 rounded bg-gray-300"></div>
          <div className="h-2 w-1/3 rounded bg-gray-300"></div>
          <div className="h-2 w-2/3 rounded bg-gray-300"></div>
        </div>
      </div>
    </div>
  );
};

export default Weather;
