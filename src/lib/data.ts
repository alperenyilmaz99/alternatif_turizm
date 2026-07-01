import { createServerClient } from "@/lib/supabase/server";
import { demoListings, demoLocations } from "@/lib/demo-data";
import { sortLocations } from "@/lib/locations";
import type { Listing, Location } from "@/types/database";

export async function getLocations(): Promise<Location[]> {
  const supabase = createServerClient();
  if (!supabase) return demoLocations;

  const { data, error } = await supabase
    .from("locations")
    .select("*")
    .order("sort_order", { ascending: true });

  if (error || !data?.length) return demoLocations;
  return sortLocations(data);
}

export async function getListings(): Promise<Listing[]> {
  const supabase = createServerClient();
  if (!supabase) return demoListings;

  const { data, error } = await supabase
    .from("listings")
    .select("*, locations(*)")
    .eq("featured", true)
    .order("created_at", { ascending: false });

  if (error || !data?.length) return demoListings;
  return data as Listing[];
}
