"use client";

import React, { useState, useMemo } from "react";
import { Table } from "@/src/components/ui/Table";
import Image from "next/image";

interface CastPerformanceRecord {
  castMemberId: string;
  name: string;
  slug: string;
  headshot?: string;
  episodeNumber: number;
  screenTimeSeconds: number;
  sketchCount: number;
  powerRanking: number;
  status?: string;
}

interface SeasonStatsTableProps {
  performanceData: CastPerformanceRecord[];
  lfnyCountByEpisode?: { [episodeNumber: number]: string[] };
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
  performanceData,
  lfnyCountByEpisode = {},
  totalEpisodes = 1,
  backgroundImage,
  className = "",
}: SeasonStatsTableProps) {
  const [showAll, setShowAll] = useState(false);
  const [statMode, setStatMode] = useState<StatMode>("totals");
  const [episodeStart, setEpisodeStart] = useState(1);
  const [episodeEnd, setEpisodeEnd] = useState(totalEpisodes);

  const [sortBy, setSortBy] = useState<SortKey>("powerRanking");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  // Get unique cast members and aggregate data for the selected episode range
  const aggregatedData = useMemo(() => {
    const castMap: {
      [castMemberId: string]: {
        name: string;
        slug: string;
        headshot?: string;
        screenTimeSeconds: number;
        sketchCount: number;
        powerRankings: number[];
        episodesAppeared: number;
      };
    } = {};

    // Filter performance data by episode range and exclude "absent" status
    const rangeData = performanceData.filter((perf) => {
      const status = perf.status;
      return (
        perf.episodeNumber >= episodeStart &&
        perf.episodeNumber <= episodeEnd &&
        status !== "absent"
      );
    });

    // Aggregate by cast member
    rangeData.forEach((perf) => {
      if (!castMap[perf.castMemberId]) {
        castMap[perf.castMemberId] = {
          name: perf.name,
          slug: perf.slug,
          headshot: perf.headshot,
          screenTimeSeconds: 0,
          sketchCount: 0,
          powerRankings: [],
          episodesAppeared: 0,
        };
      }

      castMap[perf.castMemberId].screenTimeSeconds +=
        perf.screenTimeSeconds;

      castMap[perf.castMemberId].sketchCount += perf.sketchCount;

      castMap[perf.castMemberId].powerRankings.push(perf.powerRanking);

      castMap[perf.castMemberId].episodesAppeared += 1;
    });

    return Object.entries(castMap).map(([castMemberId, data]) => ({
      castMemberId,
      ...data,
      avgPowerRanking:
        data.powerRankings.length > 0
          ? data.powerRankings.reduce((a, b) => a + b, 0) /
            data.powerRankings.length
          : 0,
    }));
  }, [performanceData, episodeStart, episodeEnd]);

  // Count LFNY for the selected range
  const lfnyCount = useMemo(() => {
    const count: { [castMemberId: string]: number } = {};

    for (let ep = episodeStart; ep <= episodeEnd; ep++) {
      const castMemberIds = lfnyCountByEpisode[ep] || [];

      castMemberIds.forEach((castMemberId) => {
        count[castMemberId] = (count[castMemberId] || 0) + 1;
      });
    }

    return count;
  }, [lfnyCountByEpisode, episodeStart, episodeEnd]);

  // Sort data
  const sortedData = useMemo(() => {
    const sorted = [...aggregatedData];

    if (sortBy === "powerRanking") {
      sorted.sort((a, b) =>
        sortOrder === "desc"
          ? b.avgPowerRanking - a.avgPowerRanking
          : a.avgPowerRanking - b.avgPowerRanking,
      );
    } else if (sortBy === "sketchCount") {
      sorted.sort((a, b) =>
        sortOrder === "desc"
          ? b.sketchCount - a.sketchCount
          : a.sketchCount - b.sketchCount,
      );
    } else if (sortBy === "screenTime") {
      sorted.sort((a, b) =>
        sortOrder === "desc"
          ? b.screenTimeSeconds - a.screenTimeSeconds
          : a.screenTimeSeconds - b.screenTimeSeconds,
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
  }, [sortBy, sortOrder, showAll, aggregatedData, lfnyCount]);

  const handleSort = (key: string) => {
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
      return `${hours}:${String(minutes).padStart(2, "0")}:${String(
        secs,
      ).padStart(2, "0")}`;
    }

    return `${minutes}:${String(secs).padStart(2, "0")}`;
  };

  const tableData = sortedData.map((member, idx) => {
    let displayScreenTime = member.screenTimeSeconds;
    let displaySketchCount = member.sketchCount;
    let displayPowerRanking = member.avgPowerRanking;
    let displayLfny = lfnyCount[member.castMemberId] || 0;

    // If in averages mode, divide by episodes appeared
    if (statMode === "averages" && member.episodesAppeared > 0) {
      displayScreenTime = Math.round(
        displayScreenTime / member.episodesAppeared,
      );

      displaySketchCount =
        displaySketchCount / member.episodesAppeared;

      displayPowerRanking = displayPowerRanking; // Already averaged

      displayLfny = displayLfny / member.episodesAppeared;
    }

    return {
      rank: String(
        sortOrder === "desc"
          ? idx + 1
          : aggregatedData.length - idx,
      ),

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

      episodesAppeared: String(member.episodesAppeared),

      screenTime: formatScreenTime(displayScreenTime),

      sketchCount:
        statMode === "averages"
          ? Number(displaySketchCount).toFixed(2)
          : String(Math.round(displaySketchCount)),

      powerRanking: Number(displayPowerRanking).toFixed(1),

      lfnyCount:
        statMode === "averages"
          ? Number(displayLfny).toFixed(2)
          : String(Math.round(displayLfny)),
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

              {/* FROM EP */}
              <div className="relative">
                <input
                  type="number"
                  value={episodeStart}
                  onChange={(e) => {
                    const val = Math.min(
                      Math.max(1, Number(e.target.value)),
                      episodeEnd,
                    );

                    setEpisodeStart(val);
                  }}
                  min={1}
                  max={episodeEnd}
                  className="w-16 h-[38px] bg-black/40 border border-[#2C2C2A] rounded px-2 pr-5 text-center text-primary focus:outline-none font-semibold transition-colors duration-base hover:border-primary focus:border-primary appearance-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                />

                {/* Spinner Buttons */}
                <div className="absolute right-1 top-1/2 -translate-y-1/2 flex flex-col">
                  <button
                    type="button"
                    onClick={() => {
                      setEpisodeStart((current) =>
                        Math.min(current + 1, episodeEnd),
                      );
                    }}
                    disabled={episodeStart >= episodeEnd}
                    aria-label="Increase starting episode"
                    className="w-4 h-4 flex items-center justify-center text-primary hover:text-tertiary disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                  >
                    <span className="text-[10px] leading-none">
                      ▲
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setEpisodeStart((current) =>
                        Math.max(current - 1, 1),
                      );
                    }}
                    disabled={episodeStart <= 1}
                    aria-label="Decrease starting episode"
                    className="w-4 h-4 flex items-center justify-center text-primary hover:text-tertiary disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                  >
                    <span className="text-[10px] leading-none">
                      ▼
                    </span>
                  </button>
                </div>
              </div>

              <span className="text-[#B4B2A9]">TO EP</span>

              {/* TO EP */}
              <div className="relative">
                <input
                  type="number"
                  value={episodeEnd}
                  onChange={(e) => {
                    const val = Math.min(
                      totalEpisodes,
                      Math.max(
                        episodeStart,
                        Number(e.target.value),
                      ),
                    );

                    setEpisodeEnd(val);
                  }}
                  min={episodeStart}
                  max={totalEpisodes}
                  className="w-16 h-[38px] bg-black/40 border border-[#2C2C2A] rounded px-2 pr-5 text-center text-primary focus:outline-none font-semibold transition-colors duration-base hover:border-primary focus:border-primary appearance-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                />

                {/* Spinner Buttons */}
                <div className="absolute right-1 top-1/2 -translate-y-1/2 flex flex-col">
                  <button
                    type="button"
                    onClick={() => {
                      setEpisodeEnd((current) =>
                        Math.min(current + 1, totalEpisodes),
                      );
                    }}
                    disabled={episodeEnd >= totalEpisodes}
                    aria-label="Increase ending episode"
                    className="w-4 h-4 flex items-center justify-center text-primary hover:text-tertiary disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                  >
                    <span className="text-[10px] leading-none">
                      ▲
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setEpisodeEnd((current) =>
                        Math.max(current - 1, episodeStart),
                      );
                    }}
                    disabled={episodeEnd <= episodeStart}
                    aria-label="Decrease ending episode"
                    className="w-4 h-4 flex items-center justify-center text-primary hover:text-tertiary disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                  >
                    <span className="text-[10px] leading-none">
                      ▼
                    </span>
                  </button>
                </div>
              </div>
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
              key: "episodesAppeared",
              label: "Episodes",
              align: "right",
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
        {aggregatedData.length > 5 && (
          <div className="mt-4 text-center">
            <button
              onClick={() => setShowAll(!showAll)}
              className="text-primary hover:text-tertiary font-sans font-semibold transition-colors duration-base"
            >
              {showAll
                ? "See top 5"
                : `See all ${aggregatedData.length} members`}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}