"use client";
import { useState, useEffect } from "react";
import { Plus, Trash2, X, User, Phone, KeyRound, Edit } from "lucide-react";
import { useStore } from "@/lib/store";

export default function StaffPage() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const staff = useStore((state) => state.staff);
  const communities = useStore((state) => state.communities);
  const addStaff = useStore((state) => state.addStaff);
  const updateStaff = useStore((state) => state.updateStaff);
  const deleteStaff = useStore((state) => state.deleteStaff);

  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentId, setCurrentId] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [community, setCommunity] = useState("");

  if (!mounted) return null;

  const openAddModal = () => {
    setIsEditing(false);
    setName(""); setPhone(""); setCommunity("");
    setShowModal(true);
  };

  const openEditModal = (id: string, n: string, p: string, c: string) => {
    setIsEditing(true);
    setCurrentId(id);
    setName(n); setPhone(p); setCommunity(c);
    setShowModal(true);
  };

  const handleSaveStaff = () => {
    if (!name || !phone || !community) return;
    if (isEditing) {
      updateStaff(currentId, name, phone, community);
    } else {
      const pin = Math.floor(1000 + Math.random() * 9000).toString();
      addStaff({ id: `st_${Date.now()}`, name, phone, community, pin, status: "ACTIVE", role: "STAFF" });
    }
    setName(""); setPhone(""); setCommunity("");
    setShowModal(false);
  };

  const inputClasses = "w-full bg-surface-card border border-hairline text-ink p-4 text-sm font-light focus:border-m-blue-dark focus:outline-none transition-colors appearance-none";
  const labelClasses = "block text-xs font-bold uppercase tracking-machined text-muted mb-3";

  return (
    <div className="p-6 md:p-12 relative">
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
          <div className="w-full max-w-md border border-hairline bg-surface-soft p-8">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-xl font-bold uppercase text-ink">{isEditing ? "Edit Staff Member" : "Add Staff Member"}</h3>
              <button onClick={() => setShowModal(false)} className="text-muted hover:text-ink"><X size={20} /></button>
            </div>
            <div className="mb-4">
              <label className={labelClasses}>Full Name</label>
              <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Ramesh Kumar" className={inputClasses} />
            </div>
            <div className="mb-4">
              <label className={labelClasses}>Phone Number</label>
              <input type="tel" maxLength={10} value={phone} onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))} placeholder="9876543210" className={inputClasses} />
            </div>
            <div className="mb-8">
              <label className={labelClasses}>Assign Community</label>
              <select value={community} onChange={(e) => setCommunity(e.target.value)} className={inputClasses}>
                <option value="" disabled>Select community</option>
                {communities.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
              </select>
            </div>
            <button onClick={handleSaveStaff} className="flex w-full items-center justify-center gap-2 bg-m-blue-dark py-4 text-xs font-bold uppercase tracking-machined text-ink hover:bg-m-blue-light">
              {isEditing ? "Save Changes" : "Generate PIN & Save"}
            </button>
          </div>
        </div>
      )}

      <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-4">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold uppercase tracking-normal text-ink">Staff Management</h2>
          <p className="mt-2 text-sm font-light text-body">Create staff accounts and assign communities.</p>
        </div>
        <button onClick={openAddModal} className="flex items-center justify-center gap-2 bg-m-blue-dark px-6 py-3 text-xs font-bold uppercase tracking-machined text-ink hover:bg-m-blue-light transition-colors">
          <Plus size={14} /> Add Staff
        </button>
      </div>

      {/* MOBILE CARDS */}
      <div className="md:hidden space-y-4">
        {staff.map(s => (
          <div key={s.id} className="border border-hairline bg-surface-card p-4">
            <div className="flex justify-between items-start mb-3">
              <div>
                <p className="text-lg font-bold text-ink flex items-center gap-2"><User size={14} className="text-muted" /> {s.name}</p>
                <p className="text-xs font-light text-muted mt-1 flex items-center gap-2"><Phone size={12} /> {s.phone}</p>
              </div>
              <span className="text-xs font-bold text-m-blue-dark flex items-center gap-1"><KeyRound size={12} /> {s.pin}</span>
            </div>
            <p className="text-xs font-light text-body mb-4">Community: {s.community}</p>
            <div className="flex items-center justify-end gap-4 border-t border-hairline pt-3">
              <button onClick={() => openEditModal(s.id, s.name, s.phone, s.community)} className="text-muted hover:text-ink transition-colors"><Edit size={16} /></button>
              <button onClick={() => deleteStaff(s.id)} className="text-muted hover:text-m-red transition-colors"><Trash2 size={16} /></button>
            </div>
          </div>
        ))}
      </div>

      {/* DESKTOP TABLE */}
      <div className="hidden md:block border border-hairline overflow-x-auto bg-surface-card">
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
            {staff.map(s => (
              <tr key={s.id} className="border-b border-hairline last:border-none hover:bg-surface-elevated transition-colors">
                <td className="py-4 px-6 text-sm font-bold text-ink"><div className="flex items-center gap-2"><User size={14} className="text-muted"/> {s.name}</div></td>
                <td className="py-4 px-6 text-sm font-light text-body"><div className="flex items-center gap-2"><Phone size={14} className="text-muted"/> {s.phone}</div></td>
                <td className="py-4 px-6 text-sm font-light text-body">{s.community}</td>
                <td className="py-4 px-6 text-sm font-bold text-m-blue-dark text-center"><div className="flex items-center justify-center gap-1"><KeyRound size={12} /> {s.pin}</div></td>
                <td className="py-4 px-6 text-right">
                  <div className="flex items-center justify-end gap-3">
                    <button onClick={() => openEditModal(s.id, s.name, s.phone, s.community)} className="text-muted hover:text-ink transition-colors"><Edit size={16} /></button>
                    <button onClick={() => deleteStaff(s.id)} className="text-muted hover:text-m-red transition-colors"><Trash2 size={16} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}