import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function proxy(req: NextRequest) {
  const sessionId = req.cookies.get("session")?.value;
  const { pathname } = req.nextUrl;

  const isPublic =
    pathname.startsWith("/login") ||
    pathname.startsWith("/api") ||
    pathname.startsWith("/_next") ||
    pathname === "/favicon.ico";

  if (!sessionId && !isPublic) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  if (sessionId) {
    const session = await prisma.session.findUnique({
      where: { id: sessionId },
      include: {
        user: {
          include: {
            role: {
              include: {
                permissions: {
                  include: {
                    permission: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!session || session.expiresAt < new Date()) {
      return NextResponse.redirect(new URL("/login", req.url));
    }

    const permissions = session.user.role.permissions.map(
      (rp) => rp.permission.code,
    );

    const permissionMap: Record<string, string> = {
      "/users": "users:view",
      "/roles": "roles:view",
      "/documents": "documents:view",
    };

    for (const route in permissionMap) {
      if (pathname.startsWith(route)) {
        if (!permissions.includes(permissionMap[route])) {
          return NextResponse.redirect(new URL("/403", req.url));
        }
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/:path*"],
};
