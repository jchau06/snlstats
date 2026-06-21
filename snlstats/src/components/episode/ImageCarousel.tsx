// src/components/episode/ImageCarousel.tsx
"use client";

import React, { useRef, useState, useEffect } from "react";
import Image from "next/image";

interface ImageCarouselProps {
  images: string[];
  alt?: string;
  className?: string;
}

export function ImageCarousel({
  images,
  alt = "Episode carousel",
  className = "",
}: ImageCarouselProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);

  // Check scroll position to show/hide arrows
  const checkScroll = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } =
        scrollContainerRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);

      // Calculate current slide based on scroll position
      const slideIndex = Math.round(scrollLeft / clientWidth);
      setCurrentSlide(slideIndex);
    }
  };

  useEffect(() => {
    checkScroll();
    const container = scrollContainerRef.current;
    if (container) {
      container.addEventListener("scroll", checkScroll);
      window.addEventListener("resize", checkScroll);
      return () => {
        container.removeEventListener("scroll", checkScroll);
        window.removeEventListener("resize", checkScroll);
      };
    }
  }, []);

  const scroll = (direction: "left" | "right") => {
    if (scrollContainerRef.current) {
      const scrollAmount = scrollContainerRef.current.clientWidth;
      const targetScroll =
        scrollContainerRef.current.scrollLeft +
        (direction === "left" ? -scrollAmount : scrollAmount);

      scrollContainerRef.current.scrollTo({
        left: targetScroll,
        behavior: "smooth",
      });
    }
  };

  const goToSlide = (index: number) => {
    if (scrollContainerRef.current) {
      const scrollAmount = scrollContainerRef.current.clientWidth * index;
      scrollContainerRef.current.scrollTo({
        left: scrollAmount,
        behavior: "smooth",
      });
    }
  };

  if (!images || images.length === 0) {
    return (
      <div
        className={`relative w-full h-full bg-gradient-to-b from-[#0A0A0A] to-[#222222] rounded-lg flex items-center justify-center ${className}`}
      >
        <p className="text-[#B4B2A9] font-sans">No images available</p>
      </div>
    );
  }

  return (
    <div
      className={`relative w-full h-full overflow-hidden group ${className}`}
    >
      <div
        ref={scrollContainerRef}
        className="absolute inset-0 overflow-x-auto overflow-y-hidden scroll-smooth snap-x snap-mandatory scrollbar-hide"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        <style>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>

        {/* Images — give the flex row an explicit height */}
        <div className="flex flex-row flex-nowrap h-full gap-0">
          {images.map((imageUrl, index) => (
            <div
              key={index}
              className="min-w-full h-full snap-center relative overflow-hidden flex-shrink-0"
              style={{ position: "relative" }}
            >
              <Image
                src={imageUrl}
                alt={`${alt} ${index + 1}`}
                fill
                className="object-cover"
                sizes="100vw"
                priority={index === 0}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent z-10" />
              <div className="absolute bottom-4 left-4 bg-primary px-3 py-1 rounded-full text-neutral font-mono font-bold text-sm z-20">
                {index + 1} / {images.length}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Left Arrow Button */}
      {canScrollLeft && (
        <button
          onClick={() => scroll("left")}
          className="absolute left-4 top-1/2 -translate-y-1/2 z-10 bg-black/50 hover:bg-primary hover:text-neutral text-primary p-3 rounded-full transition-all duration-base backdrop-blur-sm"
          aria-label="Previous image"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </button>
      )}

      {/* Right Arrow Button */}
      {canScrollRight && (
        <button
          onClick={() => scroll("right")}
          className="absolute right-4 top-1/2 -translate-y-1/2 z-10 bg-black/50 hover:bg-primary hover:text-neutral text-primary p-3 rounded-full transition-all duration-base backdrop-blur-sm"
          aria-label="Next image"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </button>
      )}

      {/* Dot Indicators */}
      {images.length > 1 && (
        <div className="absolute bottom-4 right-4 flex gap-2 z-10">
          {images.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`rounded-full transition-all duration-base ${
                index === currentSlide
                  ? "bg-primary w-3 h-3"
                  : "bg-white/30 hover:bg-white/60 w-2 h-2"
              }`}
              aria-label={`Go to image ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
