import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    if (!body.code) {
      return NextResponse.json(
        { message: "Code is required" },
        { status: 400 },
      );
    }

    const exist = await prisma.permission.findUnique({
      where: { code: body.code },
    });

    if (exist) {
      return NextResponse.json(
        { message: "Permission already exist" },
        { status: 400 },
      );
    }

    const permission = await prisma.permission.create({
      data: {
        code: body.code,
        description: body.description,
      },
    });
    return NextResponse.json({ ok: true }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    const permissions = await prisma.permission.findMany({
      orderBy: { code: "asc" },
    });

    return NextResponse.json(permissions);
  } catch (error) {
    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 },
    );
  }
}
