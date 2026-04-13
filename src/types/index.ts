export interface WeatherRealtime {
  stationId: string;
  stationName: string;
  reportTime: string;
  data: {
    temperature: { value: number; trend: number; unit: string };
    humidity: { value: number; trend: number; unit: string };
    wind: { speed: number; direction: string; directionDegree: number; level: number; unit: string };
    pressure: { value: number; trend: number; unit: string };
    precipitation: { value: number; period: string; unit: string };
    visibility: { value: number; level: string; unit: string };
    uvIndex: number;
    feelsLike: number;
  };
}

export interface HourlyForecast {
  forecastTime: string;
  hour: number;
  weather: { code: string; name: string; icon: string };
  temperature: number;
  humidity: number;
  wind: { speed: number; direction: string; level: number };
  precipitation: number;
  precipitationProb: number;
  visibility: number;
}

export interface DailyForecast {
  date: string;
  weekDay: string;
  weather: { code: string; name: string; icon: string };
  temp: { min: number; max: number; avg: number };
  wind: { levelMin: number; levelMax: number; direction: string };
  precipitationProb: number;
  airQuality: { level: string; aqi: number };
  uvIndex: number;
}

export interface Warning {
  id: string;
  type: { code: string; name: string; icon: string };
  level: { code: string; name: string; color: string };
  title: string;
  content: string;
  region: string;
  publishTime: string;
  validUntil: string;
}

export interface WaterStation {
  id: string;
  name: string;
  type: 'auto' | 'centralized' | 'rural';
  position: [number, number];
  district: string;
  waterBody: string;
  data: {
    waterTemp: number;
    ph: number;
    dissolvedOxygen: number;
    ammoniaNitrogen: number;
    totalPhosphorus: number;
    turbidity: number;
    algaeDensity: number;
    chlorophyllA: number;
  };
  qualityGrade: string;
  status: 'normal' | 'warning' | 'exceed';
  updateTime: string;
}

export interface MapLayerState {
  weatherStations: boolean;
  envStations: boolean;
  temp: boolean;
  rain: boolean;
  wind: boolean;
  radar: boolean;
  cloud: boolean;
  centralizedWater: boolean;
  ruralWater: boolean;
}

export interface QueryState {
  type: 'rain' | 'temp' | 'wind' | null;
  period: string | null;
}
