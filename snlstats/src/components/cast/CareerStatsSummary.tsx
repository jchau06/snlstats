"use client";

import React from "react";

interface CareerStatsSummaryProps {
  totalAppearances: number;
  averageAppearancesPerEp: number;
  totalLiveFromNewYorks: number;
  totalScreenTimeSeconds: number;
  averageScreenTimeSeconds: number;
  averagePowerRanking: number;
  className?: string;
}

// Format seconds to HH:MM:SS (only show hours if > 0)
function formatScreenTime(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);

  if (hours > 0) {
    return `${hours}H ${minutes}M`;
  }
  return `${minutes}M ${secs}S`;
}

export function CareerStatsSummary({
  totalAppearances,
  averageAppearancesPerEp,
  totalLiveFromNewYorks,
  totalScreenTimeSeconds,
  averageScreenTimeSeconds,
  averagePowerRanking,
  className = "",
}: CareerStatsSummaryProps) {
  return (
    <div className={`w-full bg-neutral py-8 md:py-12 ${className}`}>
      <div className="max-w-6xl mx-auto px-4 md:px-8">
        {/* Section Header */}
        <h2 className="font-heading text-4xl md:text-5xl font-bold text-tertiary mb-8">
          Career Stats
        </h2>

        {/* Stats Grid - 2-3 columns responsive */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Total Segments */}
          <div className="border border-secondary/50 px-6 py-6 rounded-sm bg-secondary/20">
            <p className="stat-label text-xs uppercase mb-3 text-secondary/70">
              Total Segments
            </p>
            <p className="font-mono text-3xl md:text-4xl font-bold text-tertiary">
              {totalAppearances}
            </p>
          </div>

          {/* Segments Per Episode */}
          <div className="border border-secondary/50 px-6 py-6 rounded-sm bg-secondary/20">
            <p className="stat-label text-xs uppercase mb-3 text-secondary/70">
              Segments / EP
            </p>
            <p className="font-mono text-3xl md:text-4xl font-bold text-tertiary">
              {averageAppearancesPerEp.toFixed(2)}
            </p>
          </div>

          {/* Live From New York's */}
          <div className="border border-secondary/50 px-6 py-6 rounded-sm bg-secondary/20">
            <p className="stat-label text-xs uppercase mb-3 text-secondary/70">
              Live From NY's
            </p>
            <p className="font-mono text-3xl md:text-4xl font-bold text-tertiary">
              {totalLiveFromNewYorks}
            </p>
          </div>

          {/* Total Screen Time */}
          <div className="border border-secondary/50 px-6 py-6 rounded-sm bg-secondary/20">
            <p className="stat-label text-xs uppercase mb-3 text-secondary/70">
              Total Screen Time
            </p>
            <p className="font-mono text-3xl md:text-4xl font-bold text-tertiary">
              {formatScreenTime(totalScreenTimeSeconds)}
            </p>
          </div>

          {/* Average Screen Time */}
          <div className="border border-secondary/50 px-6 py-6 rounded-sm bg-secondary/20">
            <p className="stat-label text-xs uppercase mb-3 text-secondary/70">
              Avg Screen Time
            </p>
            <p className="font-mono text-3xl md:text-4xl font-bold text-tertiary">
              {formatScreenTime(averageScreenTimeSeconds)}
            </p>
          </div>

          {/* Average Power Ranking */}
          <div className="border border-secondary/50 px-6 py-6 rounded-sm bg-secondary/20">
            <p className="stat-label text-xs uppercase mb-3 text-secondary/70">
              Avg Power Rank
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