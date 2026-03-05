import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import bcrypt from "bcrypt";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    if (!body.name || !body.email || !body.password || !body.role_id) {
      return NextResponse.json(
        {
          message: "All fields are required",
        },
        { status: 400 },
      );
    }

    const exist = await prisma.user.findUnique({
      where: { email: body.email },
    });

    if (exist) {
      return NextResponse.json(
        {
          message: "User already exist",
        },
        { status: 400 },
      );
    }

    const hasedPw = await bcrypt.hash(body.password, 10);

    const user = await prisma.user.create({
      data: {
        name: body.name,
        email: body.email,
        password: hasedPw,
        roleId: body.role_id,
      },
      include: {
        role: true,
      },
    });
    return NextResponse.json(user, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
