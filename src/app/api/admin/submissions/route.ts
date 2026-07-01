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
      .from("submissions")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Admin submissions fetch error:", error);
      return NextResponse.json(
        { error: "Başvurular yüklenemedi." },
        { status: 500 }
      );
    }

    return NextResponse.json({ submissions: data });
  } catch {
    return NextResponse.json({ error: "Sunucu hatası." }, { status: 500 });
  }
}
