import { login } from "@/server/auth";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const { session } = await login(body.email, body.password);

    const res = NextResponse.json({ ok: true });

    res.cookies.set("session", session.id, {
      httpOnly: true,
      path: "/",
      expires: session.expiresAt,
    });

    return res;
  } catch (error: any) {
    return NextResponse.json(
      {
        message: error.message || "Invalid credentials",
      },
      { status: 401 },
    );
  }
}
