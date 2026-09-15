"use client";

import React, { useState, useMemo } from "react";
import { EpisodeGrid } from "@/src/components/ui/EpisodeGrid";

interface Episode {
  id: string;
  seasonId: string;
  seasonNumber: number;
  episodeNumber: number;
  airDate: Date;
  host: string;
  musicalGuest: string;
  slug?: string;
  imageUrls?: string[];
}

interface Season {
  id: string;
  seasonNumber: number;
  yearStarted: number;
  yearEnded: number;
  numEpisodes: number;
  heroImageUrl?: string;
  isLive?: boolean;
}

interface SeasonEpisodesSectionProps {
  season: Season;
  episodes: Episode[];
  globalSort: "latest" | "oldest";
  isExpanded: boolean;
  onToggleExpanded: () => void;
}

type SeasonalSortType = "latest" | "oldest";

export function SeasonEpisodesSection({
  season,
  episodes,
  globalSort,
  isExpanded,
  onToggleExpanded,
}: SeasonEpisodesSectionProps) {
  const [seasonalSort, setSeasonalSort] = useState<SeasonalSortType>("latest");

  // Sort episodes based on global and seasonal sort preferences
  const sortedEpisodes = useMemo(() => {
    const sorted = [...episodes];

    // Use global sort as primary, seasonal sort overrides within section
    const effectiveSort = seasonalSort || globalSort;

    if (effectiveSort === "latest") {
      sorted.sort((a, b) => b.episodeNumber - a.episodeNumber);
    } else {
      sorted.sort((a, b) => a.episodeNumber - b.episodeNumber);
    }

    return sorted;
  }, [episodes, globalSort, seasonalSort]);

  if (!isExpanded) {
    return (
      <div className="border border-[#2C2C2A] rounded-lg overflow-hidden">
        <button
          onClick={onToggleExpanded}
          className="w-full bg-secondary/50 hover:bg-secondary/70 transition-colors p-6 flex items-center justify-between group"
        >
          {/* Left: Season Info */}
          <div className="flex items-center gap-4 text-left">
            <div className="flex items-center justify-center w-20 h-20 bg-primary rounded-lg">
              <span className="font-heading text-3xl font-bold text-neutral">
                {season.seasonNumber}
              </span>
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-heading text-h4 text-white font-bold">
                  Season {season.seasonNumber}
                </h3>
                {season.isLive && (
                  <span className="stat-label text-[10px] uppercase bg-primary text-neutral px-2 py-1 rounded-full font-bold">
                    Live Season
                  </span>
                )}
              </div>
              <p className="text-tertiary text-sm">
                {season.yearStarted}-{season.yearEnded} · {season.numEpisodes} Episodes
              </p>
            </div>
          </div>

          {/* Right: Expand Icon */}
          <svg
            className={`w-6 h-6 text-tertiary group-hover:text-primary transition-all duration-base ${
              isExpanded ? "rotate-180" : ""
            }`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 14l-7 7m0 0l-7-7m7 7V3"
            />
          </svg>
        </button>
      </div>
    );
  }

  // Expanded view
  return (
    <div className="border border-[#2C2C2A] rounded-lg overflow-hidden">
      {/* Header - Expanded */}
      <div className="bg-secondary/50 p-6 border-b border-[#2C2C2A]">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className="flex items-center justify-center w-20 h-20 bg-primary rounded-lg">
              <span className="font-heading text-3xl font-bold text-neutral">
                {season.seasonNumber}
              </span>
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-heading text-h4 text-white font-bold">
                  Season {season.seasonNumber}
                </h3>
                {season.isLive && (
                  <span className="stat-label text-[10px] uppercase bg-primary text-neutral px-2 py-1 rounded-full font-bold">
                    Live Season
                  </span>
                )}
              </div>
              <p className="text-tertiary text-sm">
                {season.yearStarted}-{season.yearEnded} · {season.numEpisodes} Episodes
              </p>
            </div>
          </div>

          <button
            onClick={onToggleExpanded}
            className="p-2 hover:bg-secondary/70 rounded-lg transition-colors"
          >
            <svg
              className="w-6 h-6 text-tertiary hover:text-primary transition-colors rotate-180"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 14l-7 7m0 0l-7-7m7 7V3"
              />
            </svg>
          </button>
        </div>

        {/* Season-level Sort Controls */}
        <div className="flex gap-2">
          <button
            onClick={() => setSeasonalSort("latest")}
            className={`px-3 py-2 rounded-sm font-mono text-xs uppercase font-bold transition-colors ${
              seasonalSort === "latest"
                ? "bg-primary text-neutral"
                : "bg-neutral border border-secondary text-tertiary hover:border-primary"
            }`}
          >
            Latest
          </button>
          <button
            onClick={() => setSeasonalSort("oldest")}
            className={`px-3 py-2 rounded-sm font-mono text-xs uppercase font-bold transition-colors ${
              seasonalSort === "oldest"
                ? "bg-primary text-neutral"
                : "bg-neutral border border-secondary text-tertiary hover:border-primary"
            }`}
          >
            Oldest
          </button>
        </div>
      </div>

      {/* Episodes Grid - Using EpisodeGrid Component */}
      <div className="p-6">
        {sortedEpisodes.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-[#B4B2A9]">No episodes available</p>
          </div>
        ) : (
          <EpisodeGrid episodes={sortedEpisodes} />
        )}
      </div>
    </div>
  );
}