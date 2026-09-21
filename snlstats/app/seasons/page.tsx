// src/app/seasons/page.tsx
import { Metadata } from "next";
import { SeasonNavigationPageServer } from "@/src/components/season-nav/SeasonNavigationPageServer";

export const metadata: Metadata = {
  title: "Seasons | SNL Stats",
  description: "Browse all Saturday Night Live seasons",
};

interface SeasonsPageProps {
  searchParams?: Promise<{
    version?: "us" | "uk";
  }>;
}

export default async function SeasonsPage({
  searchParams,
}: SeasonsPageProps) {
  const params = await searchParams;
  const version = (params?.version as "us" | "uk") || "us";

  return (
    <>
      <main className="min-h-screen bg-neutral">
        <div className="container mx-auto px-4 py-12">
          <SeasonNavigationPageServer currentVersion={version} />
        </div>
      </main>
    </>
  );
}