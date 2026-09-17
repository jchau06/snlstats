import { prisma } from "@/src/lib/prisma";

export async function UpcomingShowsSection() {
  // Get upcoming episodes from the UpcomingEpisode table
  const upcomingShows = await prisma.upcomingEpisode.findMany({
    where: {
      airDate: {
        gt: new Date(),
      },
    },
    orderBy: {
      airDate: "asc",
    },
    take: 4,
  });

  const formatDate = (date: Date): string => {
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "2-digit",
      year: "numeric",
    });
  };

  return (
    <div className="relative w-full">
      {/* Badge */}
      <div className="mb-6">
        <span className="inline-block bg-primary/10 border border-primary px-3 py-1 rounded-full text-primary font-mono font-bold text-xs uppercase">
          Shows Coming Up Next
        </span>
      </div>

      {/* Shows Grid */}
      {upcomingShows.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {upcomingShows.map((show) => (
            <div
              key={show.id}
              className="border border-secondary/30 rounded-lg bg-secondary/20 backdrop-blur-sm p-4 sm:p-5 hover:border-primary transition-colors duration-base group"
            >
              {/* Date */}
              <div className="mb-3">
                <p className="text-[#8A8885] font-mono text-xs uppercase tracking-wide mb-1">
                  {formatDate(show.airDate)}
                </p>
                <p className="text-primary font-mono font-bold text-xs uppercase">
                  EP {show.episodeNumber}
                </p>
              </div>

              {/* Host */}
              <h3 className="font-heading text-xl sm:text-2xl font-bold text-tertiary mb-2 line-clamp-2 group-hover:text-primary transition-colors duration-base">
                {show.host}
              </h3>

              {/* Musical Guest */}
              <div className="pt-3 border-t border-secondary/20">
                <p className="text-[#8A8885] font-mono text-xs uppercase mb-1">
                  Music
                </p>
                <p className="text-white text-sm font-sans">
                  {show.musicalGuest}
                </p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="border border-secondary/30 rounded-lg bg-secondary/20 p-8 text-center">
          <p className="text-[#8A8885]">No upcoming shows announced</p>
        </div>
      )}
    </div>
  );
}