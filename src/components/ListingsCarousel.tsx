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
    const gap = 24;
    const amount = cardWidth + gap;

    el.scrollBy({
      left: direction === "left" ? -amount : amount,
      behavior: "smooth",
    });
  }

  const showArrows = canScrollLeft || canScrollRight;

  return (
    <div className="mt-10 flex items-center gap-2 sm:gap-4">
      <button
        type="button"
        onClick={() => scroll("left")}
        disabled={!canScrollLeft}
        aria-label="Önceki ilanlar"
        className={`flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 shadow-sm transition hover:border-teal-300 hover:text-teal-700 disabled:pointer-events-none disabled:opacity-0 sm:h-12 sm:w-12 ${
          showArrows ? "" : "hidden"
        }`}
      >
        <ChevronLeft />
      </button>

      <div
        ref={scrollRef}
        className="scrollbar-hide flex flex-1 gap-6 overflow-x-auto scroll-smooth snap-x snap-mandatory"
      >
        {listings.map((listing) => (
          <div
            key={listing.id}
            data-listing-card
            className="w-[85vw] flex-shrink-0 snap-start sm:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)]"
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
        className={`flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 shadow-sm transition hover:border-teal-300 hover:text-teal-700 disabled:pointer-events-none disabled:opacity-0 sm:h-12 sm:w-12 ${
          showArrows ? "" : "hidden"
        }`}
      >
        <ChevronRight />
      </button>
    </div>
  );
}
