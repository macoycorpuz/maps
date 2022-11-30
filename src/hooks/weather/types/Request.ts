export type Unit = 'imperial' | 'metric' | 'standard';

export interface OneCallRequest {
  latitude: number | string;
  longitude: number | string;
  exclude?: string;
  units?: Unit;
}

export interface CurrentRequest {
  latitude?: number | string;
  longitude?: number | string;
  location?: string;
  units?: Unit;
}
