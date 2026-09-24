// src/components/seasons-nav/SeasonNavigationPageServer.tsx
import { prisma } from "@/src/lib/prisma";
import { SeasonNavigationPageClient } from "./SeasonNavigationPageClient";

interface SeasonNavigationPageServerProps {
  currentVersion?: "us" | "uk";
}

export async function SeasonNavigationPageServer({
  currentVersion = "us",
}: SeasonNavigationPageServerProps) {
  // Fetch all seasons with all fields
  const seasons = await prisma.season.findMany({
    select: {
      id: true,
      seasonNumber: true,
      yearStarted: true,
      yearEnded: true,
      numEpisodes: true,
      heroImageUrl: true,
      navImageUrl: true,
    },
    orderBy: { seasonNumber: "desc" },
  });

  // Determine which season is "live" (most recent)
  const liveSeasonNumber = seasons[0]?.seasonNumber;

  // Transform data for client component
  // Convert null to undefined to match client component types
  const transformedSeasons = seasons.map((season) => ({
    ...season,
    heroImageUrl: season.heroImageUrl ?? undefined,
    navImageUrl: season.navImageUrl ?? undefined,
    isLive: season.seasonNumber === liveSeasonNumber,
  }));

  return (
    <SeasonNavigationPageClient
      seasons={transformedSeasons}
      currentVersion={currentVersion}
    />
  );
}