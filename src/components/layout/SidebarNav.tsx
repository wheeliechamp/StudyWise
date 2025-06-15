"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { NAV_LINKS, APP_NAME } from '@/lib/constants';
import { cn } from '@/lib/utils';
import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
} from '@/components/ui/sidebar';
import { BookMarked } from 'lucide-react';

export function SidebarNav() {
  const pathname = usePathname();

  return (
    <Sidebar side="left" variant="sidebar" collapsible="icon">
      <SidebarHeader className="border-b">
        <Link href="/" className="flex items-center gap-2 py-2">
           <BookMarked className="h-7 w-7 text-primary group-data-[collapsible=icon]:mx-auto" />
          <span className="font-headline text-xl font-semibold text-foreground group-data-[collapsible=icon]:hidden">{APP_NAME}</span>
        </Link>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          {NAV_LINKS.map((item) => {
            const isActive = item.match ? item.match(pathname) : pathname.startsWith(item.href);
            return (
              <SidebarMenuItem key={item.label}>
                <Link href={item.href} legacyBehavior passHref>
                  <SidebarMenuButton
                    isActive={isActive}
                    tooltip={{ children: item.label, side: 'right', align: 'center' }}
                    aria-label={item.label}
                    className={cn(
                        "justify-start",
                        isActive && "bg-primary/10 text-primary hover:bg-primary/20 hover:text-primary",
                        !isActive && "hover:bg-accent/50"
                    )}
                  >
                    <item.icon className={cn("h-5 w-5", isActive ? "text-primary" : "text-muted-foreground group-hover/menu-button:text-accent-foreground")} />
                    <span className="group-data-[collapsible=icon]:hidden">{item.label}</span>
                  </SidebarMenuButton>
                </Link>
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter className="mt-auto border-t p-2">
        {/* <p className="text-xs text-muted-foreground group-data-[collapsible=icon]:hidden">
          © {new Date().getFullYear()} {APP_NAME}
        </p> */}
      </SidebarFooter>
    </Sidebar>
  );
}
