"use client";

import React, { useState, useMemo } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

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

interface PerformanceBarChartProps {
  data: CastPerformanceData[];
  metric: "screenTime" | "sketchCount" | "powerRanking";
  backgroundImage?: string;
  className?: string;
}

type SortOption = "highest" | "lowest" | "alphabetical";

// Move CustomTooltip outside component to avoid recreation
const CustomTooltip = ({ active, payload, metric }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    let displayValue = data.value;

    if (metric === "screenTime") {
      const minutes = Math.floor(displayValue / 60);
      const seconds = displayValue % 60;
      displayValue = `${minutes}:${String(seconds).padStart(2, "0")}`;
    }

    return (
      <div className="bg-secondary border border-primary p-3 rounded-lg">
        <p className="font-sans font-semibold text-tertiary">{data.name}</p>
        <p className="font-mono text-primary font-bold">{displayValue}</p>
      </div>
    );
  }
  return null;
};

export function PerformanceBarChart({
  data,
  metric,
  backgroundImage,
  className = "",
}: PerformanceBarChartProps) {
  const [sortBy, setSortBy] = useState<SortOption>("highest");
  const [showAll, setShowAll] = useState(false);

  // Filter out absent cast members
  const presentCastMembers = data.filter((m) => m.status === "present");

  const getMetricLabel = () => {
    switch (metric) {
      case "screenTime":
        return "Screen Time (seconds)";
      case "sketchCount":
        return "Sketch Count";
      case "powerRanking":
        return "Power Ranking";
    }
  };

  // Sort and limit data - move getMetricValue inside useMemo
  const chartData = useMemo(() => {
    // Define getMetricValue inside useMemo
    const getMetricValue = (member: CastPerformanceData) => {
      switch (metric) {
        case "screenTime":
          return member.screenTimeSeconds;
        case "sketchCount":
          return member.sketchCount;
        case "powerRanking":
          return Number(member.powerRanking);
      }
    };

    // Get color based on performance
    const getBarColor = (value: number, maxVal: number) => {
      const ratio = value / maxVal;
      if (ratio >= 0.8) return "#FFD200"; // Gold
      if (ratio >= 0.6) return "#C4A000"; // Darker gold
      if (ratio >= 0.4) return "#8B7500"; // Brown-gold
      return "#5A5000"; // Dark brown
    };

    const sorted = [...presentCastMembers];

    if (sortBy === "highest") {
      sorted.sort((a, b) => getMetricValue(b) - getMetricValue(a));
    } else if (sortBy === "lowest") {
      sorted.sort((a, b) => getMetricValue(a) - getMetricValue(b));
    } else {
      sorted.sort((a, b) => a.name.localeCompare(b.name));
    }

    const displayData = (showAll ? sorted : sorted.slice(0, 5)).map(
      (member) => ({
        name: member.name,
        slug: member.slug,
        headshot: member.headshot,
        value: getMetricValue(member),
        fullValue: member,
      }),
    );

    const max = Math.max(...displayData.map((d) => d.value), 1);

    // Add fill color to each data point
    return displayData.map((d) => ({
      ...d,
      fill: getBarColor(d.value, max),
    }));
  }, [metric, sortBy, showAll, presentCastMembers]);

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
              {getMetricLabel()}
            </h3>
            <p className="stat-label mt-1">
              {showAll ? "All" : "Top 5"} cast members
            </p>
          </div>

          {/* Controls */}
          <div className="flex flex-col sm:flex-row gap-3">
            {/* Sort Dropdown */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortOption)}
              className="bg-neutral border border-[#2C2C2A] text-tertiary px-3 py-2 rounded-lg font-sans font-semibold hover:border-primary transition-colors duration-base cursor-pointer"
            >
              <option value="highest">Highest First</option>
              <option value="lowest">Lowest First</option>
              <option value="alphabetical">A-Z</option>
            </select>

            {/* See All Toggle */}
            {presentCastMembers.length > 5 && (
              <button
                onClick={() => setShowAll(!showAll)}
                className="bg-primary text-neutral px-4 py-2 rounded-lg font-sans font-semibold hover:bg-tertiary transition-colors duration-base"
              >
                {showAll ? "Show Top 5" : "See All"}
              </button>
            )}
          </div>
        </div>

        {/* Chart */}
        <div className="w-full h-96 md:h-[500px] min-h-[400px]">
          <ResponsiveContainer width="100%" height="100%" minWidth={0}>
            <BarChart
              data={chartData}
              layout="vertical"
              margin={{ top: 20, right: 30, left: 200, bottom: 20 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#2C2C2A" />
              <XAxis type="number" stroke="#B4B2A9" />
              <YAxis
                dataKey="name"
                type="category"
                stroke="#B4B2A9"
                width={180}
                tick={{ fontSize: 12 }}
              />
              <Tooltip
                content={<CustomTooltip metric={metric} />}
                cursor={{ fill: "#222222" }}
              />
              <Bar dataKey="value" fill="#FFD200" radius={[0, 8, 8, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Footer */}
        {presentCastMembers.length > 5 && (
          <div className="mt-4 text-center">
            <button
              onClick={() => setShowAll(!showAll)}
              className="text-primary hover:text-tertiary font-sans font-semibold transition-colors duration-base"
            >
              {showAll
                ? "Collapse to Top 5"
                : `View All ${presentCastMembers.length} Cast Members`}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
