"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import type { Listing, Location } from "@/types/database";
import LocationFilter from "./LocationFilter";
import ListingsGrid from "./ListingsGrid";

interface ListingsSectionProps {
  listings: Listing[];
  locations: Location[];
  totalCount?: number;
  countsBySlug?: Record<string, number>;
  showAllButton?: boolean;
  title?: string;
  subtitle?: string;
}

export default function ListingsSection({
  listings,
  locations,
  totalCount,
  countsBySlug: countsBySlugProp,
  showAllButton = false,
  title = "Fırsatlar",
  subtitle = "Öne çıkan devremülk ilanlarımız",
}: ListingsSectionProps) {
  const [activeSlug, setActiveSlug] = useState<string | null>(null);

  const countsFromListings = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const listing of listings) {
      const slug = listing.locations?.slug;
      if (slug) counts[slug] = (counts[slug] ?? 0) + 1;
    }
    return counts;
  }, [listings]);

  const displayTotal = totalCount ?? listings.length;
  const displayCounts = countsBySlugProp ?? countsFromListings;

  const filtered =
    activeSlug === null
      ? listings
      : listings.filter((l) => l.locations?.slug === activeSlug);

  return (
    <section className="w-full max-w-6xl px-4 py-12">
      <LocationFilter
        locations={locations}
        activeSlug={activeSlug}
        onSelect={setActiveSlug}
        totalCount={displayTotal}
        countsBySlug={displayCounts}
      />

      <h2 className="mt-12 text-center text-2xl font-bold tracking-tight text-slate-800 sm:text-3xl">
        {title}
      </h2>
      <p className="mt-2 text-center text-slate-500">{subtitle}</p>

      {filtered.length > 0 ? (
        <ListingsGrid listings={filtered} />
      ) : (
        <div className="mt-10 rounded-2xl border border-dashed border-slate-200 bg-slate-50 py-16 text-center">
          <p className="text-slate-500">
            Bu lokasyonda henüz ilan bulunmuyor.
          </p>
        </div>
      )}

      {showAllButton && (
        <div className="mt-10 text-center">
          <Link
            href="/ilanlar"
            className="inline-flex items-center justify-center rounded-xl bg-teal-600 px-8 py-3.5 text-sm font-semibold text-white shadow-md shadow-teal-600/25 transition hover:bg-teal-700"
          >
            Tümünü Göster
          </Link>
        </div>
      )}
    </section>
  );
}
