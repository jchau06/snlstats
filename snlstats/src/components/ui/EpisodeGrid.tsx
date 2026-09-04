"use client";

import React from "react";
import Link from "next/link";

interface Episode {
  id: string;
  seasonNumber: number;
  episodeNumber: number;
  airDate: Date;
  host: string;
  musicalGuest: string;
  slug?: string;
}

interface EpisodeGridProps {
  episodes: Episode[];
  className?: string;
}

export function EpisodeGrid({
  episodes,
  className = "",
}: EpisodeGridProps) {
  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "2-digit",
      year: "numeric",
    });
  };

  const getEpisodeLink = (episode: Episode): string => {
    return `/seasons/${episode.seasonNumber}/episodes/${episode.episodeNumber}`;
  };

  if (!episodes || episodes.length === 0) {
    return (
      <div className={`text-center py-12 ${className}`}>
        <p className="text-[#B4B2A9]">No episodes available</p>
      </div>
    );
  }

  return (
    <div
      className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 ${className}`}
    >
      {episodes.map((episode) => (
        <Link
          key={episode.id}
          href={getEpisodeLink(episode)}
          className="group"
        >
          <div className="border border-[#2C2C2A] rounded-lg p-4 sm:p-6 bg-black/40 hover:bg-black/60 hover:border-primary transition-all duration-base cursor-pointer h-full flex flex-col">
            {/* Header */}
            <div className="flex justify-between items-start mb-3 sm:mb-4">
              <span className="stat-label text-xs uppercase font-mono">
                EPISODE {episode.episodeNumber}
              </span>
              <span className="text-[#B4B2A9] text-xs font-mono">
                {formatDate(episode.airDate)}
              </span>
            </div>

            {/* Host & Musical Guest */}
            <div className="flex-1 flex flex-col gap-3 sm:gap-4">
              <div>
                <p className="stat-label text-xs mb-1 uppercase">HOST</p>
                <p className="font-sans font-bold text-tertiary text-base sm:text-lg group-hover:text-primary transition-colors duration-base">
                  {episode.host}
                </p>
              </div>

              <div>
                <p className="stat-label text-xs mb-1 uppercase">MUSICAL GUEST</p>
                <p className="font-sans font-bold text-tertiary text-base sm:text-lg group-hover:text-primary transition-colors duration-base">
                  {episode.musicalGuest}
                </p>
              </div>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}