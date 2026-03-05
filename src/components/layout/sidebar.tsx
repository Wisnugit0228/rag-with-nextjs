"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarHeader,
  SidebarFooter,
} from "@/components/ui/sidebar";
import { sidebarItems } from "@/config/sidebar-config";
import { LogoutButton } from "../common/logout-button";
import { usePermission } from "@/hooks/use-permission";
import { SidebarUserMenu } from "./sidebar-user-menu";

export function AppSidebar() {
  const { hasPermission, loading } = usePermission();
  const pathname = usePathname();

  if (loading) {
    return null;
  }

  const isActive = (href: string) =>
    pathname === href || pathname.startsWith(href + "/");

  const filteredItems = sidebarItems.filter((item) => {
    if (!item.permission) return true;
    return hasPermission(item.permission);
  });

  return (
    <Sidebar>
      <SidebarHeader className="text-lg font-semibold">POS App</SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Main</SidebarGroupLabel>

          <SidebarMenu>
            {filteredItems.map((item) => {
              const Icon = item.icon;

              return (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton asChild isActive={isActive(item.href)}>
                    <Link href={item.href}>
                      <Icon />
                      {item.title}
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              );
            })}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="text-xs text-muted-foreground">
        <SidebarUserMenu />
      </SidebarFooter>
    </Sidebar>
  );
}
