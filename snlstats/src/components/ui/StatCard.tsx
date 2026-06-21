import { Card } from "./Card";

interface StatCardProps {
  label: string;
  value: string | number;
  accent?: boolean;
  subtext?: string;
  className?: string;
}
 
export function StatCard({
  label,
  value,
  accent = false,
  subtext,
  className = '',
}: StatCardProps) {
  return (
    <Card className={`text-center ${className}`} hover="glow">
      <p className="stat-label mb-3">{label}</p>
      <p
        className={`font-mono text-4xl font-bold ${
          accent ? 'text-primary' : 'text-tertiary'
        }`}
      >
        {value}
      </p>
      {subtext && <p className="text-xs text-[#B4B2A9] mt-2">{subtext}</p>}
    </Card>
  );
}