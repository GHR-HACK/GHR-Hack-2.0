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
  const baseClasses = 'relative rounded-xl transition-all duration-500 ease-in-out';

  const variants = {
    default: 'bg-white/5 border border-white/10 backdrop-blur-sm',
    glass: 'glass',
    gradient: 'bg-gradient-to-br from-primary-purple/10 to-primary-orange/10 border border-primary-purple/20',
    elevated: 'bg-black/20 border border-white/5 shadow-2xl backdrop-blur-md',
  };

  const paddings = {
    none: '',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
  };

  const hoverEffect = hover ? 'hover:scale-105 hover:shadow-2xl hover:shadow-primary-purple/20' : '';

  const classes = `${baseClasses} ${variants[variant]} ${paddings[padding]} ${hoverEffect} ${className}`;

  return (
    <div ref={ref} onClick={onClick} className={classes}>
      {children}
      {variant === 'gradient' && (
        <div className="absolute inset-0 bg-gradient-to-r from-primary-purple/5 to-primary-orange/5 rounded-xl opacity-0 hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
      )}
    </div>
  );
});
