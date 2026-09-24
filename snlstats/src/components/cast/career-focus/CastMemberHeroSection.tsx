"use client";

import React from "react";
import Image from "next/image";

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
  const getTenureDisplay = () => {
    if (!yearJoined) return "Unknown";
    if (yearLeft) return `${yearJoined} - ${yearLeft}`;
    return `${yearJoined} - Present`;
  };

  const leadershipConfig: Record<
    string,
    { fullLabel: string; shortLabel: string }
  > = {
    screenTime: {
      fullLabel: "Screen Time Leader",
      shortLabel: "Screen",
    },
    sketches: {
      fullLabel: "Sketch Leader",
      shortLabel: "Sketch",
    },
    powerRanking: {
      fullLabel: "Power Ranking Leader",
      shortLabel: "Power",
    },
  };

  return (
    <div
      className={`relative w-full bg-neutral py-8 md:py-12 lg:py-16 ${className}`}
    >
      <div className="max-w-6xl mx-auto px-4 md:px-8">
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
          {/* Left: Headshot */}
          <div className="flex-shrink-0 w-full lg:w-80">
            <div className="relative border border-secondary rounded-sm overflow-hidden bg-secondary/30 aspect-square">
              <Image
                src={headshot}
                alt={`${name} headshot`}
                fill
                sizes="(max-width: 1024px) 100vw, 320px"
                className="object-cover"
                priority
              />
            </div>
          </div>

          {/* Right: Info + Stats */}
          <div className="flex-1 flex flex-col justify-start">
            {/* Tenure + Status Row */}
            <div className="flex items-center gap-4 mb-6">
              <span className="stat-label text-xs uppercase font-mono text-primary">
                {getTenureDisplay()}
              </span>

              {status && (
                <div className="flex items-center gap-2 px-3 py-1.5 bg-secondary/30 border border-secondary/50 rounded-sm">
                  <span className="w-2 h-2 bg-primary rounded-full" />
                  <span className="stat-label text-xs uppercase font-mono text-white">
                    {status.toUpperCase()}
                  </span>
                </div>
              )}
            </div>

            {/* Name */}
            <h1 className="font-heading text-5xl md:text-6xl lg:text-7xl font-bold text-tertiary mb-8 leading-tight">
              {name}
            </h1>

            {/* Top Row - Core Stats */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
              {/* Total Seasons */}
              <div className="border border-secondary/50 px-4 py-4 rounded-sm bg-secondary/20">
                <p className="stat-label text-xs uppercase mb-2 text-white/60">
                  Total Seasons
                </p>
                <p className="font-mono text-2xl font-bold text-white">
                  {totalSeasons}
                </p>
              </div>

              {/* Total Episodes */}
              <div className="border border-secondary/50 px-4 py-4 rounded-sm bg-secondary/20">
                <p className="stat-label text-xs uppercase mb-2 text-white/60">
                  Total Episodes
                </p>
                <p className="font-mono text-2xl font-bold text-white">
                  {totalEpisodes}
                </p>
              </div>

              {/* Times Hosted */}
              <div className="border border-secondary/50 px-4 py-4 rounded-sm bg-secondary/20">
                <p className="stat-label text-xs uppercase mb-2 text-white/60">
                  Times Hosted
                </p>
                <p className="font-mono text-2xl font-bold text-white">0</p>
              </div>
            </div>

            {/* Bottom Row - Leadership Boxes */}
            {leadershipBadges.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-0">
                {leadershipBadges.map((badge, idx) => (
                  <div
                    key={idx}
                    className="border border-secondary/50 px-4 py-4 rounded-sm bg-secondary/20"
                  >
                    <p className="stat-label text-xs uppercase mb-2 text-white/60">
                      {leadershipConfig[badge.category]?.fullLabel}
                    </p>

                    <p className="font-mono text-lg font-bold text-primary">
                      {badge.seasons.join(", ")}
                    </p>
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
