"use client";

import React, { useState, useMemo } from "react";
import { SeasonEpisodesSection } from "./SeasonEpisodesSection";

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

interface EpisodesPageClientProps {
  seasons: Season[];
  episodes: Episode[];
  currentVersion?: "us" | "uk";
}

type GlobalSortType = "latest" | "oldest";
type VersionType = "us" | "uk";

export function EpisodesPageClient({
  seasons,
  episodes,
  currentVersion = "us",
}: EpisodesPageClientProps) {
  const [globalSort, setGlobalSort] = useState<GlobalSortType>("latest");
  const [version, setVersion] = useState<VersionType>(currentVersion);
  const [expandedSeasons, setExpandedSeasons] = useState<Set<string>>(
    new Set()
  );

  const toggleSeasonExpanded = (seasonId: string) => {
    setExpandedSeasons((prev) => {
      const next = new Set(prev);
      if (next.has(seasonId)) {
        next.delete(seasonId);
      } else {
        next.add(seasonId);
      }
      return next;
    });
  };

  // Group episodes by season
  const episodesBySeasonId = useMemo(() => {
    const grouped = new Map<string, Episode[]>();
    episodes.forEach((ep) => {
      if (!grouped.has(ep.seasonId)) {
        grouped.set(ep.seasonId, []);
      }
      grouped.get(ep.seasonId)!.push(ep);
    });
    return grouped;
  }, [episodes]);

  // Sort seasons in descending order (newest first)
  const sortedSeasons = useMemo(() => {
    return [...seasons].sort((a, b) => b.seasonNumber - a.seasonNumber);
  }, [seasons]);

  return (
    <div className="space-y-8">
      {/* Header with Controls */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <h1 className="font-heading text-4xl md:text-5xl font-bold text-white">
          EPISODES
        </h1>

        {/* Controls */}
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Sort Buttons */}
          <div className="flex gap-2">
            <button
              onClick={() => setGlobalSort("latest")}
              className={`px-4 py-2 rounded-sm font-mono text-xs uppercase font-bold transition-colors whitespace-nowrap ${
                globalSort === "latest"
                  ? "bg-primary text-neutral"
                  : "bg-neutral border border-secondary text-tertiary hover:border-primary"
              }`}
            >
              Latest First
            </button>
            <button
              onClick={() => setGlobalSort("oldest")}
              className={`px-4 py-2 rounded-sm font-mono text-xs uppercase font-bold transition-colors whitespace-nowrap ${
                globalSort === "oldest"
                  ? "bg-primary text-neutral"
                  : "bg-neutral border border-secondary text-tertiary hover:border-primary"
              }`}
            >
              Oldest First
            </button>
          </div>

          {/* Version Selector */}
          <select
            value={version}
            onChange={(e) => setVersion(e.target.value as VersionType)}
            className="bg-neutral border border-secondary text-tertiary px-4 py-2 rounded-sm font-mono text-xs uppercase font-bold hover:border-primary transition-colors cursor-pointer"
          >
            <option value="us">US Version (NBC)</option>
            <option value="uk">UK Version</option>
          </select>
        </div>
      </div>

      {/* Seasons */}
      <div className="space-y-6">
        {sortedSeasons.map((season) => (
          <SeasonEpisodesSection
            key={season.id}
            season={season}
            episodes={episodesBySeasonId.get(season.id) || []}
            globalSort={globalSort}
            isExpanded={expandedSeasons.has(season.id)}
            onToggleExpanded={() => toggleSeasonExpanded(season.id)}
          />
        ))}
      </div>
    </div>
  );
}