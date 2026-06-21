// src/components/episode/ImageCarousel.tsx
'use client';

import React, { useRef, useState, useEffect } from 'react';
import Image from 'next/image'

interface ImageCarouselProps {
  images: string[];
  alt?: string;
  className?: string;
}

export function ImageCarousel({
  images,
  alt = 'Episode carousel',
  className = '',
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
      container.addEventListener('scroll', checkScroll);
      window.addEventListener('resize', checkScroll);
      return () => {
        container.removeEventListener('scroll', checkScroll);
        window.removeEventListener('resize', checkScroll);
      };
    }
  }, []);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = scrollContainerRef.current.clientWidth;
      const targetScroll =
        scrollContainerRef.current.scrollLeft +
        (direction === 'left' ? -scrollAmount : scrollAmount);

      scrollContainerRef.current.scrollTo({
        left: targetScroll,
        behavior: 'smooth',
      });
    }
  };

  const goToSlide = (index: number) => {
    if (scrollContainerRef.current) {
      const scrollAmount = scrollContainerRef.current.clientWidth * index;
      scrollContainerRef.current.scrollTo({
        left: scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  if (!images || images.length === 0) {
    return (
      <div
        className={`relative w-full h-96 bg-gradient-to-b from-[#0A0A0A] to-[#222222] rounded-lg flex items-center justify-center ${className}`}
      >
        <p className="text-[#B4B2A9] font-sans">No images available</p>
      </div>
    );
  }

  return (
    <div className={`relative w-full h-96 md:h-[500px] overflow-hidden group ${className}`}>
      {/* Carousel Container */}
      <div
        ref={scrollContainerRef}
        className="w-full h-96 md:h-[500px] overflow-x-auto scroll-smooth snap-x snap-mandatory scrollbar-hide"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {/* Hide scrollbar for webkit browsers */}
        <style>{`
          .scrollbar-hide::-webkit-scrollbar {
            display: none;
          }
        `}</style>

        {/* Images */}
        <div className="flex gap-0">
          {images.map((imageUrl, index) => (
            <div
              key={index}
              className="min-w-full h-96 md:h-[500px] snap-center relative overflow-hidden flex-shrink-0"
            >
              {/* Image */}
              <Image
                src={imageUrl}
                alt={`${alt} ${index + 1}`}
                fill
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src =
                    'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 500"%3E%3Crect fill="%23222222" width="1200" height="500"/%3E%3Ctext x="50%25" y="50%25" text-anchor="middle" dy=".3em" fill="%23B4B2A9" font-size="24" font-family="monospace"%3EImage not found%3C/text%3E%3C/svg%3E';
                }}
              />

              {/* Dark Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

              {/* Slide Counter */}
              <div className="absolute bottom-4 left-4 bg-primary px-3 py-1 rounded-full text-neutral font-mono font-bold text-sm">
                {index + 1} / {images.length}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Left Arrow Button */}
      {canScrollLeft && (
        <button
          onClick={() => scroll('left')}
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
          onClick={() => scroll('right')}
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
                  ? 'bg-primary w-3 h-3'
                  : 'bg-white/30 hover:bg-white/60 w-2 h-2'
              }`}
              aria-label={`Go to image ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}