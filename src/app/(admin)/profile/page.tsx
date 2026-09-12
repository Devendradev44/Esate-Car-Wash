"use client";
import { User, Mail, Shield } from "lucide-react";
import { useStore } from "@/lib/store";

export default function AdminProfile() {
  const mockUser = useStore((state) => state.mockUser);


  return (
    <div className="p-12">
      <div className="mb-10">
        <h2 className="text-3xl font-bold uppercase tracking-normal text-ink">My Profile</h2>
        <p className="mt-2 text-sm font-light text-body">Manage your administrator account.</p>
      </div>

      <div className="max-w-md border border-hairline bg-surface-card p-8">
        <div className="flex flex-col items-center justify-center mb-8">
          <div className="w-20 h-20 rounded-full bg-yellow-dark/20 flex items-center justify-center mb-4">
            <User size={32} className="text-yellow-dark" />
          </div>
          <h2 className="text-xl font-bold text-ink">{mockUser?.name || "Admin User"}</h2>
          <p className="text-sm font-light text-muted mt-1 flex items-center gap-1"><Shield size={12} /> Administrator</p>
        </div>

        <div className="border-t border-hairline pt-6 space-y-4">
          <div className="flex items-center gap-3">
            <Mail size={16} className="text-muted" />
            <p className="text-sm font-light text-ink">{mockUser?.email || "admin@estatecarwash.com"}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
