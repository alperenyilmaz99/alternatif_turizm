import Image from "next/image";
import type { Listing } from "@/types/database";

interface ListingCardProps {
  listing: Listing;
}

function formatPrice(price: number | null, type: string) {
  if (!price) return "Fiyat sorunuz";
  const formatted = new Intl.NumberFormat("tr-TR", {
    style: "currency",
    currency: "TRY",
    maximumFractionDigits: 0,
  }).format(price);
  return type === "kiralama" ? `${formatted} / hafta` : formatted;
}

export default function ListingCard({ listing }: ListingCardProps) {
  const locationName = listing.locations?.name ?? "Türkiye";

  return (
    <article className="group flex flex-col overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-slate-200/60">
      <div className="relative aspect-[4/3] overflow-hidden bg-slate-100">
        {listing.image_url ? (
          <Image
            src={listing.image_url}
            alt={listing.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, 33vw"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-slate-400">
            <svg className="h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
          </div>
        )}
        <span
          className={`absolute left-3 top-3 rounded-lg px-3 py-1 text-xs font-bold uppercase tracking-wide ${
            listing.listing_type === "kiralama"
              ? "bg-blue-600 text-white"
              : "bg-amber-500 text-white"
          }`}
        >
          {listing.listing_type}
        </span>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <p className="text-xs font-semibold uppercase tracking-wider text-teal-600">
          {locationName}
        </p>
        <h3 className="mt-1 text-lg font-bold text-slate-800 line-clamp-2">
          {listing.title}
        </h3>
        {listing.description && (
          <p className="mt-2 flex-1 text-sm leading-relaxed text-slate-500 line-clamp-2">
            {listing.description}
          </p>
        )}
        <p className="mt-4 text-xl font-bold text-slate-900">
          {formatPrice(listing.price, listing.listing_type)}
        </p>
      </div>
    </article>
  );
}
