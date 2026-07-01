import Header from "@/components/Header";
import ListingsSection from "@/components/ListingsSection";
import ContactSection from "@/components/ContactSection";
import PageShell from "@/components/PageShell";
import {
  getListings,
  getListingsCount,
  getLocations,
  HOME_LISTINGS_LIMIT,
} from "@/lib/data";

export default async function Home() {
  const [listings, locations, totalCount] = await Promise.all([
    getListings(HOME_LISTINGS_LIMIT),
    getLocations(),
    getListingsCount(),
  ]);

  return (
    <PageShell>
      <div className="flex min-h-screen flex-col">
        <div className="flex flex-1 flex-col items-center">
          <Header />
          <ListingsSection
            listings={listings}
            locations={locations}
            showAllButton={totalCount > HOME_LISTINGS_LIMIT}
          />
        </div>
        <ContactSection />
        <footer className="border-t border-white/40 bg-white/50 py-6 text-center text-sm text-slate-500 backdrop-blur-sm">
          © {new Date().getFullYear()} Alternatif Turizm Devremülk Merkezi. Tüm hakları saklıdır.
        </footer>
      </div>
    </PageShell>
  );
}
