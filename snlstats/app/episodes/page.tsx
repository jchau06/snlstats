// src/app/episodes/page.tsx
import { Metadata } from "next";
import { EpisodesPageServer } from "@/src/components/episode-nav/EpisodesPageServer";

export const metadata: Metadata = {
  title: "Episodes | SNL Stats",
  description: "Browse all Saturday Night Live episodes by season",
};

interface EpisodesPageProps {
  searchParams?: {
    version?: "us" | "uk";
  };
}

export default async function EpisodesPage({
  searchParams,
}: EpisodesPageProps) {
  const version = (searchParams?.version as "us" | "uk") || "us";

  return (
    <>
      <main className="min-h-screen bg-neutral">
        <div className="container mx-auto px-4 py-12">
          <EpisodesPageServer currentVersion={version} />
        </div>
      </main>
    </>
  );
}