"use client";
import { useState } from "react";
import { User, LogOut, Phone, MapPin, KeyRound } from "lucide-react";
import { useStore } from "@/lib/store";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/toast";

export default function StaffProfilePage() {
  const router = useRouter();
  
  const mockUser = useStore((state) => state.mockUser);
  const logoutMockUser = useStore((state) => state.logoutMockUser);
  const staff = useStore((state) => state.staff);
  const updateStaff = useStore((state) => state.updateStaff);

  const [currentPin, setCurrentPin] = useState("");
  const [newPin, setNewPin] = useState("");
  const [confirmPin, setConfirmPin] = useState("");
  const [pinError, setPinError] = useState("");
  const [showChangeForm, setShowChangeForm] = useState(false);


  // Find this staff member's details
  const myStaffDetails = staff.find(s => s.id === mockUser?.id) || staff[0];
  const staffName = myStaffDetails?.name || "";
  const staffInitials = staffName.split(" ").map(p => p[0]).filter(Boolean).slice(0, 2).join("").toUpperCase();

  const handleLogout = () => {
    logoutMockUser();
    router.replace("/staff-login");
  };

  const handleChangePin = () => {
    setPinError("");
    if (currentPin !== myStaffDetails?.pin) { setPinError("Current PIN is incorrect."); return; }
    if (!/^\d{6}$/.test(newPin)) { setPinError("New PIN must be exactly 6 digits."); return; }
    if (newPin !== confirmPin) { setPinError("New PIN and confirmation do not match."); return; }
    if (newPin === currentPin) { setPinError("New PIN must be different from the current PIN."); return; }
    updateStaff(myStaffDetails.id, { pin: newPin });
    setCurrentPin(""); setNewPin(""); setConfirmPin("");
    setShowChangeForm(false);
    toast.add({ type: "success", title: "PIN updated", description: "Your 6-digit PIN has been changed." });
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
          <div className="flex items-center p-4">
            <KeyRound size={16} className="text-muted mr-4" />
            <p className="text-sm font-light text-ink">PIN: <span className="font-bold text-ink">{myStaffDetails?.pin || "N/A"}</span></p>
          </div>
        </Card>

        <Card className="gap-0 rounded-lg border border-hairline bg-surface-card p-5 ring-0">
          {!showChangeForm ? (
            <Button onClick={() => setShowChangeForm(true)} variant="outline" className="flex w-full h-auto items-center justify-center gap-2 rounded-lg border border-hairline bg-surface-card py-3 text-xs font-bold uppercase tracking-machined text-ink hover:border-yellow-dark hover:bg-surface-elevated">
              <KeyRound size={14} /> Change PIN
            </Button>
          ) : (
            <div className="space-y-4">
              <h3 className="text-sm font-bold uppercase tracking-machined text-ink">Change 6-Digit PIN</h3>
              <div>
                <Label className="mb-2 block text-[10px] font-bold leading-normal text-muted">Current PIN</Label>
                <Input type="password" value={currentPin} maxLength={6} onChange={(e) => setCurrentPin(e.target.value.replace(/\D/g, ""))} placeholder="••••••" className="text-center text-xl tracking-[0.5em]" />
              </div>
              <div>
                <Label className="mb-2 block text-[10px] font-bold leading-normal text-muted">New PIN</Label>
                <Input type="password" value={newPin} maxLength={6} onChange={(e) => setNewPin(e.target.value.replace(/\D/g, ""))} placeholder="••••••" className="text-center text-xl tracking-[0.5em]" />
              </div>
              <div>
                <Label className="mb-2 block text-[10px] font-bold leading-normal text-muted">Confirm New PIN</Label>
                <Input type="password" value={confirmPin} maxLength={6} onChange={(e) => setConfirmPin(e.target.value.replace(/\D/g, ""))} placeholder="••••••" className="text-center text-xl tracking-[0.5em]" />
              </div>
              {pinError && <p className="text-xs font-semibold text-m-red bg-m-red/10 border border-m-red/20 py-2 rounded-lg text-center">{pinError}</p>}
              <div className="flex gap-3">
                <Button onClick={handleChangePin} className="flex flex-1 items-center justify-center gap-2 bg-yellow-dark py-3 text-xs font-bold uppercase tracking-machined text-ink hover:bg-yellow-light">
                  Update PIN
                </Button>
                <Button onClick={() => { setShowChangeForm(false); setPinError(""); setCurrentPin(""); setNewPin(""); setConfirmPin(""); }} variant="ghost" className="flex items-center justify-center gap-2 py-3 text-xs text-muted hover:text-ink">
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </Card>

        <Button onClick={handleLogout} variant="outline" className="flex w-full h-auto items-center justify-center gap-2 rounded-lg border border-m-red/50 bg-transparent py-4 text-xs font-bold uppercase tracking-machined text-m-red hover:bg-m-red hover:text-ink">
          <LogOut size={14} /> Logout
        </Button>
      </div>
    </div>
  );
}
