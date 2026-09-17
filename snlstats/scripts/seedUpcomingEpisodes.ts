// scripts/seedUpcomingEpisodes.ts
import { PrismaClient } from "@prisma/client";
import * as fs from "fs";
import * as path from "path";

const prisma = new PrismaClient();

interface UpcomingEpisodeData {
  seasonNumber: number;
  episodeNumber: number;
  airDate: string;
  host: string;
  musicalGuest: string;
}

interface UpcomingEpisodesJSON {
  upcomingEpisodes: UpcomingEpisodeData[];
}

async function seedUpcomingEpisodes() {
  console.log("🚀 Starting UpcomingEpisodes seed...\n");

  try {
    // Read the JSON file
    const filePath = path.join(
      process.cwd(),
      "public",
      "data",
      "upcomingEpisodes.json",
    );

    if (!fs.existsSync(filePath)) {
      console.error(`❌ File not found: ${filePath}`);
      process.exit(1);
    }

    const fileContent = fs.readFileSync(filePath, "utf-8");
    const data: UpcomingEpisodesJSON = JSON.parse(fileContent);

    if (!data.upcomingEpisodes || !Array.isArray(data.upcomingEpisodes)) {
      console.error(
        "❌ Invalid JSON structure. Expected { upcomingEpisodes: [...] }",
      );
      process.exit(1);
    }

    console.log(`Found ${data.upcomingEpisodes.length} episodes to seed\n`);

    let created = 0;
    let updated = 0;
    let skipped = 0;

    for (const episode of data.upcomingEpisodes) {
      try {
        // Validate required fields
        if (
          !episode.seasonNumber ||
          !episode.episodeNumber ||
          !episode.airDate ||
          !episode.host ||
          !episode.musicalGuest
        ) {
          console.log(
            `⏭️  Skipped: Missing required fields - S${episode.seasonNumber}E${episode.episodeNumber}`,
          );
          skipped++;
          continue;
        }

        // Parse and validate air date
        const airDate = new Date(episode.airDate);
        if (isNaN(airDate.getTime())) {
          console.log(
            `⏭️  Skipped: Invalid date "${episode.airDate}" for S${episode.seasonNumber}E${episode.episodeNumber}`,
          );
          skipped++;
          continue;
        }

        // Upsert episode
        const result = await prisma.upcomingEpisode.upsert({
          where: {
            seasonNumber_episodeNumber: {
              seasonNumber: episode.seasonNumber,
              episodeNumber: episode.episodeNumber,
            },
          },
          create: {
            seasonNumber: episode.seasonNumber,
            episodeNumber: episode.episodeNumber,
            airDate,
            host: episode.host.trim(),
            musicalGuest: episode.musicalGuest.trim(),
          },
          update: {
            airDate,
            host: episode.host.trim(),
            musicalGuest: episode.musicalGuest.trim(),
          },
        });

        // Determine if it was created or updated based on createdAt vs updatedAt
        const isNew = result.createdAt.getTime() === result.updatedAt.getTime();

        if (isNew) {
          console.log(
            `✅ Created: Season ${episode.seasonNumber}, Episode ${episode.episodeNumber}`,
          );
          console.log(
            `   ${episode.airDate} | ${episode.host} | ${episode.musicalGuest}`,
          );
          created++;
        } else {
          console.log(
            `🔄 Updated: Season ${episode.seasonNumber}, Episode ${episode.episodeNumber}`,
          );
          updated++;
        }
      } catch (error) {
        console.error(
          `❌ Error processing S${episode.seasonNumber}E${episode.episodeNumber}:`,
          error instanceof Error ? error.message : error,
        );
      }
    }

    console.log(`\n✨ Seeding complete!`);
    console.log(`   Created: ${created}`);
    console.log(`   Updated: ${updated}`);
    console.log(`   Skipped: ${skipped}`);
  } catch (error) {
    console.error("❌ Error:", error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

seedUpcomingEpisodes();
