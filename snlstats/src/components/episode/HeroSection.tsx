// src/components/episode/HeroSection.tsx
'use client';

import React from 'react';
import { ImageCarousel } from './ImageCarousel';

interface CastMemberInfo {
  id: string;
  name: string;
  slug: string;
}

interface HeroSectionProps {
  images: string[];
  season: number;
  episode: number;
  airDate: Date;
  host: string;
  musicalGuest: string;
  liveFromNewYorkCast: CastMemberInfo[];
  backgroundImage?: string;
  className?: string;
}

export function HeroSection({
  images,
  season,
  episode,
  airDate,
  host,
  musicalGuest,
  liveFromNewYorkCast,
  backgroundImage,
  className = '',
}: HeroSectionProps) {
  const formattedDate = airDate.toLocaleDateString('en-US', {
    month: 'short',
    day: '2-digit',
    year: 'numeric',
  });

  const lfnyNames =
    liveFromNewYorkCast.length > 0
      ? liveFromNewYorkCast.map((c) => c.name).join(', ')
      : null;

  return (
    <div className={`relative w-full h-96 md:h-[500px] overflow-hidden rounded-lg ${className}`}>
      {/* Image Carousel - Full Coverage */}
      <ImageCarousel images={images} alt={`SNL S${season}E${episode}`} className="absolute inset-0" />

      {/* Dark Gradient Overlay - Ensures text readability */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent z-10" />

      {/* Episode Header - Bottom Left */}
      <div className="absolute bottom-8 left-8 z-20 max-w-md">
        {/* Air Date Badge */}
        <div className="mb-3 inline-block">
          <span className="bg-primary text-neutral font-mono font-bold text-xs px-3 py-1 rounded-full">
            AIRED: {formattedDate}
          </span>
        </div>

        {/* Season & Episode Title */}
        <h1 className="font-heading text-4xl md:text-5xl font-bold text-tertiary mb-4 leading-tight">
          SEASON {season}, EPISODE {episode}
        </h1>

        {/* Host & Guest Info */}
        <div className="flex flex-col gap-2">
          <div className="flex items-baseline gap-2">
            <span className="stat-label">HOST:</span>
            <span className="font-sans text-lg md:text-xl font-bold text-primary uppercase">
              {host}
            </span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="stat-label">MUSIC:</span>
            <span className="font-sans text-lg md:text-xl font-bold text-primary uppercase">
              {musicalGuest}
            </span>
          </div>
        </div>
      </div>

      {/* Live From New York Badge - Bottom Right */}
      {lfnyNames && (
        <div className="absolute bottom-8 right-8 z-20">
          <div className="border border-primary rounded-lg px-4 py-3 backdrop-blur-sm bg-black/20">
            <p className="stat-label text-xs mb-1">LIVE FROM NEW YORK</p>
            <p className="font-sans font-bold text-tertiary text-sm md:text-base whitespace-nowrap">
              {lfnyNames}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

// src/components/episode/LiveFromNewYorkBadge.tsx
// Updated version - text only (no headshots)

interface CastMemberInfo {
  id: string;
  name: string;
  slug: string;
}

interface LiveFromNewYorkBadgeProps {
  castMembers: CastMemberInfo[];
  className?: string;
}

export function LiveFromNewYorkBadge({
  castMembers,
  className = '',
}: LiveFromNewYorkBadgeProps) {
  if (!castMembers || castMembers.length === 0) {
    return null;
  }

  const names = castMembers.map((m) => m.name).join(', ');

  return (
    <div className={`bg-secondary border border-[#2C2C2A] rounded-lg p-6 ${className}`}>
      <p className="stat-label mb-3">LIVE FROM NEW YORK</p>
      <p className="font-sans font-semibold text-tertiary">{names}</p>
    </div>
  );
}