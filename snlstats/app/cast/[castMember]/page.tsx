// src/app/cast/[castMemberSlug]/page.tsx
import { prisma } from "@/src/lib/prisma";
import { notFound } from "next/navigation";
import { Header } from "@/src/components/ui/Header";
import { CastMemberHeroSection } from "@/src/components/cast/career-focus/CastMemberHeroSection";
import { CareerStatsSummary } from "@/src/components/cast/career-focus/CareerStatsSummary";
import { SeasonStatsChartServer } from "@/src/components/cast/career-focus/SeasonStatsChartServer";
import { SeasonBySeasonTableServer } from "@/src/components/cast/career-focus/SeasonBySeasonTableServer";

interface Props {
  params: Promise<{
    castMember: string;
  }>;
}

export async function generateStaticParams() {
  const castMembers = await prisma.castMember.findMany();
  return castMembers.map((castMember) => ({
    castMember: castMember.slug,
  }));
}

export default async function CastMemberPage({ params }: Props) {
  // In Next.js 15+, params is a Promise
  const { castMember: castMemberSlug } = await params;

  // Debug: log the slug to verify it's coming through
  if (!castMemberSlug) {
    notFound();
  }

  // Fetch cast member by slug
  const castMember = await prisma.castMember.findUnique({
    where: { slug: castMemberSlug },
  });

  if (!castMember) {
    notFound();
  }

  // Fetch career stats for this cast member
  // Note: Prisma model name is CastMemberCareerStats, generates as castMemberCareerStats
  const careerStats = await prisma.castMemberCareerStats.findUnique({
    where: { castMemberId: castMember.id },
  });

  if (!careerStats) {
    notFound();
  }

  // Fetch all season leaders for this cast member
  const seasonLeaders = await prisma.seasonLeaders.findMany({
    where: { castMemberId: castMember.id },
    include: {
      season: {
        select: {
          seasonNumber: true,
        },
      },
    },
  });

  // Build leadership badges grouped by category
  interface LeadershipBadge {
    category: "screenTime" | "sketches" | "powerRanking";
    seasons: string[];
  }

  const leadershipMap: Record<string, string[]> = {};

  seasonLeaders.forEach((leader) => {
    const seasonLabel = `S${leader.season.seasonNumber}`;

    if (leader.isScreenTimeLeader) {
      if (!leadershipMap["screenTime"]) leadershipMap["screenTime"] = [];
      leadershipMap["screenTime"].push(seasonLabel);
    }

    if (leader.isSketchLeader) {
      if (!leadershipMap["sketches"]) leadershipMap["sketches"] = [];
      leadershipMap["sketches"].push(seasonLabel);
    }

    if (leader.isPowerRankingLeader) {
      if (!leadershipMap["powerRanking"]) leadershipMap["powerRanking"] = [];
      leadershipMap["powerRanking"].push(seasonLabel);
    }
  });

  const leadershipBadges: LeadershipBadge[] = [];

  if (leadershipMap["screenTime"]) {
    leadershipBadges.push({
      category: "screenTime",
      seasons: leadershipMap["screenTime"].sort((a, b) => {
        const aNum = parseInt(a.substring(1));
        const bNum = parseInt(b.substring(1));
        return aNum - bNum;
      }),
    });
  }

  if (leadershipMap["sketches"]) {
    leadershipBadges.push({
      category: "sketches",
      seasons: leadershipMap["sketches"].sort((a, b) => {
        const aNum = parseInt(a.substring(1));
        const bNum = parseInt(b.substring(1));
        return aNum - bNum;
      }),
    });
  }

  if (leadershipMap["powerRanking"]) {
    leadershipBadges.push({
      category: "powerRanking",
      seasons: leadershipMap["powerRanking"].sort((a, b) => {
        const aNum = parseInt(a.substring(1));
        const bNum = parseInt(b.substring(1));
        return aNum - bNum;
      }),
    });
  }

  return (
    <>
      <Header />
      <div className="w-full bg-neutral">
        {/* Hero Section */}
        <CastMemberHeroSection
          name={castMember.name}
          headshot={
            castMember.headshot ||
            "https://wxvqsqaokhjefplzglgk.supabase.co/storage/v1/object/public/snlstats-images/placeholder.jpg"
          }
          status={castMember.status}
          yearJoined={careerStats.yearJoined}
          yearLeft={careerStats.yearLeft}
          totalSeasons={careerStats.totalSeasons}
          totalEpisodes={careerStats.totalEpisodes}
          leadershipBadges={leadershipBadges}
        />

        {/* Career Stats Section */}
        <div className="border-t border-secondary/30">
          <CareerStatsSummary
            totalAppearances={careerStats.totalAppearances}
            averageAppearancesPerEp={Number(
              careerStats.averageAppearancesPerEp,
            )}
            totalLiveFromNewYorks={careerStats.totalLiveFromNewYorks}
            totalScreenTimeSeconds={careerStats.totalScreenTimeSeconds}
            averageScreenTimeSeconds={Number(
              careerStats.averageScreenTimeSeconds,
            )}
            averagePowerRanking={Number(careerStats.averagePowerRanking)}
          />
        </div>

        {/* Season Stats Chart Section */}
        <div className="px-4 md:px-8 py-4 border-t border-secondary/30">
          <div className="max-w-6xl mx-auto">
            <SeasonStatsChartServer castMemberId={castMember.id} />
          </div>
        </div>

        {/* Season-by-Season Table Section */}
        <div className="px-4 md:px-8 py-4 border-t border-secondary/30">
          <div className="max-w-6xl mx-auto">
            <SeasonBySeasonTableServer
              castMemberId={castMember.id}
              castMemberSlug={castMember.slug}
            />
          </div>
        </div>
      </div>
    </>
  );
}
