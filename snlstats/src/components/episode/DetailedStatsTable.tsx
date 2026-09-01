"use client";

import React, { useState, useMemo } from "react";
import { Table } from "../ui";
import Image from "next/image";

interface CastPerformanceData {
  id: string;
  name: string;
  slug: string;
  headshot?: string;
  screenTimeSeconds: number;
  sketchCount: number;
  powerRanking: number;
  status: string;
}

interface DetailedStatsTableProps {
  data: CastPerformanceData[];
  backgroundImage?: string;
  className?: string;
}

type SortKey = "rank" | "screenTime" | "sketchCount" | "powerRanking";

export function DetailedStatsTable({
  data,
  backgroundImage,
  className = "",
}: DetailedStatsTableProps) {
  const [showAll, setShowAll] = useState(false);

  // Default to Power Ranking, descending
  const [sortBy, setSortBy] = useState<SortKey>("powerRanking");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  // Filter present cast members
  const presentCastMembers = useMemo(
    () => data.filter((m) => m.status === "present"),
    [data],
  );

  // Sort data
  const sortedData = useMemo(() => {
    const sorted = [...presentCastMembers];

    if (sortBy === "powerRanking") {
      sorted.sort((a, b) =>
        sortOrder === "desc"
          ? Number(b.powerRanking) - Number(a.powerRanking)
          : Number(a.powerRanking) - Number(b.powerRanking),
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
    }

    return showAll ? sorted : sorted.slice(0, 5);
  }, [sortBy, sortOrder, showAll, presentCastMembers]);

  const handleSort = (key: string) => {
    // Rank is not a sorting key.
    // Clicking Rank simply reverses the current sort direction.
    if (key === "rank") {
      setSortOrder((current) => (current === "desc" ? "asc" : "desc"));
      return;
    }

    const keyMap: { [key: string]: SortKey } = {
      screenTime: "screenTime",
      sketchCount: "sketchCount",
      powerRanking: "powerRanking",
    };

    const mappedKey = keyMap[key];

    if (!mappedKey) {
      return;
    }

    if (sortBy === mappedKey) {
      // Clicking the same column reverses its direction
      setSortOrder((current) => (current === "desc" ? "asc" : "desc"));
    } else {
      // Switching to a new column starts descending
      setSortBy(mappedKey);
      setSortOrder("desc");
    }
  };

  // Format screen time
  const formatScreenTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${String(secs).padStart(2, "0")}`;
  };

  // Rank is based on the current sorted position.
  //
  // Descending:
  //   1, 2, 3, ... 17
  //
  // Ascending:
  //   17, 16, 15, ... 1
  //
  // Since sortedData is already sorted according to the selected
  // column/order, we calculate the displayed rank from its position.
  const totalMembers = presentCastMembers.length;

  const tableData = sortedData.map((member, idx) => ({
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

    screenTime: formatScreenTime(member.screenTimeSeconds),

    sketchCount: String(member.sketchCount),

    powerRanking: Number(member.powerRanking).toFixed(1),
  }));

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
              DETAILED CAST STATS{" "}
              <span className="text-primary text-sm font-mono">S51E03</span>
            </h3>
          </div>

          {/* Export Button */}
          <button className="bg-primary text-neutral px-4 py-2 rounded-lg font-sans font-semibold hover:bg-tertiary transition-colors duration-base flex items-center gap-2">
            <span>↓</span> Export CSV
          </button>
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
              label: "Screen Time",
              align: "right",
              sortable: true,
            },
            {
              key: "sketchCount",
              label: "Appearances",
              align: "right",
              sortable: true,
            },
            {
              key: "powerRanking",
              label: "Power Ranking",
              align: "right",
              sortable: true,
              highlight: true,
            },
          ]}
          data={tableData}
          onSort={handleSort}
          sortBy={sortBy}
          sortOrder={sortOrder}
        />

        {/* Footer */}
        {presentCastMembers.length > 5 && (
          <div className="mt-4 text-center">
            <button
              onClick={() => setShowAll(!showAll)}
              className="text-primary hover:text-tertiary font-sans font-semibold transition-colors duration-base"
            >
              {showAll
                ? "See top 5"
                : `See all ${presentCastMembers.length} members`}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
