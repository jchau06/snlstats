import { prisma } from "@/src/lib/prisma";
import { CombinedCastPageClient } from "./CombinedCastPageClient";

async function fetchAndTransformCastMembers(
  filter?: "current" | "alumni"
) {
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

  let filteredMembers = castMembers;

  if (filter === "current") {
    filteredMembers = castMembers.filter(
      (m) => m.leaveSeason === null && m.status !== "alumni"
    );
  } else if (filter === "alumni") {
    filteredMembers = castMembers.filter((m) => m.status === "alumni");
  }

  return filteredMembers.map((member) => {
    const currentSeasonCast = member.seasonCast
      ? member.seasonCast[member.seasonCast.length - 1]
      : null;

    return {
      id: member.id,
      name: member.name,
      slug: member.slug,
      headshot: member.headshot,
      status: member.status,
      joinSeason: member.joinSeason,
      leaveSeason: member.leaveSeason,
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
        : null,
    };
  });
}

export async function CombinedCastPageServer() {
  // Fetch all three datasets
  const [allCastMembers, currentCastMembers, alumniCastMembers] =
    await Promise.all([
      fetchAndTransformCastMembers(),
      fetchAndTransformCastMembers("current"),
      fetchAndTransformCastMembers("alumni"),
    ]);

  return (
    <CombinedCastPageClient
      castMembers={allCastMembers}
      currentCastMembers={currentCastMembers}
      alumniCastMembers={alumniCastMembers}
    />
  );
}