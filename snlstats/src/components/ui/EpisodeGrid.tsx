"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";

interface Episode {
  id: string;
  seasonNumber: number;
  episodeNumber: number;
  airDate: Date;
  host: string;
  musicalGuest: string;
  slug?: string;
  imageUrls?: string[];
}

interface EpisodeGridProps {
  episodes: Episode[];
  className?: string;
}

export function EpisodeGrid({
  episodes,
  className = "",
}: EpisodeGridProps) {
  const [showAll, setShowAll] = useState(false);

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      month: "2-digit",
      day: "2-digit",
      year: "2-digit",
    });
  };

  const getEpisodeLink = (episode: Episode): string => {
    return `/seasons/${episode.seasonNumber}/episodes/${episode.episodeNumber}`;
  };

  const isDoubleDuty = (episode: Episode): boolean => {
    return (
      episode.host.toLowerCase() ===
      episode.musicalGuest.toLowerCase()
    );
  };

  if (!episodes || episodes.length === 0) {
    return (
      <div className={`text-center py-12 ${className}`}>
        <p className="text-[#B4B2A9]">No episodes available</p>
      </div>
    );
  }

  const displayedEpisodes = showAll ? episodes : episodes.slice(0, 8);

  return (
    <div className={className}>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
        {displayedEpisodes.map((episode) => (
          <Link
            key={episode.id}
            href={getEpisodeLink(episode)}
            className="group"
          >
            <div className="flex flex-col h-full cursor-pointer">
              {/* Episode Header Badge + Date */}
              <div className="flex items-center justify-between mb-2 sm:mb-3 px-1">
                <span className="stat-label text-[10px] sm:text-xs uppercase font-mono bg-[#3A3A38] rounded-full px-2 py-0.5">
                  E{episode.episodeNumber}
                </span>
                <span className="text-[#8A8885] text-[10px] sm:text-xs font-mono">
                  {formatDate(episode.airDate)}
                </span>
              </div>

              {/* Image Container */}
              <div className="relative w-full aspect-video mb-3 sm:mb-4 overflow-hidden rounded-lg bg-[#222222] border border-[#2C2C2A] group-hover:border-primary transition-all duration-base">
                {episode.imageUrls && episode.imageUrls.length > 0 ? (
                  <Image
                    src={episode.imageUrls[0]}
                    alt={`${episode.host} - ${episode.musicalGuest}`}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-base"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src =
                        'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 225"%3E%3Crect fill="%23222222" width="400" height="225"/%3E%3C/svg%3E';
                    }}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-[#8A8885] text-xs">
                    No image
                  </div>
                )}
              </div>

              {/* Host / Musical Guest */}
              <div className="text-center">
                {isDoubleDuty(episode) ? (
                  <p className="font-sans font-bold text-tertiary text-xs sm:text-sm group-hover:text-primary transition-colors duration-base line-clamp-1">
                    {episode.host}
                  </p>
                ) : (
                  <>
                    <p className="font-sans font-bold text-tertiary text-xs sm:text-sm group-hover:text-primary transition-colors duration-base line-clamp-1">
                      {episode.host}
                    </p>
                    <p className="text-[#8A8885] text-[10px] sm:text-xs line-clamp-1">
                      {episode.musicalGuest}
                    </p>
                  </>
                )}
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Expand/Collapse Button */}
      {episodes.length > 8 && (
        <div className="mt-6 sm:mt-8 text-center">
          <button
            onClick={() => setShowAll(!showAll)}
            className="text-primary hover:text-tertiary font-sans font-semibold text-sm transition-colors duration-base"
          >
            {showAll
              ? "See first 8 episodes"
              : `See all ${episodes.length} episodes`}
          </button>
        </div>
      )}
    </div>
  );
}