// scripts/generateSeasonLeaders.ts
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

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

      console.log(
        `📊 Season ${season.seasonNumber} (${season.yearStarted}-${season.yearEnded}) - ${seasonStats.length} cast members`
      );

      // Sort by Screen Time
      const screenTimeRanked = [...seasonStats]
        .sort((a, b) => b.totalScreenTimeSeconds - a.totalScreenTimeSeconds)
        .map((stat, idx) => ({
          castMemberId: stat.castMemberId,
          rank: idx + 1,
          name: stat.castMember.name,
          value: stat.totalScreenTimeSeconds,
        }));

      // Sort by Sketches
      const sketchesRanked = [...seasonStats]
        .sort((a, b) => b.totalAppearances - a.totalAppearances)
        .map((stat, idx) => ({
          castMemberId: stat.castMemberId,
          rank: idx + 1,
          name: stat.castMember.name,
          value: stat.totalAppearances,
        }));

      // Sort by Power Ranking
      const powerRanked = [...seasonStats]
        .sort((a, b) => b.powerRankingSeason - a.powerRankingSeason)
        .map((stat, idx) => ({
          castMemberId: stat.castMemberId,
          rank: idx + 1,
          name: stat.castMember.name,
          value: stat.powerRankingSeason,
        }));

      // Upsert SeasonLeaders for each cast member
      for (const stat of seasonStats) {
        const screenTimeRank = screenTimeRanked.find(
          (r) => r.castMemberId === stat.castMemberId
        )?.rank;
        const sketchRank = sketchesRanked.find(
          (r) => r.castMemberId === stat.castMemberId
        )?.rank;
        const powerRank = powerRanked.find(
          (r) => r.castMemberId === stat.castMemberId
        )?.rank;

        // Determine if they're a leader (top 3)
        const isScreenTimeLeader = screenTimeRank && screenTimeRank <= 3;
        const isSketchLeader = sketchRank && sketchRank <= 3;
        const isPowerRankingLeader = powerRank && powerRank <= 3;

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
            rankingScreenTime: screenTimeRank,
            rankingSketchCount: sketchRank,
            rankingPowerRanking: powerRank,
            isScreenTimeLeader: isScreenTimeLeader || false,
            isSketchLeader: isSketchLeader || false,
            isPowerRankingLeader: isPowerRankingLeader || false,
          },
          update: {
            rankingScreenTime: screenTimeRank,
            rankingSketchCount: sketchRank,
            rankingPowerRanking: powerRank,
            isScreenTimeLeader: isScreenTimeLeader || false,
            isSketchLeader: isSketchLeader || false,
            isPowerRankingLeader: isPowerRankingLeader || false,
          },
        });
      }

      // Print top 3 for this season
      console.log(`  🏆 Screen Time: ${screenTimeRanked.slice(0, 3).map((r) => `${r.rank}. ${r.name}`).join(" | ")}`);
      console.log(`  🏆 Sketches: ${sketchesRanked.slice(0, 3).map((r) => `${r.rank}. ${r.name}`).join(" | ")}`);
      console.log(`  🏆 Power Ranking: ${powerRanked.slice(0, 3).map((r) => `${r.rank}. ${r.name}`).join(" | ")}\n`);
    }

    console.log("✨ SeasonLeaders generation complete!");
  } catch (error) {
    console.error("❌ Error:", error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

generateSeasonLeaders();