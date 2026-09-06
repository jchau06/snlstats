"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";

export interface SeasonCastMember {
  id: string;
  name: string;
  slug: string;
  seasonOpeningImageUrl?: string;
  status?: "repertory" | "featured";
}

interface SeasonCastGridProps {
  castMembers: SeasonCastMember[];
  className?: string;
  columns?: "auto" | 3 | 4 | 5 | 6;
}

export function SeasonCastGrid({
  castMembers,
  className = "",
  columns = "auto",
}: SeasonCastGridProps) {
  const getCastLink = (member: SeasonCastMember): string => {
    return `/cast/${member.slug}`;
  };

  const getGridColsClass = () => {
    if (columns === "auto") {
      return "grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5";
    }
    return `grid-cols-2 sm:grid-cols-3 lg:grid-cols-${columns}`;
  };

  const getLastName = (fullName: string): string => {
    const parts = fullName.trim().split(" ");
    return parts[parts.length - 1];
  };

  // Sort: repertory first, then featured, then alphabetically by last name
  const sortedCastMembers = [...castMembers].sort((a, b) => {
    const statusOrder = { repertory: 0, featured: 1 };
    const statusA = statusOrder[a.status as keyof typeof statusOrder] ?? 2;
    const statusB = statusOrder[b.status as keyof typeof statusOrder] ?? 2;

    if (statusA !== statusB) {
      return statusA - statusB;
    }

    const lastNameA = getLastName(a.name);
    const lastNameB = getLastName(b.name);
    return lastNameA.localeCompare(lastNameB);
  });

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
      {sortedCastMembers.map((member) => (
        <Link
          key={member.id}
          href={getCastLink(member)}
          className="group"
        >
          <div className="flex flex-col h-full">
            {/* Season Opening Image */}
            <div className="relative mb-2 sm:mb-3 aspect-video rounded-lg overflow-hidden bg-gradient-to-b from-[#3A3A38] to-[#222222] border border-[#2C2C2A] group-hover:border-primary transition-all duration-base">
              {member.seasonOpeningImageUrl ? (
                <>
                  <Image
                    src={member.seasonOpeningImageUrl}
                    alt={member.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-base"
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, (max-width: 1280px) 25vw, 20vw"
                    priority={false}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent z-10" />
                </>
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <svg
                    className="w-8 h-8 text-[#3A3A38]"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                </div>
              )}
            </div>

            {/* Name */}
            <p className="font-sans font-bold text-tertiary text-center text-xs sm:text-sm group-hover:text-primary transition-colors duration-base line-clamp-2">
              {member.name}
            </p>

            {/* Featured Badge */}
            {member.status === "featured" && (
              <p className="text-center text-[#F4D03F] text-[10px] sm:text-xs font-semibold mt-0.5">
                Featured
              </p>
            )}
          </div>
        </Link>
      ))}
    </div>
  );
}