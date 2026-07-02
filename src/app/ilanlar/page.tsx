import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/Header";
import ListingsSection from "@/components/ListingsSection";
import PageShell from "@/components/PageShell";
import SiteFooter from "@/components/SiteFooter";
import { getListings, getLocations } from "@/lib/data";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Tüm İlanlar | Alternatif Turizm Devremülk Merkezi",
  description: "Tüm devremülk kiralama ve satış ilanlarımız.",
};

export default async function AllListingsPage() {
  const [listings, locations] = await Promise.all([
    getListings(),
    getLocations(),
  ]);

  return (
    <PageShell>
      <div className="flex min-h-screen flex-col">
        <div className="flex flex-1 flex-col items-center">
          <Header />
          <div className="w-full max-w-6xl px-4">
            <Link
              href="/"
              className="inline-flex items-center gap-1 text-sm font-medium text-teal-700 transition hover:text-teal-800"
            >
              ← Ana Sayfaya Dön
            </Link>
          </div>
          <ListingsSection
            listings={listings}
            locations={locations}
            title="Tüm İlanlar"
            subtitle={`Toplam ${listings.length} ilan listeleniyor`}
          />
        </div>
        <SiteFooter />
      </div>
    </PageShell>
  );
}
