'use client';

import React from 'react';

interface TitleProps {
  children: React.ReactNode;
  level?: 1 | 2 | 3 | 4 | 5 | 6;
  variant?: 'default' | 'gradient' | 'outline' | 'glow';
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl';
  align?: 'left' | 'center' | 'right';
  className?: string;
}

export default React.forwardRef<HTMLElement, TitleProps>(function Title({
  children,
  level = 2,
  variant = 'default',
  size = 'xl',
  align = 'center',
  className = '',
}, ref) {
  const baseClasses = 'font-bold tracking-tight';

  const variants = {
    default: 'text-white',
    gradient: 'gradient-text',
    outline: 'text-transparent bg-clip-text bg-gradient-to-r from-primary-purple to-primary-orange',
    glow: 'text-white drop-shadow-[0_0_20px_rgba(139,92,246,0.5)]',
  };

  const sizes = {
    sm: 'text-2xl md:text-3xl',
    md: 'text-3xl md:text-4xl',
    lg: 'text-4xl md:text-5xl',
    xl: 'text-5xl md:text-6xl',
    '2xl': 'text-6xl md:text-7xl',
    '3xl': 'text-7xl md:text-8xl',
  };

  const alignments = {
    left: 'text-left',
    center: 'text-center',
    right: 'text-right',
  };

  const fontSizes = {
    sm: 'font-red-hat-display',
    md: 'font-red-hat-display',
    lg: 'font-red-hat-display',
    xl: 'font-red-hat-display',
    '2xl': 'font-red-hat-display',
    '3xl': 'font-red-hat-display',
  };

  const classes = `${baseClasses} ${variants[variant]} ${sizes[size]} ${alignments[align]} ${fontSizes[size]} ${className}`;

  const tagName = `h${level}` as 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';

  return React.createElement(
    tagName,
    {
      ref,
      className: classes
    },
    children
  );
});
