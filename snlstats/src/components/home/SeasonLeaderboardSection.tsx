import { prisma } from "@/src/lib/prisma";
import { SeasonLeaderboardClient } from "./SeasonLeaderboardClient";

interface CastPerformanceDisplay {
  castMemberId: string;
  name: string;
  slug: string;
  headshot?: string;
  screenTimeSeconds: number;
  sketchCount: number;
  powerRanking: number;
}

export async function SeasonLeaderboardSection() {
  try {
    // Get the most recent season
    const mostRecentSeason = await prisma.season.findFirst({
      orderBy: {
        seasonNumber: "desc",
      },
      select: {
        seasonNumber: true,
        numEpisodes: true,
        yearStarted: true,
        yearEnded: true,
      },
    });

    if (!mostRecentSeason) {
      return (
        <div className="border border-secondary/30 rounded-lg bg-secondary/20 p-8 text-center">
          <p className="text-[#8A8885]">No season data available</p>
        </div>
      );
    }

    // Get all episodes for this season in order
    const allEpisodes = await prisma.episode.findMany({
      where: {
        season: {
          seasonNumber: mostRecentSeason.seasonNumber,
        },
      },
      select: {
        id: true,
        episodeNumber: true,
      },
      orderBy: {
        episodeNumber: "asc",
      },
    });

    // Get last 5 episode IDs
    const last5EpisodeIds = allEpisodes
      .slice(Math.max(0, allEpisodes.length - 5))
      .map((ep) => ep.id);

    // Fetch performances for ALL episodes
    const allPerformances = await prisma.castPerformance.findMany({
      where: {
        episode: {
          season: {
            seasonNumber: mostRecentSeason.seasonNumber,
          },
        },
      },
      include: {
        castMember: {
          select: {
            id: true,
            name: true,
            slug: true,
            headshot: true,
          },
        },
      },
    });

    // Fetch performances for LAST 5 episodes
    const last5Performances = await prisma.castPerformance.findMany({
      where: {
        episodeId: {
          in: last5EpisodeIds,
        },
      },
      include: {
        castMember: {
          select: {
            id: true,
            name: true,
            slug: true,
            headshot: true,
          },
        },
      },
    });

    // Function to aggregate and calculate power ranking
    const aggregatePerformances = (
      performances: typeof allPerformances,
    ): CastPerformanceDisplay[] => {
      const aggregated: {
        [key: string]: {
          castMemberId: string;
          name: string;
          slug: string;
          headshot?: string;
          screenTimeSeconds: number;
          sketchCount: number;
          powerRankings: number[];
          appearances: number;
        };
      } = {};

      performances.forEach((perf) => {
        const castId = perf.castMemberId;

        if (!aggregated[castId]) {
          aggregated[castId] = {
            castMemberId: castId,
            name: perf.castMember.name,
            slug: perf.castMember.slug,
            headshot: perf.castMember.headshot || undefined,
            screenTimeSeconds: 0,
            sketchCount: 0,
            powerRankings: [],
            appearances: 0,
          };
        }

        aggregated[castId].screenTimeSeconds += perf.screenTimeSeconds;
        aggregated[castId].sketchCount += perf.sketchCount;

        // Convert Prisma Decimal → JavaScript number
        aggregated[castId].powerRankings.push(Number(perf.powerRanking));

        aggregated[castId].appearances += 1;
      });

      return Object.values(aggregated)
        .map((perf) => ({
          castMemberId: perf.castMemberId,
          name: perf.name,
          slug: perf.slug,
          headshot: perf.headshot,
          screenTimeSeconds: perf.screenTimeSeconds,
          sketchCount: perf.sketchCount,

          powerRanking:
            perf.powerRankings.length > 0
              ? perf.powerRankings.reduce((a, b) => a + b, 0) /
                perf.powerRankings.length
              : 0,
        }))
        .sort((a, b) => b.powerRanking - a.powerRanking)
        .slice(0, 5);
    };

    const performancesAll = aggregatePerformances(allPerformances);
    const performancesLast5 = aggregatePerformances(last5Performances);

    const yearRange = `${mostRecentSeason.yearStarted}-${mostRecentSeason.yearEnded}`;

    if (performancesAll.length === 0) {
      return (
        <div className="border border-secondary/30 rounded-lg bg-secondary/20 p-8 text-center">
          <p className="text-[#8A8885]">No performance data available</p>
        </div>
      );
    }

    return (
      <SeasonLeaderboardClient
        season={mostRecentSeason.seasonNumber}
        yearRange={yearRange}
        performancesAll={performancesAll}
        performancesLast5={performancesLast5}
      />
    );
  } catch (error) {
    console.error("Error fetching season leaderboard:", error);
    return (
      <div className="border border-secondary/30 rounded-lg bg-secondary/20 p-8 text-center">
        <p className="text-[#8A8885]">Error loading season data</p>
      </div>
    );
  }
}
