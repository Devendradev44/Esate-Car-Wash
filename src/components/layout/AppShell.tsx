"use client";

import { ReactNode } from "react";
import { Topbar } from "./Topbar";

interface AppShellProps {
  children: ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  return (
    <div className="min-h-screen bg-background text-foreground font-sans antialiased">
      <div className="lg:pl-72 min-h-screen flex flex-col">
        <Topbar />
        <main className="flex-1 p-4 md:p-6 lg:p-8">
          <div className="mx-auto max-w-screen-2xl w-full">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
