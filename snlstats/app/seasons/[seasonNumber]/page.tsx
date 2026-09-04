// src/app/seasons/[seasonNumber]/page.tsx
import { prisma } from "@/src/lib/prisma";
import { notFound } from "next/navigation";
import { Header } from "@/src/components/ui/Header";
import { SeasonHeroSection } from "@/src/components/season/SeasonHeroSection";
import { EpisodeGrid } from "@/src/components/ui/EpisodeGrid";
import { CastGrid } from "@/src/components/ui/CastGrid";
import { DetailedStatsTable } from "@/src/components/episode/DetailedStatsTable";

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
          { status: "asc" }, // "featured" before "repertory" alphabetically, so reverse needed
          { castMember: { name: "asc" } }, // Then alphabetically by name
        ],
      },
      stats: {
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
        orderBy: { powerRankingSeason: "desc" },
      },
    },
  });

  if (!season) {
    notFound();
  }

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

  // Transform cast data for CastGrid (sorted by season status then name)
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
    .map((sc) => ({
      id: sc.castMember.id,
      name: sc.castMember.name,
      slug: sc.castMember.slug,
      headshot: sc.castMember.headshot || undefined,
      status: (sc.status as "repertory" | "featured") || "repertory",
    }));

  // Transform stats data for DetailedStatsTable
  const statsData = season.stats.map((stat) => ({
    id: stat.castMember.id,
    name: stat.castMember.name,
    slug: stat.castMember.slug,
    headshot: stat.castMember.headshot || undefined,
    screenTimeSeconds: stat.totalScreenTimeSeconds,
    sketchCount: stat.totalAppearances,
    powerRanking: Number(stat.powerRankingSeason),
    status: "present",
  }));

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
              <CastGrid
                castMembers={castMembers}
                showStats={false}
                columns="auto"
              />
            </section>

            {/* Cast Performance Stats Section */}
            <section className="py-8 border-t border-[#2C2C2A] pb-12">
              <h2 className="font-heading text-h3 text-tertiary font-bold mb-6">
                CAST PERFORMANCE
              </h2>
              <DetailedStatsTable data={statsData} />
            </section>
          </div>
        </div>
      </div>
    </>
  );
}