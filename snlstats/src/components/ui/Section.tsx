import React from 'react';
import { Heading } from "./Heading";

interface SectionProps {
  title?: string;
  subtitle?: string;
  children: React.ReactNode;
  className?: string;
  accent?: boolean;
}
 
export function Section({
  title,
  subtitle,
  children,
  className = '',
  accent = false,
}: SectionProps) {
  return (
    <section className={`py-12 ${className}`}>
      {title && (
        <Heading level={2} accent={accent} className="mb-2">
          {title}
        </Heading>
      )}
      {subtitle && (
        <p className="text-[#B4B2A9] text-lg mb-8 font-sans">{subtitle}</p>
      )}
      {children}
    </section>
  );
}
