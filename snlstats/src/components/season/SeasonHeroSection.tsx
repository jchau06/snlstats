"use client";

import React from "react";

interface SeasonHeroSectionProps {
  seasonNumber: number;
  yearStarted: number;
  yearEnded: number;
  numEpisodes: number;
  numCastMembers: number;
  avgViewership?: string;
  heroImageUrl: string;
  className?: string;
}

export function SeasonHeroSection({
  seasonNumber,
  yearStarted,
  yearEnded,
  numEpisodes,
  numCastMembers,
  avgViewership,
  heroImageUrl,
  className = "",
}: SeasonHeroSectionProps) {
  return (
    <div
      className={`relative w-full aspect-video md:aspect-auto md:h-[32rem] overflow-hidden rounded-lg ${className}`}
      style={{
        backgroundImage: `url(${heroImageUrl})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Dark Gradient Overlay - Ensures text readability */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent z-10 pointer-events-none" />

      {/* Content Overlay */}
      <div className="absolute inset-0 flex flex-col justify-end z-20">
        <div className="px-3 pb-4 sm:px-6 sm:pb-6 md:px-8 md:pb-8 lg:px-12 lg:pb-12">
          {/* Live Season Badge */}
          <div className="mb-3 sm:mb-4 md:mb-6 flex items-center gap-2">
            <span className="w-2 h-2 sm:w-2.5 sm:h-2.5 bg-primary rounded-full" />
            <span className="stat-label text-xs sm:text-xs md:text-sm uppercase font-mono">
              LIVE SEASON
            </span>
          </div>

          {/* Title */}
          <h1 className="font-heading text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-tertiary mb-2 sm:mb-3 md:mb-4 leading-tight">
            SEASON {seasonNumber}
          </h1>

          {/* Year Range */}
          <p className="text-[#B4B2A9] text-sm sm:text-base md:text-lg mb-4 sm:mb-6 md:mb-8">
            {yearStarted} - {yearEnded}
          </p>

          {/* Stats Row */}
          <div className="flex flex-wrap gap-4 sm:gap-6 md:gap-8 text-[10px] sm:text-xs md:text-sm">
            <div>
              <p className="stat-label uppercase mb-1">Episodes</p>
              <p className="font-mono font-bold text-tertiary">{numEpisodes}</p>
            </div>

            <div>
              <p className="stat-label uppercase mb-1">Cast Members</p>
              <p className="font-mono font-bold text-tertiary">
                {numCastMembers}
              </p>
            </div>

            {avgViewership && (
              <div>
                <p className="stat-label uppercase mb-1">Avg Viewership</p>
                <p className="font-mono font-bold text-tertiary">
                  {avgViewership}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}