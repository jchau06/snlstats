// scripts/generateAllStats.ts
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

        console.log(`✅ ${castMember.name} (${yearsDisplay})`);
        created++;
      } catch (error) {
        console.error(
          `❌ Error processing ${castMember.name}:`,
          error instanceof Error ? error.message : error
        );
      }
    }

    console.log(`\n✨ CastMemberCareerStats: ${created} cast members processed\n`);
  } catch (error) {
    console.error("❌ Error:", error);
    process.exit(1);
  }
}

async function generateSeasonLeaders() {
  console.log("🚀 Starting SeasonLeaders generation...\n");

  try {
    // Get all seasons
    const allSeasons = await prisma.season.findMany({
      orderBy: { seasonNumber: "asc" },
    });
    console.log(`Found ${allSeasons.length} seasons\n`);

    for (const season of allSeasons) {
      // Get all SeasonStats for this season
      const seasonStats = await prisma.seasonStats.findMany({
        where: { seasonId: season.id },
        include: {
          castMember: {
            select: { id: true, name: true },
          },
        },
      });

      if (seasonStats.length === 0) {
        console.log(`⏭️  Season ${season.seasonNumber}: No stats found`);
        continue;
      }

      // Get #1 in Screen Time (only 1 leader)
      const screenTimeLeader = [...seasonStats]
        .sort((a, b) => b.totalScreenTimeSeconds - a.totalScreenTimeSeconds)[0]
        ?.castMemberId;

      // Get #1 in Sketches (only 1 leader)
      const sketchesLeader = [...seasonStats]
        .sort((a, b) => b.totalAppearances - a.totalAppearances)[0]
        ?.castMemberId;

      // Get #1 in Power Ranking (only 1 leader)
      const powerLeader = [...seasonStats]
        .sort((a, b) => b.powerRankingSeason - a.powerRankingSeason)[0]
        ?.castMemberId;

      // Print leaders for this season
      const screenTimeLeaderName = seasonStats.find(
        (s) => s.castMemberId === screenTimeLeader
      )?.castMember.name;
      const sketchesLeaderName = seasonStats.find(
        (s) => s.castMemberId === sketchesLeader
      )?.castMember.name;
      const powerLeaderName = seasonStats.find(
        (s) => s.castMemberId === powerLeader
      )?.castMember.name;

      console.log(
        `📊 Season ${season.seasonNumber} (${season.yearStarted}-${season.yearEnded})`
      );
      console.log(
        `   🏆 Screen Time: ${screenTimeLeaderName}`
      );
      console.log(
        `   🎬 Sketches: ${sketchesLeaderName}`
      );
      console.log(
        `   ⚡ Power Ranking: ${powerLeaderName}`
      );

      // Upsert SeasonLeaders for each cast member
      for (const stat of seasonStats) {
        const isScreenTimeLeader = stat.castMemberId === screenTimeLeader;
        const isSketchLeader = stat.castMemberId === sketchesLeader;
        const isPowerRankingLeader = stat.castMemberId === powerLeader;

        await prisma.seasonLeaders.upsert({
          where: {
            seasonId_castMemberId: {
              seasonId: season.id,
              castMemberId: stat.castMemberId,
            },
          },
          create: {
            seasonId: season.id,
            castMemberId: stat.castMemberId,
            isScreenTimeLeader,
            isSketchLeader,
            isPowerRankingLeader,
          },
          update: {
            isScreenTimeLeader,
            isSketchLeader,
            isPowerRankingLeader,
          },
        });
      }

      console.log(
        `✅ Season ${season.seasonNumber}: ${seasonStats.length} cast members processed\n`
      );
    }

    console.log("✨ SeasonLeaders generation complete!\n");
  } catch (error) {
    console.error("❌ Error:", error);
    process.exit(1);
  }
}

async function main() {
  console.log("════════════════════════════════════════════════════");
  console.log("  SNL Stats - Generate Career Stats & Season Leaders");
  console.log("════════════════════════════════════════════════════\n");

  try {
    await generateCastMemberCareerStats();
    await generateSeasonLeaders();

    console.log("════════════════════════════════════════════════════");
    console.log("✨ All stats generated successfully!");
    console.log("════════════════════════════════════════════════════");
  } catch (error) {
    console.error("❌ Fatal Error:", error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();