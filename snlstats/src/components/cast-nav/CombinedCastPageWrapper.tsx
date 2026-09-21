"use client";

import { useState } from "react";
import { CombinedCastPageClient } from "./CombinedCastPageClient";
import type { CastMemberData, SortType } from "./CastMemberNavigationPageClient";

interface CombinedCastPageWrapperProps {
  castMembers: CastMemberData[];
  currentCastMembers: CastMemberData[];
  alumniCastMembers: CastMemberData[];
}

export function CombinedCastPageWrapper({
  castMembers,
  currentCastMembers,
  alumniCastMembers,
}: CombinedCastPageWrapperProps) {
  const [sortBy, setSortBy] = useState<SortType>("default");

  return (
    <CombinedCastPageClient
      castMembers={castMembers}
      sortBy={sortBy}
      onSortChange={setSortBy}
      currentCastMembers={currentCastMembers}
      alumniCastMembers={alumniCastMembers}
    />
  );
}