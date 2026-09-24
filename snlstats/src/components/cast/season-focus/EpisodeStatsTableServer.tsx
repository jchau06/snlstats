// src/components/cast/EpisodeStatsTableServer.tsx
import { prisma } from "@/src/lib/prisma";
import { EpisodeStatsTable } from "./EpisodeStatsTable";

interface EpisodeStatsTableServerProps {
  castMemberId: string;
  seasonId: string;
  seasonNumber: number;
  className?: string;
}

export async function EpisodeStatsTableServer({
  castMemberId,
  seasonId,
  seasonNumber,
  className,
}: EpisodeStatsTableServerProps) {
  // Fetch all cast performances in this season
  const performances = await prisma.castPerformance.findMany({
    where: {
      castMemberId,
      episode: { seasonId },
    },
    include: {
      episode: {
        select: {
          episodeNumber: true,
          host: true,
          musicalGuest: true,
          airDate: true,
          id: true,
        },
      },
    },
  });

  if (performances.length === 0) {
    return null;
  }

  // Fetch all performances for all episodes in this season at once
  const allSeasonPerformances = await prisma.castPerformance.findMany({
    where: {
      episode: { seasonId },
    },
    select: {
      episodeId: true,
      castMemberId: true,
      powerRanking: true,
    },
  });

  // Group performances by episode for ranking calculation
  const performancesByEpisode = new Map<
    string,
    Array<{ castMemberId: string; powerRanking: number }>
  >();

  allSeasonPerformances.forEach((perf) => {
    if (!performancesByEpisode.has(perf.episodeId)) {
      performancesByEpisode.set(perf.episodeId, []);
    }
    performancesByEpisode.get(perf.episodeId)!.push({
      castMemberId: perf.castMemberId,
      powerRanking: Number(perf.powerRanking),
    });
  });

  // Transform to chart data with rankings
  const data = performances.map((perf) => {
    // If host == musical guest, only show host (double-duty)
    const host = perf.episode.host ?? "Unknown";
    const guest = perf.episode.musicalGuest;

    const hostMusicalGuest: string =
      host === guest ? host : guest ? `${host} / ${guest}` : host;

    // Get rankings for this episode
    const episodePerfs = performancesByEpisode.get(perf.episode.id) || [];
    const sorted = episodePerfs
      .sort((a, b) => b.powerRanking - a.powerRanking)
      .map((p, idx) => ({ castMemberId: p.castMemberId, rank: idx + 1 }));

    const rankEntry = sorted.find((r) => r.castMemberId === castMemberId);
    const rank = rankEntry?.rank || episodePerfs.length;

    return {
      episodeNumber: perf.episode.episodeNumber,
      hostMusicalGuest,
      airDate: perf.episode.airDate.toISOString().split("T")[0],
      powerRanking: Number(perf.powerRanking),
      screenTimeSeconds: perf.screenTimeSeconds,
      segmentCount: perf.sketchCount,
      castRank: rank,
      totalCastInEpisode: episodePerfs.length,
      seasonNumber,
    };
  });

  return (
    <div className={className}>
      <EpisodeStatsTable data={data} />
    </div>
  );
}
