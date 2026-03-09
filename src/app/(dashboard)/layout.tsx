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

const NO_PADDING_ROUTES = ["/chat"];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const title = getTitleFromPath(pathname);

  const isChat = NO_PADDING_ROUTES.some((route) => pathname.startsWith(route));

  return (
    <SidebarProvider>
      <AppSidebar />

      <SidebarInset className="overflow-hidden">
        {/* Sembunyikan header bawaan saat di halaman chat */}
        {!isChat && (
          <div className="flex items-center gap-2 border-b p-3 shrink-0">
            <SidebarTrigger />
            <span className="font-semibold">{title}</span>
            <div className="ml-auto">
              <DarkmodeToggle />
            </div>
          </div>
        )}

        <main className={isChat ? "h-full overflow-hidden" : "p-6"}>
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
