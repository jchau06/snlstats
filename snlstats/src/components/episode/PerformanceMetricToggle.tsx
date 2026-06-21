'use client';
 
type Metric = 'screenTime' | 'sketchCount' | 'powerRanking';
 
interface PerformanceMetricToggleProps {
  value: Metric;
  onChange: (metric: Metric) => void;
  className?: string;
}
 
export function PerformanceMetricToggle({
  value,
  onChange,
  className = '',
}: PerformanceMetricToggleProps) {
  const metrics: Array<{ key: Metric; label: string }> = [
    { key: 'screenTime', label: 'Screen Time' },
    { key: 'sketchCount', label: 'Sketch Count' },
    { key: 'powerRanking', label: 'Power Rankings' },
  ];
 
  return (
    <div className={`flex gap-2 ${className}`}>
      {metrics.map((metric) => (
        <button
          key={metric.key}
          onClick={() => onChange(metric.key)}
          className={`px-4 py-2 rounded-lg font-sans font-semibold transition-all duration-base ${
            value === metric.key
              ? 'bg-primary text-neutral'
              : 'bg-secondary text-primary border border-[#2C2C2A] hover:border-primary'
          }`}
        >
          {metric.label}
        </button>
      ))}
    </div>
  );
}