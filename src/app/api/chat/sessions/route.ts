import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/server/get-user";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const user = await getCurrentUser();

    const sessions = await prisma.chatSession.findMany({
      where: { userId: user!.id },
      orderBy: { createdAt: "desc" },
      include: {
        chatMessages: {
          where: { role: "USER" }, // hanya ambil pesan USER
          orderBy: { createdAt: "asc" },
          take: 1, // cukup pesan pertama saja
        },
      },
    });
    return NextResponse.json(sessions);
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser();

    const session = await prisma.chatSession.create({
      data: { userId: user!.id },
    });
    return NextResponse.json(session);
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
