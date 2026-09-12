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
  const castMembers = await prisma.castMember.findMany();
  const seasonStats = await prisma.seasonStats.findMany({
    select: {
      season: { select: { seasonNumber: true, yearStarted: true, yearEnded: true } },
      castMemberId: true,
    },
  });

  return seasonStats.map((stat) => ({
    castMember: stat.castMemberId, // Will need to get slug instead
    season: `${stat.season.yearStarted}-${stat.season.yearEnded}`,
  }));
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

  if (!castMember) {
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

  // Fetch career stats for total seasons and span
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
    careerStats.yearLeft && careerStats.yearLeft !== season.yearEnded
      ? `${careerStats.yearJoined} - ${careerStats.yearLeft}`
      : `${careerStats.yearJoined} - Present`;

  return (
    <>
      <Header />
      <div className="w-full bg-neutral">
        {/* Hero Section */}
        <CastMemberSeasonHeroServer
          castMemberId={castMember.id}
          castMemberName={castMember.name}
          totalSeasons={careerStats.totalSeasons}
          careerSpan={careerSpan}
          seasonNumber={season.seasonNumber}
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
            />
          </div>
        </div>
      </div>
    </>
  );
}