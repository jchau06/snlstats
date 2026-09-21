"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { CastMemberData, SortType } from "./CastMemberNavigationPageClient";
import { CastMemberCard } from "./CastMemberCard";

interface AlumniSectionProps {
  castMembers: CastMemberData[];
  sortBy: SortType;
  onSortChange: (sort: SortType) => void;
}

export function AlumniSection({
  castMembers,
  sortBy,
  onSortChange,
}: AlumniSectionProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredCastMembers = useMemo(() => {
    if (!searchQuery.trim()) return castMembers;

    const query = searchQuery.toLowerCase().trim();

    return castMembers.filter((member) => {
      // Search by name
      if (member.name.toLowerCase().includes(query)) {
        return true;
      }

      // Search by season (e.g., "45" or "Season 45")
      // Cast member must have been active during that season
      const seasonQuery = query.replace(/season\s*/i, "");
      if (seasonQuery && !isNaN(Number(seasonQuery))) {
        const seasonNum = Number(seasonQuery);
        // For alumni, check if they were active during this season
        if (!member.joinSeason || !member.leaveSeason) return false;
        return (
          member.joinSeason <= seasonNum &&
          member.leaveSeason >= seasonNum
        );
      }

      return false;
    });
  }, [castMembers, searchQuery]);

  return (
    <div className="space-y-8">
      {/* Header with Controls */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h1 className="font-heading text-4xl md:text-5xl font-bold text-white">
            FULL ALUMNI DIRECTORY
          </h1>
          <Link
            href="/cast"
            className="text-tertiary hover:text-primary text-sm font-mono uppercase font-bold transition-colors"
          >
            ← Back
          </Link>
        </div>
        <p className="text-tertiary text-sm">
          {filteredCastMembers.length} Alumni Total
        </p>
      </div>

      {/* Controls Container */}
      <div className="flex flex-col sm:flex-row gap-3">
        {/* Search Bar */}
        <div className="relative flex-1 md:max-w-md">
          <input
            type="text"
            placeholder="Search Alumni (e.g. Ferrell, Season 45)"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-neutral border border-secondary text-tertiary px-4 py-2 rounded-sm font-mono text-xs uppercase placeholder-[#666] hover:border-primary focus:border-primary focus:outline-none transition-colors"
          />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-tertiary hover:text-primary"
              >
                ✕
              </button>
            )}
        </div>

        {/* Sort Dropdown */}
        <select
          value={sortBy}
          onChange={(e) => onSortChange(e.target.value as SortType)}
          className="bg-neutral border border-secondary text-tertiary px-4 py-2 rounded-sm font-mono text-xs uppercase font-bold hover:border-primary transition-colors cursor-pointer whitespace-nowrap"
        >
          <option value="default">Sort By: Alphabetical</option>
          <option value="earliest-hires">Earliest Hires</option>
          <option value="latest-hires">Latest Hires</option>
          <option value="avg-sketches">Average Sketches</option>
          <option value="total-sketches">Total Sketches</option>
          <option value="avg-screen-time">Average Screen Time</option>
          <option value="total-screen-time">Total Screen Time</option>
          <option value="total-episodes">Total Episodes</option>
          <option value="power-ranking">Power Ranking</option>
          <option value="total-lfnys">Total LFNYs</option>
        </select>
      </div>

      {/* Cast Grid */}
      {filteredCastMembers.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-6">
          {filteredCastMembers.map((member, index) => (
            <CastMemberCard
              key={member.id}
              member={member}
              sortBy={sortBy}
              rank={index + 1}
              index={index}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-tertiary">
            No cast members found matching &quot;{searchQuery}&quot;
          </p>
        </div>
      )}
    </div>
  );
}