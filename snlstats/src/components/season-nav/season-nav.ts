// src/types/seasons-nav.ts

export type GlobalSortType = "latest" | "oldest";
export type VersionType = "us" | "uk";

export interface Season {
  id: string;
  seasonNumber: number;
  yearStarted: number;
  yearEnded: number;
  numEpisodes: number;
  heroImageUrl?: string;
  navImageUrl?: string;
  isLive?: boolean;
}

export interface SeasonNavigationPageClientProps {
  seasons: Season[];
  currentVersion?: VersionType;
}

export interface SeasonCardProps {
  season: Season;
}