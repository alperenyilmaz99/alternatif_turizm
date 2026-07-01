"use client";

import { useState, type FormEvent } from "react";
import type { Location } from "@/types/database";

interface AddListingFormProps {
  locations: Location[];
  onSuccess?: () => void;
}

export default function AddListingForm({ locations, onSuccess }: AddListingFormProps) {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [error, setError] = useState("");
  const [successTitle, setSuccessTitle] = useState("");

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("loading");
    setError("");

    const form = e.currentTarget;
    const formData = new FormData(form);

    const payload = {
      title: formData.get("title") as string,
      description: (formData.get("description") as string) || undefined,
      location_id: formData.get("location_id") as string,
      listing_type: formData.get("listing_type") as "kiralama" | "satış",
      image_url: (formData.get("image_url") as string) || undefined,
    };

    try {
      const res = await fetch("/api/admin/listings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "İlan eklenemedi.");

      setStatus("success");
      setSuccessTitle(data.listing?.title ?? payload.title);
      form.reset();
      onSuccess?.();
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "Bir hata oluştu.");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5 rounded-2xl border border-slate-100 bg-white p-6 shadow-sm sm:p-8">
      <div>
        <label htmlFor="title" className="mb-1.5 block text-sm font-medium text-slate-700">
          İlan Başlığı *
        </label>
        <input
          id="title"
          name="title"
          type="text"
          required
          placeholder="Örn: Eliz Termal Kızılcahamam"
          className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20"
        />
      </div>

      <div>
        <label htmlFor="description" className="mb-1.5 block text-sm font-medium text-slate-700">
          Açıklama
        </label>
        <textarea
          id="description"
          name="description"
          rows={4}
          placeholder="İlan açıklaması..."
          className="w-full resize-none rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20"
        />
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="location_id" className="mb-1.5 block text-sm font-medium text-slate-700">
            Lokasyon *
          </label>
          <select
            id="location_id"
            name="location_id"
            required
            className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20"
          >
            <option value="">Seçiniz</option>
            {locations.map((loc) => (
              <option key={loc.id} value={loc.id}>
                {loc.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="listing_type" className="mb-1.5 block text-sm font-medium text-slate-700">
            İşlem Türü *
          </label>
          <select
            id="listing_type"
            name="listing_type"
            required
            className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20"
          >
            <option value="">Seçiniz</option>
            <option value="kiralama">Kiralama</option>
            <option value="satış">Satış</option>
          </select>
        </div>
      </div>

      <div>
        <label htmlFor="image_url" className="mb-1.5 block text-sm font-medium text-slate-700">
          Görsel URL
        </label>
        <input
          id="image_url"
          name="image_url"
          type="url"
          placeholder="https://images.unsplash.com/..."
          className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20"
        />
        <p className="mt-1.5 text-xs text-slate-400">
          Doğrudan görsel linki yapıştırın. Unsplash sayfa linki değil,
          images.unsplash.com ile biten link kullanın.
        </p>
      </div>

      {status === "success" && (
        <div className="rounded-xl bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700">
          &quot;{successTitle}&quot; ilanı başarıyla eklendi.
        </div>
      )}

      {status === "error" && (
        <div className="rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={status === "loading"}
        className="w-full rounded-xl bg-teal-600 py-3.5 text-sm font-semibold text-white shadow-md shadow-teal-600/25 transition hover:bg-teal-700 disabled:opacity-60 sm:w-auto sm:px-8"
      >
        {status === "loading" ? "Kaydediliyor..." : "İlanı Yayınla"}
      </button>
    </form>
  );
}
