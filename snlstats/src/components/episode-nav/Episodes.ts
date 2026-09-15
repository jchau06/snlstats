// src/types/episodes.ts

export type GlobalSortType = "latest" | "oldest";
export type VersionType = "us" | "uk";
export type SeasonalSortType = "latest" | "oldest";

export interface Episode {
  id: string;
  seasonId: string;
  seasonNumber: number;
  episodeNumber: number;
  airDate: Date;
  host: string;
  musicalGuest: string;
  slug?: string;
  imageUrls?: string[];
}

export interface Season {
  id: string;
  seasonNumber: number;
  yearStarted: number;
  yearEnded: number;
  numEpisodes: number;
  heroImageUrl?: string;
  isLive?: boolean;
}

export interface EpisodesPageClientProps {
  seasons: Season[];
  episodes: Episode[];
  currentVersion?: VersionType;
}

export interface SeasonEpisodesSectionProps {
  season: Season;
  episodes: Episode[];
  globalSort: GlobalSortType;
  isExpanded: boolean;
  onToggleExpanded: () => void;
}