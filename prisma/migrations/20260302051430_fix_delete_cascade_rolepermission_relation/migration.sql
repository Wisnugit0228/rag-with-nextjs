-- DropForeignKey
ALTER TABLE "role-permissions" DROP CONSTRAINT "role-permissions_roleId_fkey";

-- AddForeignKey
ALTER TABLE "role-permissions" ADD CONSTRAINT "role-permissions_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "roles"("id") ON DELETE CASCADE ON UPDATE CASCADE;
