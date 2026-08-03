"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useStore } from "@/lib/store";
import { ChevronDown, User, Settings, LogOut } from "lucide-react";

export function Header() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const logoutMockUser = useStore((state) => state.logoutMockUser);

  const handleLogout = () => {
    logoutMockUser();
    router.push("/login");
  };

  return (
    <div className="sticky top-0 z-40 border-b border-hairline bg-canvas p-6 flex justify-end items-center relative">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 text-xs font-bold uppercase tracking-machined text-ink hover:text-m-blue-dark transition-colors"
      >
        Admin User
        <ChevronDown size={14} />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <>
          {/* Invisible overlay to close dropdown when clicking outside */}
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)}></div>
          
          <div className="absolute right-6 top-16 z-50 w-48 border border-hairline bg-surface-soft shadow-lg">
            <div className="flex flex-col p-2">
              <button 
                onClick={() => { setIsOpen(false); router.push("/profile"); }} 
                className="flex items-center gap-2 px-3 py-2 text-xs font-bold uppercase tracking-machined text-body hover:bg-surface-card hover:text-ink transition-colors text-left"
              >
                <User size={14} /> Profile
              </button>
              <button 
                onClick={() => { setIsOpen(false); router.push("/settings"); }} 
                className="flex items-center gap-2 px-3 py-2 text-xs font-bold uppercase tracking-machined text-body hover:bg-surface-card hover:text-ink transition-colors text-left"
              >
                <Settings size={14} /> Settings
              </button>
              <div className="border-t border-hairline my-2"></div>
              <button 
                onClick={handleLogout} 
                className="flex items-center gap-2 px-3 py-2 text-xs font-bold uppercase tracking-machined text-m-red hover:bg-m-red hover:text-ink transition-colors text-left"
              >
                <LogOut size={14} /> Logout
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}