// src/app/cast/[castMember]/[season]/page.tsx
import { prisma } from "@/src/lib/prisma";
import { notFound } from "next/navigation";
import { Header } from "@/src/components/ui/Header";
import { CastMemberSeasonHeroServer } from "@/src/components/cast/CastMemberSeasonHeroServer";
import { SeasonStatsSummary } from "@/src/components/cast/SeasonStatsSummary";

interface Props {
  params: Promise<{
    castMember: string;
    season: string;
  }>;
}

export async function generateStaticParams() {
  // Generate all combinations of cast members and seasons
  const seasonStats = await prisma.seasonStats.findMany({
    select: {
      season: { select: { seasonNumber: true, yearStarted: true, yearEnded: true } },
      castMemberId: true,
    },
  });

  // Map castMemberId to slug
  const castMembers = await prisma.castMember.findMany({
    select: { id: true, slug: true },
  });

  const castMemberMap = new Map(castMembers.map((cm) => [cm.id, cm.slug]));

  return seasonStats
    .map((stat) => {
      const slug = castMemberMap.get(stat.castMemberId);
      if (!slug) return null;
      return {
        castMember: slug,
        season: `${stat.season.yearStarted}-${stat.season.yearEnded}`,
      };
    })
    .filter((item) => item !== null);
}

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
      <Header />
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
              averageScreenTimeSeconds={Number(seasonStats.averageScreenTimeSeconds)}
              averagePowerRanking={Number(seasonStats.powerRankingSeason)}
              lfnyCount={lfnyCount}
              seasonNumber={season.seasonNumber}
            />
          </div>
        </div>
      </div>
    </>
  );
}