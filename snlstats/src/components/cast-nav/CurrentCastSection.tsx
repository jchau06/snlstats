"use client";

import React, { useState, useMemo } from "react";
import { CastMemberData, SortType } from "./CastMemberNavigationPageClient";
import { CastMemberCard } from "./CastMemberCard";

interface CombinedCastPageClientProps {
  castMembers: CastMemberData[];
  currentCastMembers: CastMemberData[];
  alumniCastMembers: CastMemberData[];
}

type ViewType = "current" | "alumni" | "all";

export function CombinedCastPageClient({
  castMembers,
  currentCastMembers,
  alumniCastMembers,
}: CombinedCastPageClientProps) {
  const [view, setView] = useState<ViewType>("current");
  const [sortBy, setSortBy] = useState<SortType>("default");
  const [searchQuery, setSearchQuery] = useState("");

  const getLastName = (fullName: string): string => {
    const parts = fullName.trim().split(" ");
    return parts[parts.length - 1];
  };

  const getDisplayMembers = (): CastMemberData[] => {
    switch (view) {
      case "current":
        return currentCastMembers;
      case "alumni":
        return alumniCastMembers;
      case "all":
        return castMembers;
    }
  };

  const displayMembers = getDisplayMembers();

  const filteredAndSortedMembers = useMemo(() => {
    let members = [...displayMembers];

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      members = members.filter((member) => {
        // Search by name
        if (member.name.toLowerCase().includes(query)) {
          return true;
        }

        // Search by season (e.g., "45" or "Season 45")
        const seasonQuery = query.replace(/season\s*/i, "");
        if (seasonQuery && !isNaN(Number(seasonQuery))) {
          const seasonNum = Number(seasonQuery);
          if (!member.joinSeason) return false;

          // Current cast: only check join season (no leave season)
          if (!member.leaveSeason) {
            // Only show if the season is current (i.e., they joined in or before the current season)
            // For simplicity, we assume current season exists in data
            return member.joinSeason <= seasonNum;
          }

          // Alumni: must be within their season range
          return (
            member.joinSeason <= seasonNum && member.leaveSeason >= seasonNum
          );
        }

        return false;
      });
    }

    // Apply sorting
    switch (sortBy) {
      case "default":
        members.sort((a, b) =>
          getLastName(a.name).localeCompare(getLastName(b.name)),
        );
        break;
      case "earliest-hires":
        members.sort((a, b) => {
          const seasonDiff = (a.joinSeason || 0) - (b.joinSeason || 0);
          if (seasonDiff !== 0) return seasonDiff;
          return getLastName(a.name).localeCompare(getLastName(b.name));
        });
        break;
      case "latest-hires":
        members.sort((a, b) => {
          const seasonDiff = (b.joinSeason || 0) - (a.joinSeason || 0);
          if (seasonDiff !== 0) return seasonDiff;
          return getLastName(a.name).localeCompare(getLastName(b.name));
        });
        break;
      case "avg-sketches":
        members.sort(
          (a, b) =>
            (b.careerStats?.averageAppearancesPerEp || 0) -
            (a.careerStats?.averageAppearancesPerEp || 0),
        );
        break;
      case "total-sketches":
        members.sort(
          (a, b) =>
            (b.careerStats?.totalAppearances || 0) -
            (a.careerStats?.totalAppearances || 0),
        );
        break;
      case "avg-screen-time":
        members.sort(
          (a, b) =>
            (b.careerStats?.averageScreenTimeSeconds || 0) -
            (a.careerStats?.averageScreenTimeSeconds || 0),
        );
        break;
      case "total-screen-time":
        members.sort(
          (a, b) =>
            (b.careerStats?.totalScreenTimeSeconds || 0) -
            (a.careerStats?.totalScreenTimeSeconds || 0),
        );
        break;
      case "total-episodes":
        members.sort(
          (a, b) =>
            (b.careerStats?.totalEpisodes || 0) -
            (a.careerStats?.totalEpisodes || 0),
        );
        break;
      case "power-ranking":
        members.sort(
          (a, b) =>
            (b.careerStats?.averagePowerRanking || 0) -
            (a.careerStats?.averagePowerRanking || 0),
        );
        break;
      case "total-lfnys":
        members.sort(
          (a, b) =>
            (b.careerStats?.totalLiveFromNewYorks || 0) -
            (a.careerStats?.totalLiveFromNewYorks || 0),
        );
        break;
    }

    // Add ranking for stats sorts
    if (
      [
        "avg-sketches",
        "total-sketches",
        "avg-screen-time",
        "total-screen-time",
        "power-ranking",
        "total-lfnys",
        "total-episodes",
      ].includes(sortBy)
    ) {
      members.forEach((member, index) => {
        (member as any).rank = index + 1;
      });
    }

    return members;
  }, [displayMembers, sortBy, searchQuery]);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="font-heading text-4xl md:text-5xl font-bold text-white mb-2">
          CAST MEMBERS
        </h1>
        <p className="text-tertiary text-sm">
          Archive explorer tracking performers, sketch counts, screen time, and
          power rankings across all seasons.
        </p>
      </div>

      {/* View Toggle */}
      <div className="flex gap-2 flex-wrap">
        {[
          { value: "current" as ViewType, label: "Current Cast" },
          { value: "alumni" as ViewType, label: "Alumni" },
          { value: "all" as ViewType, label: "All Cast Members" },
        ].map((option) => (
          <button
            key={option.value}
            onClick={() => setView(option.value)}
            className={`px-4 py-2 rounded-sm font-mono text-xs uppercase font-bold transition-colors whitespace-nowrap ${
              view === option.value
                ? "bg-primary text-neutral"
                : "bg-neutral border border-secondary text-tertiary hover:border-primary"
            }`}
          >
            {option.label}
          </button>
        ))}
      </div>

      {/* Controls */}
      <div className="flex flex-col lg:flex-row gap-3 lg:items-center">
        {/* Search Bar */}
        <div className="relative flex-1 min-w-0">
          <input
            type="text"
            placeholder="Search Cast or Season"
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
          onChange={(e) => setSortBy(e.target.value as SortType)}
          className="bg-neutral border border-secondary text-tertiary px-4 py-2 rounded-sm font-mono text-xs uppercase font-bold hover:border-primary transition-colors cursor-pointer shrink-0"
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

      {/* Result Count */}
      <div className="text-tertiary text-sm">
        Showing {filteredAndSortedMembers.length} of {displayMembers.length}{" "}
        cast members
      </div>

      {/* Cast Grid */}
      {filteredAndSortedMembers.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-6">
          {filteredAndSortedMembers.map((member, index) => (
            <CastMemberCard
              key={member.id}
              member={member}
              sortBy={sortBy}
              rank={(member as any).rank}
              index={index}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-tertiary">
            No cast members found
            {searchQuery ? ` matching "${searchQuery}"` : ""}
          </p>
        </div>
      )}
    </div>
  );
}
