// Client-side chart component
"use client";
 
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";
 
interface ChartData {
  seasonNumber: number;
  yearStarted: number;
  yearEnded: number;
  totalScreenTimeSeconds: number;
  castMembersInSeason: number;
  castMemberRankInSeason: number;
}
 
interface SeasonStatsChartClientProps {
  data: ChartData[];
}
 
const formatTimeLabel = (seconds: number): string => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
 
  if (hours > 0) {
    return `${hours}H ${minutes}M`;
  }
  return `${minutes}M ${secs}S`;
};
 
const getBarColor = (rank: number, totalCastMembers: number) => {
  const normalized = 1 - (rank - 1) / (totalCastMembers - 1 || 1);
 
  if (normalized < 0.5) {
    const t = normalized * 2;
    const r = Math.round(239 + (255 - 239) * t);
    const g = Math.round(68 + (210 - 68) * t);
    const b = Math.round(68 + (0 - 68) * t);
    return `rgb(${r}, ${g}, ${b})`;
  } else {
    const t = (normalized - 0.5) * 2;
    const r = Math.round(255 + (34 - 255) * t);
    const g = Math.round(210 + (197 - 210) * t);
    const b = Math.round(0 + (94 - 0) * t);
    return `rgb(${r}, ${g}, ${b})`;
  }
};
 
const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-secondary border border-primary p-3 rounded-lg">
        <p className="font-sans font-semibold text-tertiary">
          S{data.seasonNumber} ({data.yearStarted}-{data.yearEnded})
        </p>
        <p className="font-mono text-primary font-bold">
          {formatTimeLabel(data.totalScreenTimeSeconds)}
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
  if (!data || data.length === 0) {
    return (
      <div className="bg-secondary/80 backdrop-blur-sm border border-[#2C2C2A] p-6 rounded-lg">
        <p className="text-tertiary">No season data available</p>
      </div>
    );
  }
 
  return (
    <div className="bg-secondary/80 backdrop-blur-sm border border-[#2C2C2A] p-6 rounded-lg">
      <div className="mb-6">
        <h3 className="font-heading text-h3 text-tertiary font-bold">
          Stats Per Season
        </h3>
        <p className="stat-label mt-2">Screen time by season</p>
      </div>
 
      <div className="w-full" style={{ height: "400px" }}>
        <ResponsiveContainer width="100%" height="100%" minWidth={0}>
          <BarChart
            data={data}
            layout="vertical"
            margin={{ top: 10, right: 180, left: 160, bottom: 10 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#2C2C2A" vertical={false} />
            <XAxis type="number" stroke="#2C2C2A" tick={false} axisLine={false} />
            <YAxis
              dataKey={(entry) => `S${entry.seasonNumber} (${entry.yearStarted}-${entry.yearEnded})`}
              type="category"
              stroke="#B4B2A9"
              width={160}
              tick={{ fontSize: 12 }}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(255, 210, 0, 0.1)" }} />
            <Bar
              dataKey="totalScreenTimeSeconds"
              radius={[0, 8, 8, 0]}
              label={(props) => {
                const { x, y, width, value, index } = props;
                const entry = data[index];
                if (!entry) return null;
 
                const timeLabel = formatTimeLabel(value);
                const rankLabel = `#${entry.castMemberRankInSeason} / ${entry.castMembersInSeason}`;
 
                return (
                  <g>
                    <text
                      x={x + width + 8}
                      y={y + 5}
                      fill="#FFD200"
                      fontSize={12}
                      fontWeight="bold"
                      fontFamily="monospace"
                      textAnchor="start"
                      dominantBaseline="middle"
                    >
                      {timeLabel}
                    </text>
                    <text
                      x={x + width + 8}
                      y={y + 18}
                      fill="#B4B2A9"
                      fontSize={11}
                      fontFamily="monospace"
                      textAnchor="start"
                      dominantBaseline="middle"
                    >
                      {rankLabel}
                    </text>
                  </g>
                );
              }}
            >
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={getBarColor(entry.castMemberRankInSeason, entry.castMembersInSeason)}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
 