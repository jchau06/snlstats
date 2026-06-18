// src/app/seasons/[seasonNumber]/episodes/[ep]/page.tsx
import { prisma } from '@/src/lib/prisma';
import { notFound } from 'next/navigation';

interface Props {
  params: {
    seasonNumber: string;
    ep: string;
  };
}

export async function generateStaticParams() {
  // Fetch all episodes at build time for static generation
  const episodes = await prisma.episode.findMany({
    include: { season: true },
  });

  return episodes.map((ep) => ({
    seasonNumber: ep.season.seasonNumber.toString(),
    ep: ep.episodeNumber.toString(),
  }));
}

export default async function EpisodePage({ params }: Props) {
  const { seasonNumber, ep } = params;

  // Fetch episode data
  const episode = await prisma.episode.findFirst({
    where: {
      episodeNumber: parseInt(ep),
      season: { seasonNumber: parseInt(seasonNumber) },
    },
    include: {
      season: true,
      performances: {
        include: { castMember: true },
        orderBy: { screenTimeSeconds: 'desc' },
      },
    },
  });

  if (!episode) {
    notFound();
  }

  return (
    <div>
      <h1>
        SNL S{episode.season.seasonNumber} E{episode.episodeNumber}
      </h1>
      <p>
        {episode.airDate.toLocaleDateString()} | Host: {episode.host} | Guest:{' '}
        {episode.musicalGuest}
      </p>

      <table>
        <thead>
          <tr>
            <th>Cast Member</th>
            <th>Screen Time (sec)</th>
            <th>Sketches</th>
            <th>Power Ranking</th>
          </tr>
        </thead>
        <tbody>
          {episode.performances.map((perf) => (
            <tr key={perf.id}>
              <td>
                <a href={`/cast/${perf.castMember.slug}/s${seasonNumber}`}>
                  {perf.castMember.name}
                </a>
              </td>
              <td>{perf.screenTimeSeconds}</td>
              <td>{perf.sketchCount}</td>
              <td>{String(perf.powerRanking)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}