import type { Listing } from "@/types/database";
import { DEFAULT_PHONE, KIZILCAHAMAM_PHONE } from "@/lib/contacts";

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
    ? KIZILCAHAMAM_PHONE
    : DEFAULT_PHONE;
}

export function getWhatsAppUrl(listing: Listing) {
  const phone = getWhatsAppNumberForListing(listing);
  const message = `Merhaba, "${listing.title}" ilanı hakkında bilgi almak istiyorum.`;
  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
}

export function formatPhoneDisplay(phone: string) {
  const local = phone.startsWith("90") ? `0${phone.slice(2)}` : phone;
  return `${local.slice(0, 4)} ${local.slice(4, 7)} ${local.slice(7)}`;
}

export function getCallUrl(listing: Listing) {
  return `tel:+${getWhatsAppNumberForListing(listing)}`;
}
