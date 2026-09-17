// scripts/generateAllStats.ts
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function generateCastMemberCareerStats() {
  console.log("🚀 Starting CastMemberCareerStats generation...\n");

  try {
    // ---------------------------------------------------------
    // Fetch all LFNY data once
    // ---------------------------------------------------------

    const allLFNYs = await prisma.liveFromNewYork.findMany();

    const lfnyByCastMemberId: { [castMemberId: string]: number } = {};

    for (const lfny of allLFNYs) {
      for (const castMemberId of lfny.castMemberIds) {
        lfnyByCastMemberId[castMemberId] =
          (lfnyByCastMemberId[castMemberId] || 0) + 1;
      }
    }

    // ---------------------------------------------------------
    // Fetch all seasons for year lookups
    // ---------------------------------------------------------

    const allSeasons = await prisma.season.findMany();

    const seasonMap: {
      [seasonNumber: number]: {
        yearStarted: number;
        yearEnded: number;
      };
    } = {};

    for (const season of allSeasons) {
      seasonMap[season.seasonNumber] = {
        yearStarted: season.yearStarted,
        yearEnded: season.yearEnded,
      };
    }

    // ---------------------------------------------------------
    // Get all cast members
    // ---------------------------------------------------------

    const allCastMembers = await prisma.castMember.findMany();

    console.log(`Found ${allCastMembers.length} cast members\n`);

    let processed = 0;

    // ---------------------------------------------------------
    // Generate career stats
    // ---------------------------------------------------------

    for (const castMember of allCastMembers) {
      try {
        // Get all non-absent performances
        const performances = await prisma.castPerformance.findMany({
          where: {
            castMemberId: castMember.id,
            status: {
              not: "absent",
            },
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
          console.log(
            `⏭️  ${castMember.name}: No performances (skipped)`,
          );
          continue;
        }

        // -----------------------------------------------------
        // Calculate career totals
        // -----------------------------------------------------

        const uniqueSeasons = new Set(
          performances.map((p) => p.episode.seasonId),
        );

        const uniqueEpisodes = new Set(
          performances.map((p) => p.episodeId),
        );

        const totalScreenTimeSeconds = performances.reduce(
          (sum, p) => sum + p.screenTimeSeconds,
          0,
        );

        const totalAppearances = performances.reduce(
          (sum, p) => sum + p.sketchCount,
          0,
        );

        // -----------------------------------------------------
        // Calculate average power ranking
        // -----------------------------------------------------

        const powerRankings = performances
          .map((p) => Number(p.powerRanking))
          .filter((value) => !Number.isNaN(value));

        const averagePowerRanking =
          powerRankings.length > 0
            ? powerRankings.reduce((sum, pr) => sum + pr, 0) /
              powerRankings.length
            : 0;

        // -----------------------------------------------------
        // Calculate episode averages
        // -----------------------------------------------------

        const totalEpisodes = uniqueEpisodes.size;

        const averageScreenTimeSeconds =
          totalEpisodes > 0
            ? totalScreenTimeSeconds / totalEpisodes
            : 0;

        const averageAppearancesPerEp =
          totalEpisodes > 0
            ? totalAppearances / totalEpisodes
            : 0;

        const totalLiveFromNewYorks =
          lfnyByCastMemberId[castMember.id] || 0;

        // -----------------------------------------------------
        // Calculate year joined / year left
        //
        // IMPORTANT:
        // Only use a calculated value when the CastMember has
        // valid season information.
        // -----------------------------------------------------

        let calculatedYearJoined: number | null = null;
        let calculatedYearLeft: number | null = null;

        if (
          castMember.joinSeason !== null &&
          castMember.joinSeason !== undefined &&
          seasonMap[castMember.joinSeason]
        ) {
          calculatedYearJoined =
            seasonMap[castMember.joinSeason].yearStarted;
        }

        if (
          castMember.leaveSeason !== null &&
          castMember.leaveSeason !== undefined &&
          seasonMap[castMember.leaveSeason]
        ) {
          calculatedYearLeft =
            seasonMap[castMember.leaveSeason].yearEnded;
        }

        // -----------------------------------------------------
        // Get existing career stats
        // -----------------------------------------------------

        const existingCareerStats =
          await prisma.castMemberCareerStats.findUnique({
            where: {
              castMemberId: castMember.id,
            },
          });

        /*
         * Preserve existing yearJoined if CastMember.joinSeason
         * does not provide a valid value.
         *
         * This prevents a stats regeneration from doing:
         *
         *   existing yearJoined: 2020
         *   calculated yearJoined: null
         *
         * and accidentally changing it to:
         *
         *   yearJoined: null
         */
        const yearJoined =
          calculatedYearJoined ??
          existingCareerStats?.yearJoined ??
          null;

        /*
         * For yearLeft, use the current CastMember value when
         * available. Otherwise preserve the existing value.
         */
        const yearLeft =
          calculatedYearLeft ??
          existingCareerStats?.yearLeft ??
          null;

        // -----------------------------------------------------
        // Upsert career stats
        // -----------------------------------------------------

        await prisma.castMemberCareerStats.upsert({
          where: {
            castMemberId: castMember.id,
          },

          create: {
            castMemberId: castMember.id,

            totalSeasons: uniqueSeasons.size,
            totalEpisodes,

            totalScreenTimeSeconds,
            totalAppearances,

            averageScreenTimeSeconds:
              Math.round(averageScreenTimeSeconds * 100) / 100,

            averageAppearancesPerEp:
              Math.round(averageAppearancesPerEp * 100) / 100,

            averagePowerRanking:
              Math.round(averagePowerRanking * 100) / 100,

            totalLiveFromNewYorks,

            yearJoined,
            yearLeft,
          },

          update: {
            totalSeasons: uniqueSeasons.size,
            totalEpisodes,

            totalScreenTimeSeconds,
            totalAppearances,

            averageScreenTimeSeconds:
              Math.round(averageScreenTimeSeconds * 100) / 100,

            averageAppearancesPerEp:
              Math.round(averageAppearancesPerEp * 100) / 100,

            averagePowerRanking:
              Math.round(averagePowerRanking * 100) / 100,

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

        console.log(
          `✅ ${castMember.name} (${yearsDisplay})`,
        );

        processed++;
      } catch (error) {
        console.error(
          `❌ Error processing ${castMember.name}:`,
          error instanceof Error
            ? error.message
            : error,
        );
      }
    }

    console.log(
      `\n✨ CastMemberCareerStats: ${processed} cast members processed\n`,
    );
  } catch (error) {
    console.error("❌ Error:", error);
    process.exit(1);
  }
}

// =============================================================
// Generate Season Leaders
// =============================================================

async function generateSeasonLeaders() {
  console.log("🚀 Starting SeasonLeaders generation...\n");

  try {
    const allSeasons = await prisma.season.findMany({
      orderBy: {
        seasonNumber: "asc",
      },
    });

    console.log(`Found ${allSeasons.length} seasons\n`);

    for (const season of allSeasons) {
      const seasonStats = await prisma.seasonStats.findMany({
        where: {
          seasonId: season.id,
        },
        include: {
          castMember: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      });

      if (seasonStats.length === 0) {
        console.log(
          `⏭️  Season ${season.seasonNumber}: No stats found`,
        );
        continue;
      }

      // -------------------------------------------------------
      // Find leaders
      // -------------------------------------------------------

      const screenTimeLeader = [...seasonStats]
        .sort(
          (a, b) =>
            b.totalScreenTimeSeconds -
            a.totalScreenTimeSeconds,
        )[0]?.castMemberId;

      const sketchesLeader = [...seasonStats]
        .sort(
          (a, b) =>
            b.totalAppearances -
            a.totalAppearances,
        )[0]?.castMemberId;

      const powerLeader = [...seasonStats]
        .sort(
          (a, b) =>
            b.powerRankingSeason -
            a.powerRankingSeason,
        )[0]?.castMemberId;

      // -------------------------------------------------------
      // Print leaders
      // -------------------------------------------------------

      const screenTimeLeaderName = seasonStats.find(
        (s) => s.castMemberId === screenTimeLeader,
      )?.castMember.name;

      const sketchesLeaderName = seasonStats.find(
        (s) => s.castMemberId === sketchesLeader,
      )?.castMember.name;

      const powerLeaderName = seasonStats.find(
        (s) => s.castMemberId === powerLeader,
      )?.castMember.name;

      console.log(
        `📊 Season ${season.seasonNumber} (${season.yearStarted}-${season.yearEnded})`,
      );

      console.log(
        `   🏆 Screen Time: ${screenTimeLeaderName}`,
      );

      console.log(
        `   🎬 Sketches: ${sketchesLeaderName}`,
      );

      console.log(
        `   ⚡ Power Ranking: ${powerLeaderName}`,
      );

      // -------------------------------------------------------
      // Upsert SeasonLeaders
      // -------------------------------------------------------

      for (const stat of seasonStats) {
        const isScreenTimeLeader =
          stat.castMemberId === screenTimeLeader;

        const isSketchLeader =
          stat.castMemberId === sketchesLeader;

        const isPowerRankingLeader =
          stat.castMemberId === powerLeader;

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
        `✅ Season ${season.seasonNumber}: ${seasonStats.length} cast members processed\n`,
      );
    }

    console.log(
      "✨ SeasonLeaders generation complete!\n",
    );
  } catch (error) {
    console.error("❌ Error:", error);
    process.exit(1);
  }
}

// =============================================================
// Main
// =============================================================

async function main() {
  console.log(
    "════════════════════════════════════════════════════",
  );
  console.log(
    "  SNL Stats - Generate Career Stats & Season Leaders",
  );
  console.log(
    "════════════════════════════════════════════════════\n",
  );

  try {
    await generateCastMemberCareerStats();
    await generateSeasonLeaders();

    console.log(
      "════════════════════════════════════════════════════",
    );
    console.log(
      "✨ All stats generated successfully!",
    );
    console.log(
      "════════════════════════════════════════════════════",
    );
  } catch (error) {
    console.error("❌ Fatal Error:", error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();