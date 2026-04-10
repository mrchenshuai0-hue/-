import React, { useState } from 'react';
import ReactECharts from 'echarts-for-react';
import { Cloud, Wind, Droplets, Thermometer, Calendar, X } from 'lucide-react';

interface Props {
  station: any;
  onClose: () => void;
}

export const WeatherStationPopup: React.FC<Props> = ({ station, onClose }) => {
  const [activeTab, setActiveTab] = useState('realtime'); // 'realtime' | 'yoy'
  const [yoyType, setYoyType] = useState('rain'); // 'rain' | 'temp' | 'wind'

  // Mock data for Yo-Y comparison
  const yoyData = {
    rain: {
      '2025': [45, 56, 89, 120, 150, 200, 250, 220, 180, 90, 60, 40],
      '2026': [50, 48, 95, 110, 160, 190, 280, 210, 175, 85, 65, 45]
    },
    temp: {
      '2025': [8, 10, 15, 20, 25, 28, 32, 31, 27, 22, 16, 10],
      '2026': [9, 11, 14, 21, 24, 29, 33, 30, 28, 21, 17, 9]
    },
    wind: {
      '2025': [3.2, 3.5, 4.1, 3.8, 3.5, 4.0, 4.5, 4.2, 3.9, 3.6, 3.4, 3.3],
      '2026': [3.4, 3.3, 4.0, 3.9, 3.6, 4.2, 4.3, 4.1, 4.0, 3.5, 3.5, 3.2]
    }
  };

  const getChartOption = () => {
    if (activeTab === 'realtime') {
      return {
        backgroundColor: 'transparent',
        tooltip: { trigger: 'axis', backgroundColor: 'rgba(15, 23, 42, 0.9)', textStyle: { color: '#fff' } },
        legend: { data: ['温度', '降水', '风速'], textStyle: { color: '#94a3b8', fontSize: 10 }, top: 0 },
        grid: { top: 30, right: 10, bottom: 20, left: 30 },
        xAxis: { type: 'category', data: ['00:00', '04:00', '08:00', '12:00', '16:00', '20:00'], axisLabel: { color: '#94a3b8', fontSize: 10 } },
        yAxis: [
          { type: 'value', name: '温度(℃)/风速(m/s)', nameTextStyle: { color: '#94a3b8', fontSize: 10 }, splitLine: { lineStyle: { color: 'rgba(255,255,255,0.1)' } }, axisLabel: { color: '#94a3b8', fontSize: 10 } },
          { type: 'value', name: '降水(mm)', nameTextStyle: { color: '#94a3b8', fontSize: 10 }, splitLine: { show: false }, axisLabel: { color: '#94a3b8', fontSize: 10 } }
        ],
        series: [
          { name: '温度', type: 'line', smooth: true, data: [station.temp - 2, station.temp - 1, station.temp, station.temp + 2, station.temp + 1, station.temp - 1], itemStyle: { color: '#f59e0b' } },
          { name: '降水', type: 'bar', yAxisIndex: 1, data: [0, 0, station.rain, 0, 0, 0], itemStyle: { color: '#3b82f6' } },
          { name: '风速', type: 'line', smooth: true, data: [station.wind - 1, station.wind, station.wind + 1, station.wind, station.wind - 0.5, station.wind], itemStyle: { color: '#00f2fe' } }
        ]
      };
    } else {
      const data2025 = yoyData[yoyType as keyof typeof yoyData]['2025'];
      const data2026 = yoyData[yoyType as keyof typeof yoyData]['2026'];
      const xAxisData = ['1月','2月','3月','4月','5月','6月','7月','8月','9月','10月','11月','12月'];
      const name = yoyType === 'rain' ? '降水量(mm)' : yoyType === 'temp' ? '平均气温(℃)' : '平均风速(m/s)';
      
      return {
        backgroundColor: 'transparent',
        tooltip: { trigger: 'axis', backgroundColor: 'rgba(15, 23, 42, 0.9)', textStyle: { color: '#fff' } },
        legend: { data: ['去年', '今年'], textStyle: { color: '#94a3b8', fontSize: 10 }, top: 0 },
        grid: { top: 30, right: 10, bottom: 20, left: 35 },
        xAxis: { type: 'category', data: xAxisData, axisLabel: { color: '#94a3b8', fontSize: 10 } },
        yAxis: { type: 'value', name, nameTextStyle: { color: '#94a3b8', fontSize: 10 }, splitLine: { lineStyle: { color: 'rgba(255,255,255,0.1)' } }, axisLabel: { color: '#94a3b8', fontSize: 10 } },
        series: [
          { name: '去年', type: 'line', smooth: true, data: data2025, itemStyle: { color: '#94a3b8' } },
          { name: '今年', type: 'line', smooth: true, data: data2026, itemStyle: { color: '#00f2fe' } }
        ]
      };
    }
  };

  return (
    <div className="w-full h-full flex flex-col text-white relative">
      <button onClick={onClose} className="absolute -top-1 -right-1 p-1 text-slate-400 hover:text-white hover:bg-white/10 rounded-full transition-colors z-10">
        <X className="w-4 h-4" />
      </button>
      {/* Header */}
      <div className="flex justify-between items-start mb-3 pr-6">
        <div>
          <h3 className="text-sm font-bold text-brand-blue flex items-center gap-1">
            <Cloud className="w-4 h-4" />
            {station.name}
          </h3>
          <div className="flex items-center gap-2 mt-1 text-[10px] text-slate-400">
            <span className="flex items-center gap-0.5">ID: {station.id}</span>
          </div>
        </div>
        <div className="flex bg-slate-800/50 rounded p-0.5 border border-white/10">
          <button onClick={() => setActiveTab('realtime')} className={`px-2 py-1 text-[10px] rounded transition-colors ${activeTab === 'realtime' ? 'bg-brand-blue text-white' : 'text-slate-400 hover:text-white'}`}>实况</button>
          <button onClick={() => setActiveTab('yoy')} className={`px-2 py-1 text-[10px] rounded transition-colors ${activeTab === 'yoy' ? 'bg-brand-blue text-white' : 'text-slate-400 hover:text-white'}`}>同比</button>
        </div>
      </div>

      {activeTab === 'realtime' ? (
        <>
          {/* Realtime Data Grid */}
          <div className="grid grid-cols-3 gap-2 mb-3">
            <div className="bg-slate-800/50 p-2 rounded flex items-center gap-2 border border-white/5">
              <Thermometer className="w-5 h-5 text-orange-400" />
              <div>
                <div className="text-[9px] text-slate-400">气温</div>
                <div className="text-sm font-bold text-white">{station.temp} <span className="text-[10px] font-normal text-slate-500">℃</span></div>
              </div>
            </div>
            <div className="bg-slate-800/50 p-2 rounded flex items-center gap-2 border border-white/5">
              <Droplets className="w-5 h-5 text-blue-400" />
              <div>
                <div className="text-[9px] text-slate-400">降水</div>
                <div className="text-sm font-bold text-white">{station.rain} <span className="text-[10px] font-normal text-slate-500">mm</span></div>
              </div>
            </div>
            <div className="bg-slate-800/50 p-2 rounded flex items-center gap-2 border border-white/5">
              <Wind className="w-5 h-5 text-cyan-400" />
              <div>
                <div className="text-[9px] text-slate-400">风速</div>
                <div className="text-sm font-bold text-white">{station.wind} <span className="text-[10px] font-normal text-slate-500">m/s</span></div>
              </div>
            </div>
          </div>
        </>
      ) : (
        <div className="flex justify-between items-center mb-3">
          <div className="flex gap-2">
            {['rain', 'temp', 'wind'].map(type => (
              <button
                key={type}
                onClick={() => setYoyType(type)}
                className={`px-2 py-1 text-[10px] rounded border transition-colors ${yoyType === type ? 'bg-brand-blue/20 border-brand-blue text-brand-blue' : 'bg-slate-800/50 border-white/10 text-slate-400 hover:border-white/30'}`}
              >
                {type === 'rain' ? '降水同比' : type === 'temp' ? '气温同比' : '风速同比'}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Chart */}
      <div className="flex-1 min-h-0 bg-slate-800/30 rounded border border-white/5 p-1">
        <ReactECharts option={getChartOption()} notMerge={true} style={{ height: '100%', width: '100%' }} />
      </div>
    </div>
  );
};
