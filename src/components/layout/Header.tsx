"use client";

import Link from 'next/link';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { APP_NAME } from '@/lib/constants';
import { BookMarked } from 'lucide-react';

export function Header() {
  return (
    <header className="sticky top-0 z-40 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6 shadow-sm">
      <div className="md:hidden">
        <SidebarTrigger />
      </div>
      <Link href="/" className="flex items-center gap-2">
        <BookMarked className="h-6 w-6 text-primary" />
        <span className="font-headline text-xl font-semibold text-foreground">{APP_NAME}</span>
      </Link>
      <div className="ml-auto flex items-center gap-4">
        {/* Future elements like ThemeToggle or UserProfile can go here */}
      </div>
    </header>
  );
}
