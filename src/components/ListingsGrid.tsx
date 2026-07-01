import type { Listing } from "@/types/database";
import ListingCard from "./ListingCard";

interface ListingsGridProps {
  listings: Listing[];
}

export default function ListingsGrid({ listings }: ListingsGridProps) {
  return (
    <div className="mt-10 grid auto-rows-fr grid-cols-3 gap-2 sm:gap-4 md:gap-6">
      {listings.map((listing) => (
        <div key={listing.id} className="flex h-full min-h-0">
          <ListingCard listing={listing} />
        </div>
      ))}
    </div>
  );
}
