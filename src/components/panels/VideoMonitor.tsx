import React, { useState } from 'react';

export const VideoMonitor: React.FC = () => {
  const [activeTab, setActiveTab] = useState(0);
  const locations = ['南溪水库', '马冠山水厂', '点头镇站点', '桐城街道'];

  return (
    <div className="h-full flex flex-col overflow-hidden">
      <div className="bg-gradient-to-r from-brand-blue/20 to-transparent p-3 flex justify-between items-center border-b border-white/5">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rotate-45 bg-brand-blue shadow-[0_0_8px_#00d4ff]" />
          <h3 className="text-base font-bold italic tracking-wider text-white">实时视频监控</h3>
        </div>
        <span className="text-[10px] font-mono text-slate-500">更新: 16:00</span>
      </div>

      <div className="flex-1 p-4 flex flex-col gap-4">
        <div className="relative">
          <select
            value={activeTab}
            onChange={(e) => setActiveTab(Number(e.target.value))}
            className="w-full bg-slate-900/80 border border-brand-blue/30 text-white text-xs py-2.5 px-4 rounded-lg appearance-none cursor-pointer focus:outline-none focus:border-brand-blue shadow-[0_0_10px_rgba(0,242,254,0.1)]"
          >
            {locations.map((loc, i) => (
              <option key={i} value={i} className="bg-slate-900 text-white">
                {i + 1}. {loc}
              </option>
            ))}
          </select>
          <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-brand-blue">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>

        <div className="relative flex-1 bg-black rounded-lg border border-white/10 overflow-hidden group">
          <img 
            src={`https://picsum.photos/seed/fuding-water-${activeTab}/800/450`} 
            alt="监控视频" 
            className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
            referrerPolicy="no-referrer"
          />
          {/* Tech Overlays */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-3 left-3 text-xs font-mono text-brand-blue bg-black/50 px-2 py-0.5">摄像头 0{activeTab + 1}</div>
            <div className="absolute top-3 right-3 text-xs font-mono text-brand-blue bg-black/50 px-2 py-0.5">录制中 ●</div>
            <div className="absolute bottom-3 left-3 text-xs font-mono text-white/70 bg-black/30 px-2">{locations[activeTab]}</div>
            
            {/* Corner Brackets */}
            <div className="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 border-brand-blue/50" />
            <div className="absolute top-0 right-0 w-6 h-6 border-t-2 border-r-2 border-brand-blue/50" />
            <div className="absolute bottom-0 left-0 w-6 h-6 border-b-2 border-l-2 border-brand-blue/50" />
            <div className="absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 border-brand-blue/50" />
          </div>
        </div>
      </div>
    </div>
  );
};
