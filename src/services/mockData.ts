import { WeatherRealtime, HourlyForecast, DailyForecast, Warning, WaterStation } from '../types';

export const mockWeatherRealtime: WeatherRealtime = {
  stationId: 'FJS001',
  stationName: '福鼎国家基本气象站',
  reportTime: '2024-01-01 10:00:00',
  data: {
    temperature: { value: 18.5, trend: 1.2, unit: '℃' },
    humidity: { value: 72, trend: -3, unit: '%' },
    wind: { speed: 3.2, direction: '东北', directionDegree: 45, level: 2, unit: '米/秒' },
    pressure: { value: 1013.2, trend: -0.3, unit: '百帕' },
    precipitation: { value: 0.0, period: '今日', unit: '毫米' },
    visibility: { value: 15.0, level: '优', unit: '公里' },
    uvIndex: 5,
    feelsLike: 17.8
  }
};

export const mockHourlyForecast: HourlyForecast[] = Array.from({ length: 24 }).map((_, i) => ({
  forecastTime: `2024-01-01 ${10 + i}:00:00`,
  hour: (10 + i) % 24,
  weather: { code: '01', name: '晴', icon: '☀️' },
  temperature: 18 + Math.sin(i / 4) * 5,
  humidity: 70 + Math.cos(i / 4) * 10,
  wind: { speed: 2 + Math.random(), direction: '北', level: 1 },
  precipitation: 0,
  precipitationProb: 5 + i,
  visibility: 15
}));

export const mockDailyForecast: DailyForecast[] = [
  { date: '2024-01-01', weekDay: '周一', weather: { code: '01', name: '晴', icon: '☀️' }, temp: { min: 18, max: 26, avg: 22 }, wind: { levelMin: 3, levelMax: 4, direction: '东北' }, precipitationProb: 10, airQuality: { level: '良', aqi: 65 }, uvIndex: 5 },
  { date: '2024-01-02', weekDay: '周二', weather: { code: '02', name: '多云', icon: '⛅' }, temp: { min: 17, max: 24, avg: 21 }, wind: { levelMin: 2, levelMax: 3, direction: '东' }, precipitationProb: 35, airQuality: { level: '优', aqi: 45 }, uvIndex: 4 },
  { date: '2024-01-03', weekDay: '周三', weather: { code: '03', name: '小雨', icon: '🌧️' }, temp: { min: 16, max: 22, avg: 19 }, wind: { levelMin: 4, levelMax: 5, direction: '东北' }, precipitationProb: 80, airQuality: { level: '优', aqi: 30 }, uvIndex: 2 },
  { date: '2024-01-04', weekDay: '周四', weather: { code: '03', name: '中雨', icon: '🌧️' }, temp: { min: 15, max: 20, avg: 18 }, wind: { levelMin: 3, levelMax: 4, direction: '北' }, precipitationProb: 60, airQuality: { level: '优', aqi: 25 }, uvIndex: 1 },
  { date: '2024-01-05', weekDay: '周五', weather: { code: '02', name: '多云', icon: '⛅' }, temp: { min: 16, max: 23, avg: 20 }, wind: { levelMin: 2, levelMax: 3, direction: '南' }, precipitationProb: 20, airQuality: { level: '良', aqi: 55 }, uvIndex: 3 },
  { date: '2024-01-06', weekDay: '周六', weather: { code: '01', name: '晴', icon: '☀️' }, temp: { min: 17, max: 25, avg: 21 }, wind: { levelMin: 2, levelMax: 3, direction: '西南' }, precipitationProb: 5, airQuality: { level: '良', aqi: 70 }, uvIndex: 5 },
  { date: '2024-01-07', weekDay: '周日', weather: { code: '01', name: '晴', icon: '☀️' }, temp: { min: 18, max: 27, avg: 23 }, wind: { levelMin: 3, levelMax: 4, direction: '西' }, precipitationProb: 0, airQuality: { level: '中度', aqi: 110 }, uvIndex: 6 }
];

