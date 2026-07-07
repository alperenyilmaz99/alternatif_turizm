import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { createAdminClient } from "@/lib/supabase/admin";

async function getAuthenticatedClient() {
  const authenticated = await isAdminAuthenticated();
  if (!authenticated) {
    return { error: NextResponse.json({ error: "Yetkisiz erişim." }, { status: 401 }) };
  }

  const supabase = createAdminClient();
  if (!supabase) {
    return {
      error: NextResponse.json(
        { error: "Veritabanı yönetici bağlantısı yapılandırılmamış." },
        { status: 500 }
      ),
    };
  }

  return { supabase };
}

function validateListingBody(body: Record<string, unknown>) {
  const { title, location_id, listing_type } = body;

  if (!title || !location_id || !listing_type) {
    return "Başlık, lokasyon ve işlem türü zorunludur.";
  }

  if (!["kiralama", "satış"].includes(listing_type as string)) {
    return "Geçersiz işlem türü.";
  }

  return null;
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const auth = await getAuthenticatedClient();
    if (auth.error) return auth.error;

    const { id } = await params;
    if (!id) {
      return NextResponse.json({ error: "İlan ID gerekli." }, { status: 400 });
    }

    const { data, error } = await auth.supabase!
      .from("listings")
      .select("*, locations(*)")
      .eq("id", id)
      .single();

    if (error) {
      console.error("Admin listing fetch error:", error);
      return NextResponse.json({ error: "İlan bulunamadı." }, { status: 404 });
    }

    return NextResponse.json({ listing: data });
  } catch {
    return NextResponse.json({ error: "Sunucu hatası." }, { status: 500 });
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const auth = await getAuthenticatedClient();
    if (auth.error) return auth.error;

    const { id } = await params;
    if (!id) {
      return NextResponse.json({ error: "İlan ID gerekli." }, { status: 400 });
    }

    const body = await request.json();
    const validationError = validateListingBody(body);
    if (validationError) {
      return NextResponse.json({ error: validationError }, { status: 400 });
    }

    const { title, description, location_id, listing_type, image_url } = body;

    const { data, error } = await auth.supabase!
      .from("listings")
      .update({
        title,
        description: description || null,
        location_id,
        listing_type,
        image_url: image_url || null,
      })
      .eq("id", id)
      .select("id, title")
      .single();

    if (error) {
      console.error("Admin listing update error:", error);
      return NextResponse.json({ error: "İlan güncellenemedi." }, { status: 500 });
    }

    return NextResponse.json({ success: true, listing: data });
  } catch {
    return NextResponse.json({ error: "Sunucu hatası." }, { status: 500 });
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const auth = await getAuthenticatedClient();
    if (auth.error) return auth.error;

    const { id } = await params;
    if (!id) {
      return NextResponse.json({ error: "İlan ID gerekli." }, { status: 400 });
    }

    const { error } = await auth.supabase!.from("listings").delete().eq("id", id);

    if (error) {
      console.error("Admin listing delete error:", error);
      return NextResponse.json({ error: "İlan silinemedi." }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Sunucu hatası." }, { status: 500 });
  }
}
