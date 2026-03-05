import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    if (!body.role_id || !body.permission_id) {
      return NextResponse.json(
        { message: "All fields are required" },
        { status: 400 },
      );
    }

    // insert pivot
    await prisma.rolePermission.create({
      data: {
        roleId: body.role_id,
        permissionId: body.permission_id,
      },
    });

    // 🔥 ambil ulang role + permissions
    const updatedRole = await prisma.role.findUnique({
      where: { id: body.role_id },
      include: {
        permissions: {
          include: {
            permission: true,
          },
        },
      },
    });

    return NextResponse.json(updatedRole, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 },
    );
  }
}
