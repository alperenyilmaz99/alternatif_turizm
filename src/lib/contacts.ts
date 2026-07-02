export interface SiteContact {
  name: string;
  phoneE164: string;
  phoneDisplay: string;
  region: string;
}

export const KIZILCAHAMAM_PHONE = "905441052626";
export const DEFAULT_PHONE = "905559985198";

export const SITE_CONTACTS: SiteContact[] = [
  {
    name: "Cezmi Bey",
    phoneE164: KIZILCAHAMAM_PHONE,
    phoneDisplay: "0544 105 2626",
    region: "Kızılcahamam",
  },
  {
    name: "Abdullah Bey",
    phoneE164: DEFAULT_PHONE,
    phoneDisplay: "0555 998 5198",
    region: "Bolu, Afyon ve diğer lokasyonlar",
  },
];

export function getTelUrl(phoneE164: string) {
  return `tel:+${phoneE164}`;
}

export function getWhatsAppUrlForPhone(phoneE164: string, message?: string) {
  const base = `https://wa.me/${phoneE164}`;
  if (!message) return base;
  return `${base}?text=${encodeURIComponent(message)}`;
}
