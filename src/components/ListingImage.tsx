import Image from "next/image";
import { canUseNextImage, resolveListingImageUrl } from "@/lib/image";

interface ListingImageProps {
  src: string | null | undefined;
  alt: string;
}

function ImagePlaceholder() {
  return (
    <div className="flex h-full items-center justify-center text-slate-400">
      <svg className="h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
        />
      </svg>
    </div>
  );
}

export default function ListingImage({ src, alt }: ListingImageProps) {
  const resolved = resolveListingImageUrl(src);

  if (!resolved) {
    return <ImagePlaceholder />;
  }

  if (canUseNextImage(resolved)) {
    return (
      <Image
        src={resolved}
        alt={alt}
        fill
        className="object-cover transition-transform duration-500 group-hover:scale-105"
        sizes="(max-width: 768px) 100vw, 33vw"
      />
    );
  }

  return (
    // Harici görsel linkleri için standart img kullan
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={resolved}
      alt={alt}
      className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
    />
  );
}
