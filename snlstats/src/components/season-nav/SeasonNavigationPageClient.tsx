// src/components/seasons-nav/SeasonNavigationPageClient.tsx
"use client";

import React, { useState, useMemo } from "react";
import { SeasonCard } from "./SeasonCard";

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

interface SeasonNavigationPageClientProps {
  seasons: Season[];
  currentVersion?: "us" | "uk";
}

type GlobalSortType = "latest" | "oldest";
type VersionType = "us" | "uk";

export function SeasonNavigationPageClient({
  seasons,
  currentVersion = "us",
}: SeasonNavigationPageClientProps) {
  const [globalSort, setGlobalSort] = useState<GlobalSortType>("latest");
  const [version, setVersion] = useState<VersionType>(currentVersion);

  // Sort seasons based on global sort
  const sortedSeasons = useMemo(() => {
    const sorted = [...seasons];

    if (globalSort === "latest") {
      sorted.sort((a, b) => b.seasonNumber - a.seasonNumber);
    } else {
      sorted.sort((a, b) => a.seasonNumber - b.seasonNumber);
    }

    return sorted;
  }, [seasons, globalSort]);

  // Get version label
  const getVersionLabel = (): string => {
    return version === "us" ? "US VERSION - RECENT" : "UK VERSION - RECENT";
  };

  // Get version dropdown label
  const getVersionDropdownLabel = (): string => {
    return version === "us" ? "US VERSION (NBC)" : "UK VERSION";
  };

  return (
    <div className="space-y-8">
      {/* Header with Controls */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <h1 className="font-heading text-4xl md:text-5xl font-bold text-primary">
          SEASONS
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
            <option value="us">{getVersionDropdownLabel()}</option>
            <option value="uk">UK VERSION</option>
          </select>
        </div>
      </div>

      {/* Version Label */}
      <div className="border-b border-secondary/30 pb-6">
        <h2 className="font-mono text-sm uppercase tracking-wide text-tertiary font-bold">
          {getVersionLabel()}
        </h2>
      </div>

      {/* Seasons Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sortedSeasons.map((season) => (
          <SeasonCard key={season.id} season={season} />
        ))}
      </div>
    </div>
  );
}