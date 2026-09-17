"use client";

import React, { useState, useMemo } from "react";
import { CurrentCastSection } from "./CurrentCastSection";
import { AlumniSection } from "./AlumniSection";

export interface CastMemberData {
  id: string;
  name: string;
  slug: string;
  headshot?: string;
  status: string;
  joinSeason?: number;
  leaveSeason?: number;
  seasonCastStatus?: "repertory" | "featured";
  careerStats?: {
    totalAppearances: number;
    totalScreenTimeSeconds: number;
    averageScreenTimeSeconds: number;
    averageAppearancesPerEp: number;
    averagePowerRanking: number;
    totalLiveFromNewYorks: number;
    totalSeasons: number;
    totalEpisodes: number;
  };
}

interface CastMemberNavigationPageClientProps {
  castMembers: CastMemberData[];
  isAlumniPage?: boolean;
}

export type SortType =
  | "default"
  | "earliest-hires"
  | "latest-hires"
  | "avg-sketches"
  | "total-sketches"
  | "avg-screen-time"
  | "total-screen-time"
  | "total-episodes"
  | "power-ranking"
  | "total-lfnys";

export function CastMemberNavigationPageClient({
  castMembers,
  isAlumniPage = false,
}: CastMemberNavigationPageClientProps) {
  const [sortBy, setSortBy] = useState<SortType>("default");

  const getLastName = (fullName: string): string => {
    const parts = fullName.trim().split(" ");
    return parts[parts.length - 1];
  };

  const sortedCastMembers = useMemo(() => {
    const sorted = [...castMembers];

    switch (sortBy) {
      case "default":
        sorted.sort((a, b) => getLastName(a.name).localeCompare(getLastName(b.name)));
        break;
      case "earliest-hires":
        sorted.sort((a, b) => {
          const seasonDiff = (a.joinSeason || 0) - (b.joinSeason || 0);
          if (seasonDiff !== 0) return seasonDiff;
          return getLastName(a.name).localeCompare(getLastName(b.name));
        });
        break;
      case "latest-hires":
        sorted.sort((a, b) => {
          const seasonDiff = (b.joinSeason || 0) - (a.joinSeason || 0);
          if (seasonDiff !== 0) return seasonDiff;
          return getLastName(a.name).localeCompare(getLastName(b.name));
        });
        break;
      case "avg-sketches":
        sorted.sort(
          (a, b) =>
            (b.careerStats?.averageAppearancesPerEp || 0) -
            (a.careerStats?.averageAppearancesPerEp || 0)
        );
        break;
      case "total-sketches":
        sorted.sort(
          (a, b) =>
            (b.careerStats?.totalAppearances || 0) -
            (a.careerStats?.totalAppearances || 0)
        );
        break;
      case "avg-screen-time":
        sorted.sort(
          (a, b) =>
            (b.careerStats?.averageScreenTimeSeconds || 0) -
            (a.careerStats?.averageScreenTimeSeconds || 0)
        );
        break;
      case "total-screen-time":
        sorted.sort(
          (a, b) =>
            (b.careerStats?.totalScreenTimeSeconds || 0) -
            (a.careerStats?.totalScreenTimeSeconds || 0)
        );
        break;
      case "total-episodes":
        sorted.sort(
          (a, b) =>
            (b.careerStats?.totalEpisodes || 0) -
            (a.careerStats?.totalEpisodes || 0)
        );
        break;
      case "power-ranking":
        sorted.sort(
          (a, b) =>
            (b.careerStats?.averagePowerRanking || 0) -
            (a.careerStats?.averagePowerRanking || 0)
        );
        break;
      case "total-lfnys":
        sorted.sort(
          (a, b) =>
            (b.careerStats?.totalLiveFromNewYorks || 0) -
            (a.careerStats?.totalLiveFromNewYorks || 0)
        );
        break;
    }

    // Add ranking for stats sorts
    if (
      [
        "avg-sketches",
        "total-sketches",
        "avg-screen-time",
        "total-screen-time",
        "power-ranking",
        "total-lfnys",
        "total-episodes",
      ].includes(sortBy)
    ) {
      sorted.forEach((member, index) => {
        (member as any).rank = index + 1;
      });
    }

    return sorted;
  }, [castMembers, sortBy]);

  if (isAlumniPage) {
    return (
      <AlumniSection
        castMembers={sortedCastMembers}
        sortBy={sortBy}
        onSortChange={setSortBy}
      />
    );
  }

  return (
    <CurrentCastSection
      castMembers={sortedCastMembers}
      sortBy={sortBy}
      onSortChange={setSortBy}
    />
  );
}