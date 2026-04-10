import React, { useState } from 'react';
import ReactECharts from 'echarts-for-react';
import { Calendar, MapPin, AlertTriangle, WifiOff } from 'lucide-react';

export const AutoMonitoringCard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('牛头溪微型站');

  const stats = [
    { label: '监测点位', value: 7, icon: MapPin, color: 'text-cyan-400', bg: 'bg-cyan-400/10' },
    { label: '超标点位', value: 2, icon: AlertTriangle, color: 'text-pink-400', bg: 'bg-pink-400/10' },
    { label: '掉线告警', value: 5, icon: WifiOff, color: 'text-slate-400', bg: 'bg-slate-400/10' },
  ];

  const tabs = ['牛头溪微型站', '会甲溪生物毒性站', '南溪水库湾'];

  const option = {
    backgroundColor: 'transparent',
    tooltip: {
      trigger: 'axis',
      backgroundColor: 'rgba(15, 23, 42, 0.9)',
      borderColor: 'rgba(0, 212, 255, 0.3)',
      textStyle: { color: '#fff' },
    },
    grid: {
      top: '15%',
      left: '5%',
      right: '5%',
      bottom: '15%',
      containLabel: true,
    },
    xAxis: {
      type: 'category',
      data: ['00:00', '02:00', '04:00', '06:00', '08:00', '10:00', '12:00', '14:00', '16:00'],
      axisLine: { lineStyle: { color: 'rgba(255, 255, 255, 0.1)' } },
      axisLabel: { color: '#94a3b8', fontSize: 10 },
    },
    yAxis: {
      type: 'value',
      axisLine: { show: false },
      axisLabel: { color: '#94a3b8', fontSize: 10, formatter: '{value} ℃' },
      splitLine: { lineStyle: { color: 'rgba(255, 255, 255, 0.05)', type: 'dashed' } },
      min: 10,
      max: 30,
    },
    series: [
      {
        name: '水温',
        type: 'line',
        smooth: true,
        symbol: 'circle',
        symbolSize: 6,
        data: [18.5, 18.2, 17.8, 17.5, 18.0, 19.5, 21.2, 22.5, 21.8],
        lineStyle: {
          width: 3,
          color: {
            type: 'linear',
            x: 0, y: 0, x2: 1, y2: 0,
            colorStops: [
              { offset: 0, color: '#f59e0b' },
              { offset: 1, color: '#fbbf24' }
            ]
          },
          shadowBlur: 10,
          shadowColor: 'rgba(245, 158, 11, 0.5)'
        },
        itemStyle: {
          color: '#f59e0b',
          borderColor: '#fff',
          borderWidth: 2,
        },
        areaStyle: {
          color: {
            type: 'linear',
            x: 0, y: 0, x2: 0, y2: 1,
            colorStops: [
              { offset: 0, color: 'rgba(245, 158, 11, 0.2)' },
              { offset: 1, color: 'rgba(245, 158, 11, 0)' }
            ]
          }
        }
      }
    ]
  };

  return (
    <div className="h-full flex flex-col overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-brand-blue/20 to-transparent p-3 flex justify-between items-center border-b border-white/5">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rotate-45 bg-brand-blue shadow-[0_0_8px_#00d4ff]" />
          <h3 className="text-base font-bold italic tracking-wider text-white">自动监测数据</h3>
        </div>
        <span className="text-[10px] font-mono text-slate-500">更新: 16:00</span>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-3 gap-3 p-4">
        {stats.map((s, i) => (
          <div key={i} className={`relative p-3 rounded-lg border border-white/5 ${s.bg} group overflow-hidden`}>
            <div className="flex items-center gap-2 mb-1.5">
              <s.icon className={`w-5 h-5 ${s.color}`} />
              <span className="text-xs text-slate-300">{s.label}</span>
            </div>
            <div className="flex items-baseline gap-1">
              <span className={`text-2xl font-bold font-mono ${s.color}`}>{s.value}</span>
              <span className="text-xs text-slate-500">个</span>
              <span className="ml-auto text-sm text-brand-blue/50 group-hover:translate-y-[-2px] transition-transform">↑</span>
            </div>
            {/* Decorative lines */}
            <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent" />
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex px-4 gap-2 mb-3">
        {tabs.map(t => (
          <button
            key={t}
            onClick={() => setActiveTab(t)}
            className={`flex-1 py-2 text-xs transition-all border-b-2 ${
              activeTab === t 
                ? 'border-brand-blue text-white bg-brand-blue/10' 
                : 'border-transparent text-slate-500 hover:text-slate-300'
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {/* Filters */}
      <div className="flex px-4 gap-4 text-xs text-slate-400 mb-2 overflow-x-auto no-scrollbar">
        {['水质类别', '水温', 'pH', '溶解氧', '高锰酸盐指数', '化学需氧量', '氨氮'].map((f) => (
          <div key={f} className="flex items-center gap-1.5 whitespace-nowrap cursor-pointer hover:text-white transition-colors">
            <div className={`w-3 h-3 border border-white/20 rounded-sm flex items-center justify-center transition-colors ${f === '水温' ? 'bg-orange-500 border-orange-500' : 'bg-slate-800/50'}`}>
              {f === '水温' && <div className="w-1.5 h-1.5 bg-white rounded-sm" />}
            </div>
            <span className={f === '水温' ? 'text-white font-medium' : ''}>{f}</span>
          </div>
        ))}
      </div>

      {/* Chart */}
      <div className="flex-1 min-h-0">
        <ReactECharts option={option} style={{ height: '100%', width: '100%' }} />
      </div>
    </div>
  );
};
