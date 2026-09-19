// src/app/cast/all/page.tsx
import { Metadata } from "next";
import { CombinedCastPageServer } from "@/src/components/cast-nav/CombinedCastPageServer";

export const metadata: Metadata = {
  title: "All Cast Members | SNL Stats",
  description: "Browse all Saturday Night Live cast members and alumni",
};

export default async function AllCastPage() {
  return (
    <>
      <main className="min-h-screen bg-neutral">
        <div className="container mx-auto px-4 py-12">
          <CombinedCastPageServer />
        </div>
      </main>
    </>
  );
}