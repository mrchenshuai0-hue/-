export const FUDING_CENTER: [number, number] = [27.3271, 120.1960];
export const MAP_ZOOM = 11;

export const STATION_TYPES = {
  centralized: {
    name: '集中饮用水站点',
    icon: '💧',
    color: '#10b981',
  },
  rural: {
    name: '农村饮用水站点',
    icon: '🏠',
    color: '#38bdf8',
  },
  auto: {
    name: '水环境自动监测站',
    icon: '🔬',
    color: '#8b5cf6',
  },
  weather: {
    name: '气象站',
    icon: '🌡️',
    color: '#f59e0b',
  },
  env: {
    name: '环保站',
    icon: '🌿',
    color: '#22c55e',
  }
};

export const QUALITY_GRADES = [
  { grade: 'Ⅰ', color: '#10b981', description: '优' },
  { grade: 'Ⅱ', color: '#22c55e', description: '良' },
  { grade: 'Ⅲ', color: '#eab308', description: '合格' },
  { grade: 'Ⅳ', color: '#f97316', description: '轻度污染' },
  { grade: 'Ⅴ', color: '#ef4444', description: '中度污染' }
];
