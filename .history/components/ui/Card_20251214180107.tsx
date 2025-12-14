'use client';

import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'glass' | 'gradient' | 'elevated';
  padding?: 'none' | 'sm' | 'md' | 'lg';
  hover?: boolean;
  onClick?: () => void;
}

export default React.forwardRef<HTMLDivElement, CardProps>(function Card({
  children,
  className = '',
  variant = 'default',
  padding = 'md',
  hover = false,
  onClick,
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
    <div ref={ref} onClick={onClick} className={classes}>
      {/* Main content */}
      {children}
      
      {/* Gradient overlay for gradient variant */}
      {variant === 'gradient' && (
        <div className="absolute inset-0 bg-gradient-to-r from-primary-orange/5 to-primary-purple/5 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
      )}
      
      {/* Decorative bottom-right curve effect */}
      <div className="absolute -bottom-8 -right-8 w-32 h-32 bg-gradient-to-tl from-primary-purple/5 to-transparent rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
      
      {/* Black accent line on hover */}
      <div className="absolute inset-0 rounded-xl pointer-events-none group-hover:shadow-inset transition-shadow duration-300" style={{
        boxShadow: 'inset 0 0 0 1px rgba(0,0,0,0)'
      }} />
    </div>
  );
});
