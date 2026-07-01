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

export interface SubmissionRecord {
  id: string;
  full_name: string;
  phone: string;
  email: string | null;
  location: string;
  listing_type: "kiralama" | "satış";
  description: string;
  created_at: string;
}

export interface AdminListing {
  id: string;
  title: string;
  listing_type: "kiralama" | "satış";
  created_at: string;
  locations?: { name: string } | null;
}
