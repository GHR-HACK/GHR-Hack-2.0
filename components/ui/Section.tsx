'use client';

import React from 'react';

interface SectionProps {
  children: React.ReactNode;
  className?: string;
  id?: string;
  background?: 'default' | 'gradient' | 'dark' | 'pattern';
  fullHeight?: boolean;
}

export default function Section({
  children,
  className = '',
  id,
  background = 'default',
  fullHeight = false,
}: SectionProps) {
  const baseClasses = 'relative w-full overflow-hidden';

  const backgrounds = {
    default: 'bg-black',
    gradient: 'bg-gradient-to-br from-black via-gray-900 to-black',
    dark: 'bg-gray-900',
    pattern: 'bg-black',
  };

  const height = fullHeight ? 'min-h-screen' : 'py-16 md:py-24';

  const classes = `${baseClasses} ${backgrounds[background]} ${height} ${className}`;

  return (
    <section id={id} className={classes}>
      {background === 'pattern' && (
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(139,92,246,0.3)_1px,transparent_0)] bg-[length:20px_20px]" />
        </div>
      )}
      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8">
        {children}
      </div>
      {background === 'gradient' && (
        <div className="absolute inset-0 bg-gradient-to-r from-primary-purple/5 via-transparent to-primary-orange/5 pointer-events-none" />
      )}
    </section>
  );
}
