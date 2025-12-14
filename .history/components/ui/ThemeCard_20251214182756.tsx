'use client';

import React from 'react';

interface ThemeCardProps {
  children?: React.ReactNode;
  icon?: React.ReactNode;
  onClick?: () => void;
  className?: string;
  accentColor?: 'orange' | 'purple' | 'blue' | 'green';
  curveColor?: string;
}

const accentColors = {
  orange: 'bg-primary-orange',
  purple: 'bg-primary-purple',
  blue: 'bg-blue-500',
  green: 'bg-green-500',
};

const curveColors = {
  orange: '#e9552b',
  purple: '#680b7d',
  blue: '#3b82f6',
  green: '#10b981',
};

export default React.forwardRef<HTMLDivElement, ThemeCardProps>(function ThemeCard({
  children,
  icon,
  onClick,
  className = '',
  accentColor = 'orange',
  curveColor = 'purple',
}, ref) {
  return (
    <div 
      ref={ref}
      onClick={onClick}
      className={`relative w-full max-w-[280px] mx-auto cursor-pointer group ${className}`}
    >
      {/* Icon Badge at Top Center */}
      <div className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2 z-20">
        <div className={`${accentColors[accentColor]} rounded-2xl p-4 shadow-lg group-hover:shadow-xl group-hover:scale-110 transition-all duration-300`}>
          <div className="text-white">
            {icon ? (
              icon
            ) : (
              <svg className="h-8 w-8" fill="currentColor" viewBox="0 0 24 24">
                <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z" />
              </svg>
            )}
          </div>
        </div>
      </div>

      {/* Main Card */}
      <div className="relative bg-white rounded-3xl shadow-xl overflow-hidden pt-20 pb-8 px-6 group-hover:shadow-2xl group-hover:shadow-black/25 transition-all duration-300 group-hover:scale-[1.02] group-hover:translate-y-[-4px]">
        {/* Content */}
        <div className="relative z-10 flex flex-col items-center justify-center min-h-[120px]">
          {children}
        </div>

        {/* Decorative Curve at Bottom Right */}
        <div className="absolute -bottom-16 -right-16 w-48 h-48 pointer-events-none">
          <svg
            width="100%"
            height="100%"
            viewBox="0 0 280 200"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="absolute bottom-0 right-0"
            preserveAspectRatio="none"
          >
            <path 
              d="M 140 200 Q 200 180, 280 100 Q 320 60, 280 0 L 280 200 Z" 
              fill={curveColors[curveColor]} 
              opacity="0.15"
            />
          </svg>
        </div>
      </div>
    </div>
  );
});
