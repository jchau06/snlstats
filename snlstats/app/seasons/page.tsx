// src/app/seasons/page.tsx
import { Metadata } from "next";
import { Header } from "@/src/components/ui/Header";
import { SeasonNavigationPageServer } from "@/src/components/season-nav/SeasonNavigationPageServer";

export const metadata: Metadata = {
  title: "Seasons | SNL Stats",
  description: "Browse all Saturday Night Live seasons",
};

interface SeasonsPageProps {
  searchParams?: {
    version?: "us" | "uk";
  };
}

export default async function SeasonsPage({
  searchParams,
}: SeasonsPageProps) {
  const version = (searchParams?.version as "us" | "uk") || "us";

  return (
    <>
      <Header />
      <main className="min-h-screen bg-neutral">
        <div className="container mx-auto px-4 py-12">
          <SeasonNavigationPageServer currentVersion={version} />
        </div>
      </main>
    </>
  );
}