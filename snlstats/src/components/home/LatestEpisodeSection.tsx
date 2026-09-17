import { prisma } from "@/src/lib/prisma";
import Image from "next/image";

export async function LatestEpisodeSection() {
  // Get the most recent episode by airDate
  const latestEpisode = await prisma.episode.findFirst({
    orderBy: {
      airDate: "desc",
    },
    select: {
      season: {
        select: {
          seasonNumber: true,
        },
      },
      episodeNumber: true,
      airDate: true,
      host: true,
      musicalGuest: true,
      imageUrls: true,
    },
  });

  if (!latestEpisode || !latestEpisode.imageUrls || latestEpisode.imageUrls.length === 0) {
    return (
      <div className="border border-secondary/30 rounded-lg bg-secondary/20 p-8 text-center">
        <p className="text-[#8A8885]">No episodes available</p>
      </div>
    );
  }

  const formattedDate = latestEpisode.airDate.toLocaleDateString("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
  });

  return (
    <div className="relative w-full">
      {/* Badge */}
      <div className="mb-6">
        <span className="inline-block bg-primary/10 border border-primary px-3 py-1 rounded-full text-primary font-mono font-bold text-xs uppercase">
          Latest Episode Analysis
        </span>
      </div>

      {/* Main Content Card */}
      <div className="border border-secondary/30 rounded-lg overflow-hidden bg-secondary/20 backdrop-blur-sm">
        <div className="flex flex-col md:flex-row">
          {/* Left: Image */}
          <div className="w-full md:w-2/5 relative aspect-square md:aspect-auto min-h-80">
            <Image
              src={latestEpisode.imageUrls[0]}
              alt={latestEpisode.host || "Episode"}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 40vw"
              priority
            />
            {/* Gradient overlay for readability */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-transparent to-transparent md:from-black/80 md:via-black/40 md:to-transparent z-10" />
          </div>

          {/* Right: Content */}
          <div className="w-full md:w-3/5 p-6 sm:p-8 md:p-10 lg:p-12 flex flex-col justify-center">
            {/* Episode Label */}
            <div className="mb-4">
              <span className="text-primary font-mono font-bold text-xs uppercase tracking-wide">
                Season {latestEpisode.season.seasonNumber}, Episode {latestEpisode.episodeNumber}
              </span>
            </div>

            {/* Host Name */}
            <h2 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
              {(latestEpisode.host || "TBA").toUpperCase()}
            </h2>

            {/* Stats Grid */}
            <div className="space-y-4 mb-6">
              {/* Air Date */}
              <div>
                <p className="text-[#8A8885] font-mono text-xs uppercase mb-1">
                  Aired
                </p>
                <p className="text-tertiary font-sans text-base sm:text-lg">
                  {formattedDate}
                </p>
              </div>

              {/* Musical Guest */}
              <div>
                <p className="text-[#8A8885] font-mono text-xs uppercase mb-1">
                  Musical Guest
                </p>
                <p className="text-tertiary font-sans text-base sm:text-lg">
                  {latestEpisode.musicalGuest || "TBA"}
                </p>
              </div>
            </div>

            {/* CTA Link */}
            <a
              href={`/episodes/season-${latestEpisode.season.seasonNumber}/episode-${latestEpisode.episodeNumber}`}
              className="inline-flex items-center gap-2 w-fit text-primary hover:text-tertiary transition-colors duration-base font-mono font-bold text-sm uppercase"
            >
              View Details
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}