"use client";

import { usePathname } from "next/navigation";
import { AppSidebar } from "@/components/layout/sidebar";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { DarkmodeToggle } from "@/components/common/darkmode-toggle";
import { getTitleFromPath } from "@/config/sidebar-config";

export default function RolesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const title = getTitleFromPath(pathname);

  return (
    <SidebarProvider>
      <AppSidebar />

      <SidebarInset className="relative z-0">
        <div className="flex items-center gap-2 border-b p-3">
          <SidebarTrigger />
          <span className="font-semibold">{title}</span>

          <div className="ml-auto">
            <DarkmodeToggle />
          </div>
        </div>

        <main className="p-6">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}
