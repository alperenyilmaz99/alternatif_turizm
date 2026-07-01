import type { Listing } from "@/types/database";

const WHATSAPP_KIZILCA_HAMAM = "905441052626";
const WHATSAPP_DEFAULT = "905559985198";

function normalizeText(text: string) {
  return text
    .toLowerCase()
    .replace(/ı/g, "i")
    .replace(/ğ/g, "g")
    .replace(/ü/g, "u")
    .replace(/ş/g, "s")
    .replace(/ö/g, "o")
    .replace(/ç/g, "c");
}

export function isKizilcaHamamListing(listing: Listing) {
  const slug = listing.locations?.slug;
  if (slug === "kizilcahamam") return true;

  const fields = [
    listing.locations?.name,
    listing.title,
    listing.description,
  ]
    .filter(Boolean)
    .map((value) => normalizeText(value as string));

  return fields.some((value) => value.includes("kizilca"));
}

export function getWhatsAppNumberForListing(listing: Listing) {
  return isKizilcaHamamListing(listing)
    ? WHATSAPP_KIZILCA_HAMAM
    : WHATSAPP_DEFAULT;
}

export function getWhatsAppUrl(listing: Listing) {
  const phone = getWhatsAppNumberForListing(listing);
  const message = `Merhaba, "${listing.title}" ilanı hakkında bilgi almak istiyorum.`;
  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
}
