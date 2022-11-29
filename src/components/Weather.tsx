import moment from 'moment';
import Image from 'next/image';
import Loader from './Loader';

interface Props {
  data: any;
  isLoading: boolean;
  error?: any;
  onClick: () => void;
}

const Weather: React.FC<Props> = ({ data, isLoading, error, onClick }) => {
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
        onClick={onClick}
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
    </>
  );
};

export default Weather;
