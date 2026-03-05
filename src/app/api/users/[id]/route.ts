import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { getCurrentUser } from "@/server/get-user";

export async function PUT(
  req: Request,
  context: { params: Promise<{ id: string }> },
) {
  try {
    const userC = await getCurrentUser();
    if (!userC?.permissions.includes("users:edit")) {
      return new Response("Forbidden", { status: 403 });
    }
    const body = await req.json();
    const { id } = await context.params;

    const hasedPw = await bcrypt.hash(body.password, 10);

    const user = await prisma.user.update({
      where: { id },
      data: {
        name: body.name,
        email: body.email,
        roleId: body.role_id,
      },
      include: {
        role: true,
      },
    });
    return NextResponse.json(user, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: "Update failed" }, { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  context: { params: Promise<{ id: string }> },
) {
  try {
    const userC = await getCurrentUser();
    if (!userC?.permissions.includes("users:delete")) {
      return new Response("Forbidden", { status: 403 });
    }
    const { id } = await context.params;
    const user = await prisma.user.delete({
      where: { id },
    });
    return NextResponse.json(user, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: "Delete failed" }, { status: 500 });
  }
}
