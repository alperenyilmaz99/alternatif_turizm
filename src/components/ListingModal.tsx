"use client";

import { useEffect } from "react";
import type { Listing } from "@/types/database";
import { formatListingTypeLabel } from "@/lib/listings";
import {
  formatPhoneDisplay,
  getCallUrl,
  getWhatsAppNumberForListing,
  getWhatsAppUrl,
} from "@/lib/whatsapp";
import ListingImage from "./ListingImage";

interface ListingModalProps {
  listing: Listing;
  onClose: () => void;
}

function WhatsAppIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5" aria-hidden="true">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.435 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}

function PhoneIcon() {
  return (
    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
      />
    </svg>
  );
}

export default function ListingModal({ listing, onClose }: ListingModalProps) {
  const locationName = listing.locations?.name ?? "Türkiye";
  const whatsappUrl = getWhatsAppUrl(listing);
  const callUrl = getCallUrl(listing);
  const phoneDisplay = formatPhoneDisplay(getWhatsAppNumberForListing(listing));

  useEffect(() => {
    document.body.style.overflow = "hidden";

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" />

      <div
        className="relative z-10 max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-2xl bg-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          aria-label="Kapat"
          className="absolute right-4 top-4 z-20 flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-slate-600 shadow-md transition hover:bg-white hover:text-slate-900"
        >
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="relative aspect-[16/10] overflow-hidden bg-slate-100">
          <ListingImage
            src={listing.image_url}
            alt={listing.title}
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 800px"
          />
          <span
            className={`absolute left-4 top-4 rounded-lg px-3 py-1.5 text-sm font-bold uppercase tracking-wide ${
              listing.listing_type === "kiralama"
                ? "bg-blue-600 text-white"
                : "bg-amber-500 text-white"
            }`}
          >
            {formatListingTypeLabel(listing.listing_type)}
          </span>
        </div>

        <div className="p-6 sm:p-8">
          <p className="text-sm font-semibold uppercase tracking-wider text-teal-600">
            {locationName}
          </p>
          <h2 className="mt-2 text-2xl font-bold text-slate-800 sm:text-3xl">
            {listing.title}
          </h2>

          {listing.description ? (
            <p className="mt-5 text-base leading-relaxed text-slate-600 sm:text-lg">
              {listing.description}
            </p>
          ) : (
            <p className="mt-5 text-base text-slate-400">Açıklama bulunmuyor.</p>
          )}

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <a
              href={callUrl}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-teal-600 px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-teal-600/25 transition hover:bg-teal-700"
            >
              <PhoneIcon />
              Ara ({phoneDisplay})
            </a>
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#25D366] px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-[#25D366]/30 transition hover:bg-[#20bd5a]"
            >
              <WhatsAppIcon />
              WhatsApp
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