export const mockWarnings: Warning[] = [
  {
    id: 'W20240101001',
    type: { code: 'typhoon', name: '台风', icon: '🌀' },
    level: { code: 'orange', name: '橙色', color: '#f97316' },
    title: '福鼎市台风橙色预警',
    content: '第14号台风"小犬"（强台风级）将于1月2日傍晚到夜间在福建中部到浙江南部一带沿海登陆，受其影响，1月2日夜里到3日我市有暴雨到大暴雨，局部特大暴雨。',
    region: '福鼎市',
    publishTime: '2024-01-01 10:00:00',
    validUntil: '2024-01-02 18:00:00'
  },
  {
    id: 'W20240101002',
    type: { code: 'rain', name: '暴雨', icon: '🌧️' },
    level: { code: 'yellow', name: '黄色', color: '#eab308' },
    title: '福鼎市暴雨黄色预警',
    content: '受台风外围云系影响，预计未来6小时我市部分乡镇降雨量将达50毫米以上。',
    region: '福鼎市',
    publishTime: '2024-01-01 08:00:00',
    validUntil: '2024-01-01 20:00:00'
  }
];

export const mockWaterStations: WaterStation[] = [
  {
    id: 'WQ001',
    name: '南溪水库水质监测站',
    type: 'auto',
    position: [27.2856, 120.1532],
    district: '点头镇',
    waterBody: '南溪水库',
    data: { waterTemp: 22.5, ph: 7.2, dissolvedOxygen: 8.5, ammoniaNitrogen: 0.15, totalPhosphorus: 0.02, turbidity: 2.3, algaeDensity: 1200, chlorophyllA: 3.2 },
    qualityGrade: 'Ⅰ',
    status: 'normal',
    updateTime: '2024-01-01 10:00:00'
  },
  {
    id: 'WQ002',
    name: '马冠山水厂',
    type: 'centralized',
    position: [27.3201, 120.1895],
    district: '桐城街道',
    waterBody: '马冠山水库',
    data: { waterTemp: 23.1, ph: 7.0, dissolvedOxygen: 8.2, ammoniaNitrogen: 0.18, totalPhosphorus: 0.025, turbidity: 2.8, algaeDensity: 1500, chlorophyllA: 3.8 },
    qualityGrade: 'Ⅱ',
    status: 'normal',
    updateTime: '2024-01-01 10:00:00'
  },
  {
    id: 'WQ003',
    name: '磻溪村饮水站',
    type: 'rural',
    position: [27.2523, 120.1245],
    district: '磻溪镇',
    waterBody: '磻溪溪流',
    data: { waterTemp: 21.8, ph: 7.4, dissolvedOxygen: 7.9, ammoniaNitrogen: 0.22, totalPhosphorus: 0.03, turbidity: 3.5, algaeDensity: 1800, chlorophyllA: 4.2 },
    qualityGrade: 'Ⅲ',
    status: 'warning',
    updateTime: '2024-01-01 10:00:00'
  }
];

export const mockWeatherStations = [
  { id: 'MS001', name: '福鼎本站', position: [27.32, 120.21], temp: 18.5, rain: 0.0, wind: 3.2 },
  { id: 'MS002', name: '太姥山站', position: [27.10, 120.24], temp: 15.2, rain: 0.5, wind: 5.8 },
  { id: 'MS003', name: '嵛山岛站', position: [26.93, 120.45], temp: 17.8, rain: 0.0, wind: 8.5 },
  { id: 'MS004', name: '点头镇站', position: [27.28, 120.15], temp: 19.1, rain: 0.0, wind: 2.4 },
  { id: 'MS005', name: '白琳镇站', position: [27.22, 120.12], temp: 18.8, rain: 0.2, wind: 3.1 },
];

export const mockWaterSourceAreas = {
  centralized: [
    { id: 'WS001', name: '南溪水库一级保护区', coords: [[27.28, 120.14], [27.29, 120.14], [27.29, 120.16], [27.28, 120.16]] },
    { id: 'WS002', name: '马冠山水库保护区', coords: [[27.31, 120.18], [27.33, 120.18], [27.33, 120.20], [27.31, 120.20]] },
  ],
  rural: [
    { id: 'RW001', name: '磻溪村水源地', coords: [[27.24, 120.11], [27.26, 120.11], [27.26, 120.13], [27.24, 120.13]] },
    { id: 'RW002', name: '管阳镇水源地', coords: [[27.42, 120.15], [27.44, 120.15], [27.44, 120.17], [27.42, 120.17]] },
  ]
};
