import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/server/get-user";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  context: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await context.params;
    const role = await prisma.role.findUnique({
      where: { id },
    });

    if (!role) {
      return NextResponse.json({ message: "Role not found" }, { status: 404 });
    }

    return NextResponse.json(role);
  } catch (error) {
    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 },
    );
  }
}

export async function PUT(
  req: Request,
  context: { params: Promise<{ id: string }> },
) {
  try {
    const user = await getCurrentUser();
    if (!user?.permissions.includes("roles:edit")) {
      return new Response("Forbidden", { status: 403 });
    }
    const body = await req.json();
    const { id } = await context.params;

    const role = await prisma.role.update({
      where: { id },
      data: {
        name: body.name,
        description: body.description,
      },
      include: {
        permissions: {
          include: {
            permission: true,
          },
        },
      },
    });

    return NextResponse.json(role);
  } catch (error) {
    return NextResponse.json({ message: "Update failed" }, { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  context: { params: Promise<{ id: string }> },
) {
  try {
    const user = await getCurrentUser();
    if (!user?.permissions.includes("roles:delete")) {
      return new Response("Forbidden", { status: 403 });
    }
    const { id } = await context.params;
    const role = await prisma.role.findUnique({
      where: { id },
    });
    if (role?.name === "admin")
      return NextResponse.json(
        { message: "Cannot delete admin role" },
        { status: 400 },
      );
    await prisma.role.delete({
      where: { id },
    });
    return NextResponse.json({ ok: true }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
