// scripts/loadEpisodeData.ts
import "dotenv/config";
import fs from "fs";
import path from "path";
import { PrismaClient } from "@prisma/client";

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
    status?: string;
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

    // Season dates
    const seasonYears: Record<number, { start: number; end: number }> = {
      51: { start: 2025, end: 2026 },
      50: { start: 2024, end: 2025 },
      49: { start: 2023, end: 2024 },
    };

    // Get or create the season
    const season = await prisma.season.upsert({
      where: { seasonNumber: data.season },
      create: {
        seasonNumber: data.season,
        yearStarted: seasonYears[data.season]?.start ?? 2025,
        yearEnded: seasonYears[data.season]?.end ?? 2026,
        numEpisodes: 16,
      },
      update: {},
    });

    // Determine the latest season in the database.
    // Only performers from this season should be marked as "current".
    const latestSeason = await prisma.season.findFirst({
      orderBy: {
        seasonNumber: "desc",
      },
    });

    const isCurrentSeason =
      latestSeason !== null &&
      data.season === latestSeason.seasonNumber;

    console.log(
      isCurrentSeason
        ? `📌 Season ${data.season} is the current/latest season`
        : `📚 Season ${data.season} is a historical season`,
    );

    // Create episode slug
    const episodeSlug = `snl-${data.season}-ep-${String(
      data.episode,
    ).padStart(2, "0")}-${slugify(data.host)}`;

    // Ensure episode exists
    const episode = await prisma.episode.upsert({
      where: {
        slug: episodeSlug,
      },
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

    // ---------------------------------------------------------
    // Cast performances
    // ---------------------------------------------------------

    for (const perf of data.castPerformance) {
      // Check whether cast member already exists
      let castMember = await prisma.castMember.findUnique({
        where: {
          name: perf.name,
        },
      });

      if (castMember) {
        /*
         * IMPORTANT:
         *
         * Only modify CastMember career status when loading
         * the current/latest season.
         *
         * This prevents loading historical seasons such as
         * Season 50 from changing:
         *
         *   status: alumni -> current
         *   leaveSeason: 50 -> null
         *
         * Historical episode data should not overwrite a
         * cast member's current career status.
         */
        if (isCurrentSeason) {
          castMember = await prisma.castMember.update({
            where: {
              id: castMember.id,
            },
            data: {
              status: "current",
              leaveSeason: null,
            },
          });
        }
      } else {
        /*
         * Cast member doesn't exist yet.
         *
         * If we're loading the current season, they are a
         * current cast member.
         *
         * If we're loading a historical season, don't assume
         * they are currently active.
         */
        castMember = await prisma.castMember.create({
          data: {
            name: perf.name,
            slug: slugify(perf.name),
            joinSeason: data.season,
            status: isCurrentSeason ? "current" : "alumni",
            leaveSeason: isCurrentSeason ? null : data.season,
            headshot: `https://wxvqsqaokhjefplzglgk.supabase.co/storage/v1/object/public/snlstats-images/cast/${slugify(perf.name)}.jpg`,
          },
        });
      }

      // Upsert the cast member's performance for this episode
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
          status: perf.status || "present",
        },
        update: {
          screenTimeSeconds: perf.screenTimeSeconds,
          sketchCount: perf.sketchCount,
          powerRanking: perf.powerRanking,
          status: perf.status || "present",
        },
      });
    }

    // ---------------------------------------------------------
    // Live From New York
    // ---------------------------------------------------------

    const lfnyCastIds = await Promise.all(
      (data.liveFromNewYork || []).map(async (name) => {
        const member = await prisma.castMember.findUnique({
          where: {
            name,
          },
          select: {
            id: true,
          },
        });

        return member?.id;
      }),
    );

    await prisma.liveFromNewYork.upsert({
      where: {
        episodeId: episode.id,
      },
      create: {
        episodeId: episode.id,
        castMemberIds: lfnyCastIds.filter(Boolean) as string[],
      },
      update: {
        castMemberIds: lfnyCastIds.filter(Boolean) as string[],
      },
    });

    console.log(`✓ Loaded episode successfully`);
  } catch (error) {
    console.error(`✗ Error loading episode from ${filePath}:`, error);
    throw error;
  }
}

async function main() {
  const episodesDir = path.join(
    process.cwd(),
    "public/data/episodes",
  );

  const args = process.argv.slice(2);

  let files: string[];

  if (args.length > 0) {
    files = args;
    console.log(`Loading ${files.length} specified file(s)\n`);
  } else {
    files = fs
      .readdirSync(episodesDir)
      .filter((file) => file.endsWith(".json"))
      .sort();

    console.log(`Found ${files.length} episode files to load\n`);
  }

  let failedCount = 0;

  for (const file of files) {
    /*
     * If an absolute path is provided, use it directly.
     * Otherwise, look inside public/data/episodes.
     */
    const filePath = path.isAbsolute(file)
      ? file
      : path.join(episodesDir, file);

    if (!fs.existsSync(filePath)) {
      console.error(`✗ File not found: ${file}`);
      failedCount++;
      continue;
    }

    try {
      await loadEpisodeData(filePath);
    } catch {
      failedCount++;
    }
  }

  await prisma.$disconnect();

  if (failedCount > 0) {
    console.error(
      `\n❌ Finished with ${failedCount} file(s) that failed to load.`,
    );
    process.exit(1);
  }

  console.log(
    `\n✓ All ${files.length} specified episode(s) loaded successfully!`,
  );
}

main().catch(async (error) => {
  console.error("Fatal error:", error);
  await prisma.$disconnect();
  process.exit(1);
});