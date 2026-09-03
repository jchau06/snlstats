import { prisma } from "@/src/lib/prisma";
import { Decimal } from "@prisma/client/runtime/library";

async function generateSeasonStats(seasonNumber: number) {
  console.log(`Generating stats for Season ${seasonNumber}...`);

  // Get the season
  const season = await prisma.season.findUnique({
    where: { seasonNumber },
  });

  if (!season) {
    console.error(`Season ${seasonNumber} not found`);
    return;
  }

  // Get all performances in the season (excluding absences)
  const performances = await prisma.castPerformance.findMany({
    where: {
      episode: { seasonId: season.id },
      status: "present",
    },
    include: { castMember: true, episode: true },
  });

  console.log(`Found ${performances.length} performances`);

  // Group by cast member and calculate aggregates
  const statsByMember = new Map<
    string,
    {
      castMemberId: string;
      totalScreenTime: number;
      totalAppearances: number;
      powerRankings: number[];
      episodesPresent: number; // ← Track number of present episodes
    }
  >();

  performances.forEach((perf) => {
    const key = perf.castMemberId;
    if (!statsByMember.has(key)) {
      statsByMember.set(key, {
        castMemberId: key,
        totalScreenTime: 0,
        totalAppearances: 0,
        powerRankings: [],
        episodesPresent: 0, // ← Initialize counter
      });
    }

    const stats = statsByMember.get(key)!;
    stats.totalScreenTime += perf.screenTimeSeconds;
    stats.totalAppearances += perf.sketchCount;
    stats.powerRankings.push(Number(perf.powerRanking));
    stats.episodesPresent += 1; // ← Increment for each present episode
  });

  // Create or update SeasonStats
  let createdCount = 0;
  for (const [castMemberId, stats] of statsByMember.entries()) {
    // Divide by episodesPresent, not total season episodes
    const avgScreenTime = new Decimal(
      stats.totalScreenTime / stats.episodesPresent
    ).toDecimalPlaces(2);
    const avgAppearances = new Decimal(
      stats.totalAppearances / stats.episodesPresent
    ).toDecimalPlaces(2);
    const avgPowerRanking = new Decimal(
      stats.powerRankings.reduce((a, b) => a + b, 0) / stats.powerRankings.length
    ).toDecimalPlaces(2);

    await prisma.seasonStats.upsert({
      where: {
        seasonId_castMemberId: {
          seasonId: season.id,
          castMemberId,
        },
      },
      update: {
        totalScreenTimeSeconds: stats.totalScreenTime,
        totalAppearances: stats.totalAppearances,
        averageScreenTimeSeconds: avgScreenTime,
        averageAppearances: avgAppearances,
        powerRankingSeason: avgPowerRanking,
      },
      create: {
        seasonId: season.id,
        castMemberId,
        totalScreenTimeSeconds: stats.totalScreenTime,
        totalAppearances: stats.totalAppearances,
        averageScreenTimeSeconds: avgScreenTime,
        averageAppearances: avgAppearances,
        powerRankingSeason: avgPowerRanking,
      },
    });

    createdCount++;
  }

  console.log(`✓ Created/updated ${createdCount} SeasonStats records`);
}

// Run: tsx scripts/generate-season-stats.ts 51
const seasonNumber = parseInt(process.argv[2] || "51", 10);
generateSeasonStats(seasonNumber).catch(console.error);