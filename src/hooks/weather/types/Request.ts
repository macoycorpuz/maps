export interface OneCallRequest {
  lat: number | string;
  lon: number | string;
}

export interface CurrentRequest {
  lat?: number | string;
  lon?: number | string;
  q?: string;
}
