import React from 'react';
import { motion } from 'motion/react';

export const LoadingMask: React.FC = () => {
  return (
    <div className="absolute inset-0 z-[2000] bg-slate-900/80 backdrop-blur-sm flex flex-col items-center justify-center">
      <div className="relative w-24 h-24">
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="absolute inset-0 border-4 border-brand-blue/20 border-t-brand-blue rounded-full"
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-2xl animate-pulse">🌊</span>
        </div>
      </div>
      <p className="mt-4 text-brand-blue font-bold tracking-widest animate-pulse">
        系统数据加载中...
      </p>
    </div>
  );
};
