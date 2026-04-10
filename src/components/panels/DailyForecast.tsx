import React from 'react';
import ReactECharts from 'echarts-for-react';
import { mockDailyForecast } from '../../services/mockData';

export const DailyForecast: React.FC = () => {
  const option = {
    backgroundColor: 'transparent',
    tooltip: { trigger: 'axis', show: false },
    grid: { top: '20%', left: '5%', right: '5%', bottom: '20%', containLabel: false },
    xAxis: { type: 'category', data: mockDailyForecast.map(d => d.date), show: false },
    yAxis: {
      type: 'value',
      show: false,
      min: Math.min(...mockDailyForecast.map(d => d.temp.min)) - 5,
      max: Math.max(...mockDailyForecast.map(d => d.temp.max)) + 5,
    },
    series: [
      {
        name: '最高温',
        type: 'line',
        smooth: true,
        data: mockDailyForecast.map(item => item.temp.max),
        lineStyle: { color: '#ffcc00', width: 2, shadowBlur: 5, shadowColor: 'rgba(255, 204, 0, 0.5)' },
        itemStyle: { color: '#ffcc00' },
        label: { show: true, position: 'top', color: '#fff', fontSize: 10, formatter: '{c}°' },
        symbol: 'circle',
        symbolSize: 4,
      },
      {
        name: '最低温',
        type: 'line',
        smooth: true,
        data: mockDailyForecast.map(item => item.temp.min),
        lineStyle: { color: '#00f2fe', width: 2, shadowBlur: 5, shadowColor: 'rgba(0, 242, 254, 0.5)' },
        itemStyle: { color: '#00f2fe' },
        label: { show: true, position: 'bottom', color: '#94a3b8', fontSize: 10, formatter: '{c}°' },
        symbol: 'circle',
        symbolSize: 4,
      }
    ]
  };

  return (
    <div className="h-full flex flex-col">
      <div className="bg-gradient-to-r from-brand-blue/20 to-transparent p-3 flex justify-between items-center border-b border-white/5">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rotate-45 bg-brand-blue shadow-[0_0_8px_#00d4ff]" />
          <h3 className="text-base font-bold italic tracking-wider text-white">未来7日预报</h3>
        </div>
        <span className="text-[10px] font-mono text-slate-500">更新: 16:00</span>
      </div>

      <div className="flex-1 p-4 flex flex-col">
        <div className="flex justify-between px-1">
          {mockDailyForecast.map((day, idx) => (
            <div key={idx} className="flex flex-col items-center">
              <span className="text-xs text-slate-400">{day.weekDay}</span>
              <span className="text-[10px] text-slate-500">{day.date.split('-')[2]}日</span>
              <span className="text-2xl my-1">{day.weather.icon}</span>
            </div>
          ))}
        </div>

        <div className="flex-1 min-h-[80px]">
          <ReactECharts option={option} style={{ height: '100%', width: '100%' }} />
        </div>

        <div className="flex justify-between px-1 mt-2">
          {mockDailyForecast.map((day, idx) => (
            <div key={idx} className="flex flex-col items-center">
              <span className="text-xl mb-1">{day.weather.icon}</span>
              <div className="flex items-center gap-0.5 text-xs text-slate-500">
                <span className="text-brand-blue">▲</span>
                <span>{day.wind.levelMax}级</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
