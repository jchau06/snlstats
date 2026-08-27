'use client';

import React from 'react';

interface EpisodeHeaderProps {
  season: number;
  episode: number;
  airDate: Date;
  host: string;
  musicalGuest: string;
  className?: string;
}

export function EpisodeHeader({
  season,
  episode,
  airDate,
  host,
  musicalGuest,
  className = '',
}: EpisodeHeaderProps) {
  const formattedDate = airDate.toLocaleDateString('en-US', {
    month: 'short',
    day: '2-digit',
    year: 'numeric',
  });

  return (
    <div
      className={`relative z-20 flex flex-col justify-end px-3 pb-4 sm:px-6 sm:pb-6 md:px-8 md:pb-8 lg:px-12 lg:pb-12 pointer-events-none ${className}`}
    >
      <div className="flex flex-col md:flex-row justify-between items-end gap-3 sm:gap-4 md:gap-6 lg:gap-8">
        {/* Left Column */}
        <div className="w-full sm:max-w-2.5xl">
          <div className="mb-1 sm:mb-2 md:mb-3 inline-block">
            <span className="text-white font-mono font-bold text-xs sm:text-xs md:text-sm rounded-full">
              AIRED: {formattedDate}
            </span>
          </div>

          <h1 className="font-heading text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-tertiary mb-2 sm:mb-3 md:mb-4 lg:mb-8 leading-tight">
            SEASON {season}, EPISODE {episode}
          </h1>

          <div className="flex flex-col gap-2 sm:gap-3 md:gap-4 lg:gap-6">
            <div className="flex flex-col sm:flex-row sm:items-baseline gap-1.5 sm:gap-2 md:gap-3">
              <span className="stat-label uppercase text-xs sm:text-xs md:text-sm lg:text-base whitespace-nowrap">
                HOST:
              </span>
              <span className="font-sans text-base sm:text-lg md:text-xl lg:text-2xl font-bold text-primary uppercase break-words">
                {host}
              </span>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-baseline gap-1.5 sm:gap-2 md:gap-3">
              <span className="stat-label uppercase text-xs sm:text-xs md:text-sm lg:text-base whitespace-nowrap">
                MUSIC:
              </span>
              <span className="font-sans text-base sm:text-lg md:text-xl lg:text-2xl font-bold text-primary uppercase break-words">
                {musicalGuest}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}