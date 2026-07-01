export const LOCATION_ORDER = [
  "kizilcahamam",
  "bolu",
  "afyon",
  "diger",
] as const;

export const FORM_LOCATIONS = [
  "Kızılcahamam",
  "Bolu",
  "Afyon",
  "Diğer",
] as const;

export function sortLocations<T extends { slug: string; sort_order?: number }>(
  locations: T[]
): T[] {
  return [...locations].sort((a, b) => {
    if (a.sort_order != null && b.sort_order != null) {
      return a.sort_order - b.sort_order;
    }
    const indexA = LOCATION_ORDER.indexOf(a.slug as (typeof LOCATION_ORDER)[number]);
    const indexB = LOCATION_ORDER.indexOf(b.slug as (typeof LOCATION_ORDER)[number]);
    return (
      (indexA === -1 ? 999 : indexA) - (indexB === -1 ? 999 : indexB)
    );
  });
}
