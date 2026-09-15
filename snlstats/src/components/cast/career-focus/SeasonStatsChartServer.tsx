// src/components/cast/SeasonStatsChartServer.tsx
import { prisma } from "@/src/lib/prisma";
import { SeasonStatsChartClient } from "./SeasonStatsChartClient";

interface SeasonStatsChartServerProps {
  castMemberId: string;
  className?: string;
}

export async function SeasonStatsChartServer({
  castMemberId,
  className,
}: SeasonStatsChartServerProps) {
  // Fetch all season stats for this cast member
  const castMemberSeasonStats = await prisma.seasonStats.findMany({
    where: { castMemberId },
    include: {
      season: {
        select: {
          id: true,
          seasonNumber: true,
          yearStarted: true,
          yearEnded: true,
        },
      },
    },
    orderBy: { season: { seasonNumber: "desc" } },
  });

  if (castMemberSeasonStats.length === 0) {
    return null;
  }

  // For each season, calculate the cast member's ranking
  const seasonStatsWithRanking = await Promise.all(
    castMemberSeasonStats.map(async (stat) => {
      // Get all cast members' stats for this season
      const allSeasonStats = await prisma.seasonStats.findMany({
        where: { seasonId: stat.seasonId },
        select: { castMemberId: true, totalScreenTimeSeconds: true },
      });

      // Sort by screen time to get ranking
      const sorted = allSeasonStats
        .sort((a, b) => b.totalScreenTimeSeconds - a.totalScreenTimeSeconds)
        .map((s, idx) => ({ castMemberId: s.castMemberId, rank: idx + 1 }));

      // Find this cast member's rank
      const rankEntry = sorted.find((r) => r.castMemberId === castMemberId);
      const rank = rankEntry?.rank || allSeasonStats.length;

      return {
        seasonNumber: stat.season.seasonNumber,
        yearStarted: stat.season.yearStarted,
        yearEnded: stat.season.yearEnded,
        totalScreenTimeSeconds: stat.totalScreenTimeSeconds,
        totalAppearances: stat.totalAppearances,
        averageScreenTimeSeconds: Number(stat.averageScreenTimeSeconds),
        averageAppearances: Number(stat.averageAppearances),
        powerRankingSeason: Number(stat.powerRankingSeason),
        castMembersInSeason: allSeasonStats.length,
        castMemberRankInSeason: rank,
      };
    }),
  );

  return (
    <div className={className}>
      <SeasonStatsChartClient data={seasonStatsWithRanking} />
    </div>
  );
}
