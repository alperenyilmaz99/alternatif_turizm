export const LISTING_IMAGES_BUCKET = "listing-images";

export const LISTING_IMAGE_MAX_BYTES = 5 * 1024 * 1024;

export const LISTING_IMAGE_MIME_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
  "image/gif",
] as const;

export type ListingImageMimeType = (typeof LISTING_IMAGE_MIME_TYPES)[number];

const EXT_TO_MIME: Record<string, ListingImageMimeType> = {
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  png: "image/png",
  webp: "image/webp",
  gif: "image/gif",
};

export function resolveListingImageMimeType(
  file: File
): ListingImageMimeType | null {
  const normalizedType = file.type.toLowerCase();
  if (
    LISTING_IMAGE_MIME_TYPES.includes(normalizedType as ListingImageMimeType)
  ) {
    return normalizedType as ListingImageMimeType;
  }

  const ext = file.name.split(".").pop()?.toLowerCase();
  if (!ext) return null;
  return EXT_TO_MIME[ext] ?? null;
}
