"use client";

import React from "react";

interface LeadershipBadge {
  category: "screenTime" | "sketches" | "powerRanking";
  seasons: string[];
}

interface CastMemberHeroSectionProps {
  name: string;
  headshot: string;
  status: string;
  yearJoined: number | null;
  yearLeft: number | null;
  totalSeasons: number;
  totalEpisodes: number;
  leadershipBadges: LeadershipBadge[];
  className?: string;
}

export function CastMemberHeroSection({
  name,
  headshot,
  status,
  yearJoined,
  yearLeft,
  totalSeasons,
  totalEpisodes,
  leadershipBadges,
  className = "",
}: CastMemberHeroSectionProps) {
  // Format tenure display
  const getTenureDisplay = () => {
    if (!yearJoined) return "Unknown";
    if (yearLeft) return `${yearJoined} - ${yearLeft}`;
    return `${yearJoined} - Present`;
  };

  // Map leadership categories to display labels
  const leadershipLabels: Record<
    string,
    { label: string; color: string }
  > = {
    screenTime: {
      label: "Screen Time Leader",
      color: "text-primary",
    },
    sketches: {
      label: "Sketch Leader",
      color: "text-primary",
    },
    powerRanking: {
      label: "Power Ranking Leader",
      color: "text-primary",
    },
  };

  return (
    <div
      className={`relative w-full bg-neutral py-8 md:py-12 lg:py-16 ${className}`}
    >
      <div className="max-w-6xl mx-auto px-4 md:px-8">
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
          {/* Left: Headshot + Status */}
          <div className="flex-shrink-0 w-full lg:w-80">
            <div className="relative">
              {/* Headshot Container */}
              <div className="border border-secondary rounded-sm overflow-hidden bg-secondary/30">
                <img
                  src={headshot}
                  alt={name}
                  className="w-full aspect-square object-cover"
                />
              </div>

              {/* Status Badge */}
              <div className="absolute top-4 left-4">
                <div className="bg-secondary/80 backdrop-blur-sm px-3 py-2 rounded-sm border border-secondary">
                  <span className="stat-label text-xs uppercase font-mono text-tertiary">
                    {status}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Info + Stats */}
          <div className="flex-1 flex flex-col justify-start">
            {/* Tenure Badge */}
            <div className="mb-4">
              <span className="stat-label text-xs uppercase font-mono text-secondary/70">
                {getTenureDisplay()}
              </span>
            </div>

            {/* Name */}
            <h1 className="font-heading text-5xl md:text-6xl lg:text-7xl font-bold text-tertiary mb-8 leading-tight">
              {name}
            </h1>

            {/* Career Highlights Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
              {/* Total Seasons */}
              <div className="border border-secondary/50 px-4 py-4 rounded-sm bg-secondary/20">
                <p className="stat-label text-xs uppercase mb-2 text-secondary/70">
                  Total Seasons
                </p>
                <p className="font-mono text-2xl font-bold text-tertiary">
                  {totalSeasons}
                </p>
              </div>

              {/* Total Episodes */}
              <div className="border border-secondary/50 px-4 py-4 rounded-sm bg-secondary/20">
                <p className="stat-label text-xs uppercase mb-2 text-secondary/70">
                  Total Episodes
                </p>
                <p className="font-mono text-2xl font-bold text-tertiary">
                  {totalEpisodes}
                </p>
              </div>

              {/* Leadership Badges - Conditional Rendering */}
              {leadershipBadges.length > 0 && (
                <div className="col-span-2 md:col-span-1 border border-primary/50 px-4 py-4 rounded-sm bg-primary/10">
                  <p className="stat-label text-xs uppercase mb-3 text-primary">
                    {leadershipBadges.length > 1
                      ? "Multi-Category Leader"
                      : "Category Leader"}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {leadershipBadges.map((badge, idx) => (
                      <span
                        key={idx}
                        className="inline-block px-2 py-1 bg-primary/20 border border-primary text-primary text-xs font-mono"
                      >
                        {leadershipLabels[badge.category]?.label.split(" ")[0]}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Leadership Details - Only show if there are badges */}
            {leadershipBadges.length > 0 && (
              <div className="space-y-3 pt-4 border-t border-secondary/30">
                {leadershipBadges.map((badge, idx) => (
                  <div key={idx} className="flex justify-between items-start">
                    <span className="stat-label text-xs uppercase text-secondary/70">
                      {leadershipLabels[badge.category]?.label}
                    </span>
                    <div className="flex flex-wrap justify-end gap-2">
                      {badge.seasons.map((season) => (
                        <span
                          key={season}
                          className="font-mono text-sm text-primary"
                        >
                          {season}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}