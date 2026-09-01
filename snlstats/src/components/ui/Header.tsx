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
        <div className="flex items-center justify-between h-16">
          {/* Logo / Home */}
          <Link
            href="/"
            className="flex items-center gap-2 hover:opacity-80 transition-opacity duration-base flex-shrink-0"
          >
            {/* Stylized SNL logo */}
            <div className="w-10 h-10 bg-primary rounded-sm flex items-center justify-center">
              <svg
                viewBox="0 0 24 24"
                className="w-6 h-6 text-neutral"
                fill="currentColor"
              >
                {/* Simplified stage/spotlight icon */}
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2m0 18c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8m3.5-9c.83 0 1.5-.67 1.5-1.5S16.33 8 15.5 8 14 8.67 14 9.5s.67 1.5 1.5 1.5m-7 0c.83 0 1.5-.67 1.5-1.5S9.33 8 8.5 8 7 8.67 7 9.5 7.67 11 8.5 11m3.5 6.5c2.33 0 4.31-1.46 5.11-3.5H6.89c.8 2.04 2.78 3.5 5.11 3.5z" />
              </svg>
            </div>
            <span className="font-heading text-lg font-bold text-tertiary hidden sm:inline">
              SNL STATS
            </span>
          </Link>

          {/* Navigation - Centered */}
          <nav className="flex items-center gap-8">
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

          {/* Spacer for balance */}
          <div className="w-10 flex-shrink-0" />
        </div>
      </div>
    </header>
  );
}