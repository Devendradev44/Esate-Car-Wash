"use client";

import { useState } from "react";
import { Menu, X } from "lucide-react";
import { Sidebar } from "./Sidebar";
import { Header } from "./Header";

export function AdminShell({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen bg-canvas">
      
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 bg-black/80 md:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar: Hidden on mobile, visible on Desktop (md) */}
      <div className={`${sidebarOpen ? "translate-x-0" : "-translate-x-full"} fixed z-50 h-full md:relative md:translate-x-0 transition-transform duration-300`}>
        <Sidebar />
      </div>

      {/* Main Content Area */}
      <div className="flex flex-1 flex-col overflow-hidden">
        
        {/* Mobile Top Header with Hamburger */}
        <div className="flex h-16 items-center border-b border-hairline bg-canvas p-4 md:hidden">
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="text-ink">
            {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
          <h1 className="ml-4 text-sm font-bold uppercase tracking-machined text-ink">Estate Car Wash</h1>
        </div>

        {/* Desktop Header (Hidden on mobile) */}
        <div className="hidden md:block">
          <Header />
        </div>

        <main className="flex-1 overflow-y-auto p-6 md:p-12">
          {children}
        </main>
      </div>
    </div>
  );
}