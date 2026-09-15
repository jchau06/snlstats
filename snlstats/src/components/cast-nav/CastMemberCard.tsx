// src/components/cast-nav/CastMemberCard.tsx
"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { CastMemberData, SortType } from "./CastMemberNavigationPageClient";

interface CastMemberCardProps {
  member: CastMemberData;
  sortBy: SortType;
  rank?: number;
}

const formatScreenTime = (seconds: number): string => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = Math.round(seconds % 60);

  if (hours > 0) {
    return `${hours}h ${minutes}m ${secs}s`;
  } else if (minutes > 0) {
    return `${minutes}m ${secs}s`;
  }
  return `${secs}s`;
};

const getSeasonDisplay = (joinSeason?: number, leaveSeason?: number): string => {
  if (!joinSeason) return "—";
  
  if (!leaveSeason) {
    // Current cast member
    return `Season ${joinSeason} - Present`;
  }
  
  // Alumni: calculate number of seasons
  const numSeasons = leaveSeason - joinSeason + 1;
  return `${numSeasons} Seasons (${joinSeason}-${leaveSeason})`;
};

export function CastMemberCard({
  member,
  sortBy,
  rank,
}: CastMemberCardProps) {
  const getCardStats = () => {
    const stats = member.careerStats;
    if (!stats) return { line1: "—", line2: "—" };

    switch (sortBy) {
      case "default":
      case "earliest-hires":
      case "latest-hires":
        return {
          line1: `${stats.totalAppearances} SKETCHES`,
          line2: `${formatScreenTime(stats.totalScreenTimeSeconds)} SCREEN TIME`,
        };
      case "avg-sketches":
        return {
          line1: `${stats.totalAppearances} SKETCHES`,
          line2: `${stats.averageAppearancesPerEp.toFixed(2)} AVG`,
        };
      case "total-sketches":
        return {
          line1: `${stats.totalAppearances} SKETCHES`,
          line2: `${stats.averageAppearancesPerEp.toFixed(2)} AVG`,
        };
      case "avg-screen-time":
        return {
          line1: `${formatScreenTime(stats.totalScreenTimeSeconds)} TOTAL`,
          line2: `${formatScreenTime(stats.averageScreenTimeSeconds)} AVG`,
        };
      case "total-screen-time":
        return {
          line1: `${formatScreenTime(stats.totalScreenTimeSeconds)} TOTAL`,
          line2: `${formatScreenTime(stats.averageScreenTimeSeconds)} AVG`,
        };
      case "power-ranking":
        return {
          line1: `${stats.averagePowerRanking.toFixed(2)} AVG PWR`,
          line2: `${member.careerStats?.totalAppearances} SKETCHES`,
        };
      default:
        return { line1: "—", line2: "—" };
    }
  };

  const stats = getCardStats();
  const isStatsSorted = [
    "avg-sketches",
    "total-sketches",
    "avg-screen-time",
    "total-screen-time",
    "power-ranking",
  ].includes(sortBy);

  return (
    <Link href={`/cast/${member.slug}`} className="group">
      <div className="flex flex-col h-full">
        {/* Headshot Image */}
        <div className="relative mb-3 sm:mb-4 aspect-square rounded-lg overflow-hidden bg-gradient-to-b from-[#3A3A38] to-[#222222] border border-[#2C2C2A] group-hover:border-primary transition-all duration-base">
          {member.headshot ? (
            <>
              <Image
                src={member.headshot}
                alt={member.name}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-base"
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, (max-width: 1280px) 25vw, 20vw"
                priority={false}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent z-10" />
            </>
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <svg
                className="w-8 h-8 text-[#3A3A38]"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </div>
          )}

          {/* Ranking Badge */}
          {isStatsSorted && rank && (
            <div className="absolute top-2 right-2 bg-primary text-neutral px-2 py-1 rounded-sm font-mono text-xs font-bold z-20">
              #{rank}
            </div>
          )}
        </div>

        {/* Name */}
        <p className="font-sans font-bold text-tertiary text-center text-xs sm:text-sm group-hover:text-primary transition-colors duration-base line-clamp-2 mb-2">
          {member.name}
        </p>

        {/* Career Stats */}
        <div className="text-center text-[10px] sm:text-xs text-[#8A8885] font-mono space-y-0.5">
          <p>{stats.line1}</p>
          <p>{stats.line2}</p>
        </div>

        {/* Seasons Info */}
        <p className="text-center text-[9px] sm:text-[10px] text-[#666] font-mono mt-1">
          {getSeasonDisplay(member.joinSeason, member.leaveSeason)}
        </p>
      </div>
    </Link>
  );
}