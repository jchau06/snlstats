import "dotenv/config";
import fs from "fs";
import path from "path";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

interface SeasonMediaJSON {
  seasonNumber: number;
  seasonOpening: Array<{
    castMemberName: string;
    imageUrl: string;
  }>;
}

async function seedSeasonMedia(filePath: string) {
  try {
    const fileContent = fs.readFileSync(filePath, "utf-8");
    const data: SeasonMediaJSON = JSON.parse(fileContent);

    console.log(`Loading season media for Season ${data.seasonNumber}...`);

    // Get the season
    const season = await prisma.season.findUnique({
      where: { seasonNumber: data.seasonNumber },
    });

    if (!season) {
      throw new Error(
        `Season ${data.seasonNumber} not found. Run seed-season.ts first.`
      );
    }

    let linkedCount = 0;

    // Link season-opening images
    for (const media of data.seasonOpening) {
      const castMember = await prisma.castMember.findUnique({
        where: { name: media.castMemberName },
      });

      if (!castMember) {
        console.warn(`⚠️  Cast member not found: ${media.castMemberName}`);
        continue;
      }

      await prisma.seasonCastMedia.upsert({
        where: {
          seasonId_castMemberId_imageType: {
            seasonId: season.id,
            castMemberId: castMember.id,
            imageType: "season-opening",
          },
        },
        update: { imageUrl: media.imageUrl },
        create: {
          seasonId: season.id,
          castMemberId: castMember.id,
          imageUrl: media.imageUrl,
          imageType: "season-opening",
        },
      });

      linkedCount++;
    }

    console.log(
      `✓ Linked ${linkedCount} season-opening images for Season ${data.seasonNumber}`
    );
  } catch (error) {
    console.error(`Error loading season media:`, error);
    process.exit(1);
  }
}

// Run: npx ts-node scripts/seed-season-media.ts data/season-51/season-media.json
const filePath = process.argv[2];
if (!filePath) {
  console.error(
    "Usage: npx ts-node scripts/seed-season-media.ts <path-to-season-media.json>"
  );
  process.exit(1);
}

seedSeasonMedia(filePath).catch(console.error);