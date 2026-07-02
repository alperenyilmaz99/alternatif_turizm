import { createServerClient } from "@/lib/supabase/server";
import { demoListings, demoLocations } from "@/lib/demo-data";
import { sortLocations } from "@/lib/locations";
import type { Listing, Location } from "@/types/database";

export const HOME_LISTINGS_LIMIT = 9;

export async function getLocations(): Promise<Location[]> {
  const supabase = createServerClient();
  if (!supabase) return demoLocations;

  const { data, error } = await supabase
    .from("locations")
    .select("*")
    .order("sort_order", { ascending: true });

  if (error) {
    console.error("getLocations error:", error);
    return [];
  }
  if (!data?.length) return demoLocations;
  return sortLocations(data);
}

export async function getListings(limit?: number): Promise<Listing[]> {
  const supabase = createServerClient();
  if (!supabase) {
    return limit ? demoListings.slice(0, limit) : demoListings;
  }

  let query = supabase
    .from("listings")
    .select("*, locations(*)")
    .order("created_at", { ascending: false });

  if (limit) {
    query = query.limit(limit);
  }

  const { data, error } = await query;

  if (error) {
    console.error("getListings error:", error);
    return [];
  }
  return (data ?? []) as Listing[];
}

export async function getListingsCount(): Promise<number> {
  const supabase = createServerClient();
  if (!supabase) return demoListings.length;

  const { count, error } = await supabase
    .from("listings")
    .select("*", { count: "exact", head: true });

  if (error) {
    console.error("getListingsCount error:", error);
    return 0;
  }
  return count ?? 0;
}
