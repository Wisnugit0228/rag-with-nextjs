import {
  LayoutDashboard,
  ShoppingCart,
  Users,
  Shield,
  Warehouse,
  Computer,
  FileStack,
  MessageCircleMore,
} from "lucide-react";

export type SidebarItem = {
  title: string;
  href: string;
  icon: any;
  permission?: string;
};

export const sidebarItems: SidebarItem[] = [
  {
    title: "Dashboard",
    href: "/",
    icon: LayoutDashboard,
  },
  {
    title: "Documents",
    href: "/documents",
    icon: FileStack,
    permission: "documents:view",
  },
  {
    title: "Chat Whith AI",
    href: "/chat",
    icon: MessageCircleMore,
  },
  {
    title: "Orders",
    href: "/orders",
    icon: ShoppingCart,
    permission: "orders:view",
  },
  {
    title: "Users",
    href: "/users",
    icon: Users,
    permission: "users:view",
  },
  {
    title: "Roles",
    href: "/roles",
    icon: Shield,
    permission: "roles:view",
  },
  {
    title: "Warehouses",
    href: "/warehouses",
    icon: Warehouse,
    permission: "wh:view",
  },
  {
    title: "Cashiers",
    href: "/cashiers",
    icon: Computer,
    permission: "cashier:view",
  },
];

export function getTitleFromPath(pathname: string) {
  const item = sidebarItems.find(
    (i) => pathname === i.href || pathname.startsWith(i.href + "/"),
  );

  return item?.title ?? "Dashboard";
}
