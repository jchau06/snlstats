"use client";

import React, { useState, useMemo, useEffect } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
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

// Format time for display on bars
const formatTimeLabel = (seconds: number): string => {
  const minutes = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${minutes}:${String(secs).padStart(2, "0")}`;
};

// Responsive helper functions
const getChartMargin = () => {
  if (typeof window === "undefined") {
    return { top: 10, right: 140, left: 170, bottom: 10 };
  }

  const width = window.innerWidth;

  if (width < 640) {
    // Mobile: sm breakpoint
    return { top: 10, right: 10, left: 10, bottom: 10 };
  } else if (width < 768) {
    // Tablet: md breakpoint
    return { top: 10, right: 50, left: 50, bottom: 10 };
  } else {
    // Desktop: lg and up
    return { top: 10, right: 80, left: 80, bottom: 10 };
  }
};

const getYAxisWidth = () => {
  if (typeof window === "undefined") return 160;

  const width = window.innerWidth;

  if (width < 640) return 80;
  if (width < 768) return 110;
  return 160;
};

const getYAxisFontSize = () => {
  if (typeof window === "undefined") return 12;

  const width = window.innerWidth;

  if (width < 640) return 10;
  if (width < 768) return 11;
  return 12;
};

const getLabelFontSize = () => {
  if (typeof window === "undefined") return 12;

  const width = window.innerWidth;

  if (width < 640) return 9;
  if (width < 768) return 10;
  return 12;
};

// Move CustomTooltip outside component to avoid recreation
const CustomTooltip = ({ active, payload, metric }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    let displayValue = data.value;

    if (metric === "screenTime") {
      displayValue = formatTimeLabel(displayValue);
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
  const [, setWindowWidth] = useState(
    typeof window !== "undefined" ? window.innerWidth : 1024
  );

  // Listen for window resize to trigger responsive updates
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Filter out absent cast members
  const presentCastMembers = data.filter((m) => m.status === "present");

  const getMetricLabel = () => {
    switch (metric) {
      case "screenTime":
        return "Screen Time:";
      case "sketchCount":
        return "Appearances:";
      case "powerRanking":
        return "Power Ranking:";
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

    // Get color based on absolute performance with smooth gradient
    const getBarColor = (value: number, minVal: number, maxVal: number) => {
      const range = maxVal - minVal;
      const normalized = range === 0 ? 0 : (value - minVal) / range; // 0 to 1

      // Smooth gradient: Red (0) → Yellow (0.5) → Green (1)
      if (normalized < 0.5) {
        // Red to Yellow: interpolate between #EF4444 and #FFD200
        const t = normalized * 2; // 0 to 1 within red-yellow range
        const r = Math.round(239 + (255 - 239) * t); // 239 to 255
        const g = Math.round(68 + (210 - 68) * t); // 68 to 210
        const b = Math.round(68 + (0 - 68) * t); // 68 to 0
        return `rgb(${r}, ${g}, ${b})`;
      } else {
        // Yellow to Green: interpolate between #FFD200 and #22C55E
        const t = (normalized - 0.5) * 2; // 0 to 1 within yellow-green range
        const r = Math.round(255 + (34 - 255) * t); // 255 to 34
        const g = Math.round(210 + (197 - 210) * t); // 210 to 197
        const b = Math.round(0 + (94 - 0) * t); // 0 to 94
        return `rgb(${r}, ${g}, ${b})`;
      }
    };

    const sorted = [...presentCastMembers];

    if (sortBy === "highest") {
      sorted.sort((a, b) => getMetricValue(b) - getMetricValue(a));
    } else if (sortBy === "lowest") {
      sorted.sort((a, b) => getMetricValue(a) - getMetricValue(b));
    } else {
      sorted.sort((a, b) => a.name.localeCompare(b.name));
    }

    // Log for debugging
    if (process.env.NODE_ENV === "development") {
      console.log("Sorted data:", sorted.map(m => ({ name: m.name, value: getMetricValue(m) })));
    }

    // Calculate min/max from ALL present members (not just visible ones)
    const allValues = presentCastMembers.map(m => getMetricValue(m));
    const minVal = Math.min(...allValues);
    const maxVal = Math.max(...allValues);

    const displayData = (showAll ? sorted : sorted.slice(0, 5)).map(
      (member) => ({
        name: member.name,
        slug: member.slug,
        headshot: member.headshot,
        value: getMetricValue(member),
        fullValue: member,
      }),
    );

    // Ensure we have data
    if (displayData.length === 0) {
      return [];
    }

    // Add fill color to each data point based on absolute scale
    return displayData.map((d) => ({
      ...d,
      fill: getBarColor(d.value, minVal, maxVal),
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
              {showAll ? "All" : "Top five"} cast members:
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
        <div
          className="w-full"
          style={{
            height: `${Math.max(
              400,
              chartData.length * (typeof window !== "undefined" && window.innerWidth < 640 ? 30 : 40)
            )}px`,
          }}
        >
          <ResponsiveContainer width="100%" height="100%" minWidth={0}>
            <BarChart
              data={chartData}
              layout="vertical"
              margin={getChartMargin()}
              key={`${metric}-${chartData.length}`}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#2C2C2A" vertical={false} />
              <XAxis type="number" stroke="#2C2C2A" tick={false} axisLine={false} />
              <YAxis
                dataKey="name"
                type="category"
                stroke="#B4B2A9"
                width={getYAxisWidth()}
                tick={{ fontSize: getYAxisFontSize() }}
              />
              <Tooltip
                content={<CustomTooltip metric={metric} />}
                cursor={{ fill: "rgba(255, 210, 0, 0.1)" }}
              />
              <Bar
                dataKey="value"
                radius={[0, 8, 8, 0]}
                label={(props) => {
                  const { x, y, width, value } = props;
                  let displayValue = String(value);

                  if (metric === "screenTime") {
                    displayValue = formatTimeLabel(value);
                  } else if (metric === "sketchCount") {
                    displayValue = String(Math.round(value));
                  } else if (metric === "powerRanking") {
                    displayValue = Number(value).toFixed(2);
                  }

                  return (
                    <text
                      x={x + width + 8}
                      y={y + 12}
                      fill="#FFD200"
                      fontSize={getLabelFontSize()}
                      fontWeight="bold"
                      fontFamily="monospace"
                      textAnchor="start"
                      dominantBaseline="middle"
                    >
                      {displayValue}
                    </text>
                  );
                }}
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Bar>
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