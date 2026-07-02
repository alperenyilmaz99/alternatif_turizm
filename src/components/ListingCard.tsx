"use client";

import { useState } from "react";
import type { Listing } from "@/types/database";
import { getCallUrl, getWhatsAppUrl } from "@/lib/whatsapp";
import { formatListingTypeLabel } from "@/lib/listings";
import ListingImage from "./ListingImage";
import ListingModal from "./ListingModal";

interface ListingCardProps {
  listing: Listing;
}

function PhoneIcon() {
  return (
    <svg
      className="h-3.5 w-3.5 sm:h-4 sm:w-4"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
      />
    </svg>
  );
}

function WhatsAppIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className="h-3.5 w-3.5 sm:h-4 sm:w-4"
      aria-hidden="true"
    >
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.435 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}

export default function ListingCard({ listing }: ListingCardProps) {
  const [isOpen, setIsOpen] = useState(false);
  const locationName = listing.locations?.name ?? "Türkiye";
  const whatsappUrl = getWhatsAppUrl(listing);
  const callUrl = getCallUrl(listing);

  return (
    <>
      <article
        onClick={() => setIsOpen(true)}
        className="group relative flex h-full w-full cursor-pointer flex-col overflow-hidden rounded-xl border border-white/70 bg-white/90 shadow-md shadow-teal-900/5 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-teal-900/10 sm:rounded-2xl"
      >
        <div className="relative aspect-[4/3] w-full shrink-0 overflow-hidden bg-slate-100">
          <ListingImage src={listing.image_url} alt={listing.title} />
          <span
            className={`absolute left-1.5 top-1.5 z-10 rounded-md px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide sm:left-3 sm:top-3 sm:rounded-lg sm:px-3 sm:py-1 sm:text-xs ${
              listing.listing_type === "kiralama"
                ? "bg-blue-600 text-white"
                : "bg-amber-500 text-white"
            }`}
          >
            {formatListingTypeLabel(listing.listing_type)}
          </span>
        </div>

        <div className="flex h-[5.75rem] shrink-0 flex-col overflow-hidden p-2.5 sm:h-[7.75rem] sm:p-5">
          <p className="shrink-0 truncate text-[10px] font-semibold uppercase tracking-wider text-teal-600 sm:text-xs">
            {locationName}
          </p>
          <h3 className="mt-0.5 h-[2.5em] shrink-0 overflow-hidden text-xs font-bold leading-tight text-slate-800 line-clamp-2 sm:mt-1 sm:text-base">
            {listing.title}
          </h3>
          <p className="mt-1 h-[2.5em] shrink-0 overflow-hidden text-[10px] leading-tight text-slate-500 line-clamp-2 sm:mt-2 sm:h-[2.75em] sm:text-sm">
            {listing.description || "\u00A0"}
          </p>
        </div>

        <div className="mt-auto flex shrink-0 items-center justify-between px-2.5 pb-3.5 pt-1 sm:px-5 sm:pb-5 sm:pt-1.5">
          <a
            href={callUrl}
            aria-label="Telefon ile ara"
            onClick={(e) => e.stopPropagation()}
            className="flex h-7 w-7 items-center justify-center rounded-full bg-teal-600 text-white shadow-md shadow-teal-600/25 transition hover:scale-105 hover:bg-teal-700 sm:h-8 sm:w-8"
          >
            <PhoneIcon />
          </a>
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="WhatsApp ile iletişime geç"
            onClick={(e) => e.stopPropagation()}
            className="flex h-7 w-7 items-center justify-center rounded-full bg-[#25D366] text-white shadow-md shadow-[#25D366]/25 transition hover:scale-105 hover:bg-[#20bd5a] sm:h-8 sm:w-8"
          >
            <WhatsAppIcon />
          </a>
        </div>
      </article>

      {isOpen && (
        <ListingModal listing={listing} onClose={() => setIsOpen(false)} />
      )}
    </>
  );
}
