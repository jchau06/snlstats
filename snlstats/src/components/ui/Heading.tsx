import React from 'react';

interface HeadingProps {
  level: 1 | 2 | 3 | 4 | 5;
  children: React.ReactNode;
  className?: string;
  accent?: boolean;
}
 
export function Heading({
  level,
  children,
  className = '',
  accent = false,
}: HeadingProps) {
  const accentClass = accent ? 'text-primary' : 'text-tertiary';
 
  const styles: Record<
    number,
    { className: string; tag: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' }
  > = {
    1: {
      tag: 'h1',
      className: `font-heading text-h1 font-bold leading-tight ${accentClass}`,
    },
    2: {
      tag: 'h2',
      className: `font-heading text-h2 font-bold leading-tight ${accentClass}`,
    },
    3: {
      tag: 'h3',
      className: `font-subheading text-h3 font-bold leading-snug ${accentClass}`,
    },
    4: {
      tag: 'h4',
      className: `font-subheading text-h4 font-bold leading-snug ${accentClass}`,
    },
    5: {
      tag: 'h5',
      className: `font-subheading text-h5 font-bold leading-snug ${accentClass}`,
    },
  };
 
  const { tag: Tag, className: baseClass } = styles[level];
 
  return (
    <Tag className={`${baseClass} ${className}`}>
      {children}
    </Tag>
  );
}
