'use client';

import React from 'react';
import Link from 'next/link';

interface HeaderProps {
  className?: string;
}

export function Header({ className = '' }: HeaderProps) {
  return (
    <header
      className={`relative w-full bg-secondary/80 backdrop-blur-sm border-b border-[#2C2C2A] ${className}`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-[1fr_auto_1fr] items-center h-16">
          {/* Logo / Home */}
          <Link
            href="/"
            className="justify-self-start flex items-center gap-2 hover:opacity-80 transition-opacity duration-base flex-shrink-0"
          >
            <span className="font-heading text-lg font-bold text-tertiary hidden sm:inline">
              SNL STATS
            </span>
          </Link>

          {/* Navigation - Exactly centered */}
          <nav className="justify-self-center flex items-center gap-8">
            <Link
              href="/seasons"
              className="stat-label uppercase text-sm hover:text-primary transition-colors duration-base"
            >
              Seasons
            </Link>

            <Link
              href="/episodes"
              className="stat-label uppercase text-sm hover:text-primary transition-colors duration-base"
            >
              Episodes
            </Link>

            <Link
              href="/cast"
              className="stat-label uppercase text-sm hover:text-primary transition-colors duration-base"
            >
              Cast
            </Link>
          </nav>

          {/* Right-side spacer for symmetrical centering */}
          <div />
        </div>
      </div>
    </header>
  );
}