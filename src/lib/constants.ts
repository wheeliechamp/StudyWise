import type { LucideIcon } from 'lucide-react';
import { LayoutDashboard, History, BookOpen, Brain, Settings } from 'lucide-react';

export const APP_NAME = "学習ワイズ";

export interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
  match?: (pathname: string) => boolean;
}

export const NAV_LINKS: NavItem[] = [
  { href: "/", label: "ダッシュボード", icon: LayoutDashboard, match: (pathname) => pathname === "/" },
  { href: "/history", label: "セッション履歴", icon: History },
  { href: "/subjects", label: "科目別分析", icon: BookOpen },
  { href: "/summarizer", label: "AIノート要約", icon: Brain },
];

export const SETTINGS_LINK: NavItem = {
  href: "/settings", label: "設定", icon: Settings
};
