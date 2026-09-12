// src/components/cast/CastMemberSeasonHeroServer.tsx
import { prisma } from "@/src/lib/prisma";
import { CastMemberSeasonHero } from "./CastMemberSeasonHero";

interface CastMemberSeasonHeroServerProps {
  castMemberId: string;
  castMemberName: string;
  totalSeasons: number;
  careerSpan: string;
  seasonNumber: number;
  className?: string;
}

export async function CastMemberSeasonHeroServer({
  castMemberId,
  castMemberName,
  totalSeasons,
  careerSpan,
  seasonNumber,
  className,
}: CastMemberSeasonHeroServerProps) {
  // Fetch season
  const season = await prisma.season.findUnique({
    where: { seasonNumber },
  });

  if (!season) {
    return null;
  }

  // Fetch season stats
  const seasonStats = await prisma.seasonStats.findUnique({
    where: {
      seasonId_castMemberId: {
        seasonId: season.id,
        castMemberId,
      },
    },
  });

  // Fetch season cast for role
  const seasonCast = await prisma.seasonCast.findUnique({
    where: {
      seasonId_castMemberId: {
        seasonId: season.id,
        castMemberId,
      },
    },
    select: { status: true },
  });

  // Fetch season opening image
  const seasonMedia = await prisma.seasonCastMedia.findFirst({
    where: {
      seasonId: season.id,
      castMemberId,
      imageType: "season-opening",
    },
    select: { imageUrl: true },
  });

  if (!seasonStats) {
    return null;
  }

  // Fetch season leaders to get rankings
  const seasonLeader = await prisma.seasonLeaders.findUnique({
    where: {
      seasonId_castMemberId: {
        seasonId: season.id,
        castMemberId,
      },
    },
  });

  // Determine rankings (if cast member is a leader in a category, their ranking is #1)
  // Otherwise, we'd need to query all seasonStats for the season to get the ranking
  // For now, we'll show rankings only if they're leaders (#1)
  const screenTimeRanking = seasonLeader?.isScreenTimeLeader ? 1 : null;
  const sketchRanking = seasonLeader?.isSketchLeader ? 1 : null;
  const powerRanking = seasonLeader?.isPowerRankingLeader ? 1 : null;

  return (
    <CastMemberSeasonHero
      name={castMemberName}
      seasonImage={seasonMedia?.imageUrl}
      totalSeasons={totalSeasons}
      careerSpan={careerSpan}
      episodesPresent={seasonStats.episodesPresent}
      totalEpisodesInSeason={season.numEpisodes}
      screenTimeRanking={screenTimeRanking}
      sketchRanking={sketchRanking}
      powerRanking={powerRanking}
      role={seasonCast?.status || "Repertory"}
      className={className}
    />
  );
}