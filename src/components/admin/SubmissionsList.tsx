"use client";

import { useCallback, useEffect, useState } from "react";
import type { SubmissionRecord } from "@/types/database";

function formatDate(date: string) {
  return new Intl.DateTimeFormat("tr-TR", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(date));
}

export default function SubmissionsList() {
  const [submissions, setSubmissions] = useState<SubmissionRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const fetchSubmissions = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/admin/submissions");
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Başvurular yüklenemedi.");
      setSubmissions(data.submissions ?? []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Bir hata oluştu.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSubmissions();
  }, [fetchSubmissions]);

  async function handleDelete(id: string, name: string) {
    if (!confirm(`"${name}" adlı başvuruyu silmek istediğinize emin misiniz?`)) {
      return;
    }

    setDeletingId(id);
    try {
      const res = await fetch(`/api/admin/submissions/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Başvuru silinemedi.");
      setSubmissions((prev) => prev.filter((s) => s.id !== id));
    } catch (err) {
      alert(err instanceof Error ? err.message : "Silme işlemi başarısız.");
    } finally {
      setDeletingId(null);
    }
  }

  if (loading) {
    return <p className="text-center text-slate-500">Başvurular yükleniyor...</p>;
  }

  if (error) {
    return (
      <div className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
        {error}
      </div>
    );
  }

  if (submissions.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-slate-200 bg-white py-16 text-center">
        <p className="text-slate-500">Henüz başvuru bulunmuyor.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {submissions.map((submission) => (
        <article
          key={submission.id}
          className="rounded-xl border border-slate-100 bg-white p-5 shadow-sm"
        >
          <div className="flex flex-wrap items-start justify-between gap-2">
            <div>
              <h3 className="font-semibold text-slate-800">{submission.full_name}</h3>
              <p className="mt-1 text-sm text-slate-500">{formatDate(submission.created_at)}</p>
            </div>
            <div className="flex items-center gap-2">
              <span className="rounded-lg bg-teal-50 px-3 py-1 text-xs font-semibold text-teal-700">
                {submission.listing_type}
              </span>
              <button
                onClick={() => handleDelete(submission.id, submission.full_name)}
                disabled={deletingId === submission.id}
                className="rounded-lg border border-red-200 px-3 py-1 text-xs font-medium text-red-600 transition hover:bg-red-50 disabled:opacity-60"
              >
                {deletingId === submission.id ? "Siliniyor..." : "Sil"}
              </button>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-1 gap-2 text-sm sm:grid-cols-2">
            <p>
              <span className="font-medium text-slate-700">Telefon:</span>{" "}
              <a href={`tel:${submission.phone}`} className="text-teal-600 hover:underline">
                {submission.phone}
              </a>
            </p>
            {submission.email && (
              <p>
                <span className="font-medium text-slate-700">E-posta:</span>{" "}
                <a href={`mailto:${submission.email}`} className="text-teal-600 hover:underline">
                  {submission.email}
                </a>
              </p>
            )}
            <p>
              <span className="font-medium text-slate-700">Lokasyon:</span>{" "}
              {submission.location}
            </p>
          </div>

          <p className="mt-4 text-sm leading-relaxed text-slate-600">
            <span className="font-medium text-slate-700">Detay:</span> {submission.description}
          </p>
        </article>
      ))}
    </div>
  );
}
