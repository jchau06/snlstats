"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface HeaderProps {
  className?: string;
}

export function Header({ className = "" }: HeaderProps) {
  const pathname = usePathname();

  const navItems = [
    { label: "Seasons", href: "/seasons" },
    { label: "Episodes", href: "/episodes" },
    { label: "Cast", href: "/cast" },
  ];

  const isActive = (href: string) => {
    return pathname.startsWith(href);
  };

  return (
    <header
      className={`relative w-full bg-secondary border-b border-[#2C2C2A] ${className}`}
    >
      {/* Top yellow rule */}
      <div className="absolute top-0 left-0 w-full h-[2px] bg-primary" />

      {/* Brand row */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative h-[86px] flex items-center justify-between">
          {/* Left spacer keeps the brand centered */}
          <div className="w-1/3" />

          {/* Centered brand */}
          <Link
            href="/"
            className="group absolute left-1/2 -translate-x-1/2 flex flex-col items-center justify-center"
          >
            <div className="flex items-baseline leading-none">
              <span className="font-heading text-4xl sm:text-5xl font-bold tracking-[-0.055em] text-primary">
                SNL
              </span>
              <span className="font-heading text-4xl sm:text-5xl font-bold tracking-[-0.055em] text-tertiary">
                STATS
              </span>
            </div>

            <div className="flex items-center gap-2 mt-1.5">
              <span className="h-px w-5 bg-primary/50" />

              <span className="font-mono text-[9px] sm:text-[10px] tracking-[0.28em] uppercase text-[#8A8885]">
                Saturday Night Live Analytics
              </span>

              <span className="h-px w-5 bg-primary/50" />
            </div>
          </Link>

          {/* Live data indicator */}
          <div className="flex items-center justify-end gap-2 w-1/3 ml-auto">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full rounded-full bg-primary opacity-40 animate-ping" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
            </span>

            <span className="font-mono text-[10px] font-bold tracking-[0.18em] uppercase text-[#8A8885]">
              Live Data
            </span>
          </div>
        </div>
      </div>

      {/* Navigation row */}
      <div className="relative h-[52px] border-t border-[#2C2C2A]">
        <nav className="absolute left-1/2 top-0 flex h-full -translate-x-1/2 items-center gap-2 sm:gap-8">
          {navItems.map((item) => {
            const active = isActive(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`
                  group relative flex h-full items-center
                  px-3 sm:px-5
                  font-mono text-xs sm:text-sm
                  font-bold uppercase tracking-[0.08em]
                  whitespace-nowrap
                  transition-colors duration-300
                  ${
                    active
                      ? "text-primary"
                      : "text-[#A09E99] hover:text-tertiary"
                  }
                `}
              >
                {item.label}

                <span
                  className={`
                    absolute bottom-0 left-1/2 h-[2px]
                    -translate-x-1/2 bg-primary
                    transition-all duration-300
                    ${active ? "w-8" : "w-0 group-hover:w-8"}
                  `}
                />
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Bottom yellow accents */}
      <div className="absolute bottom-0 left-0 h-px w-24 bg-primary/40" />
      <div className="absolute bottom-0 right-0 h-px w-24 bg-primary/40" />
    </header>
  );
}
