"use client";

import type { Location } from "@/types/database";

interface LocationFilterProps {
  locations: Location[];
  activeSlug: string | null;
  onSelect: (slug: string | null) => void;
}

export default function LocationFilter({
  locations,
  activeSlug,
  onSelect,
}: LocationFilterProps) {
  return (
    <nav className="flex flex-wrap items-center justify-center gap-3 px-4">
      <button
        onClick={() => onSelect(null)}
        className={`rounded-xl border px-6 py-2.5 text-sm font-semibold transition-all duration-200 ${
          activeSlug === null
            ? "border-teal-600 bg-teal-600 text-white shadow-md shadow-teal-600/25"
            : "border-slate-200 bg-white text-slate-600 hover:border-teal-300 hover:text-teal-700"
        }`}
      >
        Tümü
      </button>
      {locations.map((location) => (
        <button
          key={location.id}
          onClick={() => onSelect(location.slug)}
          className={`rounded-xl border px-6 py-2.5 text-sm font-semibold uppercase tracking-wide transition-all duration-200 ${
            activeSlug === location.slug
              ? "border-teal-600 bg-teal-600 text-white shadow-md shadow-teal-600/25"
              : "border-slate-200 bg-white text-slate-600 hover:border-teal-300 hover:text-teal-700"
          }`}
        >
          {location.name}
        </button>
      ))}
    </nav>
  );
}
