// src/app/seasons/[seasonNumber]/page.tsx
import { prisma } from "@/src/lib/prisma";
import { notFound } from "next/navigation";
import { Header } from "@/src/components/ui/Header";
import { SeasonHeroSection } from "@/src/components/season/SeasonHeroSection";
import { EpisodeGrid } from "@/src/components/ui/EpisodeGrid";
import { SeasonCastGrid } from "@/src/components/season/SeasonCastGrid";
import { SeasonStatsTable } from "@/src/components/season/SeasonStatsTable";

interface Props {
  params: Promise<{
    seasonNumber: string;
  }>;
}

export async function generateStaticParams() {
  const seasons = await prisma.season.findMany();
  return seasons.map((season) => ({
    seasonNumber: season.seasonNumber.toString(),
  }));
}

export default async function SeasonPage({ params }: Props) {
  // In Next.js 15+, params is a Promise
  const { seasonNumber } = await params;

  const seasonNum = parseInt(seasonNumber, 10);

  // Validate parsed value
  if (isNaN(seasonNum)) {
    notFound();
  }

  // Fetch season with all related data
  const season = await prisma.season.findUnique({
    where: { seasonNumber: seasonNum },
    include: {
      episodes: {
        orderBy: { episodeNumber: "asc" },
        select: {
          id: true,
          episodeNumber: true,
          airDate: true,
          host: true,
          musicalGuest: true,
          slug: true,
          seasonId: true,
          imageUrls: true,
          liveFromNewYork: true,
        },
      },
      castMembers: {
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
        orderBy: [
          { status: "asc" },
          { castMember: { name: "asc" } },
        ],
      },
      castMedia: {
        where: { imageType: "season-opening" },
      },
    },
  });

  if (!season) {
    notFound();
  }

  // Fetch all CastPerformance records for this season
  const performances = await prisma.castPerformance.findMany({
    where: {
      episode: {
        seasonId: season.id,
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
      episode: {
        select: {
          episodeNumber: true,
        },
      },
    },
  });

  // Build LFNY count map
  const lfnyCountMap: { [castMemberId: string]: number } = {};
  season.episodes.forEach((ep) => {
    if (ep.liveFromNewYork?.castMemberIds) {
      ep.liveFromNewYork.castMemberIds.forEach((castMemberId) => {
        lfnyCountMap[castMemberId] = (lfnyCountMap[castMemberId] || 0) + 1;
      });
    }
  });

  // Build LFNY count by episode for range filtering
  const lfnyCountByEpisode: { [episodeNumber: number]: string[] } = {};
  season.episodes.forEach((ep) => {
    if (ep.liveFromNewYork?.castMemberIds) {
      lfnyCountByEpisode[ep.episodeNumber] = ep.liveFromNewYork.castMemberIds;
    }
  });

  // Transform performance data for SeasonStatsTable
  const performanceData = performances.map((perf) => ({
    castMemberId: perf.castMember.id,
    name: perf.castMember.name,
    slug: perf.castMember.slug,
    headshot: perf.castMember.headshot || undefined,
    episodeNumber: perf.episode.episodeNumber,
    screenTimeSeconds: perf.screenTimeSeconds || 0,
    sketchCount: perf.sketchCount || 0,
    powerRanking: Number(perf.powerRanking) || 0,
  }));

  // Transform episode data for EpisodeGrid
  const episodes = season.episodes.map((ep) => ({
    id: ep.id,
    seasonNumber: seasonNum,
    episodeNumber: ep.episodeNumber,
    airDate: ep.airDate,
    host: ep.host || "TBD",
    musicalGuest: ep.musicalGuest || "TBD",
    slug: ep.slug,
    imageUrls: ep.imageUrls || [],
  }));

  // Transform cast data for SeasonCastGrid with season-opening images
  const castMembers = season.castMembers
    .sort((a, b) => {
      // Priority: repertory first, then featured
      const statusOrder = { repertory: 0, featured: 1 };
      const statusA = statusOrder[a.status as keyof typeof statusOrder] ?? 2;
      const statusB = statusOrder[b.status as keyof typeof statusOrder] ?? 2;

      if (statusA !== statusB) {
        return statusA - statusB;
      }

      // Then alphabetically by name
      return a.castMember.name.localeCompare(b.castMember.name);
    })
    .map((sc) => {
      // Find season-opening image for this cast member
      const seasonOpeningMedia = season.castMedia.find(
        (media) => media.castMemberId === sc.castMember.id
      );

      return {
        id: sc.castMember.id,
        name: sc.castMember.name,
        slug: sc.castMember.slug,
        seasonOpeningImageUrl: seasonOpeningMedia?.imageUrl,
        status: (sc.status as "repertory" | "featured") || "repertory",
      };
    });

  return (
    <>
      <Header />
      <div className="w-full bg-neutral">
        {/* Hero Section */}
        <div className="px-4 md:px-8 py-8">
          <div className="max-w-6xl mx-auto">
            <SeasonHeroSection
              seasonNumber={season.seasonNumber}
              yearStarted={season.yearStarted}
              yearEnded={season.yearEnded}
              numEpisodes={season.numEpisodes}
              numCastMembers={season.castMembers.length}
              heroImageUrl={
                season.heroImageUrl ||
                "https://wxvqsqaokhjefplzglgk.supabase.co/storage/v1/object/public/snl-season-media/placeholder.jpg"
              }
            />
          </div>
        </div>

        {/* Main Content Container */}
        <div className="px-4 md:px-8 py-4">
          <div className="max-w-6xl mx-auto">
            {/* Episodes Section */}
            <section className="py-8 border-t border-[#2C2C2A]">
              <h2 className="font-heading text-h3 text-tertiary font-bold mb-6">
                EPISODES
              </h2>
              <EpisodeGrid episodes={episodes} />
            </section>

            {/* Cast Section */}
            <section className="py-8 border-t border-[#2C2C2A]">
              <h2 className="font-heading text-h3 text-tertiary font-bold mb-6">
                CAST
              </h2>
              <SeasonCastGrid castMembers={castMembers} columns="auto" />
            </section>

            {/* Cast Performance Stats Section */}
            <section className="py-8 border-t border-[#2C2C2A] pb-12">
              <h2 className="font-heading text-h3 text-tertiary font-bold mb-6">
                CAST PERFORMANCE
              </h2>
              <SeasonStatsTable
                performanceData={performanceData}
                lfnyCountByEpisode={lfnyCountByEpisode}
                totalEpisodes={season.numEpisodes}
              />
            </section>
          </div>
        </div>
      </div>
    </>
  );
}