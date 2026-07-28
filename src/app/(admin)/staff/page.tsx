"use client";

import { useState } from "react";
import { Plus, Search, Edit, Trash2, KeyRound, X, EyeOff } from "lucide-react";

const initialStaff = [
  { id: "st1", name: "Ramesh Kumar", phone: "9876543210", community: "Prestige Shantiniketan", pin: "1234", status: "ACTIVE" },
  { id: "st2", name: "Suresh Babu", phone: "9876543211", community: "Sobha Halcyon", pin: "5678", status: "ACTIVE" },
  { id: "st3", name: "Anil Reddy", phone: "9876543212", community: "Brigade Gateway", pin: "9999", status: "DISABLED" },
];

// Dropdown options matching the Communities table
const communities = ["Prestige Shantiniketan", "Sobha Halcyon", "Brigade Gateway"];

export default function StaffPage() {
  const [staff, setStaff] = useState(initialStaff);
  const [searchQuery, setSearchQuery] = useState("");
  const [showModal, setShowModal] = useState(false);
  
  // Form State
  const [newName, setNewName] = useState("");
  const [newPhone, setNewPhone] = useState("");
  const [newCommunity, setNewCommunity] = useState(communities[0]);
  const [newPin, setNewPin] = useState("");

  const filteredStaff = staff.filter(s => 
    s.name.toLowerCase().includes(searchQuery.toLowerCase()) || s.phone.includes(searchQuery)
  );

  const handleAddStaff = () => {
    if (!newName || !newPhone || !newPin) return;
    const newMember = {
      id: `st${Date.now()}`,
      name: newName,
      phone: newPhone,
      community: newCommunity,
      pin: newPin,
      status: "ACTIVE"
    };
    setStaff([newMember, ...staff]);
    setNewName(""); setNewPhone(""); setNewCommunity(communities[0]); setNewPin("");
    setShowModal(false);
  };

  const toggleStatus = (id: string) => {
    setStaff(staff.map(s => 
      s.id === id ? { ...s, status: s.status === "ACTIVE" ? "DISABLED" : "ACTIVE" } : s
    ));
  };

  const resetPin = (id: string) => {
    const randomPin = String(Math.floor(1000 + Math.random() * 9000)); // Generate 4-digit pin
    setStaff(staff.map(s => s.id === id ? { ...s, pin: randomPin } : s));
    alert(`New PIN generated: ${randomPin}`);
  };

  const inputClasses = "w-full bg-surface-card border border-hairline text-ink p-4 text-sm font-light focus:border-m-blue-dark focus:outline-none transition-colors appearance-none";
  const labelClasses = "block text-xs font-bold uppercase tracking-machined text-muted mb-3";

  return (
    <div className="p-12 relative">
      {/* Add Staff Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80">
          <div className="w-full max-w-md border border-hairline bg-surface-soft p-8 mx-4">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-xl font-bold uppercase text-ink">Add Staff Member</h3>
              <button onClick={() => setShowModal(false)} className="text-muted hover:text-ink"><X size={20} /></button>
            </div>
            
            <div className="mb-4">
              <label className={labelClasses}>Full Name</label>
              <input type="text" value={newName} onChange={(e) => setNewName(e.target.value)} placeholder="e.g. Ramesh Kumar" className={inputClasses} />
            </div>
            
            <div className="mb-4">
              <label className={labelClasses}>Phone Number (Login ID)</label>
              <input type="tel" value={newPhone} onChange={(e) => setNewPhone(e.target.value)} placeholder="+91 98765 43210" className={inputClasses} />
            </div>

            <div className="mb-4">
              <label className={labelClasses}>Assigned Community</label>
              <select value={newCommunity} onChange={(e) => setNewCommunity(e.target.value)} className={inputClasses}>
                {communities.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>

            <div className="mb-8">
              <label className={labelClasses}>4-Digit Login PIN</label>
              <input 
                type="password" 
                value={newPin} 
                onChange={(e) => setNewPin(e.target.value)} 
                maxLength={4} 
                placeholder="****" 
                className={inputClasses + " text-center text-xl tracking-[0.5em]"} 
              />
            </div>

            <button onClick={handleAddStaff} className="flex w-full items-center justify-center gap-2 bg-m-blue-dark py-4 text-xs font-bold uppercase tracking-machined text-ink hover:bg-m-blue-light">
              Save Staff Member
            </button>
          </div>
        </div>
      )}

      {/* Header & Actions */}
      <div className="flex items-center justify-between mb-10">
        <div>
          <h2 className="text-3xl font-bold uppercase tracking-normal text-ink">Staff Management</h2>
          <p className="mt-2 text-sm font-light text-body">Create staff accounts, assign communities, and manage PINs.</p>
        </div>
        <button onClick={() => setShowModal(true)} className="flex items-center gap-2 bg-m-blue-dark px-6 py-3 text-xs font-bold uppercase tracking-machined text-ink hover:bg-m-blue-light transition-colors">
          <Plus size={14} /> Add Staff
        </button>
      </div>

      {/* Search Bar */}
      <div className="mb-6 flex items-center gap-3 border border-hairline bg-surface-card p-3">
        <Search size={16} className="text-muted" />
        <input type="text" placeholder="Search by name or phone..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className={inputClasses + " border-none bg-transparent p-0 focus:outline-none"} />
      </div>

      {/* Data Table */}
      <div className="border border-hairline overflow-x-auto">
        <table className="w-full min-w-[800px]">
          <thead className="border-b border-hairline bg-surface-soft">
            <tr>
              <th className="py-4 px-6 text-left text-xs font-bold uppercase tracking-machined text-muted">Name</th>
              <th className="py-4 px-6 text-left text-xs font-bold uppercase tracking-machined text-muted">Phone</th>
              <th className="py-4 px-6 text-left text-xs font-bold uppercase tracking-machined text-muted">Community</th>
              <th className="py-4 px-6 text-left text-xs font-bold uppercase tracking-machined text-muted">PIN</th>
              <th className="py-4 px-6 text-left text-xs font-bold uppercase tracking-machined text-muted">Status</th>
              <th className="py-4 px-6 text-right text-xs font-bold uppercase tracking-machined text-muted">Actions</th>
            </tr>
          </thead>
          
          <tbody>
            {filteredStaff.map(s => (
              <tr key={s.id} className="border-b border-hairline hover:bg-surface-card transition-colors">
                <td className="py-4 px-6 text-sm font-bold text-ink">{s.name}</td>
                <td className="py-4 px-6 text-sm font-light text-body">{s.phone}</td>
                <td className="py-4 px-6 text-sm font-light text-ink">{s.community}</td>
                <td className="py-4 px-6 text-sm font-bold text-m-red tracking-wider">{s.pin}</td>
                <td className="py-4 px-6">
                  <span className={`text-xs font-bold uppercase tracking-machined px-2 py-1 ${s.status === "ACTIVE" ? "text-success" : "text-muted"}`}>
                    {s.status}
                  </span>
                </td>
                <td className="py-4 px-6 text-right">
                  <div className="flex items-center justify-end gap-3">
                    <button onClick={() => resetPin(s.id)} className="text-muted hover:text-warning transition-colors" title="Reset PIN"><KeyRound size={16} /></button>
                    <button onClick={() => toggleStatus(s.id)} className="text-muted hover:text-warning transition-colors" title="Disable/Enable"><EyeOff size={16} /></button>
                    <button className="text-muted hover:text-m-red transition-colors" title="Delete"><Trash2 size={16} /></button>
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