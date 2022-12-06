import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { CurrentResponse, OneCallResponse } from './types';
import { CurrentRequest, OneCallRequest } from './types/Request';

const appid = `appid=${process.env.NEXT_PUBLIC_WEATHER_API_KEY}`;
const domain = 'https://api.openweathermap.org/data';

const instance = axios.create({
  baseURL: 'https://api.openweathermap.org/data',
  timeout: 1000,
});

type FetchCurrent = (_: CurrentRequest) => Promise<CurrentResponse>;
export const fetchCurrent: FetchCurrent = async req => {
  let location = req.location && `&q=${req.location}`;
  if (req.latitude && req.longitude)
    location = `&lat=${req.latitude}&lon=${req.longitude}`;
  const units = `&units=${req.units ?? 'metric'}`;
  const url = `/2.5/weather?${appid}${units}${location}`;
  const response = await instance.get<CurrentResponse>(url);
  return response.data;
};

type OneCall = (_: OneCallRequest) => Promise<OneCallResponse>;
export const fetchOneCall: OneCall = async req => {
  const location = `&lat=${req.latitude}&lon=${req.longitude}`;
  const units = `&units=${req.units ?? 'metric'}`;
  const exclude = `&exclude=${req.exclude}`;
  const url = `/3.0/onecall?${appid}${units}${location}${exclude}`;
  const response = await instance.get<OneCallResponse>(url);
  return response.data;
};

export const useWeather = (req: CurrentRequest) =>
  useQuery({
    queryKey: ['currentWeather', req],
    queryFn: () => fetchCurrent(req),
    refetchInterval: 3600000,
    refetchOnWindowFocus: false,
  });

export const useForecast = (req: OneCallRequest) =>
  useQuery({
    queryKey: ['forecast', req],
    queryFn: () => fetchOneCall(req),
    refetchOnWindowFocus: false,
  });
