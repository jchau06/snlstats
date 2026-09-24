// src/components/episodes/EpisodesPageServer.tsx
import { prisma } from "@/src/lib/prisma";
import { EpisodesPageClient } from "./EpisodesPageClient";

interface EpisodesPageServerProps {
  currentVersion?: "us" | "uk";
}

export async function EpisodesPageServer({
  currentVersion = "us",
}: EpisodesPageServerProps) {
  // Fetch all seasons
  const seasons = await prisma.season.findMany({
    orderBy: { seasonNumber: "desc" },
  });

  // Fetch all episodes with their related data
  const episodes = await prisma.episode.findMany({
    include: {
      season: true,
    },
    orderBy: [{ seasonId: "desc" }, { episodeNumber: "desc" }],
  });

  // Determine which season is "live" (most recent)
  const liveSeasonNumber = seasons[0]?.seasonNumber;

  // Transform data for client component
  // Convert null values to undefined (or defaults) to match client component types
  const transformedSeasons = seasons.map((season) => ({
    ...season,
    heroImageUrl: season.heroImageUrl ?? undefined,
    navImageUrl: season.navImageUrl ?? undefined,
    isLive: season.seasonNumber === liveSeasonNumber,
  }));

  const transformedEpisodes = episodes.map((episode) => ({
    ...episode,
    host: episode.host ?? "",
    musicalGuest: episode.musicalGuest ?? "",
    seasonNumber: episode.season.seasonNumber,
  }));

  return (
    <EpisodesPageClient
      seasons={transformedSeasons}
      episodes={transformedEpisodes}
      currentVersion={currentVersion}
    />
  );
}