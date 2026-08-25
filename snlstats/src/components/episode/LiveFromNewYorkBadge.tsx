// src/components/episode/LfnyBadge.tsx
"use client";

import React from "react";

interface CastMemberInfo {
  id: string;
  name: string;
  slug: string;
}

interface LfnyBadgeProps {
  liveFromNewYorkCast: CastMemberInfo[];
  className?: string;
}

export function LfnyBadge({
  liveFromNewYorkCast,
  className = "",
}: LfnyBadgeProps) {
  if (liveFromNewYorkCast.length === 0) return null;

  const lfnyNames = liveFromNewYorkCast.map((c) => c.name).join(", ");

  return (
    <div className={`border border-primary rounded-lg px-6 py-5 backdrop-blur-sm bg-black/30 ${className}`}>
      <p className="stat-label text-xs mb-3 uppercase">LIVE FROM NEW YORK</p>
      <p className="font-sans font-bold text-tertiary text-base md:text-lg leading-relaxed">
        {lfnyNames}
      </p>
    </div>
  );
}