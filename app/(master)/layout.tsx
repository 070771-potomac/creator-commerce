"use client";

import {
  DownloadSimpleIcon,
  GearIcon,
  HeartIcon,
  PackageIcon,
  QuestionIcon,
  ReceiptIcon,
  ShoppingBagIcon,
  SquaresFourIcon,
  UsersIcon,
} from "@phosphor-icons/react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import Link from "next/link";
import { usePathname } from "next/navigation";

// Sidebar sections from docs/site-tree.md (Dashboard layout).
const navGroups = [
  {
    label: null,
    items: [{ title: "Overview", href: "/dashboard", icon: SquaresFourIcon }],
  },
  {
    label: "Selling",
    items: [
      { title: "Products", href: "/products", icon: PackageIcon },
      { title: "Sales", href: "/sales", icon: ReceiptIcon },
    ],
  },
  {
    label: "Buying",
    items: [
      { title: "Purchases", href: "/purchases", icon: ShoppingBagIcon },
      { title: "Downloads", href: "/downloads", icon: DownloadSimpleIcon },
      { title: "Wishlist", href: "/wishlist", icon: HeartIcon },
      { title: "Following", href: "/following", icon: UsersIcon },
    ],
  },
  {
    label: null,
    items: [
      { title: "Settings", href: "/settings", icon: GearIcon },
      { title: "Help", href: "/help/first-sale", icon: QuestionIcon },
    ],
  },
];

export default function MasterLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  // Also highlights the parent link on nested pages, e.g. /products/new → Products.
  const isActive = (href: string) =>
    pathname === href || pathname.startsWith(`${href}/`);

  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader>
          <Link href="/" className="px-2 py-1 font-heading text-base font-medium">
            My-E-Commerce
          </Link>
        </SidebarHeader>
        <SidebarContent>
          {navGroups.map((group, index) => (
            <SidebarGroup key={group.label ?? index}>
              {group.label ? (
                <SidebarGroupLabel>{group.label}</SidebarGroupLabel>
              ) : null}
              <SidebarGroupContent>
                <SidebarMenu>
                  {group.items.map((item) => (
                    <SidebarMenuItem key={item.href}>
                      <SidebarMenuButton
                        isActive={isActive(item.href)}
                        render={<Link href={item.href} />}
                      >
                        <item.icon />
                        <span>{item.title}</span>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          ))}
        </SidebarContent>
      </Sidebar>

      <SidebarInset>
        <header className="flex h-14 items-center gap-4 border-b px-4">
          <SidebarTrigger />
          <NavigationMenu>
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuTrigger>Account</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="w-48 p-2">
                    <li>
                      <NavigationMenuLink render={<Link href="/settings" />}>
                        Profile
                      </NavigationMenuLink>
                    </li>
                    <li>
                      {/* Placeholder until Better Auth adds a real sign-out (S6). */}
                      <NavigationMenuLink render={<Link href="/login" />}>
                        Log out
                      </NavigationMenuLink>
                    </li>
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </header>

        <main className="flex-1 overflow-auto">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}
