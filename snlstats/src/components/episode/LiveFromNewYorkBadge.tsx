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

  const lfnyNames = liveFromNewYorkCast.map((c) => c.name).join(", ");

  if (liveFromNewYorkCast.length === 0) {
    return (
      <div className={`border border-primary rounded-lg px-5 py-6 backdrop-blur-sm bg-black/30 w-fit ${className}`}>
      <p className="stat-label text-xs mb-1.5 uppercase tracking-wide">Who said &#34;LIVE FROM NEW YORK&#34;?</p>
      <p className="font-sans font-semibold text-tertiary text-sm leading-none">
        No cast members said &#39;LIVE FROM NEW YORK&#39; in this episode.
      </p>
    </div>
    );
  }


  return (
    <div className={`border border-primary rounded-lg px-5 py-6 backdrop-blur-sm bg-black/30 w-fit ${className}`}>
      <p className="stat-label text-xs mb-1.5 uppercase tracking-wide">Who said &#34;LIVE FROM NEW YORK&#34;?</p>
      <p className="font-sans font-semibold text-tertiary text-sm leading-none">
        {lfnyNames}
      </p>
    </div>
  );
}