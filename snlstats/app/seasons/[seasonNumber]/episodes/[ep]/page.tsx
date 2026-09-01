// src/app/seasons/[seasonNumber]/episodes/[ep]/page.tsx
import { prisma } from "@/src/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Button } from "@/src/components/ui";
import { HeroSection } from "@/src/components/episode/HeroSection";
import { LfnyBadge } from "@/src/components/episode/LiveFromNewYorkBadge";
import { PerformanceAnalyticsSection } from "@/src/components/episode/PerformanceAnalyticsSection";
import { Header } from "@/src/components/ui/Header";

interface Props {
  params: Promise<{
    seasonNumber: string;
    ep: string;
  }>;
}

export async function generateStaticParams() {
  const episodes = await prisma.episode.findMany({
    include: { season: true },
  });

  return episodes.map((ep) => ({
    seasonNumber: ep.season.seasonNumber.toString(),
    ep: ep.episodeNumber.toString(),
  }));
}

export default async function EpisodePage({ params }: Props) {
  // In Next.js 15+, params is a Promise
  const { seasonNumber, ep } = await params;

  const seasonNum = parseInt(seasonNumber, 10);
  const episodeNum = parseInt(ep, 10);

  // Validate parsed values
  if (isNaN(seasonNum) || isNaN(episodeNum)) {
    notFound();
  }

  // Fetch episode with all related data
  const episode = await prisma.episode.findFirst({
    where: {
      episodeNumber: episodeNum,
      season: { seasonNumber: seasonNum },
    },
    include: {
      season: true,
      performances: {
        include: { castMember: true },
        orderBy: { screenTimeSeconds: "desc" },
      },
      liveFromNewYork: true,
    },
  });

  if (!episode) {
    notFound();
  }

  // Get LFNY cast with full details
  const lfnyCastMembers = episode.liveFromNewYork?.castMemberIds
    ? await Promise.all(
        episode.liveFromNewYork.castMemberIds.map(async (id) => {
          const cm = await prisma.castMember.findUnique({
            where: { id },
            select: { id: true, name: true, slug: true },
          });
          return cm;
        }),
      ).then((members) => members.filter(Boolean) as any[])
    : [];

  // Transform performance data for charts
  const performanceData = episode.performances.map((perf) => ({
    id: perf.id,
    name: perf.castMember.name,
    slug: perf.castMember.slug,
    headshot: perf.castMember.headshot || undefined,
    screenTimeSeconds: perf.screenTimeSeconds,
    sketchCount: perf.sketchCount,
    powerRanking: Number(perf.powerRanking),
    status: perf.status,
  }));

  return (
    <>
      <Header />
      <div className="w-full bg-neutral">
        {/* Hero Section */}
        <div className="px-4 md:px-8 py-8">
          <div className="max-w-6xl mx-auto">
            <HeroSection
              images={episode.imageUrls || []}
              season={seasonNum}
              episode={episodeNum}
              airDate={new Date(episode.airDate)}
              host={episode.host || "TBD"}
              musicalGuest={episode.musicalGuest || "TBD"}
              liveFromNewYorkCast={[]}
            />
          </div>
        </div>

        {/* Main Content Container */}
        <div className="px-4 md:px-8 py-4">
          <div className="max-w-6xl mx-auto">
            {/* Live From New York Section */}
            <LfnyBadge liveFromNewYorkCast={lfnyCastMembers} />

            {/* Performance Analytics Section */}
            <PerformanceAnalyticsSection data={performanceData} />

            {/* Navigation */}
            <div className="flex justify-between items-center pt-8 border-t border-[#2C2C2A]">
              {episodeNum > 1 ? (
                <Link href={`/seasons/${seasonNum}/episodes/${episodeNum - 1}`}>
                  <Button variant="outline" size="md">
                    ← Previous episode
                  </Button>
                </Link>
              ) : (
                <div />
              )}

              {episodeNum < (episode.season?.numEpisodes || 16) ? (
                <Link href={`/seasons/${seasonNum}/episodes/${episodeNum + 1}`}>
                  <Button variant="outline" size="md">
                    Next episode →
                  </Button>
                </Link>
              ) : (
                <div />
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
