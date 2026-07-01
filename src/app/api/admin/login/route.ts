import { NextResponse } from "next/server";
import {
  ADMIN_COOKIE,
  createAdminSessionToken,
  getSessionCookieOptions,
} from "@/lib/admin-auth";

export async function POST(request: Request) {
  try {
    const { password } = await request.json();
    const adminPassword = process.env.ADMIN_PASSWORD;

    if (!adminPassword) {
      return NextResponse.json(
        { error: "Admin paneli yapılandırılmamış." },
        { status: 500 }
      );
    }

    if (password !== adminPassword) {
      return NextResponse.json(
        { error: "Hatalı şifre." },
        { status: 401 }
      );
    }

    const token = createAdminSessionToken();
    const response = NextResponse.json({ success: true });
    response.cookies.set(ADMIN_COOKIE, token, getSessionCookieOptions());
    return response;
  } catch {
    return NextResponse.json({ error: "Giriş başarısız." }, { status: 500 });
  }
}
