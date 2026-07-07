"use client";

import { useCallback, useEffect, useState } from "react";
import type { AdminListing, Location } from "@/types/database";
import EditListingModal from "./EditListingModal";

interface ManageListingsProps {
  locations: Location[];
}

function formatDate(date: string) {
  return new Intl.DateTimeFormat("tr-TR", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(date));
}

export default function ManageListings({ locations }: ManageListingsProps) {
  const [listings, setListings] = useState<AdminListing[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);

  const fetchListings = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/admin/listings");
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "İlanlar yüklenemedi.");
      setListings(data.listings ?? []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Bir hata oluştu.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchListings();
  }, [fetchListings]);

  async function handleDelete(id: string, title: string) {
    if (!confirm(`"${title}" ilanını silmek istediğinize emin misiniz?`)) {
      return;
    }

    setDeletingId(id);
    try {
      const res = await fetch(`/api/admin/listings/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "İlan silinemedi.");
      setListings((prev) => prev.filter((l) => l.id !== id));
    } catch (err) {
      alert(err instanceof Error ? err.message : "Silme işlemi başarısız.");
    } finally {
      setDeletingId(null);
    }
  }

  function handleEditSuccess() {
    setEditingId(null);
    void fetchListings();
  }

  if (loading) {
    return <p className="text-center text-slate-500">İlanlar yükleniyor...</p>;
  }

  if (error) {
    return (
      <div className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
        {error}
      </div>
    );
  }

  if (listings.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-slate-200 bg-white py-16 text-center">
        <p className="text-slate-500">Henüz ilan bulunmuyor.</p>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-3">
        {listings.map((listing) => (
          <div
            key={listing.id}
            className="flex flex-col gap-3 rounded-xl border border-slate-100 bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between"
          >
            <div>
              <h3 className="font-semibold text-slate-800">{listing.title}</h3>
              <p className="mt-1 text-sm text-slate-500">
                {listing.locations?.name ?? "—"} · {listing.listing_type} ·{" "}
                {formatDate(listing.created_at)}
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setEditingId(listing.id)}
                className="rounded-lg border border-teal-200 px-4 py-2 text-sm font-medium text-teal-700 transition hover:bg-teal-50"
              >
                Düzenle
              </button>
              <button
                onClick={() => handleDelete(listing.id, listing.title)}
                disabled={deletingId === listing.id}
                className="rounded-lg border border-red-200 px-4 py-2 text-sm font-medium text-red-600 transition hover:bg-red-50 disabled:opacity-60"
              >
                {deletingId === listing.id ? "Siliniyor..." : "Sil"}
              </button>
            </div>
          </div>
        ))}
      </div>

      {editingId && (
        <EditListingModal
          listingId={editingId}
          locations={locations}
          onClose={() => setEditingId(null)}
          onSuccess={handleEditSuccess}
        />
      )}
    </>
  );
}
