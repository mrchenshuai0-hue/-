import React, { useEffect, useState } from 'react';
import { Warning } from '../../types';
import { mockWarnings } from '../../services/mockData';
import { AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const HeaderMarquee: React.FC = () => {
  const [warnings] = useState<Warning[]>(mockWarnings);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % warnings.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [warnings.length]);

  return (
    <div className="h-full flex items-center px-4 overflow-hidden relative">
      <div className="flex items-center gap-2 text-brand-blue font-bold shrink-0 mr-4 border-r border-white/10 pr-4">
        <AlertCircle className="w-4 h-4 animate-pulse text-danger" />
        <span className="text-sm tracking-widest italic">实时预警</span>
      </div>
      
      <div className="flex-1 relative h-full flex items-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -50, opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="flex items-center gap-4"
          >
            <span 
              className="px-2 py-0.5 rounded-sm text-[10px] font-bold uppercase tracking-tighter"
              style={{ backgroundColor: warnings[currentIndex].level.color + '22', color: warnings[currentIndex].level.color, border: `1px solid ${warnings[currentIndex].level.color}` }}
            >
              {warnings[currentIndex].level.name}
            </span>
            <span className="text-slate-200 text-xs font-medium truncate max-w-[600px]">
              {warnings[currentIndex].title}: {warnings[currentIndex].content}
            </span>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};
