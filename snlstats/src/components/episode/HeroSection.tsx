"use client";

import React from "react";
import { ImageCarousel } from "./ImageCarousel";
import { EpisodeHeader } from "./EpisodeHeader";

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
  liveFromNewYorkCast?: CastMemberInfo[];
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
  className = "",
}: HeroSectionProps) {
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

      {/* Episode Header Overlay */}
      <div className="absolute inset-0 flex flex-col justify-end">
        <EpisodeHeader
          season={season}
          episode={episode}
          airDate={airDate}
          host={host}
          musicalGuest={musicalGuest}
        />
      </div>
    </div>
  );
}