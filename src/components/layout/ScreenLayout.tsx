import React, { useEffect, useState } from 'react';

interface ScreenLayoutProps {
  children: React.ReactNode;
}

export const ScreenLayout: React.FC<ScreenLayoutProps> = ({ children }) => {
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const handleResize = () => {
      const targetWidth = 1920;
      const targetHeight = 1080;
      const windowWidth = window.innerWidth;
      const windowHeight = window.innerHeight;
      
      const scaleX = windowWidth / targetWidth;
      const scaleY = windowHeight / targetHeight;
      
      // Use the smaller scale to ensure it fits both dimensions
      setScale(Math.min(scaleX, scaleY));
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="w-screen h-screen bg-[#0a1628] flex items-center justify-center overflow-hidden">
      <div 
        style={{
          width: '1920px',
          height: '1080px',
          transform: `scale(${scale})`,
          transformOrigin: 'center center',
          transition: 'transform 0.3s ease-out'
        }}
        className="relative shrink-0"
      >
        {children}
      </div>
    </div>
  );
};
