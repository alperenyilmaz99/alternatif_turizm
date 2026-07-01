import type { Listing, Location } from "@/types/database";

export const demoLocations: Location[] = [
  { id: "1", name: "Kızılcahamam", slug: "kizilcahamam", sort_order: 1 },
  { id: "2", name: "Bolu", slug: "bolu", sort_order: 2 },
  { id: "3", name: "Afyon", slug: "afyon", sort_order: 3 },
  { id: "4", name: "Diğer", slug: "diger", sort_order: 4 },
];

export const demoListings: Listing[] = [
  {
    id: "1",
    title: "Eliz Termal",
    description:
      "Kızılcahamam'da termal tatil imkanı. Spa, havuz ve konforlu konaklama seçenekleri.",
    location_id: "1",
    price: null,
    listing_type: "kiralama",
    image_url:
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&q=80",
    featured: true,
    created_at: new Date().toISOString(),
    locations: demoLocations[0],
  },
  {
    id: "2",
    title: "Narven Termal",
    description:
      "Bolu'da doğayla iç içe termal tatil. Aileler için ideal devremülk seçenekleri.",
    location_id: "2",
    price: null,
    listing_type: "kiralama",
    image_url:
      "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&q=80",
    featured: true,
    created_at: new Date().toISOString(),
    locations: demoLocations[1],
  },
  {
    id: "3",
    title: "Özgül Termal",
    description:
      "Afyon'da kaplıca ve termal tedavi imkanlarıyla huzurlu bir tatil deneyimi.",
    location_id: "3",
    price: null,
    listing_type: "satış",
    image_url:
      "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800&q=80",
    featured: true,
    created_at: new Date().toISOString(),
    locations: demoLocations[2],
  },
];
