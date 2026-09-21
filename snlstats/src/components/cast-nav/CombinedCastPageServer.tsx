import { prisma } from "@/src/lib/prisma";
import { CombinedCastPageWrapper } from "./CombinedCastPageWrapper";

async function fetchAndTransformCastMembers() {
  const castMembers = await prisma.castMember.findMany({
    include: {
      seasonCast: {
        select: {
          seasonId: true,
          status: true,
          season: {
            select: {
              seasonNumber: true,
            },
          },
        },
      },
      careerStats: true,
    },
    orderBy: { name: "asc" },
  });

  return castMembers.map((member) => {
    const currentSeasonCast = member.seasonCast
      ? member.seasonCast[member.seasonCast.length - 1]
      : null;

    return {
      id: member.id,
      name: member.name,
      slug: member.slug,
      headshot: member.headshot ?? undefined,
      status: member.status,
      joinSeason: member.joinSeason ?? undefined,
      leaveSeason: member.leaveSeason ?? undefined,
      seasonCastStatus: currentSeasonCast?.status as
        | "repertory"
        | "featured"
        | undefined,
      careerStats: member.careerStats
        ? {
            totalAppearances: member.careerStats.totalAppearances,
            totalScreenTimeSeconds:
              member.careerStats.totalScreenTimeSeconds,
            averageScreenTimeSeconds: Number(
              member.careerStats.averageScreenTimeSeconds
            ),
            averageAppearancesPerEp: Number(
              member.careerStats.averageAppearancesPerEp
            ),
            averagePowerRanking: Number(
              member.careerStats.averagePowerRanking
            ),
            totalLiveFromNewYorks: member.careerStats.totalLiveFromNewYorks,
            totalSeasons: member.careerStats.totalSeasons,
            totalEpisodes: member.careerStats.totalEpisodes,
          }
        : undefined,
    };
  });
}

export async function CombinedCastPageServer() {
  const allCastMembers = await fetchAndTransformCastMembers();

  const currentCastMembers = allCastMembers.filter(
    (m) => !m.leaveSeason && m.status !== "alumni"
  );

  const alumniCastMembers = allCastMembers.filter(
    (m) => m.status === "alumni"
  );

  return (
    <CombinedCastPageWrapper
      castMembers={allCastMembers}
      currentCastMembers={currentCastMembers}
      alumniCastMembers={alumniCastMembers}
    />
  );
}