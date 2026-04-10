import React from 'react';
import ReactECharts from 'echarts-for-react';
import { WaterStation } from '../../types';
import { MapPin, Droplets, Activity, CheckCircle2, AlertTriangle, XCircle, X } from 'lucide-react';

interface Props {
  station: WaterStation;
  onClose: () => void;
}

export const EnvStationPopup: React.FC<Props> = ({ station, onClose }) => {
  const getStatusInfo = (status: string) => {
    switch (status) {
      case 'normal': return { label: '达标', color: 'text-green-400', bg: 'bg-green-400/20', icon: CheckCircle2 };
      case 'warning': return { label: '未达标', color: 'text-yellow-400', bg: 'bg-yellow-400/20', icon: AlertTriangle };
      case 'error': return { label: '超标', color: 'text-red-400', bg: 'bg-red-400/20', icon: XCircle };
      default: return { label: '未知', color: 'text-slate-400', bg: 'bg-slate-400/20', icon: Activity };
    }
  };

  const statusInfo = getStatusInfo(station.status);

  const chartOption = {
    backgroundColor: 'transparent',
    tooltip: { trigger: 'axis', backgroundColor: 'rgba(15, 23, 42, 0.9)', textStyle: { color: '#fff' } },
    grid: { top: 30, right: 10, bottom: 20, left: 30 },
    xAxis: {
      type: 'category',
      data: ['水温', 'pH', '溶氧', '氨氮', '总磷', '浊度'],
      axisLabel: { color: '#94a3b8', fontSize: 10, interval: 0 }
    },
    yAxis: { type: 'value', splitLine: { lineStyle: { color: 'rgba(255,255,255,0.1)' } }, axisLabel: { color: '#94a3b8', fontSize: 10 } },
    series: [{
      type: 'bar',
      data: [
        station.data.waterTemp,
        station.data.ph,
        station.data.dissolvedOxygen,
        station.data.ammoniaNitrogen * 10, // scaled for visibility
        station.data.totalPhosphorus * 100, // scaled for visibility
        station.data.turbidity
      ],
      itemStyle: {
        color: {
          type: 'linear', x: 0, y: 0, x2: 0, y2: 1,
          colorStops: [{ offset: 0, color: '#00f2fe' }, { offset: 1, color: '#4facfe' }]
        },
        borderRadius: [4, 4, 0, 0]
      }
    }]
  };

  return (
    <div className="w-full h-full flex flex-col text-white">
      {/* Header */}
      <div className="flex justify-between items-start mb-3 relative pr-6">
        <button onClick={onClose} className="absolute -top-1 -right-1 p-1 text-slate-400 hover:text-white hover:bg-white/10 rounded-full transition-colors z-10">
          <X className="w-4 h-4" />
        </button>
        <div>
          <h3 className="text-sm font-bold text-brand-blue flex items-center gap-1">
            <Droplets className="w-4 h-4" />
            {station.name}
          </h3>
          <div className="flex items-center gap-2 mt-1 text-[10px] text-slate-400">
            <span className="flex items-center gap-0.5"><MapPin className="w-3 h-3" /> {station.district} - {station.waterBody}</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className={`flex items-center gap-1 px-2 py-1 rounded text-[10px] font-bold ${statusInfo.bg} ${statusInfo.color}`}>
            <statusInfo.icon className="w-3 h-3" />
            {statusInfo.label}
          </div>
        </div>
      </div>

      {/* Data Grid */}
      <div className="grid grid-cols-4 gap-2 mb-3">
        <div className="bg-slate-800/50 p-1.5 rounded text-center border border-white/5">
          <div className="text-[9px] text-slate-400">水质类别</div>
          <div className="text-xs font-bold text-brand-blue">{station.qualityGrade}类</div>
        </div>
        <div className="bg-slate-800/50 p-1.5 rounded text-center border border-white/5">
          <div className="text-[9px] text-slate-400">水温(℃)</div>
          <div className="text-xs font-bold text-orange-400">{station.data.waterTemp}</div>
        </div>
        <div className="bg-slate-800/50 p-1.5 rounded text-center border border-white/5">
          <div className="text-[9px] text-slate-400">pH值</div>
          <div className="text-xs font-bold text-green-400">{station.data.ph}</div>
        </div>
        <div className="bg-slate-800/50 p-1.5 rounded text-center border border-white/5">
          <div className="text-[9px] text-slate-400">溶解氧</div>
          <div className="text-xs font-bold text-cyan-400">{station.data.dissolvedOxygen}</div>
        </div>
        <div className="bg-slate-800/50 p-1.5 rounded text-center border border-white/5">
          <div className="text-[9px] text-slate-400">氨氮</div>
          <div className="text-xs font-bold text-yellow-400">{station.data.ammoniaNitrogen}</div>
        </div>
        <div className="bg-slate-800/50 p-1.5 rounded text-center border border-white/5">
          <div className="text-[9px] text-slate-400">总磷</div>
          <div className="text-xs font-bold text-pink-400">{station.data.totalPhosphorus}</div>
        </div>
        <div className="bg-slate-800/50 p-1.5 rounded text-center border border-white/5">
          <div className="text-[9px] text-slate-400">浊度</div>
          <div className="text-xs font-bold text-blue-400">{station.data.turbidity}</div>
        </div>
        <div className="bg-slate-800/50 p-1.5 rounded text-center border border-white/5">
          <div className="text-[9px] text-slate-400">叶绿素a</div>
          <div className="text-xs font-bold text-emerald-400">{station.data.chlorophyllA}</div>
        </div>
      </div>

      <div className="text-[10px] text-slate-500 mb-2">更新时间: {station.updateTime}</div>

      {/* Chart */}
      <div className="flex-1 min-h-0 bg-slate-800/30 rounded border border-white/5 p-1">
        <ReactECharts option={chartOption} style={{ height: '100%', width: '100%' }} />
      </div>
    </div>
  );
};
