"use client";
import { User, LogOut, Phone, MapPin, KeyRound } from "lucide-react";
import { useStore } from "@/lib/store";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function StaffProfilePage() {
  const router = useRouter();

  const mockUser = useStore((state) => state.mockUser);
  const logoutMockUser = useStore((state) => state.logoutMockUser);
  const staff = useStore((state) => state.staff);

  // Find this staff member's details
  const myStaffDetails = staff.find(s => s.id === mockUser?.id) || staff[0];
  const staffName = myStaffDetails?.name || "";
  const staffInitials = staffName.split(" ").map(p => p[0]).filter(Boolean).slice(0, 2).join("").toUpperCase();

  const handleLogout = () => {
    logoutMockUser();
    router.replace("/staff-login");
  };

  return (
    <div className="flex min-h-screen flex-col bg-canvas pb-24">
      <div className="border-b border-hairline bg-surface-soft p-6">
        <h1 className="text-2xl font-bold uppercase text-ink">My Profile</h1>
      </div>

      <div className="flex-1 p-6 space-y-6">
        <Card className="gap-0 flex flex-col items-center justify-center rounded-lg border border-hairline bg-surface-card p-8 ring-0">
          <div className="w-20 h-20 rounded-full bg-yellow-dark/20 flex items-center justify-center mb-4">
            {staffInitials ? (
              <span className="text-2xl font-bold text-yellow-dark">{staffInitials}</span>
            ) : (
              <User size={32} className="text-yellow-dark" />
            )}
          </div>
          <h2 className="text-xl font-bold text-ink">{myStaffDetails?.name || "Staff Member"}</h2>
          <p className="text-sm font-light text-muted mt-1">Staff</p>
        </Card>

        <Card className="gap-0 rounded-lg border border-hairline bg-surface-card ring-0 divide-y divide-hairline">
          <div className="flex items-center p-4">
            <Phone size={16} className="text-muted mr-4" />
            <p className="text-sm font-light text-ink">{myStaffDetails?.phone || "N/A"}</p>
          </div>
          <div className="flex items-center p-4">
            <MapPin size={16} className="text-muted mr-4" />
            <p className="text-sm font-light text-ink">{myStaffDetails?.community || "N/A"}</p>
          </div>
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center">
              <KeyRound size={16} className="text-muted mr-4" />
              <p className="text-sm font-light text-ink">PIN: <span className="font-bold text-ink">{myStaffDetails?.pin || "N/A"}</span></p>
            </div>
          </div>
        </Card>

        <Button onClick={handleLogout} variant="outline" className="flex w-full h-auto items-center justify-center gap-2 rounded-lg border border-m-red/50 bg-transparent py-4 text-xs font-bold uppercase tracking-machined text-m-red hover:bg-m-red hover:text-ink">
          <LogOut size={14} /> Logout
        </Button>
      </div>
    </div>
  );
}