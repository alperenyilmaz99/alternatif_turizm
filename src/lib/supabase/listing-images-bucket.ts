import type { SupabaseClient } from "@supabase/supabase-js";
import { LISTING_IMAGE_MAX_BYTES, LISTING_IMAGES_BUCKET } from "@/lib/storage";

export async function ensureListingImagesBucket(
  supabase: SupabaseClient
): Promise<{ ok: true } | { ok: false; error: string }> {
  const { data: buckets, error: listError } = await supabase.storage.listBuckets();

  if (listError) {
    return { ok: false, error: listError.message };
  }

  const exists = buckets?.some(
    (bucket) =>
      bucket.id === LISTING_IMAGES_BUCKET || bucket.name === LISTING_IMAGES_BUCKET
  );

  if (exists) {
    return { ok: true };
  }

  const { error: createError } = await supabase.storage.createBucket(
    LISTING_IMAGES_BUCKET,
    {
      public: true,
      fileSizeLimit: LISTING_IMAGE_MAX_BYTES,
    }
  );

  if (createError) {
    const message = createError.message.toLowerCase();
    if (message.includes("already exists") || message.includes("duplicate")) {
      return { ok: true };
    }
    return { ok: false, error: createError.message };
  }

  return { ok: true };
}
