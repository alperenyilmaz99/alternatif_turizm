import { createHmac, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";

export const ADMIN_COOKIE = "admin_session";
const SESSION_MAX_AGE = 60 * 60 * 24; // 24 saat

export function createAdminSessionToken(): string {
  const password = process.env.ADMIN_PASSWORD;
  if (!password) throw new Error("ADMIN_PASSWORD yapılandırılmamış");
  return createHmac("sha256", password)
    .update("admin-authenticated")
    .digest("hex");
}

export function verifyAdminSessionToken(token: string | undefined): boolean {
  if (!token) return false;
  try {
    const expected = createAdminSessionToken();
    if (token.length !== expected.length) return false;
    return timingSafeEqual(Buffer.from(token), Buffer.from(expected));
  } catch {
    return false;
  }
}

export async function isAdminAuthenticated(): Promise<boolean> {
  const cookieStore = await cookies();
  const token = cookieStore.get(ADMIN_COOKIE)?.value;
  return verifyAdminSessionToken(token);
}

export function getSessionCookieOptions() {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    maxAge: SESSION_MAX_AGE,
    path: "/",
  };
}
