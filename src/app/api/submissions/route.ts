import { NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase/server";
import type { Submission } from "@/types/database";

export async function POST(request: Request) {
  try {
    const body: Submission = await request.json();

    if (!body.full_name || !body.phone || !body.location || !body.listing_type || !body.description) {
      return NextResponse.json(
        { error: "Lütfen zorunlu alanları doldurun." },
        { status: 400 }
      );
    }

    const supabase = createServerClient();
    if (!supabase) {
      return NextResponse.json(
        { error: "Veritabanı bağlantısı yapılandırılmamış." },
        { status: 500 }
      );
    }

    const { error } = await supabase.from("submissions").insert({
      full_name: body.full_name,
      phone: body.phone,
      email: body.email || null,
      location: body.location,
      listing_type: body.listing_type,
      description: body.description,
    });

    if (error) {
      console.error("Supabase insert error:", error);
      return NextResponse.json(
        { error: "Başvuru kaydedilemedi. Lütfen tekrar deneyin." },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: "Sunucu hatası oluştu." },
      { status: 500 }
    );
  }
}
