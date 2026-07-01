"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { Listing } from "@/types/database";
import ListingCard from "./ListingCard";

interface ListingsCarouselProps {
  listings: Listing[];
}

function ChevronLeft() {
  return (
    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
    </svg>
  );
}

function ChevronRight() {
  return (
    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
    </svg>
  );
}

export default function ListingsCarousel({ listings }: ListingsCarouselProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const updateScrollState = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;

    setCanScrollLeft(el.scrollLeft > 4);
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 4);
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    el.scrollTo({ left: 0 });
    updateScrollState();

    el.addEventListener("scroll", updateScrollState, { passive: true });
    window.addEventListener("resize", updateScrollState);

    return () => {
      el.removeEventListener("scroll", updateScrollState);
      window.removeEventListener("resize", updateScrollState);
    };
  }, [listings, updateScrollState]);

  function scroll(direction: "left" | "right") {
    const el = scrollRef.current;
    if (!el) return;

    const firstCard = el.querySelector<HTMLElement>("[data-listing-card]");
    const cardWidth = firstCard?.offsetWidth ?? 320;
    const gap = el.clientWidth < 640 ? 8 : el.clientWidth < 768 ? 16 : 24;
    const amount = cardWidth + gap;

    el.scrollBy({
      left: direction === "left" ? -amount : amount,
      behavior: "smooth",
    });
  }

  const showArrows = canScrollLeft || canScrollRight;

  return (
    <div className="mt-10 flex items-stretch gap-1 sm:gap-4">
      <button
        type="button"
        onClick={() => scroll("left")}
        disabled={!canScrollLeft}
        aria-label="Önceki ilanlar"
        className={`flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 shadow-sm transition hover:border-teal-300 hover:text-teal-700 disabled:pointer-events-none disabled:opacity-0 sm:h-11 sm:w-11 md:h-12 md:w-12 ${
          showArrows ? "" : "hidden"
        }`}
      >
        <ChevronLeft />
      </button>

      <div
        ref={scrollRef}
        className="scrollbar-hide flex flex-1 items-stretch gap-2 overflow-x-auto scroll-smooth snap-x snap-mandatory sm:gap-4 md:gap-6"
      >
        {listings.map((listing) => (
          <div
            key={listing.id}
            data-listing-card
            className="flex w-[calc(33.333%-0.35rem)] min-w-0 flex-shrink-0 snap-start sm:w-[calc(33.333%-0.7rem)] md:w-[calc(33.333%-1rem)]"
          >
            <ListingCard listing={listing} />
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={() => scroll("right")}
        disabled={!canScrollRight}
        aria-label="Sonraki ilanlar"
        className={`flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 shadow-sm transition hover:border-teal-300 hover:text-teal-700 disabled:pointer-events-none disabled:opacity-0 sm:h-11 sm:w-11 md:h-12 md:w-12 ${
          showArrows ? "" : "hidden"
        }`}
      >
        <ChevronRight />
      </button>
    </div>
  );
}
