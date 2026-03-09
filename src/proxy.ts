import { NextRequest, NextResponse } from "next/server";

export async function proxy(req: NextRequest) {
  const sessionId = req.cookies.get("session")?.value;
  const { pathname } = req.nextUrl;

  const isPublic =
    pathname.startsWith("/login") ||
    pathname.startsWith("/api") ||
    pathname.startsWith("/_next") ||
    pathname === "/favicon.ico";

  // Kalau tidak ada session dan bukan public route → redirect login
  if (!sessionId && !isPublic) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // Kalau sudah login tapi akses /login → redirect ke home
  if (sessionId && pathname.startsWith("/login")) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
