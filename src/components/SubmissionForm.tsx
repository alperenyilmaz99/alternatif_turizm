"use client";

import { useState, type FormEvent } from "react";

const LOCATIONS = ["Eliz", "Afyon", "Antalya", "Bodrum", "Diğer"];

export default function SubmissionForm() {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("loading");
    setErrorMessage("");

    const form = e.currentTarget;
    const formData = new FormData(form);

    const payload = {
      full_name: formData.get("full_name") as string,
      phone: formData.get("phone") as string,
      email: (formData.get("email") as string) || undefined,
      location: formData.get("location") as string,
      listing_type: formData.get("listing_type") as "kiralama" | "satış",
      description: formData.get("description") as string,
    };

    try {
      const res = await fetch("/api/submissions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Başvuru gönderilemedi.");
      }

      setStatus("success");
      form.reset();
    } catch (err) {
      setStatus("error");
      setErrorMessage(err instanceof Error ? err.message : "Bir hata oluştu.");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="full_name" className="mb-1.5 block text-sm font-medium text-slate-700">
            Ad Soyad *
          </label>
          <input
            id="full_name"
            name="full_name"
            type="text"
            required
            placeholder="Adınız Soyadınız"
            className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20"
          />
        </div>
        <div>
          <label htmlFor="phone" className="mb-1.5 block text-sm font-medium text-slate-700">
            Telefon *
          </label>
          <input
            id="phone"
            name="phone"
            type="tel"
            required
            placeholder="05XX XXX XX XX"
            className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20"
          />
        </div>
      </div>

      <div>
        <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-slate-700">
          E-posta
        </label>
        <input
          id="email"
          name="email"
          type="email"
          placeholder="ornek@email.com"
          className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20"
        />
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="location" className="mb-1.5 block text-sm font-medium text-slate-700">
            Lokasyon *
          </label>
          <select
            id="location"
            name="location"
            required
            className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20"
          >
            <option value="">Seçiniz</option>
            {LOCATIONS.map((loc) => (
              <option key={loc} value={loc}>
                {loc}
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
            className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20"
          >
            <option value="">Seçiniz</option>
            <option value="kiralama">Kiralama</option>
            <option value="satış">Satış</option>
          </select>
        </div>
      </div>

      <div>
        <label htmlFor="description" className="mb-1.5 block text-sm font-medium text-slate-700">
          Devremülk Detayları *
        </label>
        <textarea
          id="description"
          name="description"
          required
          rows={4}
          placeholder="Devremülkünüz hakkında detaylı bilgi verin (otel adı, oda tipi, hafta bilgisi vb.)"
          className="w-full resize-none rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20"
        />
      </div>

      {status === "success" && (
        <div className="rounded-xl bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700">
          Başvurunuz başarıyla gönderildi. En kısa sürede sizinle iletişime geçeceğiz.
        </div>
      )}

      {status === "error" && (
        <div className="rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
          {errorMessage}
        </div>
      )}

      <button
        type="submit"
        disabled={status === "loading"}
        className="mt-2 w-full rounded-xl bg-teal-600 px-6 py-3.5 text-sm font-semibold text-white shadow-md shadow-teal-600/25 transition hover:bg-teal-700 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
      >
        {status === "loading" ? "Gönderiliyor..." : "Başvuruyu Gönder"}
      </button>
    </form>
  );
}
