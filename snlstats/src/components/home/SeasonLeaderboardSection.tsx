import { prisma } from "@/src/lib/prisma";
import Image from "next/image";
import Link from "next/link";

interface CastPerformanceDisplay {
  castMemberId: string;
  name: string;
  slug: string;
  headshot?: string;
  screenTimeSeconds: number;
  sketchCount: number;
  powerRanking: number;
}

async function getSeasonLeaderboardData(): Promise<{
  season: number;
  performances: CastPerformanceDisplay[];
  totalEpisodes: number;
}> {
  // Get the most recent season
  const mostRecentSeason = await prisma.season.findFirst({
    orderBy: {
      seasonNumber: "desc",
    },
    select: {
      seasonNumber: true,
      numEpisodes: true,
    },
  });

  if (!mostRecentSeason) {
    return {
      season: 0,
      performances: [],
      totalEpisodes: 0,
    };
  }

  // Get all cast performances for the most recent season
  const performances = await prisma.castPerformance.findMany({
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

  // Aggregate performances by cast member
  const aggregatedPerformances: {
    [key: string]: {
      castMemberId: string;
      name: string;
      slug: string;
      headshot?: string;
      screenTimeSeconds: number;
      sketchCount: number;
      powerRankings: number[];
    };
  } = {};

  performances.forEach((perf) => {
    const castId = perf.castMemberId;

    if (!aggregatedPerformances[castId]) {
      aggregatedPerformances[castId] = {
        castMemberId: castId,
        name: perf.castMember.name,
        slug: perf.castMember.slug,
        headshot: perf.castMember.headshot || undefined,
        screenTimeSeconds: 0,
        sketchCount: 0,
        powerRankings: [],
      };
    }

    aggregatedPerformances[castId].screenTimeSeconds +=
      perf.screenTimeSeconds;
    aggregatedPerformances[castId].sketchCount += perf.sketchCount;
    aggregatedPerformances[castId].powerRankings.push(perf.powerRanking);
  });

  // Calculate average power ranking and format for display
  const displayPerformances: CastPerformanceDisplay[] = Object.values(
    aggregatedPerformances,
  )
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

  return {
    season: mostRecentSeason.seasonNumber,
    performances: displayPerformances,
    totalEpisodes: mostRecentSeason.numEpisodes,
  };
}

export async function SeasonLeaderboardSection() {
  const { season, performances, totalEpisodes } =
    await getSeasonLeaderboardData();

  const formatScreenTime = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    if (hours > 0) {
      return `${hours}:${String(minutes).padStart(2, "0")}:${String(
        secs,
      ).padStart(2, "0")}`;
    }

    return `${minutes}:${String(secs).padStart(2, "0")}`;
  };

  if (season === 0 || performances.length === 0) {
    return (
      <div className="border border-secondary/30 rounded-lg bg-secondary/20 p-8 text-center">
        <p className="text-[#8A8885]">No season data available</p>
      </div>
    );
  }

  return (
    <div className="relative w-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <span className="inline-block bg-primary/10 border border-primary px-3 py-1 rounded-full text-primary font-mono font-bold text-xs uppercase mb-3 sm:mb-0">
            Season {season} Leaderboard
          </span>
          <h3 className="font-heading text-2xl sm:text-3xl font-bold text-white mt-3 sm:mt-0">
            Real-time Cast Performance
          </h3>
        </div>
      </div>

      {/* Leaderboard Table */}
      <div className="border border-secondary/30 rounded-lg overflow-hidden bg-secondary/20 backdrop-blur-sm">
        {/* Table Header */}
        <div className="grid grid-cols-12 gap-4 px-4 sm:px-6 py-4 bg-secondary/40 border-b border-secondary/30 font-mono text-xs uppercase font-bold text-[#8A8885]">
          <div className="col-span-1 text-center">Rank</div>
          <div className="col-span-5 sm:col-span-4">Cast Member</div>
          <div className="col-span-2 text-right">Screen Time</div>
          <div className="col-span-2 text-right">Sketches</div>
          <div className="col-span-2 text-right">Avg PWR</div>
        </div>

        {/* Table Rows */}
        {performances.map((perf, idx) => (
          <div
            key={perf.castMemberId}
            className="grid grid-cols-12 gap-4 px-4 sm:px-6 py-4 border-b border-secondary/20 hover:bg-secondary/30 transition-colors duration-base items-center last:border-b-0"
          >
            {/* Rank */}
            <div className="col-span-1">
              <p className="text-primary font-mono font-bold text-lg text-center">
                {idx + 1}
              </p>
            </div>

            {/* Cast Member */}
            <div className="col-span-5 sm:col-span-4">
              <Link href={`/cast/${perf.slug}`} className="group flex items-center gap-2">
                {perf.headshot && (
                  <div className="relative w-8 h-8 flex-shrink-0 rounded-full overflow-hidden border border-primary/30 group-hover:border-primary transition-colors">
                    <Image
                      src={perf.headshot}
                      alt={perf.name}
                      fill
                      className="object-cover"
                      sizes="32px"
                    />
                  </div>
                )}
                <span className="text-white font-semibold group-hover:text-primary transition-colors line-clamp-1">
                  {perf.name}
                </span>
              </Link>
            </div>

            {/* Screen Time */}
            <div className="col-span-2 text-right">
              <p className="text-tertiary font-mono text-sm">
                {formatScreenTime(perf.screenTimeSeconds)}
              </p>
            </div>

            {/* Sketches */}
            <div className="col-span-2 text-right">
              <p className="text-tertiary font-mono text-sm">
                {perf.sketchCount}
              </p>
            </div>

            {/* Avg PWR */}
            <div className="col-span-2 text-right">
              <p className="text-primary font-mono font-bold text-sm">
                {perf.powerRanking.toFixed(1)} / 100
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* View Full Rankings Link */}
      <div className="mt-6 text-center">
        <Link
          href={`/seasons/${season}`}
          className="inline-flex items-center gap-2 text-primary hover:text-tertiary transition-colors duration-base font-mono font-bold text-sm uppercase"
        >
          View Full Season Rankings
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </Link>
      </div>
    </div>
  );
}