import Header from "@/components/Header";
import ListingsSection from "@/components/ListingsSection";
import ContactSection from "@/components/ContactSection";
import { getListings, getLocations } from "@/lib/data";

export default async function Home() {
  const [listings, locations] = await Promise.all([
    getListings(),
    getLocations(),
  ]);

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <div className="flex flex-1 flex-col items-center">
        <Header />
        <ListingsSection listings={listings} locations={locations} />
      </div>
      <ContactSection />
      <footer className="border-t border-slate-100 py-6 text-center text-sm text-slate-400">
        © {new Date().getFullYear()} Alternatif Turizm Devremülk Merkezi. Tüm hakları saklıdır.
      </footer>
    </div>
  );
}
