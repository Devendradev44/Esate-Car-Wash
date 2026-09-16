"use client";
import { useState } from "react";
import { User, Phone, Mail, LogOut, Edit, Save, X } from "lucide-react";
import { useStore } from "@/lib/store";
import { useRouter } from "next/navigation";

export default function ProfilePage() {
  const router = useRouter();
  
  const mockUser = useStore((state) => state.mockUser);
  const logoutMockUser = useStore((state) => state.logoutMockUser);
  const updateMockUser = useStore((state) => state.updateMockUser);

  const [isEditing, setIsEditing] = useState(false);
  const [savedMessage, setSavedMessage] = useState("");
  const [draft, setDraft] = useState<{ name: string; phone: string; email: string } | null>(null);

  const handleEdit = () => {
    if (mockUser) {
      setDraft({
        name: mockUser.name || "",
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
    // Basic validation
    if (draft.phone.length !== 10) {
      setSavedMessage("Phone number must be exactly 10 digits.");
      return;
    }
    if (!draft.name.trim()) {
      setSavedMessage("Name cannot be empty.");
      return;
    }
    
    // Save to global Zustand store
    updateMockUser({ name: draft.name, phone: draft.phone, email: draft.email });
    setDraft(null);
    setIsEditing(false);
    setSavedMessage("Profile updated successfully!");
    
    // Clear message after 3 seconds
    setTimeout(() => setSavedMessage(""), 3000);
  };

  const handleLogout = () => {
    logoutMockUser();
    router.replace("/login");
  };

  const displayName = mockUser?.name || "Customer";
  const displayPhone = mockUser?.phone || "";
  const displayEmail = mockUser?.email || "";

  return (
    <div className="flex min-h-screen flex-col bg-canvas pb-24">
      <div className="border-b border-hairline bg-surface-soft p-6 flex justify-between items-center">
        <h1 className="text-2xl font-bold uppercase text-ink">My Profile</h1>
        <button 
          onClick={isEditing ? handleSave : handleEdit}
          className="flex items-center gap-1 text-xs font-bold uppercase tracking-machined text-yellow-dark border border-yellow-dark px-3 py-2 hover:bg-yellow-dark hover:text-ink transition-colors"
        >
          {isEditing ? <Save size={14} /> : <Edit size={14} />}
          {isEditing ? "Save Changes" : "Edit Profile"}
        </button>
      </div>

      <div className="flex-1 p-6 space-y-6">
        <div className="flex flex-col items-center justify-center border border-hairline bg-surface-card p-8">
          <div className="w-20 h-20 rounded-full bg-yellow-dark/20 flex items-center justify-center mb-4">
            <User size={32} className="text-yellow-dark" />
          </div>
          <h2 className="text-xl font-bold text-ink">{displayName}</h2>
          <p className="text-sm font-light text-muted mt-1">Customer</p>
        </div>

        {/* Visual Feedback */}
        {savedMessage && (
          <div className={`p-3 text-xs font-bold uppercase tracking-machined text-center ${savedMessage.includes("successfully") ? "bg-success/20 text-success" : "bg-m-red/20 text-m-red"}`}>
            {savedMessage}
          </div>
        )}

        <div className="border border-hairline bg-surface-card divide-y divide-hairline">
          <div className="flex items-center p-4">
            <User size={16} className="text-muted mr-4" />
            <input 
              type="text" 
              value={isEditing && draft ? draft.name : displayName} 
              onChange={(e) => setDraft(prev => prev ? { ...prev, name: e.target.value } : null)} 
              disabled={!isEditing}
              placeholder="Your name"
              className="bg-transparent text-sm font-light text-ink focus:outline-none w-full disabled:text-muted" 
            />
            {isEditing && (
              <button onClick={handleCancel} className="ml-2 text-muted hover:text-ink"><X size={16} /></button>
            )}
          </div>
          <div className="flex items-center p-4">
            <Phone size={16} className="text-muted mr-4" />
            <input 
              type="tel" 
              maxLength={10}
              value={isEditing && draft ? draft.phone : displayPhone} 
              onChange={(e) => setDraft(prev => prev ? { ...prev, phone: e.target.value.replace(/\D/g, '') } : null)} 
              disabled={!isEditing}
              placeholder="10-digit mobile number"
              className="bg-transparent text-sm font-light text-ink focus:outline-none w-full disabled:text-muted" 
            />
          </div>
          <div className="flex items-center p-4">
            <Mail size={16} className="text-muted mr-4" />
            <input 
              type="email" 
              value={isEditing && draft ? draft.email : displayEmail} 
              onChange={(e) => setDraft(prev => prev ? { ...prev, email: e.target.value } : null)} 
              disabled={!isEditing}
              placeholder="user@example.com"
              className="bg-transparent text-sm font-light text-ink focus:outline-none w-full disabled:text-muted" 
            />
          </div>
        </div>

        <button onClick={handleLogout} className="flex w-full items-center justify-center gap-2 border border-m-red/50 text-m-red py-4 text-xs font-bold uppercase tracking-machined hover:bg-m-red hover:text-ink transition-colors">
          <LogOut size={14} /> Logout
        </button>
      </div>
    </div>
  );
}