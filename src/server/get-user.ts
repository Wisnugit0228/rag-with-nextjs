// src/server/get-user.ts
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";

export async function getCurrentUser() {
  const cookieStore = await cookies();
  const sessionId = cookieStore.get("session")?.value;

  if (!sessionId) return null;

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

  if (!session) return null;

  if (session.expiresAt < new Date()) return null;

  const permissionCodes = session.user.role.permissions.map(
    (rp) => rp.permission.code,
  );

  return {
    ...session.user,
    permissions: permissionCodes,
  };
}
