import React from 'react';
import ReactECharts from 'echarts-for-react';
import * as echarts from 'echarts';
import { mockWaterStations } from '../../services/mockData';

export const DataChart: React.FC = () => {
  const option = {
    backgroundColor: 'transparent',
    tooltip: {
      trigger: 'axis',
      backgroundColor: 'rgba(5, 10, 20, 0.9)',
      borderColor: 'rgba(0, 242, 254, 0.3)',
      textStyle: { color: '#fff' },
    },
    legend: {
      data: ['溶解氧', '氨氮', '总磷'],
      textStyle: { color: '#94a3b8', fontSize: 10 },
      top: 0,
      itemWidth: 10,
      itemHeight: 10,
    },
    grid: {
      top: '20%',
      left: '3%',
      right: '4%',
      bottom: '5%',
      containLabel: true,
    },
    xAxis: {
      type: 'category',
      data: mockWaterStations.map(s => s.name.replace('水质监测站', '')),
      axisLine: { lineStyle: { color: 'rgba(255, 255, 255, 0.1)' } },
      axisLabel: { color: '#94a3b8', fontSize: 10, rotate: 30 },
    },
    yAxis: {
      type: 'value',
      splitLine: { lineStyle: { color: 'rgba(255, 255, 255, 0.05)', type: 'dashed' } },
      axisLabel: { color: '#94a3b8', fontSize: 10 },
    },
    series: [
      {
        name: '溶解氧',
        type: 'bar',
        data: mockWaterStations.map(s => s.data.dissolvedOxygen),
        itemStyle: { 
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: '#00ff9d' },
            { offset: 1, color: '#00ff9d22' }
          ])
        },
        barWidth: 8,
      },
      {
        name: '氨氮',
        type: 'bar',
        data: mockWaterStations.map(s => s.data.ammoniaNitrogen * 10),
        itemStyle: { 
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: '#ffcc00' },
            { offset: 1, color: '#ffcc0022' }
          ])
        },
        barWidth: 8,
      },
      {
        name: '总磷',
        type: 'bar',
        data: mockWaterStations.map(s => s.data.totalPhosphorus * 100),
        itemStyle: { 
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: '#ff0055' },
            { offset: 1, color: '#ff005522' }
          ])
        },
        barWidth: 8,
      }
    ]
  };

  return (
    <div className="h-full flex flex-col overflow-hidden">
      <div className="bg-gradient-to-r from-brand-blue/20 to-transparent p-3 flex justify-between items-center border-b border-white/5">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rotate-45 bg-brand-blue shadow-[0_0_8px_#00d4ff]" />
          <h3 className="text-base font-bold italic tracking-wider text-white">水质指标对比分析</h3>
        </div>
        <span className="text-[10px] font-mono text-slate-500">更新: 16:00</span>
      </div>

      <div className="flex-1 p-4">
        <ReactECharts option={option} style={{ height: '100%', width: '100%' }} />
      </div>
    </div>
  );
};
