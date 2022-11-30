import { useQuery } from '@tanstack/react-query';
import { CurrentResponse, OneCallResponse } from './types';
import { CurrentRequest, OneCallRequest } from './types/Request';

const appid = `&appid=${process.env.NEXT_PUBLIC_WEATHER_API_KEY}`;
const domain = 'https://api.openweathermap.org/data';

type Current = (_: CurrentRequest) => Promise<CurrentResponse>;
export const fetchCurrent: Current = async req => {
  let location = req.location && `&q=${req.location}`;
  if (req.latitude && req.longitude)
    location = `&lat=${req.latitude}&lon=${req.longitude}`;

  if (!location) throw Error('Invalid location');
  const units = `&units=${req.units ?? 'metric'}`;
  const url = `${domain}/2.5/weather?${appid}${units}${location}`;
  const response = await fetch(url);
  const currentWeather = await response.json();
  return currentWeather;
};

type OneCall = (_: OneCallRequest) => Promise<OneCallResponse>;
export const fetchOneCall: OneCall = async req => {
  const location = `&lat=${req.latitude}&lon=${req.longitude}`;
  const units = `&units=${req.units ?? 'metric'}`;
  const exclude = `&exclude=${req.exclude}`;
  const url = `${domain}/3.0/onecall?${appid}${units}${location}${exclude}`;
  const response = await fetch(url);
  const oneCallWeather = await response.json();
  return oneCallWeather;
};

export const useWeather = (req: CurrentRequest) =>
  useQuery({
    queryKey: ['currentWeather', req],
    queryFn: () => fetchCurrent(req),
    refetchInterval: 3600000,
  });

export const useForecast = (req: OneCallRequest) =>
  useQuery({
    queryKey: ['forecast', req],
    queryFn: () => fetchOneCall(req),
  });
