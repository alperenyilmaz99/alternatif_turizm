"use client";

import type { Location } from "@/types/database";
import ListingForm from "./ListingForm";

interface AddListingFormProps {
  locations: Location[];
  onSuccess?: () => void;
}

export default function AddListingForm({ locations, onSuccess }: AddListingFormProps) {
  return (
    <ListingForm
      locations={locations}
      submitLabel="İlanı Yayınla"
      loadingLabel="Kaydediliyor..."
      successMessage={(title) => `"${title}" ilanı başarıyla eklendi.`}
      onSuccess={onSuccess}
    />
  );
}
