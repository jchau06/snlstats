"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";

export interface CastMember {
  id: string;
  name: string;
  slug: string;
  headshot?: string;
  status?: "present" | "featured" | "alum";
  // Optional stats display
  screenTimeSeconds?: number;
  appearances?: number;
  powerRanking?: number;
}

interface CastGridProps {
  castMembers: CastMember[];
  className?: string;
  showStats?: boolean;
  columns?: "auto" | 3 | 4 | 5;
}

export function CastGrid({
  castMembers,
  className = "",
  showStats = false,
  columns = "auto",
}: CastGridProps) {
  const formatScreenTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${String(secs).padStart(2, "0")}`;
  };

  const getCastLink = (member: CastMember): string => {
    return `/cast/${member.slug}`;
  };

  const getGridColsClass = () => {
    if (columns === "auto") {
      return "grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5";
    }
    return `grid-cols-2 sm:grid-cols-3 lg:grid-cols-${columns}`;
  };

  if (!castMembers || castMembers.length === 0) {
    return (
      <div className={`text-center py-12 ${className}`}>
        <p className="text-[#B4B2A9]">No cast members available</p>
      </div>
    );
  }

  return (
    <div
      className={`grid ${getGridColsClass()} gap-3 sm:gap-4 lg:gap-6 ${className}`}
    >
      {castMembers.map((member) => (
        <Link
          key={member.id}
          href={getCastLink(member)}
          className="group"
        >
          <div className="flex flex-col h-full">
            {/* Headshot Container */}
            <div className="relative mb-3 sm:mb-4 aspect-square rounded-lg overflow-hidden bg-[#222222] border border-[#2C2C2A] group-hover:border-primary transition-all duration-base">
              {member.headshot ? (
                <Image
                  src={member.headshot}
                  alt={member.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-base"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src =
                      'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200"%3E%3Crect fill="%23222222" width="200" height="200"/%3E%3C/svg%3E';
                  }}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-[#B4B2A9] text-xs">
                  img
                </div>
              )}
            </div>

            {/* Name */}
            <p className="font-sans font-bold text-tertiary text-center text-xs sm:text-sm group-hover:text-primary transition-colors duration-base mb-1 sm:mb-2 line-clamp-2">
              {member.name}
            </p>

            {/* Stats (Optional) */}
            {showStats && (
              <div className="text-center text-[#8A8885] text-[10px] sm:text-xs space-y-0.5 sm:space-y-1">
                {member.screenTimeSeconds !== undefined && (
                  <p>{formatScreenTime(member.screenTimeSeconds)}</p>
                )}
                {member.appearances !== undefined && (
                  <p>{member.appearances} appearances</p>
                )}
                {member.powerRanking !== undefined && (
                  <p className="text-primary font-semibold">
                    {member.powerRanking.toFixed(1)}
                  </p>
                )}
              </div>
            )}
          </div>
        </Link>
      ))}
    </div>
  );
}