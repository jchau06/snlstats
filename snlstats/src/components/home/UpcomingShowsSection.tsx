import { prisma } from "@/src/lib/prisma";

export async function UpcomingShowsSection() {
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

  const noteColors = [
    {
      paper: "bg-[#FFF9D8]",
      pin: "bg-[#E7D33C]",
      accent: "bg-[#E7D33C]",
    },
    {
      paper: "bg-[#CDEFF3]",
      pin: "bg-[#78C9D4]",
      accent: "bg-[#78C9D4]",
    },
    {
      paper: "bg-[#F2A7D0]",
      pin: "bg-[#D65A9D]",
      accent: "bg-[#D65A9D]",
    },
    {
      paper: "bg-[#FFF9D8]",
      pin: "bg-[#E7D33C]",
      accent: "bg-[#E7D33C]",
    },
  ];

  return (
    <section className="relative w-full">
      {/* Section label */}
      <div className="mb-7">
        <span className="inline-flex items-center border border-primary rounded-full px-3 py-1.5 text-primary font-mono font-bold text-xs uppercase tracking-wide">
          Shows Coming Up Next
        </span>
      </div>

      {upcomingShows.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-7 lg:gap-5">
          {upcomingShows.map((show, index) => {
            const colors = noteColors[index % noteColors.length];
            const rotation = ["-rotate-1", "rotate-1", "-rotate-[1.5deg]", "rotate-[1deg]"][
              index % 4
            ];

            return (
              <article
                key={show.id}
                className={`group relative ${rotation} transition-transform duration-300 hover:rotate-0 hover:-translate-y-1`}
              >
                {/* Push pin */}
                <div className="absolute z-20 left-1/2 top-[-10px] -translate-x-1/2">
                  <div
                    className={`relative h-6 w-6 rounded-full ${colors.pin} border border-black/10 shadow-[0_2px_3px_rgba(0,0,0,0.25)]`}
                  >
                    <div className="absolute left-[5px] top-[4px] h-1.5 w-1.5 rounded-full bg-white/60" />
                  </div>
                  <div className="absolute left-1/2 top-5 h-2 w-2 -translate-x-1/2 rounded-full bg-black/20 blur-[2px]" />
                </div>

                {/* Sticky note */}
                <div
                  className={`relative min-h-[310px] ${colors.paper} px-6 pb-6 pt-9 text-[#171717] shadow-[3px_5px_10px_rgba(0,0,0,0.18)]`}
                >
                  {/* Subtle paper lines */}
                  <div className="pointer-events-none absolute inset-x-0 top-[96px] border-t border-black/[0.06]" />
                  <div className="pointer-events-none absolute inset-x-0 top-[168px] border-t border-black/[0.06]" />
                  <div className="pointer-events-none absolute inset-x-0 top-[255px] border-t border-black/[0.06]" />

                  {/* Date */}
                  <div className="relative">
                    <p
                      className="font-marker text-[22px] leading-none tracking-wide uppercase"
                      style={{ fontFamily: '"Marker Felt", "Comic Sans MS", cursive' }}
                    >
                      {formatDate(show.airDate)}
                    </p>

                    {/* Episode highlight */}
                    <div
                      className={`mt-3 inline-block ${colors.accent} px-2 py-1 -rotate-[1deg]`}
                    >
                      <p
                        className="font-marker text-sm font-bold uppercase leading-none"
                        style={{ fontFamily: '"Marker Felt", "Comic Sans MS", cursive' }}
                      >
                        Episode {show.episodeNumber}
                      </p>
                    </div>
                  </div>

                  {/* Host */}
                  <div className="relative mt-7">
                    <p
                      className="text-[11px] font-bold uppercase tracking-[0.16em] text-black/60"
                      style={{ fontFamily: '"Marker Felt", "Comic Sans MS", cursive' }}
                    >
                      Host
                    </p>

                    <h3
                      className="mt-1.5 text-[27px] leading-[0.95] font-bold tracking-tight"
                      style={{ fontFamily: '"Marker Felt", "Comic Sans MS", cursive' }}
                    >
                      {show.host}
                    </h3>

                    <div className="mt-2 h-[2px] w-24 bg-black/80 -rotate-[1.5deg]" />
                  </div>

                  {/* Musical guest */}
                  <div className="relative mt-7">
                    <p
                      className="text-[11px] font-bold uppercase tracking-[0.14em] text-black/60"
                      style={{ fontFamily: '"Marker Felt", "Comic Sans MS", cursive' }}
                    >
                      Musical Guest
                    </p>

                    <p
                      className="mt-1.5 text-[21px] leading-[1] font-bold"
                      style={{ fontFamily: '"Marker Felt", "Comic Sans MS", cursive' }}
                    >
                      {show.musicalGuest}
                    </p>
                  </div>

                  {/* Fold/shadow detail */}
                  <div className="pointer-events-none absolute bottom-0 right-0 h-8 w-8 border-l border-t border-black/[0.05] bg-black/[0.025]" />
                </div>
              </article>
            );
          })}
        </div>
      ) : (
        <div className="border border-secondary/30 rounded-lg bg-secondary/20 p-8 text-center">
          <p className="text-[#8A8885]">No upcoming shows announced</p>
        </div>
      )}
    </section>
  );
}
