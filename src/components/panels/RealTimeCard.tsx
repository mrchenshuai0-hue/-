import React from 'react';
import { CloudRain, Wind, Eye, Droplets, Compass, Thermometer, Cloud } from 'lucide-react';
import { mockWeatherRealtime } from '../../services/mockData';

export const RealTimeCard: React.FC = () => {
  const { data } = mockWeatherRealtime;

  const items = [
    { label: '雨量', value: data.precipitation.value, unit: data.precipitation.unit, icon: CloudRain, color: 'text-blue-400' },
    { label: '风速', value: data.wind.speed, unit: data.wind.unit, icon: Wind, color: 'text-cyan-400' },
    { label: '能见度', value: data.visibility.value, unit: '公里', icon: Eye, color: 'text-brand-blue' },
    { label: '湿度', value: data.humidity.value, unit: data.humidity.unit, icon: Droplets, color: 'text-sky-400' },
    { label: '风向', value: data.wind.direction, unit: '', icon: Compass, color: 'text-indigo-400' },
    { label: '体感', value: data.feelsLike, unit: '℃', icon: Thermometer, color: 'text-orange-400' },
  ];

  return (
    <div className="h-full flex flex-col overflow-hidden">
      <div className="bg-gradient-to-r from-brand-blue/20 to-transparent p-3 flex justify-between items-center border-b border-white/5">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rotate-45 bg-brand-blue shadow-[0_0_8px_#00d4ff]" />
          <h3 className="text-base font-bold italic tracking-wider text-white">气象实况数据</h3>
        </div>
        <span className="text-[10px] font-mono text-slate-500">更新: 16:00</span>
      </div>

      <div className="flex-1 p-2 flex flex-col justify-between overflow-y-auto">
        <div className="flex items-center justify-center gap-4 py-1.5 bg-brand-blue/5 rounded-lg border border-brand-blue/10 relative overflow-hidden group shrink-0">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-brand-blue/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
          <div className="text-4xl font-bold font-mono text-gradient">{data.temperature.value}<span className="text-xl ml-1">℃</span></div>
          <div className="flex flex-col items-center">
            <Cloud className="w-8 h-8 text-brand-blue drop-shadow-[0_0_8px_rgba(0,242,254,0.5)]" />
            <span className="text-sm font-bold text-slate-300 mt-0.5">多云</span>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-1.5 mt-2">
          {items.map((item, index) => (
            <div key={index} className="flex flex-col items-center p-1 rounded-lg bg-slate-800/30 border border-white/5 hover:border-brand-blue/30 transition-colors">
              <item.icon className={`w-3.5 h-3.5 ${item.color} mb-0.5`} />
              <span className="text-[9px] text-slate-400">{item.label}</span>
              <div className="flex items-baseline gap-0.5">
                <span className="text-xs font-bold font-mono text-white">{item.value}</span>
                <span className="text-[8px] text-slate-500">{item.unit}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
