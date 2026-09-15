// src/components/cast/CastMemberSeasonHero.tsx
"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";

interface CastMemberSeasonHeroProps {
  name: string;
  seasonImage?: string;
  castMemberSlug: string;
  seasonNumber: number;
  seasonYears: string; // e.g., "2025-2026"
  joinSeason: number; // e.g., 50
  currentSeasonNumber: number; // e.g., 51
  careerSpan: string; // e.g., "Season 50 - Present"
  episodesPresent: number;
  totalEpisodesInSeason: number;
  screenTimeRanking: number | null;
  segmentRanking: number | null;
  powerRanking: number | null;
  className?: string;
}

// Calculate which season of their career this is
const getSeasonOrdinal = (joinSeason: number, currentSeasonNumber: number): string => {
  const seasonCount = currentSeasonNumber - joinSeason + 1;
  const suffix = seasonCount === 1 ? "st" : seasonCount === 2 ? "nd" : seasonCount === 3 ? "rd" : "th";
  return `${seasonCount}${suffix}`;
};

const renderRankingBox = (label: string, ranking: number | null) => {
  return (
    <div className="border border-secondary/50 px-4 py-4 rounded-sm bg-secondary/20">
      <p className="stat-label text-xs uppercase mb-2 text-white/60">{label}</p>
      <p className="font-mono text-2xl font-bold text-primary">
        #{ranking || "—"}
      </p>
    </div>
  );
};

export function CastMemberSeasonHero({
  name,
  seasonImage,
  castMemberSlug,
  seasonNumber,
  seasonYears,
  joinSeason,
  currentSeasonNumber,
  careerSpan,
  episodesPresent,
  totalEpisodesInSeason,
  screenTimeRanking,
  segmentRanking,
  powerRanking,
  className = "",
}: CastMemberSeasonHeroProps) {
  const seasonOrdinal = getSeasonOrdinal(joinSeason, currentSeasonNumber);

  return (
    <div
      className={`relative w-full bg-neutral py-8 md:py-12 lg:py-16 ${className}`}
    >
      <div className="max-w-6xl mx-auto px-4 md:px-8">
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
          {/* Left: Season-Opening Image (rectangular) */}
          {seasonImage && (
            <div className="flex-shrink-0 w-full lg:w-96">
              <div className="relative w-full aspect-[4/3] border border-secondary rounded-sm overflow-hidden bg-secondary/30">
                <Image
                  src={seasonImage}
                  alt={name}
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            </div>
          )}

          {/* Right: Info + Stats */}
          <div className="flex-1 flex flex-col justify-start">
            {/* Back Navigation + Context */}
            <div className="mb-8">
              <Link
                href={`/cast/${castMemberSlug}`}
                className="text-primary hover:text-tertiary transition-colors text-sm font-mono uppercase mb-4 inline-block"
              >
                ← Back to Career Stats
              </Link>

              {/* Stylized Flags */}
              <div className="flex flex-wrap gap-3 mb-4">
                <div className="bg-primary/20 border border-primary px-4 py-2 rounded-sm">
                  <span className="font-mono text-sm font-bold text-primary uppercase">
                    Season {seasonNumber} Profile - {seasonYears}
                  </span>
                </div>
                <div className="bg-secondary/40 border border-secondary/60 px-4 py-2 rounded-sm">
                  <span className="font-mono text-sm font-bold text-tertiary uppercase">
                    {careerSpan}
                  </span>
                </div>
              </div>
            </div>

            {/* Name */}
            <h1 className="font-heading text-5xl md:text-6xl lg:text-7xl font-bold text-tertiary mb-8 leading-tight">
              {name}
            </h1>

            {/* Season Highlights Grid - All same size */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {/* Season Ordinal */}
              <div className="border border-secondary/50 px-4 py-4 rounded-sm bg-secondary/20">
                <p className="stat-label text-xs uppercase mb-2 text-white/60">
                  Career Season
                </p>
                <p className="font-mono text-2xl font-bold text-white">
                  {seasonOrdinal}
                </p>
              </div>

              {/* Episodes Present */}
              <div className="border border-secondary/50 px-4 py-4 rounded-sm bg-secondary/20">
                <p className="stat-label text-xs uppercase mb-2 text-white/60">
                  Episodes Present
                </p>
                <p className="font-mono text-2xl font-bold text-white">
                  {episodesPresent} / {totalEpisodesInSeason}
                </p>
              </div>

              {/* Screen Time Ranking */}
              {renderRankingBox("Screen Time Ranking", screenTimeRanking)}

              {/* Segment Ranking */}
              {renderRankingBox("Segment Ranking", segmentRanking)}

              {/* Power Ranking */}
              {renderRankingBox("Power Ranking", powerRanking)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}