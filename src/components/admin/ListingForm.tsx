"use client";

import { useState, type FormEvent } from "react";
import type { Location } from "@/types/database";
import ImageUploadField from "./ImageUploadField";

export interface ListingFormValues {
  title: string;
  description: string;
  location_id: string;
  listing_type: "kiralama" | "satış";
  image_url: string;
}

interface ListingFormProps {
  locations: Location[];
  initialValues?: ListingFormValues;
  listingId?: string;
  submitLabel: string;
  loadingLabel: string;
  successMessage?: (title: string) => string;
  onSuccess?: () => void;
  onCancel?: () => void;
}

const EMPTY_VALUES: ListingFormValues = {
  title: "",
  description: "",
  location_id: "",
  listing_type: "kiralama",
  image_url: "",
};

export default function ListingForm({
  locations,
  initialValues = EMPTY_VALUES,
  listingId,
  submitLabel,
  loadingLabel,
  successMessage,
  onSuccess,
  onCancel,
}: ListingFormProps) {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [error, setError] = useState("");
  const [successTitle, setSuccessTitle] = useState("");
  const [imageUrl, setImageUrl] = useState(initialValues.image_url);
  const [formKey, setFormKey] = useState(0);

  const isEdit = Boolean(listingId);

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
      image_url: imageUrl.trim() || undefined,
    };

    try {
      const res = await fetch(
        isEdit ? `/api/admin/listings/${listingId}` : "/api/admin/listings",
        {
          method: isEdit ? "PATCH" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || (isEdit ? "İlan güncellenemedi." : "İlan eklenemedi."));
      }

      setStatus("success");
      setSuccessTitle(data.listing?.title ?? payload.title);

      if (!isEdit) {
        form.reset();
        setImageUrl("");
        setFormKey((k) => k + 1);
      }

      onSuccess?.();
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "Bir hata oluştu.");
    }
  }

  return (
    <form
      key={formKey}
      onSubmit={handleSubmit}
      className="space-y-5 rounded-2xl border border-slate-100 bg-white p-6 shadow-sm sm:p-8"
    >
      <div>
        <label htmlFor="title" className="mb-1.5 block text-sm font-medium text-slate-700">
          İlan Başlığı *
        </label>
        <input
          id="title"
          name="title"
          type="text"
          required
          defaultValue={initialValues.title}
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
          defaultValue={initialValues.description}
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
            defaultValue={initialValues.location_id}
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
            defaultValue={initialValues.listing_type}
            className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20"
          >
            <option value="">Seçiniz</option>
            <option value="kiralama">Kiralama</option>
            <option value="satış">Satış</option>
          </select>
        </div>
      </div>

      <div>
        <p className="mb-1.5 text-sm font-medium text-slate-700">İlan Görseli</p>
        <ImageUploadField value={imageUrl} onChange={setImageUrl} />
      </div>

      {status === "success" && successMessage && (
        <div className="rounded-xl bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700">
          {successMessage(successTitle)}
        </div>
      )}

      {status === "error" && (
        <div className="rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
          {error}
        </div>
      )}

      <div className="flex flex-wrap gap-3">
        <button
          type="submit"
          disabled={status === "loading"}
          className="rounded-xl bg-teal-600 py-3.5 text-sm font-semibold text-white shadow-md shadow-teal-600/25 transition hover:bg-teal-700 disabled:opacity-60 sm:px-8"
        >
          {status === "loading" ? loadingLabel : submitLabel}
        </button>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="rounded-xl border border-slate-200 px-6 py-3.5 text-sm font-semibold text-slate-600 transition hover:border-slate-300"
          >
            İptal
          </button>
        )}
      </div>
    </form>
  );
}
