"use client";
import { useState } from "react";
import { User, Mail, Phone, LogOut } from "lucide-react";
import { useStore } from "@/lib/store";
import { useRouter } from "next/navigation";
import { toast } from "@/components/ui/toast";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function ProfilePage() {
  const router = useRouter();

  const mockUser = useStore((state) => state.mockUser);
  const logoutMockUser = useStore((state) => state.logoutMockUser);
  const updateMockUser = useStore((state) => state.updateMockUser);

  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState<{ firstName: string; lastName: string; phone: string; email: string } | null>(null);

  const handleEdit = () => {
    if (mockUser) {
      const nameParts = (mockUser.name || "").split(" ");
      const firstName = nameParts[0] || "";
      const lastName = nameParts.slice(1).join(" ") || "";
      setDraft({
        firstName,
        lastName,
        phone: mockUser.phone || "",
        email: mockUser.email || "",
      });
      setIsEditing(true);
    }
  };

  const handleCancel = () => {
    setDraft(null);
    setIsEditing(false);
  };

  const handleSave = () => {
    if (!draft) return;
    if (draft.phone.length !== 10) {
      toast.add({ type: "error", title: "Invalid phone", description: "Phone number must be exactly 10 digits." });
      return;
    }
    if (!draft.firstName.trim()) {
      toast.add({ type: "error", title: "Invalid name", description: "First name cannot be empty." });
      return;
    }
    const fullName = `${draft.firstName.trim()} ${draft.lastName.trim()}`.trim();

    updateMockUser({ name: fullName, phone: draft.phone, email: draft.email });
    setDraft(null);
    setIsEditing(false);
    toast.add({ type: "success", title: "Profile updated", description: "Your changes have been saved." });
  };

  const handleLogout = () => {
    logoutMockUser();
    router.replace("/login");
  };

  const displayFirstName = mockUser?.name?.split(" ")[0] || "";
  const displayLastName = mockUser?.name?.split(" ").slice(1).join(" ") || "";
  const displayEmail = mockUser?.email || "";
  const profileInitials = ((displayFirstName[0] || "") + (displayLastName[0] || "")).toUpperCase();

  return (
    <div className="flex min-h-screen flex-col bg-canvas pb-24">
      <div className="border-b border-hairline bg-surface-soft p-6 flex justify-between items-center">
        <h1 className="text-2xl font-bold uppercase text-ink">My Profile</h1>
        <Button
          onClick={isEditing ? handleSave : handleEdit}
          className="flex items-center gap-1 text-xs font-bold uppercase tracking-machined text-yellow-dark border border-yellow-dark bg-transparent hover:bg-yellow-dark hover:text-ink transition-colors"
        >
          {isEditing ? "Save Changes" : "Edit Profile"}
        </Button>
      </div>

      <div className="flex-1 p-6 space-y-6">
<Card className="gap-0 flex flex-col items-center justify-center rounded-lg border border-hairline bg-surface-card p-8 ring-0">
            <div className="w-20 h-20 rounded-full bg-yellow-dark/20 flex items-center justify-center mb-4">
              {profileInitials ? (
                <span className="text-2xl font-bold text-yellow-dark">{profileInitials}</span>
              ) : (
                <User size={32} className="text-yellow-dark" />
              )}
            </div>
            <h2 className="text-xl font-bold text-ink">{displayFirstName} {displayLastName}</h2>
            <p className="text-sm font-light text-muted mt-1">Customer</p>
          </Card>

<Card className="gap-0 rounded-lg border border-hairline bg-surface-card ring-0 divide-y divide-hairline">
          <div className="flex items-center p-4">
            <User size={16} className="text-muted mr-4" />
            {isEditing && draft ? (
              <div className="flex gap-2 flex-1">
                <Input
                  value={draft.firstName}
                  onChange={(e) => setDraft(prev => prev ? { ...prev, firstName: e.target.value } : null)}
                  placeholder="First name"
                  className="bg-transparent text-sm font-light text-ink focus:outline-none flex-1"
                />
                <Input
                  value={draft.lastName}
                  onChange={(e) => setDraft(prev => prev ? { ...prev, lastName: e.target.value } : null)}
                  placeholder="Last name"
                  className="bg-transparent text-sm font-light text-ink focus:outline-none flex-1"
                />
              </div>
            ) : (
              <p className="text-sm font-light text-ink w-full">{displayFirstName} {displayLastName}</p>
            )}
            {isEditing && (
              <Button
                variant="ghost"
                onClick={handleCancel}
                className="ml-2 text-muted hover:text-ink"
              >
                Cancel
              </Button>
            )}
          </div>
          <div className="flex items-center p-4">
            <Phone size={16} className="text-muted mr-4" />
            {isEditing && draft ? (
              <Input
                type="tel"
                value={draft.phone}
                onChange={(e) => setDraft(prev => prev ? { ...prev, phone: e.target.value.replace(/\D/g, "").slice(0, 10) } : null)}
                placeholder="10-digit phone"
                className="bg-transparent text-sm font-light text-ink focus:outline-none w-full"
                maxLength={10}
              />
            ) : (
              <p className="text-sm font-light text-ink w-full">{mockUser?.phone || "—"}</p>
            )}
          </div>
          <div className="flex items-center p-4">
            <Mail size={16} className="text-muted mr-4" />
            {isEditing && draft ? (
              <Input
                type="email"
                value={draft.email}
                onChange={(e) => setDraft(prev => prev ? { ...prev, email: e.target.value } : null)}
                placeholder="user@example.com"
                className="bg-transparent text-sm font-light text-ink focus:outline-none w-full"
              />
            ) : (
              <p className="text-sm font-light text-ink w-full">{displayEmail}</p>
            )}
          </div>
        </Card>

        <Button
          onClick={handleLogout}
          className="flex w-full items-center justify-center gap-2 border border-m-red/50 text-m-red py-4 text-xs font-bold uppercase tracking-machined hover:bg-m-red hover:text-ink transition-colors"
        >
          <LogOut size={14} /> Logout
        </Button>
      </div>
    </div>
  );
}