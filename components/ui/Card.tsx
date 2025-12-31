'use client';

import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'glass' | 'gradient' | 'elevated';
  padding?: 'none' | 'sm' | 'md' | 'lg';
  hover?: boolean;
  onClick?: () => void;
  style?: React.CSSProperties;
}

export default React.forwardRef<HTMLDivElement, CardProps>(function Card({
  children,
  className = '',
  variant = 'default',
  padding = 'md',
  hover = false,
  onClick,
  style,
}, ref) {
  const baseClasses = 'relative rounded-3xl transition-all duration-500 ease-in-out overflow-hidden';

  const variants = {
    default: 'bg-white border border-black/10 shadow-xl hover:shadow-2xl hover:shadow-black/25',
    glass: 'bg-white/95 backdrop-blur-md border border-black/10 shadow-xl hover:shadow-2xl hover:shadow-black/25',
    gradient: 'bg-gradient-to-br from-white to-white/95 border border-black/10 shadow-xl hover:shadow-2xl hover:shadow-black/25',
    elevated: 'bg-white border border-black/15 shadow-2xl hover:shadow-2xl hover:shadow-black/40',
  };

  const paddings = {
    none: '',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
  };

  const hoverEffect = hover
    ? 'hover:scale-[1.02] hover:translate-y-[-4px] group cursor-pointer'
    : 'group';

  const classes = `${baseClasses} ${variants[variant]} ${paddings[padding]} ${hoverEffect} ${className}`;

  return (
    <div ref={ref} onClick={onClick} className={classes} style={style}>

      {/* Main content */}
      <div className="relative z-10">
        {children}
      </div>

      {/* Gradient overlay for gradient variant */}
      {variant === 'gradient' && (
        <div className="absolute inset-0 bg-gradient-to-r from-primary-orange/5 to-primary-purple/5 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
      )}
    </div>
  );
});
