"use client";

import React from "react";
import { ImageCarousel } from "./ImageCarousel";

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
  // liveFromNewYorkCast,
  // backgroundImage,
  className = "",
}: HeroSectionProps) {
  const formattedDate = airDate.toLocaleDateString("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
  });

  return (
    <div
      className={`relative w-full aspect-video md:aspect-auto md:h-screen overflow-hidden rounded-lg ${className}`}
    >
      {/* Image Carousel - Full Coverage */}
      <ImageCarousel
        images={images}
        alt={`SNL S${season}E${episode}`}
        className="absolute inset-0 w-full h-full"
      />

      {/* Dark Gradient Overlay - Ensures text readability */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent z-10 pointer-events-none" />

      {/* Content Container - Flexbox for proper bottom alignment */}
      <div className="absolute inset-0 z-20 flex flex-col justify-end px-4 pb-6 sm:px-6 sm:pb-8 md:px-12 md:pb-12 pointer-events-none">
        <div className="flex flex-col md:flex-row justify-between items-end gap-4 sm:gap-6 md:gap-8">
          {/* Left Column */}
          <div className="w-full sm:max-w-2.5xl">
            <div className="mb-2 sm:mb-3 inline-block">
              <span className="text-white font-mono font-bold text-xs rounded-full">
                AIRED: {formattedDate}
              </span>
            </div>

            <h1 className="font-heading text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-tertiary mb-4 sm:mb-6 md:mb-8 leading-tight">
              SEASON {season}, EPISODE {episode}
            </h1>

            <div className="flex flex-col gap-3 sm:gap-4 md:gap-6">
              <div className="flex flex-col sm:flex-row sm:items-baseline gap-2 sm:gap-3">
                <span className="stat-label uppercase text-xs sm:text-sm whitespace-nowrap">
                  HOST:
                </span>
                <span className="font-sans text-lg sm:text-xl md:text-2xl font-bold text-primary uppercase break-words">
                  {host}
                </span>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-baseline gap-2 sm:gap-3">
                <span className="stat-label uppercase text-xs sm:text-sm whitespace-nowrap">
                  MUSIC:
                </span>
                <span className="font-sans text-lg sm:text-xl md:text-2xl font-bold text-primary uppercase break-words">
                  {musicalGuest}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}