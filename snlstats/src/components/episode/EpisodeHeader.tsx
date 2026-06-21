'use client';
 
import React from 'react';
import { Badge } from '../ui';
import Image from 'next/image' 

interface EpisodeHeaderProps {
  season: number;
  episode: number;
  airDate: Date;
  host: string;
  musicalGuest: string;
  backgroundImage?: string;
  className?: string;
}
 
export function EpisodeHeader({
  season,
  episode,
  airDate,
  host,
  musicalGuest,
  backgroundImage,
  className = '',
}: EpisodeHeaderProps) {
  const formattedDate = airDate.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
 
  return (
    <div className={`relative w-full py-12 md:py-16 ${className}`}>
      {/* Background Image with Overlay */}
      {backgroundImage && (
        <div className="absolute inset-0 -z-10 overflow-hidden rounded-lg">
          <Image
            src={backgroundImage}
            alt="Episode background"
            fill
            className="w-full h-full object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = 'none';
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-black/80" />
        </div>
      )}
 
      {/* Content */}
      <div className="relative z-10">
        {/* Air Date Badge */}
        <div className="mb-4 flex items-center gap-2">
          <Badge label={`AIRED: ${formattedDate}`} variant="primary" size="md" />
        </div>
 
        {/* Episode Title */}
        <h1 className="font-heading text-5xl md:text-6xl font-bold text-tertiary mb-2">
          SEASON {season}. EPISODE {episode}
        </h1>
 
        {/* Host & Guest Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
          <div>
            <p className="stat-label mb-2">Host</p>
            <p className="font-sans text-2xl md:text-3xl font-bold text-primary uppercase">
              {host}
            </p>
          </div>
          <div>
            <p className="stat-label mb-2">Musical Guest</p>
            <p className="font-sans text-2xl md:text-3xl font-bold text-primary uppercase">
              {musicalGuest}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}