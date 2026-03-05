import { User, Role } from "@prisma/client";

type UserWithRole = User & {
  role: Role;
};

export function requireRole(user: UserWithRole, role: string) {
  if (user.role.name !== role) {
    throw new Error("Forbidden");
  }
}
