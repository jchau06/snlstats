// src/components/cast/EpisodeStatsChartClient.tsx
"use client";

import { useState } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";

interface EpisodeData {
  episodeNumber: number;
  hostMusicalGuest: string;
  airDate: string;
  powerRanking: number;
  screenTimeSeconds: number;
  segmentCount: number;
  castRank: number;
  totalCastInEpisode: number;
  seasonNumber?: number;
}

interface EpisodeStatsChartClientProps {
  data: EpisodeData[];
  seasonNumber: number;
}

type MetricType = "screenTime" | "segments" | "powerRanking";
type SortType = "latest" | "oldest" | "highest" | "lowest";

const formatTimeLabel = (seconds: number): string => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = Math.round(seconds % 60);

  if (hours > 0) {
    return `${hours}H ${minutes}M`;
  }

  return `${minutes}M ${secs}S`;
};

const getMetricValue = (entry: EpisodeData, metric: MetricType): number => {
  if (metric === "screenTime") {
    return entry.screenTimeSeconds;
  } else if (metric === "segments") {
    return entry.segmentCount;
  } else {
    return entry.powerRanking;
  }
};

const formatValue = (value: number, metric: MetricType): string => {
  if (metric === "screenTime") {
    return formatTimeLabel(value);
  } else if (metric === "segments") {
    return Math.round(value).toString();
  } else {
    return value.toFixed(1);
  }
};

// Smooth gradient color based on normalized value (0-1)
// Red (0) -> Yellow (0.5) -> Green (1)
const getBarColor = (normalized: number): string => {
  if (normalized < 0.5) {
    // Red to Yellow
    const ratio = normalized * 2;

    const r = Math.round(239 - (239 - 255) * ratio);
    const g = Math.round(68 + (210 - 68) * ratio);
    const b = Math.round(68 + (0 - 68) * ratio);

    return `rgb(${r}, ${g}, ${b})`;
  } else {
    // Yellow to Green
    const ratio = (normalized - 0.5) * 2;

    const r = Math.round(255 + (34 - 255) * ratio);
    const g = Math.round(210 + (197 - 210) * ratio);
    const b = Math.round(0 + (94 - 0) * ratio);

    return `rgb(${r}, ${g}, ${b})`;
  }
};

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{ payload: EpisodeData }>;
  metric: MetricType;
}

const CustomTooltip = ({ active, payload, metric }: CustomTooltipProps) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    const value = getMetricValue(data, metric);

    return (
      <div className="bg-secondary border border-primary p-3 rounded-lg">
        <p className="font-sans font-semibold text-tertiary">
          EP {data.episodeNumber} - {data.hostMusicalGuest}
        </p>

        <p className="font-mono text-white/60 text-xs">{data.airDate}</p>

        <p className="font-mono text-primary font-bold mt-1">
          {formatValue(value, metric)}
        </p>

        <p className="font-mono text-white/60 text-xs">
          Rank: #{data.castRank} / {data.totalCastInEpisode}
        </p>
      </div>
    );
  }

  return null;
};

interface CustomBarProps {
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  index?: number;
  fill?: string;
  metric: MetricType;
  sortedData: EpisodeData[];
  minVal: number;
  range: number;
}

const CustomBar = ({
  x,
  y,
  width,
  height,
  index,
  metric,
  sortedData,
  minVal,
  range,
}: CustomBarProps) => {
  if (
    typeof x !== "number" ||
    typeof y !== "number" ||
    typeof width !== "number" ||
    typeof height !== "number" ||
    typeof index !== "number"
  ) {
    return null;
  }

  const entry = sortedData[index];

  if (!entry) {
    return null;
  }

  const val = getMetricValue(entry, metric);
  const normalized = range === 0 ? 0.5 : (val - minVal) / range;

  return (
    <rect
      x={x}
      y={y}
      width={width}
      height={height}
      fill={getBarColor(normalized)}
      rx={6}
      ry={6}
    />
  );
};

