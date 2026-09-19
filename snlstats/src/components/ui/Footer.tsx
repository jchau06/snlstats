"use client";

import React from "react";
import Link from "next/link";

interface FooterProps {
  className?: string;
}

export function Footer({ className = "" }: FooterProps) {
  return (
    <footer
      className={`relative w-full bg-secondary border-t border-[#2C2C2A] ${className}`}
    >
      {/* Top yellow rule */}
      <div className="absolute top-0 left-0 w-full h-[2px] bg-primary" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-8 sm:py-10">
          <div className="grid grid-cols-1 md:grid-cols-[minmax(0,1fr)_auto] gap-8 md:gap-16">
            {/* Brand / copyright */}
            <div className="min-w-0 flex flex-col">
              <Link
                href="/"
                className="inline-flex items-baseline w-fit leading-none group"
              >
                <span className="font-heading text-3xl sm:text-4xl font-bold tracking-[-0.055em] text-primary">
                  SNL
                </span>
                <span className="font-heading text-3xl sm:text-4xl font-bold tracking-[-0.055em] text-tertiary">
                  STATS
                </span>
              </Link>

              <div className="flex items-center gap-2 mt-3">
                <span className="h-px w-6 bg-primary/50" />
                <span className="font-mono text-[9px] sm:text-[10px] tracking-[0.25em] uppercase text-[#8A8885]">
                  Saturday Night Live Analytics
                </span>
              </div>

              <div className="mt-6 space-y-1">
                <p className="font-mono text-[10px] sm:text-xs text-[#8A8885]">
                  © {new Date().getFullYear()} SNL Stats.
                </p>

                <p className="font-mono text-[10px] sm:text-xs text-[#8A8885]">
                  All original site content and code by Jonathan Chau.
                </p>

                <p className="mt-3 max-w-2xl font-mono text-[10px] sm:text-xs text-[#6F6D69] leading-relaxed">
                  SNL and related trademarks are property of their respective
                  owners. This is an independent, non-affiliated project.
                </p>
              </div>
            </div>

            {/* Footer navigation */}
            <nav className="flex flex-col gap-3 md:min-w-[180px]">
              <FooterLink href="/about">About</FooterLink>
              <FooterLink href="/methodology">Methodology</FooterLink>
              <FooterLink href="/data-sources">Data Sources</FooterLink>
              <FooterLink href="https://github.com/yourusername/yourrepo" external>
                GitHub
              </FooterLink>
            </nav>
          </div>

          {/* Bottom metadata row */}
          <div className="mt-8 pt-4 border-t border-[#2C2C2A] flex items-center justify-between">
            <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-[#5F5D59]">
              Data Driven Entertainment
            </span>

            <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-[#5F5D59]">
              SNL STATS
            </span>
          </div>
        </div>
      </div>

      {/* Bottom yellow accents */}
      <div className="absolute bottom-0 left-0 h-px w-24 bg-primary/40" />
      <div className="absolute bottom-0 right-0 h-px w-24 bg-primary/40" />
    </footer>
  );
}

function FooterLink({
  href,
  children,
  external = false,
}: {
  href: string;
  children: React.ReactNode;
  external?: boolean;
}) {
  return (
    <Link
      href={href}
      {...(external
        ? {
            target: "_blank",
            rel: "noopener noreferrer",
          }
        : {})}
      className="group relative w-fit font-mono text-xs sm:text-sm font-bold uppercase tracking-[0.08em] text-[#8A8885] hover:text-primary transition-colors duration-300"
    >
      {children}

      <span className="absolute -bottom-1 left-0 h-[1px] w-0 bg-primary group-hover:w-full transition-all duration-300" />
    </Link>
  );
}
