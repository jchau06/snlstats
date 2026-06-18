import "dotenv/config"; // Add this as the VERY FIRST import, before everything
import fs from "fs";
import path from "path";
import { PrismaClient } from "@prisma/client";

// Log to verify the env is loaded
console.log("DATABASE_URL loaded:", !!process.env.DATABASE_URL);

const prisma = new PrismaClient();

interface EpisodeJSON {
  season: number;
  episode: number;
  airDate: string;
  host: string;
  musicalGuest: string;
  liveFromNewYork: string[];
  castPerformance: Array<{
    name: string;
    screenTimeSeconds: number;
    sketchCount: number;
    powerRanking: number;
  }>;
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/--+/g, "-");
}

async function loadEpisodeData(filePath: string) {
  try {
    const fileContent = fs.readFileSync(filePath, "utf-8");
    const data: EpisodeJSON = JSON.parse(fileContent);

    console.log(
      `Loading SNL S${data.season} E${data.episode}: ${data.host}...`,
    );

    const seasonYears: Record<number, { start: number; end: number }> = {
      51: { start: 2025, end: 2026 },
      50: { start: 2024, end: 2025 },
      49: { start: 2023, end: 2024 },
    };

    // Ensure season exists
    const season = await prisma.season.upsert({
      where: { seasonNumber: data.season },
      create: {
        seasonNumber: data.season,
        yearStarted:
          seasonYears[data.season]?.start ??
          new Date(data.airDate).getFullYear(),
        yearEnded:
          seasonYears[data.season]?.end ?? new Date(data.airDate).getFullYear(),
        numEpisodes: 20,
      },
      update: {},
    });

    // Create episode slug
    const episodeSlug = `snl-${data.season}-ep-${String(data.episode).padStart(2, "0")}-${slugify(data.host)}`;

    // Ensure episode exists
    const episode = await prisma.episode.upsert({
      where: { slug: episodeSlug },
      create: {
        seasonId: season.id,
        episodeNumber: data.episode,
        airDate: new Date(data.airDate),
        host: data.host,
        musicalGuest: data.musicalGuest,
        slug: episodeSlug,
      },
      update: {
        airDate: new Date(data.airDate),
        host: data.host,
        musicalGuest: data.musicalGuest,
      },
    });

    // Upsert cast members and their performance
    for (const perf of data.castPerformance) {
      const castMember = await prisma.castMember.upsert({
        where: { name: perf.name },
        create: {
          name: perf.name,
          slug: slugify(perf.name),
          joinSeason: data.season,
          status: "current",
        },
        update: {
          status: "current",
        },
      });

      // Upsert performance
      await prisma.castPerformance.upsert({
        where: {
          episodeId_castMemberId: {
            episodeId: episode.id,
            castMemberId: castMember.id,
          },
        },
        create: {
          episodeId: episode.id,
          castMemberId: castMember.id,
          screenTimeSeconds: perf.screenTimeSeconds,
          sketchCount: perf.sketchCount,
          powerRanking: perf.powerRanking,
        },
        update: {
          screenTimeSeconds: perf.screenTimeSeconds,
          sketchCount: perf.sketchCount,
          powerRanking: perf.powerRanking,
        },
      });
    }

    // Load LFNY data
    if (data.liveFromNewYork && data.liveFromNewYork.length > 0) {
      // Get IDs of cast members who said LFNY
      const lfnyCastIds = await Promise.all(
        data.liveFromNewYork.map(async (name) => {
          const member = await prisma.castMember.findUnique({
            where: { name },
            select: { id: true },
          });
          return member?.id;
        }),
      );

      // Upsert LFNY record
      await prisma.liveFromNewYork.upsert({
        where: { episodeId: episode.id },
        create: {
          episodeId: episode.id,
          castMemberIds: lfnyCastIds.filter(Boolean) as string[],
        },
        update: {
          castMemberIds: lfnyCastIds.filter(Boolean) as string[],
        },
      });
    }

    console.log(`✓ Loaded episode successfully`);
  } catch (error) {
    console.error(`✗ Error loading episode from ${filePath}:`, error);
    throw error;
  }
}

async function main() {
  const episodesDir = path.join(process.cwd(), "public/data/episodes");

  // Get all JSON files in the episodes directory
  const files = fs
    .readdirSync(episodesDir)
    .filter((file) => file.endsWith(".json"))
    .sort();

  console.log(`Found ${files.length} episode files to load\n`);

  for (const file of files) {
    const filePath = path.join(episodesDir, file);
    await loadEpisodeData(filePath);
  }

  console.log("\n✓ All episodes loaded successfully!");
  await prisma.$disconnect();
}

main().catch((error) => {
  console.error("Fatal error:", error);
  process.exit(1);
});
