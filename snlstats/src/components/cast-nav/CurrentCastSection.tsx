// src/components/cast-nav/CurrentCastSection.tsx
"use client";

import React from "react";
import { CastMemberData, SortType } from "./CastMemberNavigationPageClient";
import { CastMemberCard } from "./CastMemberCard";

interface CurrentCastSectionProps {
  castMembers: CastMemberData[];
  sortBy: SortType;
  onSortChange: (sort: SortType) => void;
}

export function CurrentCastSection({
  castMembers,
  sortBy,
  onSortChange,
}: CurrentCastSectionProps) {
  const repertoryMembers = castMembers.filter(
    (m) => m.seasonCastStatus === "repertory"
  );
  const featuredMembers = castMembers.filter(
    (m) => m.seasonCastStatus === "featured"
  );

  return (
    <div className="space-y-8">
      {/* Header with Controls */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <h1 className="font-heading text-4xl md:text-5xl font-bold text-white">
          CURRENT CAST MEMBERS
        </h1>

        {/* Sort Dropdown */}
        <select
          value={sortBy}
          onChange={(e) => onSortChange(e.target.value as SortType)}
          className="bg-neutral border border-secondary text-tertiary px-4 py-2 rounded-sm font-mono text-xs uppercase font-bold hover:border-primary transition-colors cursor-pointer"
        >
          <option value="default">Sort By: Default</option>
          <option value="earliest-hires">Earliest Hires</option>
          <option value="latest-hires">Latest Hires</option>
          <option value="avg-sketches">Average Sketches</option>
          <option value="total-sketches">Total Sketches</option>
          <option value="avg-screen-time">Average Screen Time</option>
          <option value="total-screen-time">Total Screen Time</option>
          <option value="power-ranking">Power Ranking</option>
        </select>
      </div>

      {/* Navigation Tabs */}
      <div className="flex gap-2 flex-wrap">
        <button className="bg-primary text-neutral px-4 py-2 rounded-sm font-mono text-xs uppercase font-bold">
          Current Cast
        </button>
        <a
          href="/cast/alumni"
          className="bg-neutral border border-secondary text-tertiary px-4 py-2 rounded-sm font-mono text-xs uppercase font-bold hover:border-primary transition-colors"
        >
          Alumni
        </a>
        <a
          href="/cast/all"
          className="bg-neutral border border-secondary text-tertiary px-4 py-2 rounded-sm font-mono text-xs uppercase font-bold hover:border-primary transition-colors"
        >
          All Cast Members
        </a>
      </div>

      {/* Repertory Players */}
      {repertoryMembers.length > 0 && (
        <div>
          <h2 className="font-heading text-h4 text-white font-bold mb-6">
            REPERTORY PLAYERS
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-6">
            {repertoryMembers.map((member, index) => (
              <CastMemberCard
                key={member.id}
                member={member}
                sortBy={sortBy}
                rank={(member as any).rank}
              />
            ))}
          </div>
        </div>
      )}

      {/* Featured Players */}
      {featuredMembers.length > 0 && (
        <div>
          <h2 className="font-heading text-h4 text-white font-bold mb-6">
            FEATURED PLAYERS
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-6">
            {featuredMembers.map((member, index) => (
              <CastMemberCard
                key={member.id}
                member={member}
                sortBy={sortBy}
                rank={(member as any).rank}
              />
            ))}
          </div>
        </div>
      )}

      {castMembers.length === 0 && (
        <div className="text-center py-12">
          <p className="text-tertiary">No cast members available</p>
        </div>
      )}
    </div>
  );
}