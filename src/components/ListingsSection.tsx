"use client";

import { useState } from "react";
import type { Listing, Location } from "@/types/database";
import LocationFilter from "./LocationFilter";
import ListingCard from "./ListingCard";

interface ListingsSectionProps {
  listings: Listing[];
  locations: Location[];
}

export default function ListingsSection({
  listings,
  locations,
}: ListingsSectionProps) {
  const [activeSlug, setActiveSlug] = useState<string | null>(null);

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
      />

      <h2 className="mt-12 text-center text-2xl font-bold tracking-tight text-slate-800 sm:text-3xl">
        Fırsatlar
      </h2>
      <p className="mt-2 text-center text-slate-500">
        Öne çıkan devremülk ilanlarımız
      </p>

      {filtered.length > 0 ? (
        <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((listing) => (
            <ListingCard key={listing.id} listing={listing} />
          ))}
        </div>
      ) : (
        <div className="mt-10 rounded-2xl border border-dashed border-slate-200 bg-slate-50 py-16 text-center">
          <p className="text-slate-500">
            Bu lokasyonda henüz ilan bulunmuyor.
          </p>
        </div>
      )}
    </section>
  );
}
