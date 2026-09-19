// src/app/cast/[castMember]/[season]/page.tsx
import { prisma } from "@/src/lib/prisma";
import { notFound } from "next/navigation";
import { CastMemberSeasonHeroServer } from "@/src/components/cast/season-focus/CastMemberSeasonHeroServer";
import { SeasonStatsSummary } from "@/src/components/cast/season-focus/SeasonStatsSummary";
import { EpisodeStatsChartServer } from "@/src/components/cast/season-focus/EpisodeStatsChartServer";
import { EpisodeStatsTableServer } from "@/src/components/cast/season-focus/EpisodeStatsTableServer";

interface Props {
  params: Promise<{
    castMember: string;
    season: string;
  }>;
}

// Use dynamic rendering for this high-cardinality route
export const dynamicParams = true;
export const revalidate = 3600; // Revalidate every hour

export default async function CastMemberSeasonPage({ params }: Props) {
  const { castMember: castMemberSlug, season: seasonRange } = await params;

  // Parse season range (e.g., "2025-2026")
  const [yearStart, yearEnd] = seasonRange.split("-").map(Number);
  if (!yearStart || !yearEnd) {
    notFound();
  }

  // Fetch cast member by slug
  const castMember = await prisma.castMember.findUnique({
    where: { slug: castMemberSlug },
  });

  if (!castMember || !castMember.joinSeason) {
    notFound();
  }

  // Fetch season by year range
  const season = await prisma.season.findFirst({
    where: {
      yearStarted: yearStart,
      yearEnded: yearEnd,
    },
  });

  if (!season) {
    notFound();
  }

  // Fetch career stats for career span
  const careerStats = await prisma.castMemberCareerStats.findUnique({
    where: { castMemberId: castMember.id },
  });

  if (!careerStats) {
    notFound();
  }

  // Fetch season stats
  const seasonStats = await prisma.seasonStats.findUnique({
    where: {
      seasonId_castMemberId: {
        seasonId: season.id,
        castMemberId: castMember.id,
      },
    },
  });

  if (!seasonStats) {
    notFound();
  }

  // Format career span
  const careerSpan =
    castMember.leaveSeason && castMember.leaveSeason !== season.yearEnded
      ? `Season ${castMember.joinSeason} - ${castMember.leaveSeason}`
      : `Season ${castMember.joinSeason} - Present`;

  const seasonYears = `${season.yearStarted}-${season.yearEnded}`;

  // Fetch LFNY count for this season
  const lfnyData = await prisma.liveFromNewYork.findMany({
    where: {
      episode: { seasonId: season.id },
      castMemberIds: {
        has: castMember.id,
      },
    },
  });
  const lfnyCount = lfnyData.length;

  return (
    <>
      <div className="w-full bg-neutral">
        {/* Hero Section */}
        <CastMemberSeasonHeroServer
          castMemberId={castMember.id}
          castMemberName={castMember.name}
          castMemberSlug={castMember.slug}
          castMemberJoinSeason={castMember.joinSeason}
          seasonNumber={season.seasonNumber}
          seasonYears={seasonYears}
          careerSpan={careerSpan}
        />

        {/* Season Stats Section */}
        <div className="px-4 md:px-8 py-8 border-t border-secondary/30">
          <div className="max-w-6xl mx-auto">
            <SeasonStatsSummary
              totalAppearances={seasonStats.totalAppearances}
              averageAppearances={Number(seasonStats.averageAppearances)}
              totalScreenTimeSeconds={seasonStats.totalScreenTimeSeconds}
              averageScreenTimeSeconds={Number(
                seasonStats.averageScreenTimeSeconds,
              )}
              averagePowerRanking={Number(seasonStats.powerRankingSeason)}
              lfnyCount={lfnyCount}
              seasonNumber={season.seasonNumber}
            />
          </div>
        </div>

        {/* Episode Stats Chart Section */}
        <div className="px-4 md:px-8 py-8 border-t border-secondary/30">
          <div className="max-w-6xl mx-auto">
            <EpisodeStatsChartServer
              castMemberId={castMember.id}
              seasonId={season.id}
              seasonNumber={season.seasonNumber}
            />
          </div>
        </div>

        {/* Episode Stats Table Section */}
        <div className="px-4 md:px-8 py-8 border-t border-secondary/30">
          <div className="max-w-6xl mx-auto">
            <EpisodeStatsTableServer
              castMemberId={castMember.id}
              seasonId={season.id}
              seasonNumber={season.seasonNumber}
            />
          </div>
        </div>
      </div>
    </>
  );
}
