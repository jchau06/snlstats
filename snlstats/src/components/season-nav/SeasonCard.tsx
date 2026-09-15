// src/components/seasons-nav/SeasonCard.tsx
"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";

interface Season {
  id: string;
  seasonNumber: number;
  yearStarted: number;
  yearEnded: number;
  numEpisodes: number;
  heroImageUrl?: string;
  navImageUrl?: string;
  isLive?: boolean;
}

interface SeasonCardProps {
  season: Season;
}

export function SeasonCard({ season }: SeasonCardProps) {
  const seasonLink = `/seasons/${season.seasonNumber}`;

  return (
    <Link href={seasonLink} className="group">
      <div className="relative overflow-hidden rounded-lg border border-[#2C2C2A] hover:border-primary transition-colors duration-base h-80">
        {/* Background Image */}
        {season.navImageUrl ? (
          <Image
            src={season.navImageUrl}
            alt={`Season ${season.seasonNumber}`}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover group-hover:scale-105 transition-transform duration-base"
            priority={false}
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-secondary to-secondary/50 flex items-center justify-center">
            <span className="text-[#8A8885] text-lg">Season {season.seasonNumber}</span>
          </div>
        )}

        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

        {/* Live Badge */}
        {season.isLive && (
          <div className="absolute top-4 left-4">
            <div className="flex items-center gap-2 bg-primary text-neutral px-3 py-1 rounded-full">
              <div className="w-2 h-2 bg-neutral rounded-full animate-pulse" />
              <span className="font-mono text-xs uppercase font-bold">Live Now</span>
            </div>
          </div>
        )}

        {/* Content - Bottom */}
        <div className="absolute bottom-0 left-0 right-0 p-6">
          <div className="space-y-3">
            {/* Season Number and Title */}
            <div>
              <h3 className="font-heading text-2xl font-bold text-white group-hover:text-primary transition-colors duration-base">
                Season {season.seasonNumber}
              </h3>
            </div>

            {/* Year Range */}
            <p className="font-mono text-sm text-tertiary">
              {season.yearStarted}-{season.yearEnded}
            </p>

            {/* Episode Count Badge */}
            <div className="inline-block">
              <span className="font-mono text-xs uppercase font-bold text-tertiary border border-secondary px-3 py-2 rounded-sm">
                {season.numEpisodes} Episodes
              </span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}