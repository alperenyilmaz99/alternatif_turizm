import type { Listing } from "@/types/database";
import ListingCard from "./ListingCard";

interface ListingsGridProps {
  listings: Listing[];
}

export default function ListingsGrid({ listings }: ListingsGridProps) {
  return (
    <div className="mt-10 grid grid-cols-3 items-stretch gap-2 sm:gap-4 md:gap-6">
      {listings.map((listing) => (
        <div key={listing.id} className="flex min-h-0 w-full">
          <ListingCard listing={listing} />
        </div>
      ))}
    </div>
  );
}
