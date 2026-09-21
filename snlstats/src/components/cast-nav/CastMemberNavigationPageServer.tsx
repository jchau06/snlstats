// src/components/cast-nav/CastMemberNavigationPageServer.tsx
import { prisma } from "@/src/lib/prisma";
import { CastMemberNavigationPageClient } from "./CastMemberNavigationPageClient";

interface CastMemberNavigationPageServerProps {
  showAlumni?: boolean;
}

export async function CastMemberNavigationPageServer({
  showAlumni = false,
}: CastMemberNavigationPageServerProps) {
  // Fetch current cast members with their season cast data and career stats
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

  // Separate current and alumni based on filter and cast member status
  let filteredCastMembers = castMembers;

  if (showAlumni) {
    // Alumni: status is "alumni" in CastMember
    filteredCastMembers = castMembers.filter((m) => m.status === "alumni");
  } else {
    // Current cast: leaveSeason is null (not alumni)
    filteredCastMembers = castMembers.filter(
      (m) => m.leaveSeason === null && m.status !== "alumni",
    );
  }

  // Transform data for client component
  const transformedCastMembers = filteredCastMembers.map((member) => {
    const currentSeasonCast = member.seasonCast
      ? member.seasonCast[member.seasonCast.length - 1]
      : null;

    return {
      id: member.id,
      name: member.name,
      slug: member.slug,
      headshot: member.headshot ?? undefined, // Convert null to undefined
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
            totalScreenTimeSeconds: member.careerStats.totalScreenTimeSeconds,
            averageScreenTimeSeconds: Number(
              member.careerStats.averageScreenTimeSeconds,
            ),
            averageAppearancesPerEp: Number(
              member.careerStats.averageAppearancesPerEp,
            ),
            averagePowerRanking: Number(member.careerStats.averagePowerRanking),
            totalLiveFromNewYorks: member.careerStats.totalLiveFromNewYorks,
            totalSeasons: member.careerStats.totalSeasons,
            totalEpisodes: member.careerStats.totalEpisodes,
          }
        : undefined, // Convert null to undefined
    };
  });

  return (
    <CastMemberNavigationPageClient
      castMembers={transformedCastMembers}
      isAlumniPage={showAlumni}
    />
  );
}
