import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

export interface LayerRequest {
  id: string;
}

export interface Layer {
  id: string | number;
  name: string;
  metadata: { [key: string]: any }[];
}

type FetchLayers = (_: LayerRequest) => Promise<Layer>;
export const fetchLayers: FetchLayers = async req => {
  const response = await axios.get<any>(`/api/layers?id=${req.id}`);
  return response.data;
};

export const useLayers = (req: LayerRequest) =>
  useQuery({
    queryKey: ['layers', req],
    queryFn: () => fetchLayers(req),
    enabled: !!req.id,
    refetchInterval: 3600000,
    refetchOnWindowFocus: false,
  });
