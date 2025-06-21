"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  BookOpen,
  BarChart3,
  Settings,
  ChevronLeft,
} from "lucide-react";

interface SidebarProps {
  isOpen: boolean;
  setOpen: (isOpen: boolean) => void;
}

const navItems = [
  { href: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/subjects", icon: BookOpen, label: "Subjects" },
  { href: "/reports", icon: BarChart3, label: "Reports" },
  { href: "/settings", icon: Settings, label: "Settings" },
];

export function Sidebar({ isOpen, setOpen }: SidebarProps) {
  const pathname = usePathname();

  return (
    <>
      {/* Mobile Overlay: サイドバー表示時に背景をクリックすると閉じる */}
      <div
        onClick={() => setOpen(false)}
        className={cn(
          "fixed inset-0 z-30 bg-black/50 transition-opacity duration-300 lg:hidden",
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
      />

      <aside
        className={cn(
          "fixed top-0 left-0 z-40 h-screen border-r bg-sidebar text-sidebar-foreground transition-all duration-300 ease-in-out",
          // モバイルでのスライドイン/アウト
          "lg:translate-x-0",
          isOpen ? "translate-x-0" : "-translate-x-full",
          // デスクトップでの幅の変更
          isOpen ? "lg:w-64" : "lg:w-20"
        )}
      >
        <div className="flex h-full flex-col">
          <div
            className={cn(
              "flex items-center border-b p-4",
              isOpen ? "justify-between" : "justify-center"
            )}
          >
            <h1 className={cn("font-headline text-xl font-bold text-sidebar-primary", !isOpen && "hidden")}>
              StudyWise
            </h1>
            <Button variant="ghost" size="icon" onClick={() => setOpen(!isOpen)} className="text-sidebar-foreground hover:bg-sidebar-accent">
              <ChevronLeft className={cn("h-6 w-6 transition-transform", !isOpen && "rotate-180")} />
            </Button>
          </div>

          <nav className="flex-1 space-y-2 px-2 py-4">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.label}
                  href={item.href}
                  className={cn(
                    "flex items-center rounded-md p-2 text-sm font-medium transition-colors",
                    "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                    isActive
                      ? "bg-sidebar-primary text-sidebar-primary-foreground"
                      : "text-sidebar-foreground",
                    !isOpen && "justify-center"
                  )}
                >
                  <item.icon className="h-5 w-5" />
                  <span className={cn("ml-3", !isOpen && "hidden")}>
                    {item.label}
                  </span>
                </Link>
              );
            })}
          </nav>
        </div>
      </aside>
    </>
  );
}