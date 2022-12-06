import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { CurrentResponse, OneCallResponse } from './types';
import { CurrentRequest, OneCallRequest } from './types/Request';

const instance = axios.create({
  baseURL: 'https://api.openweathermap.org/data',
  timeout: 1000,
});

const defaultParams = {
  appid: process.env.NEXT_PUBLIC_WEATHER_API_KEY,
  units: 'metric',
};

type FetchCurrent = (_: CurrentRequest) => Promise<CurrentResponse>;
export const fetchCurrent: FetchCurrent = async req => {
  const params = { ...defaultParams, ...req };
  const url = '/2.5/weather';
  const response = await instance.get<CurrentResponse>(url, { params });
  return response.data;
};

type OneCall = (_: OneCallRequest) => Promise<OneCallResponse>;
export const fetchOneCall: OneCall = async req => {
  const params = { ...defaultParams, ...req };
  const url = '/3.0/onecall';
  const response = await instance.get<OneCallResponse>(url, { params });
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
    enabled: !!req,
    refetchOnWindowFocus: false,
  });
