"use client";

import React, { useState, useMemo } from "react";
import { CombinedCastPageClient } from "./CombinedCastPageClient";
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
  rank?: number;
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

const STATS_SORT_TYPES: SortType[] = [
  "avg-sketches",
  "total-sketches",
  "avg-screen-time",
  "total-screen-time",
  "power-ranking",
  "total-lfnys",
  "total-episodes",
];

const getLastName = (fullName: string): string => {
  const parts = fullName.trim().split(" ");
  return parts[parts.length - 1];
};

const applySorting = (members: CastMemberData[], sortBy: SortType): void => {
  switch (sortBy) {
    case "default":
      members.sort((a, b) =>
        getLastName(a.name).localeCompare(getLastName(b.name)),
      );
      break;
    case "earliest-hires":
      members.sort((a, b) => {
        const seasonDiff = (a.joinSeason || 0) - (b.joinSeason || 0);
        if (seasonDiff !== 0) return seasonDiff;
        return getLastName(a.name).localeCompare(getLastName(b.name));
      });
      break;
    case "latest-hires":
      members.sort((a, b) => {
        const seasonDiff = (b.joinSeason || 0) - (a.joinSeason || 0);
        if (seasonDiff !== 0) return seasonDiff;
        return getLastName(a.name).localeCompare(getLastName(b.name));
      });
      break;
    case "avg-sketches":
      members.sort(
        (a, b) =>
          (b.careerStats?.averageAppearancesPerEp || 0) -
          (a.careerStats?.averageAppearancesPerEp || 0),
      );
      break;
    case "total-sketches":
      members.sort(
        (a, b) =>
          (b.careerStats?.totalAppearances || 0) -
          (a.careerStats?.totalAppearances || 0),
      );
      break;
    case "avg-screen-time":
      members.sort(
        (a, b) =>
          (b.careerStats?.averageScreenTimeSeconds || 0) -
          (a.careerStats?.averageScreenTimeSeconds || 0),
      );
      break;
    case "total-screen-time":
      members.sort(
        (a, b) =>
          (b.careerStats?.totalScreenTimeSeconds || 0) -
          (a.careerStats?.totalScreenTimeSeconds || 0),
      );
      break;
    case "total-episodes":
      members.sort(
        (a, b) =>
          (b.careerStats?.totalEpisodes || 0) -
          (a.careerStats?.totalEpisodes || 0),
      );
      break;
    case "power-ranking":
      members.sort(
        (a, b) =>
          (b.careerStats?.averagePowerRanking || 0) -
          (a.careerStats?.averagePowerRanking || 0),
      );
      break;
    case "total-lfnys":
      members.sort(
        (a, b) =>
          (b.careerStats?.totalLiveFromNewYorks || 0) -
          (a.careerStats?.totalLiveFromNewYorks || 0),
      );
      break;
  }
};

const addRankings = (members: CastMemberData[], sortBy: SortType): void => {
  if (STATS_SORT_TYPES.includes(sortBy)) {
    members.forEach((member, index) => {
      member.rank = index + 1;
    });
  }
};

export function CastMemberNavigationPageClient({
  castMembers,
  isAlumniPage = false,
}: CastMemberNavigationPageClientProps) {
  const [sortBy, setSortBy] = useState<SortType>("default");

  const sortedCastMembers = useMemo(() => {
    const sorted = [...castMembers];
    applySorting(sorted, sortBy);
    addRankings(sorted, sortBy);
    return sorted;
  }, [castMembers, sortBy]);

  const currentCastMembers = useMemo(() => {
    return sortedCastMembers.filter((member) => !member.leaveSeason);
  }, [sortedCastMembers]);

  const alumniCastMembers = useMemo(() => {
    return sortedCastMembers.filter((member) => member.leaveSeason);
  }, [sortedCastMembers]);

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
    <CombinedCastPageClient
      castMembers={sortedCastMembers}
      sortBy={sortBy}
      onSortChange={setSortBy}
      currentCastMembers={currentCastMembers}
      alumniCastMembers={alumniCastMembers}
    />
  );
}
