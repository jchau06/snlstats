// src/components/cast/SeasonBySeasonTableServer.tsx
import { prisma } from "@/src/lib/prisma";
import { SeasonBySeasonTable } from "./SeasonBySeasonTable";

interface SeasonBySeasonTableServerProps {
  castMemberId: string;
  castMemberSlug: string;
  className?: string;
}

export async function SeasonBySeasonTableServer({
  castMemberId,
  castMemberSlug,
  className,
}: SeasonBySeasonTableServerProps) {
  // Fetch all season stats for this cast member with season and role details
  const seasonStats = await prisma.seasonStats.findMany({
    where: { castMemberId },
    include: {
      season: {
        select: {
          seasonNumber: true,
          yearStarted: true,
          yearEnded: true,
          numEpisodes: true,
        },
      },
    },
  });

  if (seasonStats.length === 0) {
    return null;
  }

  // For each season stat, fetch the corresponding SeasonCast for role
  const data = await Promise.all(
    seasonStats.map(async (stat) => {
      const seasonCast = await prisma.seasonCast.findUnique({
        where: {
          seasonId_castMemberId: {
            seasonId: stat.seasonId,
            castMemberId,
          },
        },
        select: { status: true },
      });

      return {
        seasonNumber: stat.season.seasonNumber,
        yearStarted: stat.season.yearStarted,
        yearEnded: stat.season.yearEnded,
        numEpisodes: stat.season.numEpisodes,
        role: seasonCast?.status || "Repertory",
        totalAppearances: stat.totalAppearances,
        totalScreenTimeSeconds: stat.totalScreenTimeSeconds,
        averageScreenTimeSeconds: Number(stat.averageScreenTimeSeconds),
        powerRankingSeason: Number(stat.powerRankingSeason),
      };
    })
  );

  return (
    <div className={className}>
      <SeasonBySeasonTable data={data} castMemberSlug={castMemberSlug} />
    </div>
  );
}