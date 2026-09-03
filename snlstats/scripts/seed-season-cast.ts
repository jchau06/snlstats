import "dotenv/config";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function seedSeasonCast(seasonNumber: number) {
  console.log(`Linking cast members to Season ${seasonNumber}...`);

  // Get all unique cast members who performed in this season
  const performances = await prisma.castPerformance.findMany({
    where: {
      episode: { season: { seasonNumber } },
      status: "present",
    },
    distinct: ["castMemberId"],
    include: { castMember: true },
  });

  // Create SeasonCast entries
  let linkedCount = 0;
  for (const perf of performances) {
    const season = await prisma.season.findUnique({
      where: { seasonNumber },
    });

    if (!season) continue;

    await prisma.seasonCast.upsert({
      where: {
        seasonId_castMemberId: {
          seasonId: season.id,
          castMemberId: perf.castMemberId,
        },
      },
      update: {},
      create: {
        seasonId: season.id,
        castMemberId: perf.castMemberId,
      },
    });

    linkedCount++;
  }

  console.log(`✓ Linked ${linkedCount} cast members to Season ${seasonNumber}`);
}

const seasonNumber = parseInt(process.argv[2] || "51", 10);
seedSeasonCast(seasonNumber).catch(console.error);