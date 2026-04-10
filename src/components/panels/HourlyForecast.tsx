import React from 'react';
import ReactECharts from 'echarts-for-react';
import { mockHourlyForecast } from '../../services/mockData';

export const HourlyForecast: React.FC = () => {
  const displayData = mockHourlyForecast.slice(0, 10);

  const option = {
    backgroundColor: 'transparent',
    tooltip: { trigger: 'axis', show: false },
    grid: { top: '10%', left: '0%', right: '0%', bottom: '10%', containLabel: false },
    xAxis: { type: 'category', data: displayData.map(d => `${d.hour}时`), show: false },
    yAxis: { type: 'value', show: false, min: 'dataMin', max: 'dataMax' },
    series: [
      {
        type: 'line',
        smooth: true,
        symbol: 'circle',
        symbolSize: 6,
        data: displayData.map(d => d.temperature),
        label: { show: false }, // Explicitly hide labels
        lineStyle: { width: 2, color: '#ffcc00' },
        itemStyle: { color: '#ffcc00', borderWidth: 1, borderColor: '#fff' },
        areaStyle: {
          color: {
            type: 'linear', x: 0, y: 0, x2: 0, y2: 1,
            colorStops: [{ offset: 0, color: 'rgba(255, 204, 0, 0.1)' }, { offset: 1, color: 'rgba(255, 204, 0, 0)' }]
          }
        }
      }
    ]
  };

  const labels = [
    { name: '时间', height: 'h-10' },
    { name: '温度(℃)', height: 'h-32' },
    { name: '雨量(毫米)', height: 'h-10' },
    { name: '风向', height: 'h-10' },
    { name: '风速(米/秒)', height: 'h-10' },
    { name: '湿度(%)', height: 'h-10' },
  ];

  return (
    <div className="h-full flex flex-col overflow-hidden">
      <div className="bg-gradient-to-r from-brand-blue/20 to-transparent p-3 flex justify-between items-center border-b border-white/5">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rotate-45 bg-brand-blue shadow-[0_0_8px_#00d4ff]" />
          <h3 className="text-base font-bold italic tracking-wider text-white">逐时预报</h3>
        </div>
        <span className="text-[10px] font-mono text-slate-500">更新: 16:00</span>
      </div>

      <div className="flex-1 p-4 overflow-hidden">
        {/* Scrollable Content */}
        <div className="overflow-x-auto no-scrollbar relative h-full">
          <div className="flex min-w-max h-full">
            {displayData.map((h, i) => (
              <div 
                key={i} 
                className={`flex flex-col items-center w-[75px] transition-colors ${i === 0 ? 'bg-brand-blue/10 border-x border-brand-blue/20' : 'border-r border-white/5'}`}
              >
                {/* Row 1: Time */}
                <div className="h-10 flex flex-col items-center justify-center border-b border-white/5 w-full">
                  <span className="text-[9px] text-slate-500 uppercase">时间</span>
                  <span className="text-[11px] font-bold text-white">{h.hour}时</span>
                </div>
                
                {/* Row 2: Weather & Temp */}
                <div className="h-32 flex flex-col items-center justify-start pt-2 gap-0.5 border-b border-white/5 w-full relative">
                  <span className="text-xl">{h.weather.icon}</span>
                  <span className="text-[10px] text-slate-500">{h.weather.name}</span>
                  <span className="text-[11px] font-bold text-white font-mono">{h.temperature.toFixed(1)}°</span>
                  <div className="flex-1" /> {/* Spacer for chart line */}
                </div>

                {/* Row 3: Rain */}
                <div className="h-10 flex flex-col items-center justify-center border-b border-white/5 w-full">
                  <span className="text-[8px] text-slate-500 uppercase">雨量</span>
                  <span className="text-[11px] text-slate-300 font-mono">{h.precipitation.toFixed(1)}</span>
                </div>

                {/* Row 4: Wind Dir */}
                <div className="h-10 flex flex-col items-center justify-center border-b border-white/5 w-full">
                  <span className="text-[8px] text-slate-500 uppercase">风向</span>
                  <span className="text-brand-blue text-[10px] transform rotate-45">▲</span>
                </div>

                {/* Row 5: Wind Speed */}
                <div className="h-10 flex flex-col items-center justify-center border-b border-white/5 w-full">
                  <span className="text-[8px] text-slate-500 uppercase">风速</span>
                  <span className="text-[11px] text-slate-300 font-mono">{h.wind.speed.toFixed(1)}</span>
                </div>

                {/* Row 6: Humidity */}
                <div className="h-10 flex flex-col items-center justify-center w-full">
                  <span className="text-[8px] text-slate-500 uppercase">湿度</span>
                  <span className="text-[11px] text-slate-300 font-mono">{Math.round(h.humidity)}%</span>
                </div>
              </div>
            ))}
          </div>

          {/* Chart Overlay - Positioned to sit in the bottom half of Row 2 */}
          <div className="absolute top-[100px] left-0 right-0 h-12 pointer-events-none">
            <ReactECharts option={option} style={{ height: '100%', width: '100%' }} />
          </div>
        </div>
      </div>
    </div>
  );
};
