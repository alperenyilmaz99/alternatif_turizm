import { createClient } from "@supabase/supabase-js";
import { getSupabaseConfig } from "./config";

export function createServerClient() {
  const config = getSupabaseConfig();
  if (!config) return null;
  return createClient(config.url, config.key);
}
