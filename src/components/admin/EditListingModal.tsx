"use client";

import { useEffect, useState } from "react";
import type { Listing, Location } from "@/types/database";
import ListingForm, { type ListingFormValues } from "./ListingForm";

interface EditListingModalProps {
  listingId: string;
  locations: Location[];
  onClose: () => void;
  onSuccess: () => void;
}

function toFormValues(listing: Listing): ListingFormValues {
  return {
    title: listing.title,
    description: listing.description ?? "",
    location_id: listing.location_id ?? "",
    listing_type: listing.listing_type,
    image_url: listing.image_url ?? "",
  };
}

export default function EditListingModal({
  listingId,
  locations,
  onClose,
  onSuccess,
}: EditListingModalProps) {
  const [listing, setListing] = useState<Listing | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    document.body.style.overflow = "hidden";

    async function fetchListing() {
      setLoading(true);
      setError("");

      try {
        const res = await fetch(`/api/admin/listings/${listingId}`);
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "İlan yüklenemedi.");
        setListing(data.listing);
      } catch (err) {
        setError(err instanceof Error ? err.message : "İlan yüklenemedi.");
      } finally {
        setLoading(false);
      }
    }

    void fetchListing();

    return () => {
      document.body.style.overflow = "";
    };
  }, [listingId]);

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" />

      <div
        className="relative z-10 max-h-[90vh] w-full max-w-2xl overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          aria-label="Kapat"
          className="absolute right-3 top-3 z-20 flex h-10 w-10 items-center justify-center rounded-full bg-white text-slate-600 shadow-md transition hover:text-slate-900"
        >
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {loading && (
          <div className="rounded-2xl bg-white p-8 text-center text-slate-500">
            İlan yükleniyor...
          </div>
        )}

        {error && !loading && (
          <div className="rounded-2xl bg-white p-8">
            <div className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>
          </div>
        )}

        {listing && !loading && (
          <ListingForm
            locations={locations}
            listingId={listingId}
            initialValues={toFormValues(listing)}
            submitLabel="Değişiklikleri Kaydet"
            loadingLabel="Kaydediliyor..."
            successMessage={(title) => `"${title}" ilanı güncellendi.`}
            onSuccess={onSuccess}
            onCancel={onClose}
          />
        )}
      </div>
    </div>
  );
}
