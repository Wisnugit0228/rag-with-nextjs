import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST() {
  const cookie = await cookies();
  const sessionId = cookie.get("session")?.value;

  if (sessionId) {
    await prisma.session
      .delete({
        where: { id: sessionId },
      })
      .catch(() => {});
  }

  const res = NextResponse.json({ ok: true });

  res.cookies.set("session", "", {
    path: "/",
    expires: new Date(0),
  });
  return res;
}
