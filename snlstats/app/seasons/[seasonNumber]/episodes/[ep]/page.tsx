// src/app/seasons/[seasonNumber]/episodes/[ep]/page.tsx
import { prisma } from "@/src/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";

interface Props {
  params: Promise<{
    seasonNumber: string;
    ep: string;
  }>;
}

export async function generateStaticParams() {
  const episodes = await prisma.episode.findMany({
    include: { season: true },
  });

  return episodes.map((ep) => ({
    seasonNumber: ep.season.seasonNumber.toString(),
    ep: ep.episodeNumber.toString(),
  }));
}

export default async function EpisodePage({ params }: Props) {
  // In Next.js 15+, params is a Promise
  const { seasonNumber, ep } = await params;

  const seasonNum = parseInt(seasonNumber, 10);
  const episodeNum = parseInt(ep, 10);

  // Validate parsed values
  if (isNaN(seasonNum) || isNaN(episodeNum)) {
    notFound();
  }

  // Fetch episode with all related data
  const episode = await prisma.episode.findFirst({
    where: {
      episodeNumber: episodeNum,
      season: { seasonNumber: seasonNum },
    },
    include: {
      season: true,
      performances: {
        include: { castMember: true },
        orderBy: { screenTimeSeconds: "desc" },
      },
      liveFromNewYork: true,
    },
  });

  if (!episode) {
    notFound();
  }

  // Format date
  const airDate = new Date(episode.airDate);
  const formattedDate = airDate.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  // Get LFNY cast names
  const lfnyNames = episode.liveFromNewYork?.castMemberIds
    ? await Promise.all(
        episode.liveFromNewYork.castMemberIds.map(async (id) => {
          const cm = await prisma.castMember.findUnique({
            where: { id },
            select: { name: true },
          });
          return cm?.name;
        }),
      ).then((names) => names.filter(Boolean) as string[])
    : [];

  return (
    <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "2rem 1rem" }}>
      {/* Breadcrumb */}
      <div style={{ marginBottom: "2rem", fontSize: "14px" }}>
        <Link href="/">Home</Link>
        {" / "}
        <Link href={`/seasons/${seasonNum}`}>Season {seasonNum}</Link>
        {" / "}
        <span>Episode {episode.episodeNumber}</span>
      </div>

      {/* Episode Header */}
      <div
        style={{
          marginBottom: "3rem",
          paddingBottom: "2rem",
          borderBottom: "1px solid var(--color-border-tertiary)",
        }}
      >
        <h1 style={{ marginBottom: "0.5rem", fontSize: "28px" }}>
          SNL S{seasonNum} E{episode.episodeNumber}
        </h1>
        <p
          style={{ color: "var(--color-text-secondary)", marginBottom: "1rem" }}
        >
          {formattedDate}
        </p>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: "1.5rem",
            marginBottom: "1.5rem",
          }}
        >
          <div>
            <p
              style={{
                fontSize: "12px",
                color: "var(--color-text-secondary)",
                marginBottom: "0.5rem",
              }}
            >
              Host
            </p>
            <p style={{ fontSize: "16px", fontWeight: "500" }}>
              {episode.host || "TBD"}
            </p>
          </div>
          <div>
            <p
              style={{
                fontSize: "12px",
                color: "var(--color-text-secondary)",
                marginBottom: "0.5rem",
              }}
            >
              Musical guest
            </p>
            <p style={{ fontSize: "16px", fontWeight: "500" }}>
              {episode.musicalGuest || "TBD"}
            </p>
          </div>
          {lfnyNames.length > 0 && (
            <div>
              <p
                style={{
                  fontSize: "12px",
                  color: "var(--color-text-secondary)",
                  marginBottom: "0.5rem",
                }}
              >
                Live from New York
              </p>
              <p style={{ fontSize: "16px", fontWeight: "500" }}>
                {lfnyNames.join(", ")}
              </p>
            </div>
          )}
          <div>
            <p
              style={{
                fontSize: "12px",
                color: "var(--color-text-secondary)",
                marginBottom: "0.5rem",
              }}
            >
              Total cast appearances
            </p>
            <p style={{ fontSize: "16px", fontWeight: "500" }}>
              {
                episode.performances.filter((p) => p.status === "present")
                  .length
              }
              /{episode.performances.length}
            </p>
          </div>
        </div>
      </div>

      {/* Cast Performance Table */}
      <div style={{ marginBottom: "3rem" }}>
        <h2 style={{ marginBottom: "1.5rem", fontSize: "20px" }}>
          Cast performance
        </h2>

        <div style={{ overflowX: "auto" }}>
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              fontSize: "14px",
            }}
          >
            <thead>
              <tr
                style={{
                  borderBottom: "1px solid var(--color-border-tertiary)",
                }}
              >
                <th
                  style={{
                    textAlign: "left",
                    padding: "12px 0",
                    fontWeight: "500",
                    color: "var(--color-text-secondary)",
                    fontSize: "12px",
                  }}
                >
                  Rank
                </th>
                <th
                  style={{
                    textAlign: "left",
                    padding: "12px 12px",
                    fontWeight: "500",
                    color: "var(--color-text-secondary)",
                    fontSize: "12px",
                  }}
                >
                  Cast member
                </th>
                <th
                  style={{
                    textAlign: "right",
                    padding: "12px 12px",
                    fontWeight: "500",
                    color: "var(--color-text-secondary)",
                    fontSize: "12px",
                  }}
                >
                  Screen time
                </th>
                <th
                  style={{
                    textAlign: "right",
                    padding: "12px 12px",
                    fontWeight: "500",
                    color: "var(--color-text-secondary)",
                    fontSize: "12px",
                  }}
                >
                  Sketches
                </th>
                <th
                  style={{
                    textAlign: "right",
                    padding: "12px 12px",
                    fontWeight: "500",
                    color: "var(--color-text-secondary)",
                    fontSize: "12px",
                  }}
                >
                  Power ranking
                </th>
                <th
                  style={{
                    textAlign: "center",
                    padding: "12px 12px",
                    fontWeight: "500",
                    color: "var(--color-text-secondary)",
                    fontSize: "12px",
                  }}
                >
                  Status
                </th>
              </tr>
            </thead>
            <tbody>
              {episode.performances.map((perf, index) => (
                <tr
                  key={perf.id}
                  style={{
                    borderBottom: "1px solid var(--color-border-tertiary)",
                  }}
                >
                  <td
                    style={{
                      padding: "12px 0",
                      fontWeight: "500",
                      color: "var(--color-text-secondary)",
                    }}
                  >
                    {perf.status === "present" ? index + 1 : "—"}
                  </td>
                  <td style={{ padding: "12px 12px" }}>
                    <Link
                      href={`/cast/${perf.castMember.slug}/s${seasonNum}`}
                      style={{
                        color: "var(--color-text-primary)",
                        textDecoration: "none",
                        fontWeight: "500",
                      }}
                    >
                      {perf.castMember.name}
                    </Link>
                  </td>
                  <td
                    style={{
                      padding: "12px 12px",
                      textAlign: "right",
                      color: "var(--color-text-secondary)",
                    }}
                  >
                    {perf.status === "absent"
                      ? "ABS"
                      : `${Math.floor(perf.screenTimeSeconds / 60)}:${String(
                          perf.screenTimeSeconds % 60,
                        ).padStart(2, "0")}`}
                  </td>
                  <td
                    style={{
                      padding: "12px 12px",
                      textAlign: "right",
                      color: "var(--color-text-secondary)",
                    }}
                  >
                    {perf.status === "absent" ? "ABS" : perf.sketchCount}
                  </td>
                  <td
                    style={{
                      padding: "12px 12px",
                      textAlign: "right",
                      fontWeight: "500",
                    }}
                  >
                    {perf.status === "absent"
                      ? "ABS"
                      : Number(perf.powerRanking).toFixed(1)}
                  </td>
                  <td
                    style={{
                      padding: "12px 12px",
                      textAlign: "center",
                      fontSize: "12px",
                      color:
                        perf.status === "absent"
                          ? "var(--color-text-danger)"
                          : perf.screenTimeSeconds === 0
                            ? "var(--color-text-warning)"
                            : "var(--color-text-success)",
                    }}
                  >
                    {perf.status === "absent"
                      ? "Absent"
                      : perf.screenTimeSeconds === 0
                        ? "Iced out"
                        : "Present"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Navigation */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginTop: "3rem",
          paddingTop: "2rem",
          borderTop: "1px solid var(--color-border-tertiary)",
        }}
      >
        {episode.episodeNumber > 1 ? (
          <Link
            href={`/seasons/${seasonNum}/episodes/${episode.episodeNumber - 1}`}
            style={{
              padding: "8px 16px",
              border: "0.5px solid var(--color-border-secondary)",
              borderRadius: "var(--border-radius-md)",
              textDecoration: "none",
              color: "var(--color-text-primary)",
            }}
          >
            ← Previous episode
          </Link>
        ) : (
          <div />
        )}

        {episode.episodeNumber < (episode.season?.numEpisodes || 16) ? (
          <Link
            href={`/seasons/${seasonNum}/episodes/${episode.episodeNumber + 1}`}
            style={{
              padding: "8px 16px",
              border: "0.5px solid var(--color-border-secondary)",
              borderRadius: "var(--border-radius-md)",
              textDecoration: "none",
              color: "var(--color-text-primary)",
            }}
          >
            Next episode →
          </Link>
        ) : (
          <div />
        )}
      </div>
    </div>
  );
}
