import Header from "@/components/Header";
import ListingsSection from "@/components/ListingsSection";
import ContactSection from "@/components/ContactSection";
import PageShell from "@/components/PageShell";
import SiteFooter from "@/components/SiteFooter";
import {
  getListings,
  getListingsCount,
  getLocations,
  HOME_LISTINGS_LIMIT,
} from "@/lib/data";

export const dynamic = "force-dynamic";

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
        <SiteFooter />
      </div>
    </PageShell>
  );
}
