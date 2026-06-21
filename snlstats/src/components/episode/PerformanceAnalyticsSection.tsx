// src/components/episode/PerformanceAnalyticsSection.tsx
'use client';

import React, { useState } from 'react';
import { Section } from '@/src/components/ui';
import { PerformanceMetricToggle } from './PerformanceMetricToggle';
import { PerformanceBarChart } from './PerformanceBarChart';
import { DetailedStatsTable } from './DetailedStatsTable';

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

interface PerformanceAnalyticsSectionProps {
  data: CastPerformanceData[];
  backgroundImage?: string;
}

type Metric = 'screenTime' | 'sketchCount' | 'powerRanking';

export function PerformanceAnalyticsSection({
  data,
  backgroundImage,
}: PerformanceAnalyticsSectionProps) {
  const [selectedMetric, setSelectedMetric] = useState<Metric>('screenTime');

  return (
    <Section
      title="PERFORMANCE ANALYTICS"
      subtitle="Cast member stats and rankings"
      accent={true}
      className="space-y-8"
    >
      {/* Metric Toggle */}
      <div>
        <PerformanceMetricToggle
          value={selectedMetric}
          onChange={setSelectedMetric}
        />
      </div>

      {/* Performance Bar Chart */}
      <PerformanceBarChart
        data={data}
        metric={selectedMetric}
        backgroundImage={backgroundImage}
      />

      {/* Detailed Stats Table */}
      <DetailedStatsTable
        data={data}
        backgroundImage={backgroundImage}
      />
    </Section>
  );
}