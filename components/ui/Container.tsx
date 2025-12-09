'use client';

import React from 'react';

interface ContainerProps {
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  className?: string;
  center?: boolean;
}

export default function Container({
  children,
  size = 'lg',
  className = '',
  center = false,
}: ContainerProps) {
  const baseClasses = 'mx-auto';

  const sizes = {
    sm: 'max-w-2xl',
    md: 'max-w-4xl',
    lg: 'max-w-6xl',
    xl: 'max-w-7xl',
    full: 'max-w-full',
  };

  const centerClass = center ? 'text-center' : '';

  const classes = `${baseClasses} ${sizes[size]} ${centerClass} ${className}`;

  return (
    <div className={classes}>
      {children}
    </div>
  );
}
