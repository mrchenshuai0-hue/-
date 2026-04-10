import React, { useState, useEffect } from 'react';
import { HeaderMarquee } from './components/layout/HeaderMarquee';
import { ScreenLayout } from './components/layout/ScreenLayout';
import { GisMap } from './components/map/GisMap';
import { RealTimeCard } from './components/panels/RealTimeCard';
import { HourlyForecast } from './components/panels/HourlyForecast';
import { DailyForecast } from './components/panels/DailyForecast';
import { VideoMonitor } from './components/panels/VideoMonitor';
import { AutoMonitoringCard } from './components/panels/AutoMonitoringCard';
import { LoadingMask } from './components/common/LoadingMask';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, ChevronRight, Maximize2, Settings } from 'lucide-react';

export default function App() {
  const [loading, setLoading] = useState(true);
  const [leftPanelOpen, setLeftPanelOpen] = useState(true);
  const [rightPanelOpen, setRightPanelOpen] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <ScreenLayout>
      <AnimatePresence>
        {loading && <LoadingMask />}
      </AnimatePresence>
      
      <div className="w-full h-full relative bg-[#050a14] overflow-hidden">
        {/* Map Background - Full Screen */}
        <div className="absolute inset-0 z-0">
          <GisMap rightPanelOpen={rightPanelOpen} leftPanelOpen={leftPanelOpen} />
        </div>

        {/* Tech Grid Overlay */}
        <div className="absolute inset-0 pointer-events-none opacity-10 z-1" 
          style={{ backgroundImage: 'linear-gradient(#00f2fe 1px, transparent 1px), linear-gradient(90deg, #00f2fe 1px, transparent 1px)', backgroundSize: '50px 50px' }} 
        />

        {/* Header Section - Floating at top */}
        <header className="absolute top-0 left-0 right-0 h-20 flex items-center justify-between px-6 z-50 overflow-hidden">
          {/* Tech Header Background SVG */}
          <div className="absolute inset-0 z-0 pointer-events-none">
            <svg width="100%" height="100%" viewBox="0 0 1920 80" fill="none" preserveAspectRatio="none">
              {/* Symmetrical Tech Base */}
              <path d="M0 0H1920V40L1880 60H1600L1560 80H360L320 60H40L0 40V0Z" fill="url(#header_bg)" fillOpacity="1"/>
              
              {/* Left Decorative Lines */}
              <path d="M40 40L60 60H320L360 80" stroke="#00f2fe" strokeWidth="1" strokeOpacity="0.5"/>
              <path d="M0 20H300L340 40" stroke="#00f2fe" strokeWidth="0.5" strokeOpacity="0.3"/>
              
              {/* Right Decorative Lines (Symmetrical) */}
              <path d="M1880 40L1860 60H1600L1560 80" stroke="#00f2fe" strokeWidth="1" strokeOpacity="0.5"/>
              <path d="M1920 20H1620L1580 40" stroke="#00f2fe" strokeWidth="0.5" strokeOpacity="0.3"/>
              
              {/* Bottom Glow Line */}
              <path d="M360 80H1560" stroke="#00f2fe" strokeWidth="2" strokeOpacity="0.6" className="animate-pulse"/>
              
              <defs>
                <linearGradient id="header_bg" x1="960" y1="0" x2="960" y2="80" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#0d2b52"/>
                  <stop offset="1" stopColor="#061a35"/>
                </linearGradient>
              </defs>
            </svg>
          </div>

          {/* Left: Warning Content - Aligned with title height */}
          <div className="w-[500px] z-10 flex items-center pt-0">
            <div className="flex-1 overflow-hidden">
              <HeaderMarquee />
            </div>
          </div>

          {/* Center: Main Title - Centered vertically and larger font */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="relative flex items-center gap-4 pointer-events-auto">
              {/* Scanning Line Effect */}
              <div className="absolute -inset-x-10 top-0 h-[1px] bg-brand-blue/40 shadow-[0_0_10px_#00f2fe] animate-[scan_3s_linear_infinite]" />
              
              <div className="flex items-center gap-1">
                <div className="w-1 h-3 bg-brand-blue/40" />
                <div className="w-1 h-5 bg-brand-blue/80" />
                <div className="w-1 h-3 bg-brand-blue/40" />
              </div>
              <h1 className="text-3xl font-black tracking-[0.5em] text-gradient uppercase italic leading-none whitespace-nowrap drop-shadow-[0_0_20px_rgba(0,242,254,0.6)]">
                福鼎市气象环保智慧监管平台
              </h1>
              <div className="flex items-center gap-1">
                <div className="w-1 h-3 bg-brand-blue/40" />
                <div className="w-1 h-5 bg-brand-blue/80" />
                <div className="w-1 h-3 bg-brand-blue/40" />
              </div>
            </div>
          </div>

          {/* Right: System Info - Aligned with title height */}
          <div className="w-[500px] z-10 flex justify-end items-center pt-0 pr-4">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 bg-brand-blue/10 px-3 py-1 rounded border border-brand-blue/20">
                <span className="w-2 h-2 rounded-full bg-success animate-pulse shadow-[0_0_8px_#00ff9d]" />
                <span className="text-[10px] text-brand-blue font-mono font-bold uppercase tracking-wider">系统在线</span>
              </div>
              <span className="text-[10px] text-brand-blue/80 font-mono tracking-[0.2em] uppercase font-bold">版本 2.0</span>
            </div>
          </div>
        </header>

        {/* Content Overlays - Panels below header */}
        <div className="absolute top-20 left-0 right-0 bottom-0 pointer-events-none z-10">
          {/* Left Panel Overlay */}
          <motion.div 
            animate={{ x: leftPanelOpen ? 0 : -430 }}
            transition={{ type: 'spring', damping: 25, stiffness: 120 }}
            className="absolute left-4 top-4 bottom-4 w-[420px] flex flex-col pointer-events-none"
          >
            <div className="flex-1 min-h-0 pointer-events-auto dashboard-card tech-border flex flex-col overflow-hidden">
              <div className="flex-1 min-h-0 border-b border-white/5">
                <RealTimeCard />
              </div>
              <div className="flex-1 min-h-0 border-b border-white/5">
                <DailyForecast />
              </div>
              <div className="flex-1 min-h-0">
                <HourlyForecast />
              </div>
            </div>
            
            {/* Toggle Button */}
            <button 
              onClick={() => setLeftPanelOpen(!leftPanelOpen)}
              className="absolute -right-8 top-1/2 -translate-y-1/2 w-8 h-24 bg-slate-900/80 border border-brand-blue/30 rounded-r-lg flex flex-col items-center justify-center pointer-events-auto hover:bg-brand-blue/20 transition-colors group"
            >
              <div className="text-[10px] text-brand-blue font-bold vertical-text mb-2 uppercase tracking-tighter">控制面板</div>
              {leftPanelOpen ? <ChevronLeft className="w-4 h-4 text-brand-blue group-hover:scale-125 transition-transform" /> : <ChevronRight className="w-4 h-4 text-brand-blue group-hover:scale-125 transition-transform" />}
            </button>
          </motion.div>

          {/* Right Panel Overlay */}
          <motion.div 
            animate={{ x: rightPanelOpen ? 0 : 430 }}
            transition={{ type: 'spring', damping: 25, stiffness: 120 }}
            className="absolute right-4 top-4 bottom-4 w-[420px] flex flex-col pointer-events-none"
          >
            <div className="flex-1 min-h-0 pointer-events-auto dashboard-card tech-border flex flex-col overflow-hidden">
              <div className="flex-[1.8] min-h-0 border-b border-white/5">
                <AutoMonitoringCard />
              </div>
              <div className="flex-[1.2] min-h-0">
                <VideoMonitor />
              </div>
            </div>

            {/* Toggle Button */}
            <button 
              onClick={() => setRightPanelOpen(!rightPanelOpen)}
              className="absolute -left-8 top-1/2 -translate-y-1/2 w-8 h-24 bg-slate-900/80 border border-brand-blue/30 rounded-l-lg flex flex-col items-center justify-center pointer-events-auto hover:bg-brand-blue/20 transition-colors group"
            >
              <div className="text-[10px] text-brand-blue font-bold vertical-text mb-2 uppercase tracking-tighter">数据监测</div>
              {rightPanelOpen ? <ChevronRight className="w-4 h-4 text-brand-blue group-hover:scale-125 transition-transform" /> : <ChevronLeft className="w-4 h-4 text-brand-blue group-hover:scale-125 transition-transform" />}
            </button>
          </motion.div>
        </div>
      </div>
    </ScreenLayout>
  );
}
