'use client';

import React from 'react';

interface ButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  onClick?: () => void;
  href?: string;
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
}

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  onClick,
  href,
  disabled = false,
  type = 'button',
}: ButtonProps) {
  const baseClasses = 'relative inline-flex items-center justify-center font-medium transition-all duration-300 ease-in-out transform hover:scale-110 hover:shadow-lg active:scale-95 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-purple disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden rounded-lg font-red-hat-display';

  const variants = {
    primary: 'bg-gradient-to-r from-primary-orange to-primary-purple text-white hover:shadow-xl hover:shadow-primary-purple/40 hover:-translate-y-1',
    secondary: 'bg-gradient-to-r from-primary-orange to-primary-purple text-white hover:shadow-xl hover:shadow-primary-purple/40 hover:-translate-y-1',
    outline: 'border-2 border-primary-purple text-primary-purple hover:bg-primary-purple hover:text-white hover:shadow-lg',
    ghost: 'text-primary-purple hover:bg-primary-purple/10 hover:shadow-md',
  };

  const sizes = {
    sm: 'px-5 py-2 text-sm',
    md: 'px-7 py-3 text-base',
    lg: 'px-10 py-4 text-lg',
  };

  const classes = `${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`;

  if (href) {
    return (
      <a href={href} className={classes}>
        <span className="relative z-10">{children}</span>
        <div className="absolute inset-0 bg-gradient-to-r from-primary-orange/20 to-primary-purple/20 opacity-0 hover:opacity-100 transition-opacity duration-300" />
      </a>
    );
  }

  return (
    <button
      type={type}
      className={classes}
      onClick={onClick}
      disabled={disabled}
    >
      <span className="relative z-10">{children}</span>
      <div className="absolute inset-0 bg-gradient-to-r from-primary-orange/20 to-primary-purple/20 opacity-0 hover:opacity-100 transition-opacity duration-300" />
    </button>
  );
}
