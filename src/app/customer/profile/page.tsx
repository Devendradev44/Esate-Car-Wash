"use client";
import { useState, useEffect } from "react";
import { User, Phone, Mail, LogOut, Edit, Check, Save } from "lucide-react";
import { useStore } from "@/lib/store";
import { useRouter } from "next/navigation";

export default function ProfilePage() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const router = useRouter();
  
  const mockUser = useStore((state) => state.mockUser);
  const logoutMockUser = useStore((state) => state.logoutMockUser);
  const updateMockUser = useStore((state) => state.updateMockUser);

  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [savedMessage, setSavedMessage] = useState("");

  useEffect(() => {
    if (mockUser) {
      setPhone(mockUser.phone || "");
      setEmail(mockUser.email || "");
    }
  }, [mockUser]);

  if (!mounted) return null;

  const handleLogout = () => {
    document.cookie = 'mock_session=; path=/; max-age=0'; // Clear cookie
    logoutMockUser();
    router.push("/login");
  };

  const handleSave = () => {
    // Basic validation
    if (phone.length !== 10) {
      setSavedMessage("Phone number must be exactly 10 digits.");
      return;
    }
    
    // Save to global Zustand store
    updateMockUser({ phone, email });
    setIsEditing(false);
    setSavedMessage("Profile updated successfully!");
    
    // Clear message after 3 seconds
    setTimeout(() => setSavedMessage(""), 3000);
  };

  return (
    <div className="flex min-h-screen flex-col bg-canvas pb-24">
      <div className="border-b border-hairline bg-surface-soft p-6 flex justify-between items-center">
        <h1 className="text-2xl font-bold uppercase text-ink">My Profile</h1>
        <button 
          onClick={() => isEditing ? handleSave() : setIsEditing(true)}
          className="flex items-center gap-1 text-xs font-bold uppercase tracking-machined text-m-blue-dark border border-m-blue-dark px-3 py-2 hover:bg-m-blue-dark hover:text-ink transition-colors"
        >
          {isEditing ? <Save size={14} /> : <Edit size={14} />}
          {isEditing ? "Save Changes" : "Edit Profile"}
        </button>
      </div>

      <div className="flex-1 p-6 space-y-6">
        <div className="flex flex-col items-center justify-center border border-hairline bg-surface-card p-8">
          <div className="w-20 h-20 rounded-full bg-m-blue-dark/20 flex items-center justify-center mb-4">
            <User size={32} className="text-m-blue-dark" />
          </div>
          <h2 className="text-xl font-bold text-ink">{mockUser?.name || "Customer"}</h2>
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
            <Phone size={16} className="text-muted mr-4" />
            <input 
              type="tel" 
              maxLength={10}
              value={phone} 
              onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))} 
              disabled={!isEditing}
              placeholder="10-digit mobile number"
              className="bg-transparent text-sm font-light text-ink focus:outline-none w-full disabled:text-muted" 
            />
          </div>
          <div className="flex items-center p-4">
            <Mail size={16} className="text-muted mr-4" />
            <input 
              type="email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
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