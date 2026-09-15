// src/components/cast/EpisodeStatsTable.tsx
"use client";

import React, { useState } from "react";
import Link from "next/link";

interface EpisodeData {
  seasonNumber: number;
  episodeNumber: number;
  hostMusicalGuest: string;
  airDate: string;
  powerRanking: number;
  screenTimeSeconds: number;
  segmentCount: number;
  castRank: number;
  totalCastInEpisode: number;
}

interface EpisodeStatsTableProps {
  data: EpisodeData[];
  className?: string;
}

type SortType = "latest" | "oldest";

const formatScreenTime = (seconds: number): string => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = Math.round(seconds % 60);

  if (hours > 0) {
    return `${hours}:${String(minutes).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  }
  return `${minutes}:${String(secs).padStart(2, "0")}`;
};

const formatDate = (dateStr: string): string => {
  const [year, month, day] = dateStr.split("-");
  return `${month}.${day}.${year.slice(-2)}`;
};

export function EpisodeStatsTable({
  data,
  className = "",
}: EpisodeStatsTableProps) {
  const [sortBy, setSortBy] = useState<SortType>("latest");

  if (!data || data.length === 0) {
    return (
      <div className="bg-secondary/80 backdrop-blur-sm border border-[#2C2C2A] p-6 rounded-lg">
        <p className="text-tertiary">No episode data available</p>
      </div>
    );
  }

  // Sort by episode number based on sortBy
  const sortedData = [...data].sort((a, b) => {
    if (sortBy === "latest") {
      return b.episodeNumber - a.episodeNumber;
    } else {
      return a.episodeNumber - b.episodeNumber;
    }
  });

  return (
    <div className={`${className}`}>
      <div className="bg-secondary/80 backdrop-blur-sm border border-[#2C2C2A] p-6 rounded-lg">
        {/* Header */}
        <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h3 className="font-heading text-h3 text-white font-bold">
              Episode-by-Episode Performance
            </h3>
            <p className="stat-label mt-2 text-xs uppercase">Season Log</p>
          </div>

          {/* Sort Dropdown */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as SortType)}
            className="bg-neutral border border-secondary text-tertiary px-3 py-2 rounded-sm font-mono text-xs uppercase hover:border-primary transition-colors cursor-pointer"
          >
            <option value="latest">Latest</option>
            <option value="oldest">Oldest</option>
          </select>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-secondary/50">
                <th className="text-left px-4 py-3 stat-label text-xs uppercase text-white/60">
                  Episode
                </th>
                <th className="text-left px-4 py-3 stat-label text-xs uppercase text-white/60">
                  Host / Musical Guest
                </th>
                <th className="text-center px-4 py-3 stat-label text-xs uppercase text-white/60">
                  Air Date
                </th>
                <th className="text-center px-4 py-3 stat-label text-xs uppercase text-white/60">
                  Screen Time
                </th>
                <th className="text-center px-4 py-3 stat-label text-xs uppercase text-white/60">
                  Segment Count
                </th>
                <th className="text-center px-4 py-3 stat-label text-xs uppercase text-white/60">
                  Raw PWR Score
                </th>
              </tr>
            </thead>
            <tbody>
              {sortedData.map((row, idx) => (
                <tr
                  key={`${row.episodeNumber}-${idx}`}
                  className="border-b border-secondary/30 hover:bg-secondary/30 transition-colors"
                >
                  <td className="px-4 py-4 font-mono text-sm font-bold text-white">
                    {row.seasonNumber}.{String(row.episodeNumber).padStart(2, "0")}
                  </td>
                  <td className="px-4 py-4">
                    <Link
                      href={`/seasons/${row.seasonNumber}/episodes/${row.episodeNumber}`}
                      className="font-mono text-sm text-primary hover:text-tertiary transition-colors uppercase"
                    >
                      {row.hostMusicalGuest}
                    </Link>
                  </td>
                  <td className="px-4 py-4 text-center font-mono text-sm text-white/80">
                    {formatDate(row.airDate)}
                  </td>
                  <td className="px-4 py-4 text-center font-mono text-sm text-white">
                    {formatScreenTime(row.screenTimeSeconds)}
                  </td>
                  <td className="px-4 py-4 text-center font-mono text-sm text-white">
                    {row.segmentCount}
                  </td>
                  <td className="px-4 py-4 text-center font-mono text-sm text-primary font-bold">
                    {row.powerRanking.toFixed(1)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}