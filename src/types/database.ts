export interface Location {
  id: string;
  name: string;
  slug: string;
  sort_order?: number;
}

export interface Listing {
  id: string;
  title: string;
  description: string | null;
  location_id: string | null;
  price: number | null;
  listing_type: "kiralama" | "satış";
  image_url: string | null;
  featured: boolean;
  created_at: string;
  locations?: Location | null;
}

export interface Submission {
  full_name: string;
  phone: string;
  email?: string;
  location: string;
  listing_type: "kiralama" | "satış";
  description: string;
}
