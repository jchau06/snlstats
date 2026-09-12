// src/components/cast/CastMemberSeasonHero.tsx
"use client";

import React from "react";
import Image from "next/image";

interface CastMemberSeasonHeroProps {
  name: string;
  seasonImage?: string;
  totalSeasons: number;
  careerSpan: string; // e.g., "2003 - Present"
  episodesPresent: number;
  totalEpisodesInSeason: number;
  screenTimeRanking: number | null; // #1, #2, etc. or null if not a leader
  sketchRanking: number | null;
  powerRanking: number | null;
  role: string;
  className?: string;
}

export function CastMemberSeasonHero({
  name,
  seasonImage,
  totalSeasons,
  careerSpan,
  episodesPresent,
  totalEpisodesInSeason,
  screenTimeRanking,
  sketchRanking,
  powerRanking,
  role,
  className = "",
}: CastMemberSeasonHeroProps) {
  const renderRankingBox = (label: string, ranking: number | null) => {
    if (ranking === null) return null;

    const isLeader = ranking === 1;
    const textColor = isLeader ? "text-primary" : "text-tertiary";

    return (
      <div className="border border-secondary/50 px-4 py-3 rounded-sm bg-secondary/20">
        <p className="stat-label text-xs uppercase mb-2 text-white/60">
          {label}
        </p>
        <p className={`font-mono text-lg font-bold ${textColor}`}>
          {isLeader ? "YES (RANK #1)" : `RANK #${ranking}`}
        </p>
      </div>
    );
  };

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
            <div className="mb-6">
              <a
                href="#"
                className="text-primary hover:text-tertiary transition-colors text-sm font-mono uppercase mb-3 inline-block"
              >
                ← Back to Career Stats
              </a>
              <div className="space-y-2">
                <p className="stat-label text-xs uppercase text-secondary/70">
                  Season Focus (2025-2026)
                </p>
                <p className="stat-label text-xs uppercase text-secondary/70">
                  {careerSpan} (Veteran)
                </p>
              </div>
            </div>

            {/* Name */}
            <h1 className="font-heading text-5xl md:text-6xl lg:text-7xl font-bold text-tertiary mb-8 leading-tight">
              {name}
            </h1>

            {/* Season Highlights Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
              {/* Total Seasons */}
              <div className="border border-secondary/50 px-4 py-4 rounded-sm bg-secondary/20">
                <p className="stat-label text-xs uppercase mb-2 text-white/60">
                  Total Seasons
                </p>
                <p className="font-mono text-2xl font-bold text-white">
                  {totalSeasons}
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

              {/* Rankings - Conditional Rendering */}
              {(screenTimeRanking || sketchRanking || powerRanking) && (
                <div className="col-span-2 md:col-span-1 border border-primary/40 px-4 py-4 rounded-sm bg-primary/5">
                  <p className="stat-label text-xs uppercase mb-3 text-primary">
                    Season Rankings
                  </p>
                  <div className="space-y-1">
                    {screenTimeRanking && (
                      <p className="font-mono text-xs text-primary">
                        Screen Time: #{screenTimeRanking}
                      </p>
                    )}
                    {sketchRanking && (
                      <p className="font-mono text-xs text-primary">
                        Sketch: #{sketchRanking}
                      </p>
                    )}
                    {powerRanking && (
                      <p className="font-mono text-xs text-primary">
                        Power: #{powerRanking}
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Detailed Rankings */}
            <div className="space-y-3">
              {renderRankingBox("Screen Time Ranking", screenTimeRanking)}
              {renderRankingBox("Sketch Ranking", sketchRanking)}
              {renderRankingBox("Power Ranking", powerRanking)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}