const NEXT_IMAGE_HOSTS = ["images.unsplash.com"];

export function resolveListingImageUrl(
  url: string | null | undefined
): string | null {
  if (!url?.trim()) return null;

  try {
    const parsed = new URL(url.trim());

    if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
      return null;
    }

    // Unsplash sayfa linki görsel değildir
    if (
      parsed.hostname === "unsplash.com" &&
      parsed.pathname.startsWith("/photos/")
    ) {
      return null;
    }

    return parsed.toString();
  } catch {
    return null;
  }
}

export function canUseNextImage(url: string): boolean {
  try {
    const hostname = new URL(url).hostname;
    if (NEXT_IMAGE_HOSTS.includes(hostname)) return true;
    if (hostname.endsWith(".supabase.co")) return true;
    return false;
  } catch {
    return false;
  }
}
