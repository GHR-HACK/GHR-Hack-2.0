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
  const baseClasses = 'relative inline-flex items-center justify-center font-medium transition-all duration-300 ease-in-out transform hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-purple disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden';

  const variants = {
    primary: 'bg-gradient-to-r from-primary-orange to-primary-purple text-white hover:shadow-lg hover:shadow-primary-purple/25',
    secondary: 'bg-gradient-to-r from-primary-orange to-primary-purple text-white hover:shadow-lg hover:shadow-primary-purple/25',
    outline: 'border-2 border-primary-purple text-primary-purple hover:bg-primary-purple hover:text-white',
    ghost: 'text-primary-purple hover:bg-primary-purple/10',
  };

  const sizes = {
    sm: 'px-4 py-2 text-sm rounded-md',
    md: 'px-6 py-3 text-base rounded-lg',
    lg: 'px-8 py-4 text-lg rounded-xl',
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
