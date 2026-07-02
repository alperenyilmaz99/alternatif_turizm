import { randomUUID } from "crypto";
import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import {
  LISTING_IMAGE_MAX_BYTES,
  LISTING_IMAGES_BUCKET,
  resolveListingImageMimeType,
} from "@/lib/storage";
import { createAdminClient } from "@/lib/supabase/admin";
import { ensureListingImagesBucket } from "@/lib/supabase/listing-images-bucket";

const EXT_BY_MIME: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/jpg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/gif": "gif",
};

export async function POST(request: Request) {
  try {
    const authenticated = await isAdminAuthenticated();
    if (!authenticated) {
      return NextResponse.json({ error: "Yetkisiz erişim." }, { status: 401 });
    }

    const supabase = createAdminClient();
    if (!supabase) {
      return NextResponse.json(
        { error: "Veritabanı yönetici bağlantısı yapılandırılmamış." },
        { status: 500 }
      );
    }

    const formData = await request.formData();
    const file = formData.get("file");

    if (!file || !(file instanceof File)) {
      return NextResponse.json({ error: "Dosya bulunamadı." }, { status: 400 });
    }

    const contentType = resolveListingImageMimeType(file);
    if (!contentType) {
      return NextResponse.json(
        { error: "Sadece JPEG, PNG, WebP veya GIF yüklenebilir." },
        { status: 400 }
      );
    }

    if (file.size > LISTING_IMAGE_MAX_BYTES) {
      return NextResponse.json(
        { error: "Dosya en fazla 5 MB olabilir." },
        { status: 400 }
      );
    }

    const ext = EXT_BY_MIME[contentType] ?? "jpg";
    const path = `${Date.now()}-${randomUUID()}.${ext}`;
    const buffer = Buffer.from(await file.arrayBuffer());

    const bucketReady = await ensureListingImagesBucket(supabase);
    if (!bucketReady.ok) {
      console.error("Listing images bucket setup error:", bucketReady.error);
      return NextResponse.json(
        {
          error: `Storage bucket hazırlanamadı: ${bucketReady.error}`,
        },
        { status: 500 }
      );
    }

    const { error } = await supabase.storage
      .from(LISTING_IMAGES_BUCKET)
      .upload(path, buffer, {
        contentType,
        upsert: false,
      });

    if (error) {
      console.error("Admin image upload error:", error);
      return NextResponse.json(
        {
          error: error.message || "Görsel yüklenemedi.",
          details: error.name,
        },
        { status: 500 }
      );
    }

    const { data } = supabase.storage
      .from(LISTING_IMAGES_BUCKET)
      .getPublicUrl(path);

    return NextResponse.json({ url: data.publicUrl });
  } catch (err) {
    console.error("Admin image upload exception:", err);
    return NextResponse.json({ error: "Sunucu hatası." }, { status: 500 });
  }
}
