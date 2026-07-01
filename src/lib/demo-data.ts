import type { Listing, Location } from "@/types/database";

export const demoLocations: Location[] = [
  { id: "1", name: "Eliz", slug: "eliz" },
  { id: "2", name: "Afyon", slug: "afyon" },
  { id: "3", name: "Antalya", slug: "antalya" },
  { id: "4", name: "Bodrum", slug: "bodrum" },
];

export const demoListings: Listing[] = [
  {
    id: "1",
    title: "Eliz Termal Resort - 1 Hafta",
    description:
      "5 yıldızlı termal otelde 2+1 daire, tam donanımlı mutfak ve spa erişimi.",
    location_id: "1",
    price: 15000,
    listing_type: "kiralama",
    image_url:
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&q=80",
    featured: true,
    created_at: new Date().toISOString(),
    locations: demoLocations[0],
  },
  {
    id: "2",
    title: "Afyon Grand Otel - Devremülk",
    description:
      "Merkezi konumda, kaplıca ve havuz imkanlarıyla ideal tatil seçeneği.",
    location_id: "2",
    price: 850000,
    listing_type: "satış",
    image_url:
      "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800&q=80",
    featured: true,
    created_at: new Date().toISOString(),
    locations: demoLocations[1],
  },
  {
    id: "3",
    title: "Eliz Spa & Wellness",
    description: "Haftalık kiralama, 4 kişilik suit oda, kahvaltı dahil.",
    location_id: "1",
    price: 22000,
    listing_type: "kiralama",
    image_url:
      "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&q=80",
    featured: true,
    created_at: new Date().toISOString(),
    locations: demoLocations[0],
  },
];
