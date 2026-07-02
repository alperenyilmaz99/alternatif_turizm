"use client";

import { useRef, useState, type ChangeEvent, type DragEvent } from "react";
import { resolveListingImageUrl } from "@/lib/image";

interface ImageUploadFieldProps {
  value: string;
  onChange: (url: string) => void;
}

export default function ImageUploadField({ value, onChange }: ImageUploadFieldProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  const previewUrl = resolveListingImageUrl(value);

  async function uploadFile(file: File) {
    setUploading(true);
    setError("");

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Görsel yüklenemedi.");

      onChange(data.url);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Görsel yüklenemedi.");
    } finally {
      setUploading(false);
    }
  }

  function handleFileChange(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) void uploadFile(file);
    e.target.value = "";
  }

  function handleDrop(e: DragEvent<HTMLDivElement>) {
    e.preventDefault();
    setDragOver(false);

    const file = e.dataTransfer.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/") && !/\.(jpe?g|png|webp|gif)$/i.test(file.name)) {
      setError("Lütfen bir görsel dosyası seçin (JPEG, PNG, WebP, GIF).");
      return;
    }

    void uploadFile(file);
  }

  function handleUrlChange(e: ChangeEvent<HTMLInputElement>) {
    setError("");
    onChange(e.target.value);
  }

  return (
    <div className="space-y-3">
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={(e) => {
          e.preventDefault();
          setDragOver(false);
        }}
        onDrop={handleDrop}
        onClick={() => !uploading && inputRef.current?.click()}
        className={`relative cursor-pointer rounded-xl border-2 border-dashed px-4 py-8 text-center transition ${
          dragOver
            ? "border-teal-500 bg-teal-50"
            : "border-slate-200 bg-slate-50 hover:border-teal-300 hover:bg-teal-50/50"
        } ${uploading ? "pointer-events-none opacity-70" : ""}`}
      >
        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif"
          className="hidden"
          onChange={handleFileChange}
        />

        {previewUrl ? (
          <div className="mx-auto max-w-xs">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={previewUrl}
              alt="Önizleme"
              className="mx-auto max-h-40 rounded-lg object-cover shadow-sm"
            />
            <p className="mt-3 text-xs text-slate-500">
              Değiştirmek için tıklayın veya yeni görsel sürükleyin
            </p>
          </div>
        ) : (
          <div className="text-slate-500">
            <svg
              className="mx-auto h-10 w-10 text-slate-300"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            <p className="mt-3 text-sm font-medium text-slate-700">
              Görseli sürükleyip bırakın veya tıklayarak seçin
            </p>
            <p className="mt-1 text-xs text-slate-400">
              JPEG, PNG, WebP, GIF — en fazla 5 MB
            </p>
          </div>
        )}

        {uploading && (
          <p className="mt-3 text-sm font-medium text-teal-600">Yükleniyor...</p>
        )}
      </div>

      <div>
        <label htmlFor="image_url" className="mb-1.5 block text-sm font-medium text-slate-700">
          veya görsel linki yapıştırın
        </label>
        <input
          id="image_url"
          name="image_url"
          type="url"
          value={value}
          onChange={handleUrlChange}
          placeholder="https://... veya Supabase Storage linki"
          className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20"
        />
        <p className="mt-1.5 text-xs text-slate-400">
          Harici link veya bilgisayardan yüklenen görselin adresi. Unsplash için
          doğrudan görsel linki kullanın.
        </p>
      </div>

      {error && (
        <div className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>
      )}
    </div>
  );
}