export function EpisodeStatsChartClient({
  data,
  seasonNumber,
}: EpisodeStatsChartClientProps) {
  const [metric, setMetric] = useState<MetricType>("powerRanking");

  const [sortBy, setSortBy] = useState<SortType>("latest");

  if (!data || data.length === 0) {
    return (
      <div className="bg-secondary/80 backdrop-blur-sm border border-[#2C2C2A] p-6 rounded-lg">
        <p className="text-tertiary">No episode data available</p>
      </div>
    );
  }

  // Sort data
  const sortedData = [...data].sort((a, b) => {
    if (sortBy === "latest") {
      return b.episodeNumber - a.episodeNumber;
    } else if (sortBy === "oldest") {
      return a.episodeNumber - b.episodeNumber;
    }

    const aVal = getMetricValue(a, metric);
    const bVal = getMetricValue(b, metric);

    return sortBy === "highest" ? bVal - aVal : aVal - bVal;
  });

  // Calculate min/max for normalization
  const values = sortedData.map((entry) => getMetricValue(entry, metric));

  const minVal = Math.min(...values);
  const maxVal = Math.max(...values);
  const range = maxVal - minVal;

  const chartHeight = Math.max(250, data.length * 35);

  // Fixed chart width prevents Recharts from having to measure
  // a responsive parent during its initial render.
  const chartWidth = 800;

  return (
    <div className="bg-secondary/80 backdrop-blur-sm border border-[#2C2C2A] p-6 rounded-lg">
      {/* Header with Controls */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
        {/* Left: Title and Subtitle */}
        <div>
          <h3 className="font-heading text-h3 text-tertiary font-bold">
            Stats Per Episode
          </h3>

          <p className="stat-label mt-2">
            Season {seasonNumber} Performance Breakdown
          </p>
        </div>

        {/* Right: Controls */}
        <div className="flex flex-col sm:flex-row gap-2">
          {/* Metric Buttons */}
          <div className="flex gap-2">
            {["powerRanking", "screenTime", "segments"].map((m) => (
              <button
                key={m}
                onClick={() => setMetric(m as MetricType)}
                className={`px-3 py-2 rounded-sm font-mono text-xs uppercase transition-colors whitespace-nowrap ${
                  metric === m
                    ? "bg-primary text-neutral font-bold"
                    : "bg-neutral border border-secondary text-tertiary hover:border-primary"
                }`}
              >
                {m === "powerRanking"
                  ? "Power Ranking"
                  : m === "screenTime"
                    ? "Screen Time"
                    : "Segment Count"}
              </button>
            ))}
          </div>

          {/* Sort Dropdown */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as SortType)}
            className="bg-neutral border border-secondary text-tertiary px-3 py-2 rounded-sm font-mono text-xs uppercase hover:border-primary transition-colors cursor-pointer"
          >
            <option value="latest">Latest</option>
            <option value="oldest">Oldest</option>
            <option value="highest">Highest</option>
            <option value="lowest">Lowest</option>
          </select>
        </div>
      </div>

      {/* Chart */}
      <div className="w-full overflow-x-auto overflow-y-hidden">
        <div
          style={{
            height: `${chartHeight}px`,
            minWidth: `${chartWidth}px`,
          }}
        >
          <BarChart
            width={chartWidth}
            height={chartHeight}
            data={sortedData}
            layout="vertical"
            margin={{
              top: 10,
              right: 120,
              left: 160,
              bottom: 10,
            }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#2C2C2A"
              vertical={false}
            />

            <XAxis
              type="number"
              stroke="#2C2C2A"
              tick={false}
              axisLine={false}
            />

            <YAxis
              dataKey={(entry) => {
                const epNum = String(Math.round(entry.episodeNumber)).padStart(
                  2,
                  "0",
                );

                return `${seasonNumber}.${epNum} - ${entry.hostMusicalGuest}`;
              }}
              type="category"
              stroke="#B4B2A9"
              width={160}
              tick={{ fontSize: 10 }}
            />

            <Tooltip
              content={<CustomTooltip metric={metric} />}
              cursor={{
                fill: "rgba(255, 210, 0, 0.1)",
              }}
            />

            <Bar
              dataKey={(entry) => getMetricValue(entry, metric)}
              radius={[0, 6, 6, 0]}
              shape={
                <CustomBar
                  metric={metric}
                  sortedData={sortedData}
                  minVal={minVal}
                  range={range}
                />
              }
              label={(props) => {
                const { x, y, width, value, index } = props;

                // Type guards
                if (
                  typeof x !== "number" ||
                  typeof y !== "number" ||
                  typeof width !== "number"
                ) {
                  return null;
                }

                const entry = sortedData[index as number];

                if (!entry) {
                  return null;
                }

                const formattedValue = formatValue(value as number, metric);

                return (
                  <text
                    x={x + width + 8}
                    y={y + 12}
                    fill="#FFD200"
                    fontSize={11}
                    fontWeight="bold"
                    fontFamily="monospace"
                    textAnchor="start"
                    dominantBaseline="middle"
                  >
                    {formattedValue}
                  </text>
                );
              }}
            />
          </BarChart>
        </div>
      </div>
    </div>
  );
}
