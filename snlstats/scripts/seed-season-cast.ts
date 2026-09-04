import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import * as fs from "fs";
import * as path from "path";

const prisma = new PrismaClient();

interface SeasonOpeningData {
  castMemberName: string;
  status: "repertory" | "featured";
  imageUrl: string;
}

interface SeasonData {
  seasonNumber: number;
  heroImageUrl: string;
  seasonOpening: SeasonOpeningData[];
}

async function seedSeasonCast(seasonNumber: number) {
  console.log(`Linking cast members to Season ${seasonNumber}...`);

  // Load season data from JSON
  const dataPath = path.join(
    process.cwd(),
    `public/data/season-media/snl-${seasonNumber}-cast-media.json`
  );
  const seasonData: SeasonData = JSON.parse(fs.readFileSync(dataPath, "utf-8"));

  // Get season
  const season = await prisma.season.findUnique({
    where: { seasonNumber },
  });

  if (!season) {
    console.error(`Season ${seasonNumber} not found`);
    return;
  }

  let linkedCount = 0;
  for (const opening of seasonData.seasonOpening) {
    const castMember = await prisma.castMember.findUnique({
      where: { name: opening.castMemberName },
    });

    if (!castMember) {
      console.warn(`Cast member not found: ${opening.castMemberName}`);
      continue;
    }

    await prisma.seasonCast.upsert({
      where: {
        seasonId_castMemberId: {
          seasonId: season.id,
          castMemberId: castMember.id,
        },
      },
      update: { status: opening.status },
      create: {
        seasonId: season.id,
        castMemberId: castMember.id,
        status: opening.status,
      },
    });

    linkedCount++;
  }

  console.log(`✓ Linked ${linkedCount} cast members to Season ${seasonNumber}`);
}

const seasonNumber = parseInt(process.argv[2] || "51", 10);
seedSeasonCast(seasonNumber).catch(console.error);