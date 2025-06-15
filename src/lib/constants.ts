import type { LucideIcon } from 'lucide-react';
import { LayoutDashboard, History, BookOpen, Brain, Settings } from 'lucide-react';

export const APP_NAME = "StudyWise";

export interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
  match?: (pathname: string) => boolean;
}

export const NAV_LINKS: NavItem[] = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard, match: (pathname) => pathname === "/" },
  { href: "/history", label: "Session History", icon: History },
  { href: "/subjects", label: "Subject Analytics", icon: BookOpen },
  { href: "/summarizer", label: "AI Note Summarizer", icon: Brain },
];

export const SETTINGS_LINK: NavItem = {
  href: "/settings", label: "Settings", icon: Settings
};
