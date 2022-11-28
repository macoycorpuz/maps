import { useQuery } from '@tanstack/react-query';

interface Request {
  lat: number | string;
  lon: number | string;
  exclude?: string;
}

const apiKey = process.env.NEXT_PUBLIC_WEATHER_API_KEY;
const domain = 'https://api.openweathermap.org';

export const fetchGeo = async (value: any) => {
  const location = `${value},bulacan,ph`;
  const url = `${domain}/geo/1.0/direct?limit=5&appid=${apiKey}&q=${location}`;
  const result = await fetch(url).then(r => r.json());
  return { lat: result[0].lat ?? 14.843759, lon: result[0].lon ?? 120.8113694 };
};

export const fetchWeather = async ({ queryKey }: any) => {
  const params = Object.entries(queryKey[1])
    .map(([key, value]) => `&${key}=${value}`)
    .join('');
  const url = `${domain}/data/3.0/onecall?units=metric&appid=${apiKey}${params}`;
  const result = await fetch(url).then(r => r.json());
  return result;
};

const useWeather = (key: string, params: Request) => {
  const options = { refetchInterval: 3600000 };
  const keys = [key, params];
  const result = useQuery(keys, fetchWeather, options);
  return result;
};

export default useWeather;
