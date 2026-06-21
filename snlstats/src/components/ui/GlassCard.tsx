import React from 'react';

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
}
 
export function GlassCard({ children, className = '' }: GlassCardProps) {
  return (
    <div
      className={`backdrop-blur-md bg-opacity-80 bg-secondary border border-opacity-20 border-primary rounded-lg p-6 ${className}`}
    >
      {children}
    </div>
  );
}
