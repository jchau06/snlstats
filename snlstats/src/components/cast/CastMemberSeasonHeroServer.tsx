// src/components/cast/CastMemberSeasonHeroServer.tsx
import { prisma } from "@/src/lib/prisma";
import { CastMemberSeasonHero } from "./CastMemberSeasonHero";

interface CastMemberSeasonHeroServerProps {
  castMemberId: string;
  castMemberName: string;
  castMemberSlug: string;
  castMemberJoinSeason: number;
  seasonNumber: number;
  seasonYears: string;
  careerSpan: string;
  className?: string;
}

export async function CastMemberSeasonHeroServer({
  castMemberId,
  castMemberName,
  castMemberSlug,
  castMemberJoinSeason,
  seasonNumber,
  seasonYears,
  careerSpan,
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

  // Get all season stats to calculate rankings for this cast member
  const allSeasonStats = await prisma.seasonStats.findMany({
    where: { seasonId: season.id },
    orderBy: { totalScreenTimeSeconds: "desc" },
  });

  // Calculate screen time ranking
  const screenTimeRank = allSeasonStats.findIndex((s) => s.castMemberId === castMemberId) + 1;

  // For segment ranking, sort by totalAppearances
  const segmentStats = [...allSeasonStats].sort((a, b) => b.totalAppearances - a.totalAppearances);
  const segmentRank = segmentStats.findIndex((s) => s.castMemberId === castMemberId) + 1;

  // For power ranking, sort by powerRankingSeason
  const powerStats = [...allSeasonStats].sort((a, b) => Number(b.powerRankingSeason) - Number(a.powerRankingSeason));
  const powerRank = powerStats.findIndex((s) => s.castMemberId === castMemberId) + 1;

  return (
    <CastMemberSeasonHero
      name={castMemberName}
      seasonImage={seasonMedia?.imageUrl}
      castMemberSlug={castMemberSlug}
      seasonNumber={seasonNumber}
      seasonYears={seasonYears}
      joinSeason={castMemberJoinSeason}
      currentSeasonNumber={seasonNumber}
      careerSpan={careerSpan}
      episodesPresent={seasonStats.episodesPresent}
      totalEpisodesInSeason={season.numEpisodes}
      screenTimeRanking={screenTimeRank}
      segmentRanking={segmentRank}
      powerRanking={powerRank}
      className={className}
    />
  );
}