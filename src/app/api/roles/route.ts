import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/server/get-user";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user?.permissions.includes("roles:create")) {
      return new Response("Forbidden", { status: 403 });
    }
    const body = await req.json();

    if (!body.name) {
      return NextResponse.json(
        {
          message: "Role name is required",
        },
        { status: 400 },
      );
    }

    const exist = await prisma.role.findUnique({
      where: { name: body.name },
    });

    if (exist) {
      return NextResponse.json(
        {
          message: "Role already exist",
        },
        { status: 400 },
      );
    }

    const role = await prisma.role.create({
      data: {
        name: body.name,
        description: body.description ?? null,
      },
    });
    return NextResponse.json(role, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    const roles = await prisma.role.findMany({
      orderBy: { name: "asc" },
      select: {
        id: true,
        name: true,
        description: true,
        permissions: {
          select: {
            id: true,
            permission: {
              select: {
                id: true,
                code: true,
              },
            },
          },
        },
      },
    });

    return NextResponse.json(roles);
  } catch (error) {
    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 },
    );
  }
}
