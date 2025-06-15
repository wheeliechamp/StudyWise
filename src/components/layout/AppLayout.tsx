"use client";

import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import { Header } from './Header';
import { SidebarNav } from './SidebarNav';
import { TimerManager } from './TimerManager';

export function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider defaultOpen={true}>
      <TimerManager />
      <div className="flex min-h-screen w-full flex-col bg-muted/40">
        <div className="hidden md:block">
           <SidebarNav />
        </div>
        <div className="flex flex-col sm:gap-4 sm:py-4 md:pl-[var(--sidebar-width-icon)] peer-data-[state=expanded]:md:pl-[var(--sidebar-width)] transition-[padding-left] duration-300 ease-in-out">
           <div className="md:ml-0 fixed top-0 left-0 right-0 z-50 md:sticky md:left-auto md:right-auto md:z-auto peer-data-[state=expanded]:md:pl-[var(--sidebar-width)] md:pl-[var(--sidebar-width-icon)] transition-[padding-left] duration-300 ease-in-out">
            <Header />
          </div>
          <main className="flex-1 p-4 sm:px-6 sm:py-0 md:gap-8 bg-background shadow-sm md:rounded-lg">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
