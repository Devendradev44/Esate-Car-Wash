"use client";
import { useState, useEffect } from "react";
import { User, Phone, Mail, LogOut, ChevronRight } from "lucide-react";
import { useStore } from "@/lib/store";
import { useRouter } from "next/navigation";

export default function ProfilePage() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const router = useRouter();
  
  const mockUser = useStore((state) => state.mockUser);
  const logoutMockUser = useStore((state) => state.logoutMockUser);

  if (!mounted) return null;

  const handleLogout = () => {
    logoutMockUser();
    router.push("/login");
  };

  return (
    <div className="flex min-h-screen flex-col bg-canvas pb-24">
      <div className="border-b border-hairline bg-surface-soft p-6">
        <h1 className="text-2xl font-bold uppercase text-ink">My Profile</h1>
      </div>

      <div className="flex-1 p-6 space-y-6">
        {/* User Info Block */}
        <div className="flex flex-col items-center justify-center border border-hairline bg-surface-card p-8">
          <div className="w-20 h-20 rounded-full bg-m-blue-dark/20 flex items-center justify-center mb-4">
            <User size={32} className="text-m-blue-dark" />
          </div>
          <h2 className="text-xl font-bold text-ink">{mockUser?.name || "Rahul Sharma"}</h2>
          <p className="text-sm font-light text-muted mt-1">Customer</p>
        </div>

        {/* Details List */}
                
        <div className="border border-hairline bg-surface-card divide-y divide-hairline">
          <div className="flex items-center p-4">
            <Phone size={16} className="text-muted mr-4" />
            <p className="text-sm font-light text-ink">{mockUser?.phone || "9999999999"}</p>
          </div>
          <div className="flex items-center p-4">
            <Mail size={16} className="text-muted mr-4" />
            <input 
              type="email" 
              defaultValue="rahul.sharma@example.com" 
              className="bg-transparent text-sm font-light text-ink focus:outline-none w-full" 
            />
            <ChevronRight size={16} className="text-muted ml-auto" />
          </div>
        </div>

        {/* Logout Button */}
        <button onClick={handleLogout} className="flex w-full items-center justify-center gap-2 border border-m-red/50 text-m-red py-4 text-xs font-bold uppercase tracking-machined hover:bg-m-red hover:text-ink transition-colors">
          <LogOut size={14} /> Logout
        </button>
      </div>
    </div>
  );
}