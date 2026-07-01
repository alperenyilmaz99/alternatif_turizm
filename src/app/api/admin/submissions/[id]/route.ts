import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { createAdminClient } from "@/lib/supabase/admin";

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authenticated = await isAdminAuthenticated();
    if (!authenticated) {
      return NextResponse.json({ error: "Yetkisiz erişim." }, { status: 401 });
    }

    const { id } = await params;
    if (!id) {
      return NextResponse.json({ error: "Başvuru ID gerekli." }, { status: 400 });
    }

    const supabase = createAdminClient();
    if (!supabase) {
      return NextResponse.json(
        { error: "Veritabanı yönetici bağlantısı yapılandırılmamış." },
        { status: 500 }
      );
    }

    const { error } = await supabase.from("submissions").delete().eq("id", id);

    if (error) {
      console.error("Admin submission delete error:", error);
      return NextResponse.json(
        { error: "Başvuru silinemedi." },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Sunucu hatası." }, { status: 500 });
  }
}
