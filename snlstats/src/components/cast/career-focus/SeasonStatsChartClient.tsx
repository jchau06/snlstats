// src/components/cast/SeasonStatsChartClient.tsx
"use client";

import { useEffect, useRef, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";

interface ChartData {
  seasonNumber: number;
  yearStarted: number;
  yearEnded: number;
  totalScreenTimeSeconds: number;
  totalAppearances: number;
  averageScreenTimeSeconds: number;
  averageAppearances: number;
  powerRankingSeason: number;
  castMembersInSeason: number;
  castMemberRankInSeason: number;
}

interface SeasonStatsChartClientProps {
  data: ChartData[];
}

type MetricType = "screenTime" | "segments" | "powerRanking";
type DataType = "totals" | "averages";
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

const getMetricValue = (
  entry: ChartData,
  metric: MetricType,
  dataType: DataType,
): number => {
  if (metric === "screenTime") {
    return dataType === "totals"
      ? entry.totalScreenTimeSeconds
      : entry.averageScreenTimeSeconds;
  }

  if (metric === "segments") {
    return dataType === "totals"
      ? entry.totalAppearances
      : entry.averageAppearances;
  }

  return entry.powerRankingSeason;
};

const formatValue = (
  value: number,
  metric: MetricType,
  dataType: DataType,
): string => {
  if (metric === "screenTime") {
    return formatTimeLabel(value);
  }

  if (metric === "segments") {
    return dataType === "totals"
      ? Math.round(value).toString()
      : value.toFixed(2);
  }

  return value.toFixed(2);
};

const getSubtitle = (metric: MetricType, dataType: DataType): string => {
  const metricName =
    metric === "screenTime"
      ? "Screen time"
      : metric === "segments"
        ? "Segment count"
        : "Power ranking";

  const dataName = dataType === "totals" ? "totals" : "averages";

  return `${metricName} ${dataName} by season`;
};

const CustomTooltip = ({ active, payload, metric, dataType }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;

    const value = getMetricValue(data, metric, dataType);

    return (
      <div className="bg-secondary border border-primary p-3 rounded-lg">
        <p className="font-sans font-semibold text-tertiary">
          S{data.seasonNumber} ({data.yearStarted}-{data.yearEnded})
        </p>

        <p className="font-mono text-primary font-bold">
          {formatValue(value, metric, dataType)}
        </p>

        <p className="font-mono text-white/60 text-sm">
          Rank: #{data.castMemberRankInSeason} / {data.castMembersInSeason}
        </p>
      </div>
    );
  }

  return null;
};

