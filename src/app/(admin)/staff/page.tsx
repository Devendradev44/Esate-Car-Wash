"use client";
import { useState, useEffect } from "react";
import { Plus, Trash2, X, User, Phone, KeyRound } from "lucide-react";
import { useStore } from "@/lib/store";

export default function StaffPage() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const staff = useStore((state) => state.staff);
  const communities = useStore((state) => state.communities);
  const addStaff = useStore((state) => state.addStaff);

  const [showModal, setShowModal] = useState(false);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [community, setCommunity] = useState("");

  if (!mounted) return null;

  const handleAddStaff = () => {
    if (!name || !phone || !community) return;
    
    const pin = Math.floor(1000 + Math.random() * 9000).toString();
    
    addStaff({
      id: `st_${Date.now()}`,
      name,
      phone,
      community,
      pin,
      status: "ACTIVE"
    });

    setName(""); setPhone(""); setCommunity("");
    setShowModal(false);
  };

  const inputClasses = "w-full bg-surface-card border border-hairline text-ink p-4 text-sm font-light focus:border-m-blue-dark focus:outline-none transition-colors appearance-none";
  const labelClasses = "block text-xs font-bold uppercase tracking-machined text-muted mb-3";

  return (
    <div className="p-12 relative">
      {/* Add Staff Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
          <div className="w-full max-w-md border border-hairline bg-surface-soft p-8">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-xl font-bold uppercase text-ink">Add Staff Member</h3>
              <button onClick={() => setShowModal(false)} className="text-muted hover:text-ink"><X size={20} /></button>
            </div>
            
            <div className="mb-4">
              <label className={labelClasses}>Full Name</label>
              <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Ramesh Kumar" className={inputClasses} />
            </div>
            <div className="mb-4">
              <label className={labelClasses}>Phone Number</label>
              <input type="tel" maxLength={10} value={phone} onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))} placeholder="9876543210" className={inputClasses} />
            </div>
            <div className="mb-8">
              <label className={labelClasses}>Assign Community</label>
              <select value={community} onChange={(e) => setCommunity(e.target.value)} className={inputClasses}>
                <option value="" disabled>Select community</option>
                {communities.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
              </select>
            </div>

            <button onClick={handleAddStaff} className="flex w-full items-center justify-center gap-2 bg-m-blue-dark py-4 text-xs font-bold uppercase tracking-machined text-ink hover:bg-m-blue-light">
              Generate PIN & Save
            </button>
          </div>
        </div>
      )}

      {/* Header & Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-4">
        <div>
          <h2 className="text-3xl font-bold uppercase tracking-normal text-ink">Staff Management</h2>
          <p className="mt-2 text-sm font-light text-body">Create staff accounts and assign communities.</p>
        </div>
        <button onClick={() => setShowModal(true)} className="flex items-center justify-center gap-2 bg-m-blue-dark px-6 py-3 text-xs font-bold uppercase tracking-machined text-ink hover:bg-m-blue-light transition-colors">
          <Plus size={14} /> Add Staff
        </button>
      </div>

      {/* Data Table - Wrapped to prevent layout breaking */}
      <div className="border border-hairline overflow-x-auto bg-surface-card">
        <table className="w-full min-w-[800px]">
          <thead className="border-b border-hairline bg-surface-soft">
            <tr>
              <th className="py-4 px-6 text-left text-xs font-bold uppercase tracking-machined text-muted">Name</th>
              <th className="py-4 px-6 text-left text-xs font-bold uppercase tracking-machined text-muted">Phone</th>
              <th className="py-4 px-6 text-left text-xs font-bold uppercase tracking-machined text-muted">Community</th>
              <th className="py-4 px-6 text-center text-xs font-bold uppercase tracking-machined text-muted">PIN</th>
              <th className="py-4 px-6 text-right text-xs font-bold uppercase tracking-machined text-muted">Actions</th>
            </tr>
          </thead>
          <tbody>
            {staff.length === 0 ? (
              <tr>
                <td colSpan={5} className="py-10 text-center text-sm font-light text-muted">No staff members added yet.</td>
              </tr>
            ) : (
              staff.map(s => (
                <tr key={s.id} className="border-b border-hairline last:border-none hover:bg-surface-elevated transition-colors">
                  <td className="py-4 px-6 text-sm font-bold text-ink">
                    <div className="flex items-center gap-2"><User size={14} className="text-muted"/> {s.name}</div>
                  </td>
                  <td className="py-4 px-6 text-sm font-light text-body">
                    <div className="flex items-center gap-2"><Phone size={14} className="text-muted"/> {s.phone}</div>
                  </td>
                  <td className="py-4 px-6 text-sm font-light text-body">{s.community}</td>
                  <td className="py-4 px-6 text-sm font-bold text-m-blue-dark text-center">
                    <div className="flex items-center justify-center gap-1"><KeyRound size={12} /> {s.pin}</div>
                  </td>
                  <td className="py-4 px-6 text-right">
                    <button className="text-muted hover:text-m-red transition-colors"><Trash2 size={16} /></button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}