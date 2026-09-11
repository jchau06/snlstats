// scripts/generateCastMemberCareerStats.ts
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function generateCastMemberCareerStats() {
  console.log("🚀 Starting CastMemberCareerStats generation...\n");

  try {
    // Fetch all LFNY data once (optimization)
    const allLFNYs = await prisma.liveFromNewYork.findMany();
    const lfnyBycastMemberId: { [castMemberId: string]: number } = {};
    
    for (const lfny of allLFNYs) {
      for (const castMemberId of lfny.castMemberIds) {
        lfnyBycastMemberId[castMemberId] =
          (lfnyBycastMemberId[castMemberId] || 0) + 1;
      }
    }

    // Fetch all seasons for year lookups
    const allSeasons = await prisma.season.findMany();
    const seasonMap: { [seasonNumber: number]: { yearStarted: number; yearEnded: number } } = {};
    for (const season of allSeasons) {
      seasonMap[season.seasonNumber] = {
        yearStarted: season.yearStarted,
        yearEnded: season.yearEnded,
      };
    }

    // Get all cast members
    const allCastMembers = await prisma.castMember.findMany();
    console.log(`Found ${allCastMembers.length} cast members\n`);

    let created = 0;

    for (const castMember of allCastMembers) {
      try {
        // Get all non-absent performances for this cast member
        const performances = await prisma.castPerformance.findMany({
          where: {
            castMemberId: castMember.id,
            status: { not: "absent" },
          },
          include: {
            episode: {
              select: {
                seasonId: true,
              },
            },
          },
        });

        if (performances.length === 0) {
          console.log(`⏭️  ${castMember.name}: No performances (skipped)`);
          continue;
        }

        // Calculate career stats
        const uniqueSeasons = new Set(
          performances.map((p) => p.episode.seasonId)
        );
        const uniqueEpisodes = new Set(
          performances.map((p) => p.episodeId)
        );

        const totalScreenTimeSeconds = performances.reduce(
          (sum, p) => sum + p.screenTimeSeconds,
          0
        );
        const totalAppearances = performances.reduce(
          (sum, p) => sum + p.sketchCount,
          0
        );
        
        const powerRankings = performances.map((p) =>
          typeof p.powerRanking === "number"
            ? p.powerRanking
            : Number(p.powerRanking)
        );
        
        const averagePowerRanking =
          powerRankings.length > 0
            ? powerRankings.reduce((sum, pr) => sum + pr, 0) /
              powerRankings.length
            : 0;

        const totalEpisodes = uniqueEpisodes.size;
        const averageScreenTimeSeconds =
          totalScreenTimeSeconds / totalEpisodes;
        const averageAppearancesPerEp = totalAppearances / totalEpisodes;
        const totalLiveFromNewYorks = lfnyBycastMemberId[castMember.id] || 0;

        // Get year joined and year left
        let yearJoined: number | null = null;
        let yearLeft: number | null = null;

        if (castMember.joinSeason && seasonMap[castMember.joinSeason]) {
          yearJoined = seasonMap[castMember.joinSeason].yearStarted;
        }

        if (castMember.leaveSeason && seasonMap[castMember.leaveSeason]) {
          yearLeft = seasonMap[castMember.leaveSeason].yearEnded;
        }

        // Upsert career stats
        await prisma.castMemberCareerStats.upsert({
          where: { castMemberId: castMember.id },
          create: {
            castMemberId: castMember.id,
            totalSeasons: uniqueSeasons.size,
            totalEpisodes,
            totalScreenTimeSeconds,
            totalAppearances,
            averageScreenTimeSeconds: Math.round(
              averageScreenTimeSeconds * 100
            ) / 100,
            averageAppearancesPerEp: Math.round(
              averageAppearancesPerEp * 100
            ) / 100,
            averagePowerRanking: Math.round(averagePowerRanking * 100) / 100,
            totalLiveFromNewYorks,
            yearJoined,
            yearLeft,
          },
          update: {
            totalSeasons: uniqueSeasons.size,
            totalEpisodes,
            totalScreenTimeSeconds,
            totalAppearances,
            averageScreenTimeSeconds: Math.round(
              averageScreenTimeSeconds * 100
            ) / 100,
            averageAppearancesPerEp: Math.round(
              averageAppearancesPerEp * 100
            ) / 100,
            averagePowerRanking: Math.round(averagePowerRanking * 100) / 100,
            totalLiveFromNewYorks,
            yearJoined,
            yearLeft,
          },
        });

        const yearsDisplay = yearJoined
          ? yearLeft
            ? `${yearJoined}-${yearLeft}`
            : `${yearJoined}-Present`
          : "Unknown";

        console.log(`✅ ${castMember.name}`);
        console.log(
          `   ${yearsDisplay} | Seasons: ${uniqueSeasons.size} | Episodes: ${totalEpisodes} | Screen Time: ${(totalScreenTimeSeconds / 3600).toFixed(1)}h`
        );

        created++;
      } catch (error) {
        console.error(
          `❌ Error processing ${castMember.name}:`,
          error instanceof Error ? error.message : error
        );
      }
    }

    console.log(`\n✨ Complete! Created/Updated: ${created} cast members`);
  } catch (error) {
    console.error("❌ Error:", error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

generateCastMemberCareerStats();