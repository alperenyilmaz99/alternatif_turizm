"use client";

import { useEffect, useState, type FormEvent } from "react";
import Link from "next/link";
import type { Location } from "@/types/database";
import AddListingForm from "./AddListingForm";
import ManageListings from "./ManageListings";
import SubmissionsList from "./SubmissionsList";

type AdminTab = "add" | "listings" | "submissions";

interface AdminPanelProps {
  locations: Location[];
}

const TABS: { id: AdminTab; label: string }[] = [
  { id: "add", label: "Yeni İlan" },
  { id: "listings", label: "İlanları Yönet" },
  { id: "submissions", label: "Başvurular" },
];

export default function AdminPanel({ locations }: AdminPanelProps) {
  const [authenticated, setAuthenticated] = useState<boolean | null>(null);
  const [activeTab, setActiveTab] = useState<AdminTab>("add");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);
  const [listingsKey, setListingsKey] = useState(0);

  useEffect(() => {
    fetch("/api/admin/session")
      .then((res) => res.json())
      .then((data) => setAuthenticated(data.authenticated))
      .catch(() => setAuthenticated(false));
  }, []);

  async function handleLogin(e: FormEvent) {
    e.preventDefault();
    setLoginLoading(true);
    setLoginError("");

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: loginPassword }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Giriş başarısız.");

      setAuthenticated(true);
      setLoginPassword("");
    } catch (err) {
      setLoginError(err instanceof Error ? err.message : "Giriş başarısız.");
    } finally {
      setLoginLoading(false);
    }
  }

  async function handleLogout() {
    await fetch("/api/admin/logout", { method: "POST" });
    setAuthenticated(false);
  }

  if (authenticated === null) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <p className="text-slate-500">Yükleniyor...</p>
      </div>
    );
  }

  if (!authenticated) {
    return (
      <div className="mx-auto w-full max-w-md px-4 py-16">
        <h1 className="text-center text-2xl font-bold text-slate-800">Admin Girişi</h1>
        <p className="mt-2 text-center text-sm text-slate-500">
          Yönetim paneline giriş yapın
        </p>

        <form onSubmit={handleLogin} className="mt-8 space-y-4">
          <div>
            <label htmlFor="password" className="mb-1.5 block text-sm font-medium text-slate-700">
              Şifre
            </label>
            <input
              id="password"
              type="password"
              value={loginPassword}
              onChange={(e) => setLoginPassword(e.target.value)}
              required
              className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20"
            />
          </div>

          {loginError && (
            <div className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
              {loginError}
            </div>
          )}

          <button
            type="submit"
            disabled={loginLoading}
            className="w-full rounded-xl bg-teal-600 py-3 text-sm font-semibold text-white transition hover:bg-teal-700 disabled:opacity-60"
          >
            {loginLoading ? "Giriş yapılıyor..." : "Giriş Yap"}
          </button>
        </form>

        <p className="mt-6 text-center">
          <Link href="/" className="text-sm text-teal-600 hover:text-teal-700">
            ← Ana sayfaya dön
          </Link>
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-12">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Admin Paneli</h1>
          <p className="mt-1 text-sm text-slate-500">İlan ve başvuru yönetimi</p>
        </div>
        <button
          onClick={handleLogout}
          className="rounded-lg border border-slate-200 px-4 py-2 text-sm text-slate-600 transition hover:border-slate-300"
        >
          Çıkış
        </button>
      </div>

      <nav className="mb-8 flex flex-wrap gap-2">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`rounded-xl px-5 py-2.5 text-sm font-semibold transition ${
              activeTab === tab.id
                ? "bg-teal-600 text-white shadow-md shadow-teal-600/25"
                : "border border-slate-200 bg-white text-slate-600 hover:border-teal-300"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </nav>

      {activeTab === "add" && (
        <AddListingForm
          locations={locations}
          onSuccess={() => setListingsKey((k) => k + 1)}
        />
      )}

      {activeTab === "listings" && (
        <ManageListings key={listingsKey} locations={locations} />
      )}

      {activeTab === "submissions" && <SubmissionsList />}

      <p className="mt-8 text-center">
        <Link href="/" className="text-sm text-teal-600 hover:text-teal-700">
          ← Ana sayfaya dön
        </Link>
      </p>
    </div>
  );
}
