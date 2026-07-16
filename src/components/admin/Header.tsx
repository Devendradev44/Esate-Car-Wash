"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronDown, User, Settings, LogOut } from "lucide-react";

export function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown if clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="flex h-16 items-center justify-between border-b border-hairline bg-canvas px-12">
      {/* Left side - Can add Search bar later */}
      <div></div>

      {/* Right side - Admin Profile */}
      <div className="relative" ref={dropdownRef}>
        <button 
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-3 text-sm font-bold uppercase tracking-machined text-body hover:text-ink transition-colors"
        >
          <div className="flex h-8 w-8 items-center justify-center bg-surface-elevated text-ink">
            A
          </div>
          Admin
          <ChevronDown size={14} className={`transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
        </button>

        {/* Dropdown Menu */}
        {isOpen && (
          <div className="absolute right-0 top-12 w-48 border border-hairline bg-surface-card shadow-2xl shadow-black/50">
            <div className="py-2">
              <button className="flex w-full items-center gap-3 px-4 py-2 text-xs font-bold uppercase tracking-machined text-body hover:bg-surface-elevated hover:text-ink transition-colors">
                <User size={14} strokeWidth={1.5} /> Profile
              </button>
              <button className="flex w-full items-center gap-3 px-4 py-2 text-xs font-bold uppercase tracking-machined text-body hover:bg-surface-elevated hover:text-ink transition-colors">
                <Settings size={14} strokeWidth={1.5} /> Settings
              </button>
              <div className="my-1 border-t border-hairline"></div>
              <button className="flex w-full items-center gap-3 px-4 py-2 text-xs font-bold uppercase tracking-machined text-body hover:text-m-red hover:bg-surface-elevated transition-colors">
                <LogOut size={14} strokeWidth={1.5} /> Logout
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}