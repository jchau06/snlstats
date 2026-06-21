import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  clickable?: boolean;
  hover?: 'glow' | 'none';
}
 
export function Card({
  children,
  className = '',
  clickable = false,
  hover = 'glow',
}: CardProps) {
  const hoverStyles =
    hover === 'glow'
      ? 'hover:border-primary hover:shadow-gold transition-all duration-base'
      : '';
 
  const clickableStyles = clickable ? 'cursor-pointer' : '';
 
  return (
    <div
      className={`bg-secondary border border-[#2C2C2A] rounded-lg p-6 ${hoverStyles} ${clickableStyles} ${className}`}
    >
      {children}
    </div>
  );
}
