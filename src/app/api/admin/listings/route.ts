import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { createAdminClient } from "@/lib/supabase/admin";

export async function GET() {
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

    const { data, error } = await supabase
      .from("listings")
      .select("id, title, listing_type, created_at, locations(name)")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Admin listings fetch error:", error);
      return NextResponse.json(
        { error: "İlanlar yüklenemedi." },
        { status: 500 }
      );
    }

    return NextResponse.json({ listings: data });
  } catch {
    return NextResponse.json({ error: "Sunucu hatası." }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const authenticated = await isAdminAuthenticated();
    if (!authenticated) {
      return NextResponse.json({ error: "Yetkisiz erişim." }, { status: 401 });
    }

    const body = await request.json();
    const { title, description, location_id, listing_type, image_url } = body;

    if (!title || !location_id || !listing_type) {
      return NextResponse.json(
        { error: "Başlık, lokasyon ve işlem türü zorunludur." },
        { status: 400 }
      );
    }

    if (!["kiralama", "satış"].includes(listing_type)) {
      return NextResponse.json(
        { error: "Geçersiz işlem türü." },
        { status: 400 }
      );
    }

    const supabase = createAdminClient();
    if (!supabase) {
      return NextResponse.json(
        { error: "Veritabanı yönetici bağlantısı yapılandırılmamış." },
        { status: 500 }
      );
    }

    const { data, error } = await supabase
      .from("listings")
      .insert({
        title,
        description: description || null,
        location_id,
        listing_type,
        image_url: image_url || null,
        featured: true,
      })
      .select("id, title")
      .single();

    if (error) {
      console.error("Admin listing insert error:", error);
      return NextResponse.json(
        { error: "İlan kaydedilemedi." },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, listing: data });
  } catch {
    return NextResponse.json({ error: "Sunucu hatası." }, { status: 500 });
  }
}
