// src/components/cast/SeasonBySeasonTable.tsx
"use client";

import React from "react";
import Link from "next/link";

interface SeasonPerformanceData {
  seasonNumber: number;
  yearStarted: number;
  yearEnded: number;
  numEpisodes: number;
  role: string;
  totalAppearances: number;
  totalScreenTimeSeconds: number;
  averageScreenTimeSeconds: number;
  powerRankingSeason: number;
}

interface SeasonBySeasonTableProps {
  data: SeasonPerformanceData[];
  castMemberSlug: string;
  className?: string;
}

const formatScreenTime = (seconds: number): string => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = Math.round(seconds % 60);

  if (hours > 0) {
    return `${hours}:${String(minutes).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  }
  return `${minutes}:${String(secs).padStart(2, "0")}`;
};

export function SeasonBySeasonTable({
  data,
  castMemberSlug,
  className = "",
}: SeasonBySeasonTableProps) {
  if (!data || data.length === 0) {
    return (
      <div className="bg-secondary/80 backdrop-blur-sm border border-[#2C2C2A] p-6 rounded-lg">
        <p className="text-tertiary">No season data available</p>
      </div>
    );
  }

  // Sort by season number descending (newest first)
  const sortedData = [...data].sort((a, b) => b.seasonNumber - a.seasonNumber);

  return (
    <div className={`${className}`}>
      <div className="bg-secondary/80 backdrop-blur-sm border border-[#2C2C2A] p-6 rounded-lg">
        {/* Header */}
        <div className="mb-6">
          <h3 className="font-heading text-h3 text-white font-bold">
            Season-by-Season Performance
          </h3>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-secondary/50">
                <th className="text-left px-4 py-3 stat-label text-xs uppercase text-white/60">
                  Season
                </th>
                <th className="text-left px-4 py-3 stat-label text-xs uppercase text-white/60">
                  Role
                </th>
                <th className="text-center px-4 py-3 stat-label text-xs uppercase text-white/60">
                  Episodes
                </th>
                <th className="text-center px-4 py-3 stat-label text-xs uppercase text-white/60">
                  Total Screen Time
                </th>
                <th className="text-center px-4 py-3 stat-label text-xs uppercase text-white/60">
                  Avg Screen Time
                </th>
                <th className="text-center px-4 py-3 stat-label text-xs uppercase text-white/60">
                  Sketches
                </th>
                <th className="text-center px-4 py-3 stat-label text-xs uppercase text-white/60">
                  Avg PWR Rank
                </th>
              </tr>
            </thead>
            <tbody>
              {sortedData.map((row, idx) => (
                <tr
                  key={`${row.seasonNumber}-${idx}`}
                  className="border-b border-secondary/30 hover:bg-secondary/30 transition-colors"
                >
                  <td className="px-4 py-4">
                    <Link
                      href={`/cast/${castMemberSlug}/${row.yearStarted}-${row.yearEnded}`}
                      className="font-heading text-lg font-bold text-primary hover:text-tertiary transition-colors underline"
                    >
                      {row.yearStarted}-{row.yearEnded}
                    </Link>
                  </td>
                  <td className="px-4 py-4 font-mono text-sm text-tertiary uppercase">
                    {row.role}
                  </td>
                  <td className="px-4 py-4 text-center font-mono text-sm text-white">
                    {row.numEpisodes}
                  </td>
                  <td className="px-4 py-4 text-center font-mono text-sm text-white">
                    {formatScreenTime(row.totalScreenTimeSeconds)}
                  </td>
                  <td className="px-4 py-4 text-center font-mono text-sm text-white">
                    {formatScreenTime(row.averageScreenTimeSeconds)}
                  </td>
                  <td className="px-4 py-4 text-center font-mono text-sm text-white">
                    {row.totalAppearances}
                  </td>
                  <td className="px-4 py-4 text-center font-mono text-sm text-primary font-bold">
                    {row.powerRankingSeason.toFixed(1)}
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