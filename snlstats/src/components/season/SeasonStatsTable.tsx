"use client";

import React, { useState, useMemo } from "react";
import { Table } from "../ui";
import Image from "next/image";

interface SeasonCastPerformanceData {
  castMemberId: string;
  name: string;
  slug: string;
  headshot?: string;
  totalScreenTimeSeconds: number;
  totalAppearances: number;
  powerRankingSeason: number;
}

interface LiveFromNewYorkData {
  [castMemberId: string]: number;
}

interface SeasonStatsTableProps {
  data: SeasonCastPerformanceData[];
  lfnyCount?: LiveFromNewYorkData;
  totalEpisodes?: number;
  backgroundImage?: string;
  className?: string;
}

type SortKey =
  | "rank"
  | "screenTime"
  | "sketchCount"
  | "powerRanking"
  | "lfnyCount";
type StatMode = "totals" | "averages";

export function SeasonStatsTable({
  data,
  lfnyCount = {},
  totalEpisodes = 1,
  backgroundImage,
  className = "",
}: SeasonStatsTableProps) {
  const [showAll, setShowAll] = useState(false);
  const [statMode, setStatMode] = useState<StatMode>("totals");
  const [episodeStart, setEpisodeStart] = useState(1);
  const [episodeEnd, setEpisodeEnd] = useState(totalEpisodes);

  // Default to Power Ranking, descending
  const [sortBy, setSortBy] = useState<SortKey>("powerRanking");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  // Filter and sort data
  const sortedData = useMemo(() => {
    const sorted = [...data];

    // Sort by selected key
    if (sortBy === "powerRanking") {
      sorted.sort((a, b) =>
        sortOrder === "desc"
          ? Number(b.powerRankingSeason) - Number(a.powerRankingSeason)
          : Number(a.powerRankingSeason) - Number(b.powerRankingSeason),
      );
    } else if (sortBy === "sketchCount") {
      sorted.sort((a, b) =>
        sortOrder === "desc"
          ? b.totalAppearances - a.totalAppearances
          : a.totalAppearances - b.totalAppearances,
      );
    } else if (sortBy === "screenTime") {
      sorted.sort((a, b) =>
        sortOrder === "desc"
          ? b.totalScreenTimeSeconds - a.totalScreenTimeSeconds
          : a.totalScreenTimeSeconds - b.totalScreenTimeSeconds,
      );
    } else if (sortBy === "lfnyCount") {
      sorted.sort((a, b) =>
        sortOrder === "desc"
          ? (lfnyCount[b.castMemberId] || 0) -
            (lfnyCount[a.castMemberId] || 0)
          : (lfnyCount[a.castMemberId] || 0) -
            (lfnyCount[b.castMemberId] || 0),
      );
    }

    return showAll ? sorted : sorted.slice(0, 5);
  }, [sortBy, sortOrder, showAll, data, lfnyCount]);

  const handleSort = (key: string) => {
    // Rank reverses sort order
    if (key === "rank") {
      setSortOrder((current) => (current === "desc" ? "asc" : "desc"));
      return;
    }

    const keyMap: { [key: string]: SortKey } = {
      screenTime: "screenTime",
      sketchCount: "sketchCount",
      powerRanking: "powerRanking",
      lfnyCount: "lfnyCount",
    };

    const mappedKey = keyMap[key];

    if (!mappedKey) {
      return;
    }

    if (sortBy === mappedKey) {
      setSortOrder((current) => (current === "desc" ? "asc" : "desc"));
    } else {
      setSortBy(mappedKey);
      setSortOrder("desc");
    }
  };

  // Format screen time as HH:MM:SS
  const formatScreenTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    if (hours > 0) {
      return `${hours}:${String(minutes).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
    }
    return `${minutes}:${String(secs).padStart(2, "0")}`;
  };

  // Calculate episode range
  const numEpisodesInRange = episodeEnd - episodeStart + 1;
  const episodeMultiplier = numEpisodesInRange / totalEpisodes;

  const totalMembers = data.length;

  const tableData = sortedData.map((member, idx) => {
    let displayScreenTime = member.totalScreenTimeSeconds || 0;
    let displayAppearances = member.totalAppearances || 0;
    let displayPowerRanking = member.powerRankingSeason || 0;
    let displayLfny = lfnyCount[member.castMemberId] || 0;

    // If in averages mode, divide by number of episodes in range
    if (
      statMode === "averages" &&
      numEpisodesInRange > 0 &&
      totalEpisodes > 0
    ) {
      displayScreenTime = Math.round(displayScreenTime / totalEpisodes);
      displayAppearances = Math.round(displayAppearances / totalEpisodes);
      displayPowerRanking =
        (displayPowerRanking / totalEpisodes) * numEpisodesInRange;
      displayLfny = Math.round((displayLfny / totalEpisodes) * numEpisodesInRange);
    }

    return {
      rank: String(sortOrder === "desc" ? idx + 1 : totalMembers - idx),

      castMember: (
        <div className="flex items-center gap-3">
          {member.headshot && (
            <div className="relative w-8 h-8 flex-shrink-0">
              <Image
                src={member.headshot}
                alt={member.name}
                width={32}
                height={32}
                className="rounded-full object-cover border border-primary"
                onError={(e) => {
                  (e.target as HTMLImageElement).src =
                    'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"%3E%3Crect fill="%23222222" width="32" height="32"/%3E%3C/svg%3E';
                }}
              />
            </div>
          )}

          <a
            href={`/cast/${member.slug}`}
            className="text-primary hover:text-tertiary font-semibold transition-colors duration-base"
          >
            {member.name}
          </a>
        </div>
      ),

      screenTime: formatScreenTime(displayScreenTime),

      sketchCount: String(displayAppearances),

      powerRanking: Number(displayPowerRanking).toFixed(1),

      lfnyCount: String(displayLfny),
    };
  });

  return (
    <div
      className={`relative rounded-lg overflow-hidden ${className}`}
      style={{
        backgroundImage: backgroundImage
          ? `url(${backgroundImage})`
          : undefined,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Background Overlay */}
      {backgroundImage && (
        <div className="absolute inset-0 bg-black/40 -z-10" />
      )}

      <div className="relative bg-secondary/80 backdrop-blur-sm border border-[#2C2C2A] p-6 rounded-lg">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <div>
            <h3 className="font-subheading text-h4 text-tertiary font-bold">
              DETAILED CAST STATS
            </h3>
          </div>

          {/* Controls */}
          <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
            {/* Episode Range */}
            <div className="flex items-center gap-2 text-xs sm:text-sm">
              <span className="text-[#B4B2A9]">FROM EP</span>
              <input
                type="number"
                min="1"
                max={totalEpisodes}
                value={episodeStart}
                onChange={(e) =>
                  setEpisodeStart(
                    Math.min(
                      Number(e.target.value),
                      episodeEnd,
                    ),
                  )
                }
                className="w-12 bg-black/40 border border-[#2C2C2A] rounded px-2 py-1 text-primary focus:border-primary focus:outline-none"
              />
              <span className="text-[#B4B2A9]">TO EP</span>
              <input
                type="number"
                min={episodeStart}
                max={totalEpisodes}
                value={episodeEnd}
                onChange={(e) =>
                  setEpisodeEnd(
                    Math.max(
                      Number(e.target.value),
                      episodeStart,
                    ),
                  )
                }
                className="w-12 bg-black/40 border border-[#2C2C2A] rounded px-2 py-1 text-primary focus:border-primary focus:outline-none"
              />
            </div>

            {/* Totals/Averages Toggle */}
            <div className="flex gap-2 bg-black/40 rounded-lg p-1">
              <button
                onClick={() => setStatMode("totals")}
                className={`px-3 py-1 text-sm font-semibold rounded transition-colors duration-base ${
                  statMode === "totals"
                    ? "bg-primary text-neutral"
                    : "text-primary hover:text-tertiary"
                }`}
              >
                TOTALS
              </button>
              <button
                onClick={() => setStatMode("averages")}
                className={`px-3 py-1 text-sm font-semibold rounded transition-colors duration-base ${
                  statMode === "averages"
                    ? "bg-primary text-neutral"
                    : "text-primary hover:text-tertiary"
                }`}
              >
                AVERAGES
              </button>
            </div>
          </div>
        </div>

        {/* Table */}
        <Table
          columns={[
            {
              key: "rank",
              label: "Rank",
              align: "center",
              sortable: true,
            },
            {
              key: "castMember",
              label: "Cast Member",
              sortable: false,
            },
            {
              key: "screenTime",
              label: "Screen Time (MIN)",
              align: "right",
              sortable: true,
            },
            {
              key: "sketchCount",
              label: "Sketches",
              align: "right",
              sortable: true,
            },
            {
              key: "powerRanking",
              label: "Avg PWR Rank",
              align: "right",
              sortable: true,
              highlight: true,
            },
            {
              key: "lfnyCount",
              label: "LFNY",
              align: "right",
              sortable: true,
            },
          ]}
          data={tableData}
          onSort={handleSort}
          sortBy={sortBy}
          sortOrder={sortOrder}
        />

        {/* Footer */}
        {data.length > 5 && (
          <div className="mt-4 text-center">
            <button
              onClick={() => setShowAll(!showAll)}
              className="text-primary hover:text-tertiary font-sans font-semibold transition-colors duration-base"
            >
              {showAll ? "See top 5" : `See all ${data.length} members`}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}