// src/components/cast/SeasonStatsSummary.tsx
"use client";

import React from "react";

interface SeasonStatsSummaryProps {
  totalAppearances: number;
  averageAppearances: number;
  totalScreenTimeSeconds: number;
  averageScreenTimeSeconds: number;
  averagePowerRanking: number;
  lfnyCount?: number;
  seasonNumber?: number;
  className?: string;
}

// Format seconds to MM:SS (rounded to nearest second)
function formatScreenTime(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = Math.round(seconds % 60);

  if (hours > 0) {
    return `${hours}H ${minutes}M`;
  }
  return `${minutes}M ${secs}S`;
}

export function SeasonStatsSummary({
  totalAppearances,
  averageAppearances,
  totalScreenTimeSeconds,
  averageScreenTimeSeconds,
  averagePowerRanking,
  lfnyCount = 0,
  seasonNumber,
  className = "",
}: SeasonStatsSummaryProps) {
  return (
    <div className={`w-full bg-neutral py-8 md:py-12 ${className}`}>
      <div className="max-w-6xl mx-auto px-4 md:px-8">
        {/* Section Header */}
        <h2 className="font-heading text-4xl md:text-5xl font-bold text-tertiary mb-8">
          {seasonNumber ? `Season ${seasonNumber} Stats` : "Season Stats"}
        </h2>

        {/* Stats Grid - 2-3 columns responsive */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Total Segments */}
          <div className="border border-secondary/50 px-6 py-6 rounded-sm bg-secondary/20">
            <p className="stat-label text-xs uppercase mb-3 text-white/60">
              Total Segments
            </p>
            <p className="font-mono text-3xl md:text-4xl font-bold text-white">
              {totalAppearances}
            </p>
          </div>

          {/* Segments Per Episode */}
          <div className="border border-secondary/50 px-6 py-6 rounded-sm bg-secondary/20">
            <p className="stat-label text-xs uppercase mb-3 text-white/60">
              Segments / EP
            </p>
            <p className="font-mono text-3xl md:text-4xl font-bold text-white">
              {averageAppearances.toFixed(2)}
            </p>
          </div>

          {/* Live From New York's */}
          <div className="border border-secondary/50 px-6 py-6 rounded-sm bg-secondary/20">
            <p className="stat-label text-xs uppercase mb-3 text-white/60">
              Live From NY&apos;s
            </p>
            <p className="font-mono text-3xl md:text-4xl font-bold text-white">
              {lfnyCount}
            </p>
          </div>

          {/* Total Screen Time */}
          <div className="border border-secondary/50 px-6 py-6 rounded-sm bg-secondary/20">
            <p className="stat-label text-xs uppercase mb-3 text-white/60">
              Total Screen Time
            </p>
            <p className="font-mono text-3xl md:text-4xl font-bold text-white">
              {formatScreenTime(totalScreenTimeSeconds)}
            </p>
          </div>

          {/* Average Screen Time */}
          <div className="border border-secondary/50 px-6 py-6 rounded-sm bg-secondary/20">
            <p className="stat-label text-xs uppercase mb-3 text-white/60">
              Avg Screen Time / EP
            </p>
            <p className="font-mono text-3xl md:text-4xl font-bold text-white">
              {formatScreenTime(averageScreenTimeSeconds)}
            </p>
          </div>

          {/* Average Power Ranking */}
          <div className="border border-secondary/50 px-6 py-6 rounded-sm bg-secondary/20">
            <p className="stat-label text-xs uppercase mb-3 text-white/60">
              Avg PWR Rank
            </p>
            <p className="font-mono text-3xl md:text-4xl font-bold text-primary">
              {averagePowerRanking.toFixed(2)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}