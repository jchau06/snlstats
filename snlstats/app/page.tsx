import { Metadata } from "next";
import { LatestEpisodeSection } from "@/src/components/home/LatestEpisodeSection";
import { UpcomingShowsSection } from "@/src/components/home/UpcomingShowsSection";
import { SeasonLeaderboardSection } from "@/src/components/home/SeasonLeaderboardSection";

export const metadata: Metadata = {
  title: "SNL Stats | Saturday Night Live Analytics",
  description:
    "Real-time SNL analytics tracking cast performance, sketches, screen time, and power rankings across all seasons.",
};

export default async function HomePage() {
  return (
    <>
      <main className="min-h-screen bg-neutral">
        {/* Hero Section - Latest Episode */}
        <section className="border-b border-secondary/30">
          <div className="container mx-auto px-4 py-8 md:py-12 lg:py-16">
            <LatestEpisodeSection />
          </div>
        </section>

        {/* Upcoming Shows Section */}
        <section className="border-b border-secondary/30">
          <div className="container mx-auto px-4 py-8 md:py-12 lg:py-16">
            <UpcomingShowsSection />
          </div>
        </section>

        {/* Season Leaderboard Section */}
        <section>
          <div className="container mx-auto px-4 py-8 md:py-12 lg:py-16">
            <SeasonLeaderboardSection />
          </div>
        </section>
      </main>
    </>
  );
}