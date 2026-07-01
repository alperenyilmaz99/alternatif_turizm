import type { Listing } from "@/types/database";
import ListingCard from "./ListingCard";

interface ListingsGridProps {
  listings: Listing[];
}

export default function ListingsGrid({ listings }: ListingsGridProps) {
  return (
    <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {listings.map((listing) => (
        <ListingCard key={listing.id} listing={listing} />
      ))}
    </div>
  );
}