export function SeasonStatsChartClient({ data }: SeasonStatsChartClientProps) {
  const [metric, setMetric] = useState<MetricType>("screenTime");

  const [dataType, setDataType] = useState<DataType>("totals");

  const [sortBy, setSortBy] = useState<SortType>("latest");

  /*
   * Measure the chart's actual available width instead
   * of using Recharts ResponsiveContainer.
   *
   * This avoids the -1 x -1 measurement warning while
   * still allowing the chart to resize naturally.
   */
  const chartContainerRef = useRef<HTMLDivElement>(null);

  const [chartWidth, setChartWidth] = useState(800);

  useEffect(() => {
    const element = chartContainerRef.current;

    if (!element) {
      return;
    }

    const updateWidth = () => {
      const width = element.getBoundingClientRect().width;

      if (width > 0) {
        setChartWidth(width);
      }
    };

    // Initial measurement
    updateWidth();

    // Re-measure whenever the container changes size
    const observer = new ResizeObserver(updateWidth);

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, []);

  if (!data || data.length === 0) {
    return (
      <div className="bg-secondary/80 backdrop-blur-sm border border-[#2C2C2A] p-6 rounded-lg">
        <p className="text-tertiary">No season data available</p>
      </div>
    );
  }

  // Sort data
  const sortedData = [...data].sort((a, b) => {
    if (sortBy === "latest") {
      return b.seasonNumber - a.seasonNumber;
    }

    if (sortBy === "oldest") {
      return a.seasonNumber - b.seasonNumber;
    }

    const aVal = getMetricValue(a, metric, dataType);

    const bVal = getMetricValue(b, metric, dataType);

    return sortBy === "highest" ? bVal - aVal : aVal - bVal;
  });

  /*
   * Keep the chart tall enough to comfortably display
   * each season.
   */
  const chartHeight = Math.max(200, data.length * 50);

  /*
   * The Y-axis already reserves space for the season
   * labels, so we don't need a large left chart margin.
   *
   * On smaller screens, reduce the label width so the
   * actual bars get more horizontal space.
   */
  const isMobile = chartWidth < 640;

  const yAxisWidth = isMobile ? 115 : 140;

  const chartRightMargin = isMobile ? 70 : 90;

  return (
    <div className="bg-secondary/80 backdrop-blur-sm border border-[#2C2C2A] p-6 rounded-lg">
      {/* Header with Controls */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
        {/* Left: Title and Subtitle */}
        <div>
          <h3 className="font-heading text-h3 text-tertiary font-bold">
            Stats Per Season
          </h3>

          <p className="stat-label mt-2">{getSubtitle(metric, dataType)}</p>
        </div>

        {/* Controls */}
        <div className="flex flex-col sm:flex-row gap-3 flex-wrap">
          {/* Metric Buttons */}
          <div className="flex gap-2 flex-wrap">
            {["screenTime", "segments", "powerRanking"].map((m) => (
              <button
                key={m}
                onClick={() => setMetric(m as MetricType)}
                className={`px-3 py-2 rounded-sm font-mono text-xs uppercase transition-colors whitespace-nowrap ${
                  metric === m
                    ? "bg-primary text-neutral font-bold"
                    : "bg-neutral border border-secondary text-tertiary hover:border-primary"
                }`}
              >
                {m === "screenTime"
                  ? "Screen Time"
                  : m === "segments"
                    ? "Segment Count"
                    : "Power Ranking"}
              </button>
            ))}
          </div>

          {/* Data Type Buttons */}
          <div className="flex gap-2">
            {["totals", "averages"].map((dt) => (
              <button
                key={dt}
                onClick={() => setDataType(dt as DataType)}
                className={`px-3 py-2 rounded-sm font-mono text-xs uppercase transition-colors ${
                  dataType === dt
                    ? "bg-primary text-neutral font-bold"
                    : "bg-neutral border border-secondary text-tertiary hover:border-primary"
                }`}
              >
                {dt === "totals" ? "Totals" : "Averages"}
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
      <div ref={chartContainerRef} className="w-full overflow-hidden">
        <BarChart
          width={chartWidth}
          height={chartHeight}
          data={sortedData}
          layout="vertical"
          margin={{
            top: 10,
            right: chartRightMargin,
            left: 0,
            bottom: 10,
          }}
        >
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="#2C2C2A"
            vertical={false}
          />

          <XAxis type="number" stroke="#2C2C2A" tick={false} axisLine={false} />

          <YAxis
            dataKey={(entry) =>
              `S${entry.seasonNumber} (${entry.yearStarted}-${entry.yearEnded})`
            }
            type="category"
            stroke="#B4B2A9"
            width={yAxisWidth}
            tick={{
              fontSize: isMobile ? 11 : 12,
            }}
          />

          <Tooltip
            content={<CustomTooltip metric={metric} dataType={dataType} />}
            cursor={{
              fill: "rgba(255, 210, 0, 0.1)",
            }}
          />

          <Bar
            dataKey={(entry) => getMetricValue(entry, metric, dataType)}
            radius={[0, 6, 6, 0]}
            label={(props) => {
              const { x, y, width, value, index } = props;

              const entry = sortedData[index];

              if (
                !entry ||
                typeof x !== "number" ||
                typeof y !== "number" ||
                typeof width !== "number"
              ) {
                return null;
              }

              const formattedValue = formatValue(value, metric, dataType);

              return (
                <text
                  x={x + width + 8}
                  y={y + 12}
                  fill="#FFD200"
                  fontSize={12}
                  fontWeight="bold"
                  fontFamily="monospace"
                  textAnchor="start"
                  dominantBaseline="middle"
                >
                  {formattedValue}
                </text>
              );
            }}
            fill="#FFD200"
          />
        </BarChart>
      </div>
    </div>
  );
}
