"use client";

import { useState, useEffect } from "react";
import { Plus, Search, Edit, Trash2, EyeOff, Eye, X } from "lucide-react";
import { useStore } from "@/lib/store";

export default function CommunitiesPage() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const communities = useStore((state) => state.communities);
  const addCommunity = useStore((state) => state.addCommunity);
  const updateCommunityStatus = useStore((state) => state.updateCommunityStatus);
  const deleteCommunity = useStore((state) => state.deleteCommunity);
  const updateCommunity = useStore((state) => state.updateCommunity);

  const [searchQuery, setSearchQuery] = useState("");
  
  // Modal State
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  
  // Form state
  const [currentId, setCurrentId] = useState("");
  const [newName, setNewName] = useState("");
  const [newAddress, setNewAddress] = useState("");

  if (!mounted) return null;

  const filteredCommunities = communities.filter(c => 
    c.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const toggleStatus = (id: string) => {
    const currentStatus = communities.find(c => c.id === id)?.status;
    const newStatus = currentStatus === "ACTIVE" ? "HIDDEN" : "ACTIVE";
    updateCommunityStatus(id, newStatus);
  };

  const openAddModal = () => {
    setIsEditing(false);
    setNewName("");
    setNewAddress("");
    setShowModal(true);
  };

  const openEditModal = (id: string, name: string, address: string) => {
    setIsEditing(true);
    setCurrentId(id);
    setNewName(name);
    setNewAddress(address);
    setShowModal(true);
  };

  const handleSaveCommunity = () => {
    if (!newName || !newAddress) return;
    
    if (isEditing) {
      updateCommunity(currentId, newName, newAddress);
    } else {
      addCommunity({
        id: `c${Date.now()}`,
        name: newName,
        address: newAddress,
        status: "ACTIVE"
      });
    }

    setNewName("");
    setNewAddress("");
    setShowModal(false);
  };

  const inputClasses = "w-full bg-surface-card border border-hairline text-ink p-4 text-sm font-light focus:border-m-blue-dark focus:outline-none transition-colors appearance-none";
  const labelClasses = "block text-xs font-bold uppercase tracking-machined text-muted mb-3";

  return (
    <div className="p-12 relative">
      {/* Add/Edit Community Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80">
          <div className="w-full max-w-md border border-hairline bg-surface-soft p-8">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-xl font-bold uppercase text-ink">{isEditing ? "Edit Community" : "Add Community"}</h3>
              <button onClick={() => setShowModal(false)} className="text-muted hover:text-ink"><X size={20} /></button>
            </div>
            <div className="mb-4">
              <label className={labelClasses}>Community Name</label>
              <input type="text" value={newName} onChange={(e) => setNewName(e.target.value)} placeholder="e.g. Adarsh Palm Retreat" className={inputClasses} />
            </div>
            <div className="mb-8">
              <label className={labelClasses}>Address</label>
              <input type="text" value={newAddress} onChange={(e) => setNewAddress(e.target.value)} placeholder="e.g. Bellandur, Bangalore" className={inputClasses} />
            </div>
            <button onClick={handleSaveCommunity} className="flex w-full items-center justify-center gap-2 bg-m-blue-dark py-4 text-xs font-bold uppercase tracking-machined text-ink hover:bg-m-blue-light">
              {isEditing ? "Save Changes" : "Save Community"}
            </button>
          </div>
        </div>
      )}

      {/* Header & Actions */}
      <div className="flex items-center justify-between mb-10">
        <div>
          <h2 className="text-3xl font-bold uppercase tracking-normal text-ink">Communities</h2>
          <p className="mt-2 text-sm font-light text-body">Manage gated communities and their visibility.</p>
        </div>
        <button onClick={openAddModal} className="flex items-center gap-2 bg-m-blue-dark px-6 py-3 text-xs font-bold uppercase tracking-machined text-ink hover:bg-m-blue-light transition-colors">
          <Plus size={14} /> Add Community
        </button>
      </div>

      {/* Search & Table */}
      <div className="mb-6 flex items-center gap-3 border border-hairline bg-surface-card p-3">
        <Search size={16} className="text-muted" />
        <input type="text" placeholder="Search communities..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className={inputClasses + " border-none bg-transparent p-0 focus:outline-none"} />
      </div>

      <div className="border border-hairline overflow-x-auto">
        <table className="w-full min-w-[600px]">
          <thead className="border-b border-hairline bg-surface-soft">
            <tr>
              <th className="py-4 px-6 text-left text-xs font-bold uppercase tracking-machined text-muted">Name</th>
              <th className="py-4 px-6 text-left text-xs font-bold uppercase tracking-machined text-muted">Address</th>
              <th className="py-4 px-6 text-left text-xs font-bold uppercase tracking-machined text-muted">Status</th>
              <th className="py-4 px-6 text-right text-xs font-bold uppercase tracking-machined text-muted">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredCommunities.map(c => (
              <tr key={c.id} className="border-b border-hairline hover:bg-surface-card transition-colors">
                <td className="py-4 px-6 text-sm font-bold text-ink">{c.name}</td>
                <td className="py-4 px-6 text-sm font-light text-body">{c.address}</td>
                <td className="py-4 px-6">
                  <span className={`text-xs font-bold uppercase tracking-machined px-2 py-1 ${c.status === "ACTIVE" ? "text-success" : "text-muted"}`}>
                    {c.status}
                  </span>
                </td>
                <td className="py-4 px-6 text-right">
                  <div className="flex items-center justify-end gap-3">
                    {/* EDIT BUTTON */}
                    <button onClick={() => openEditModal(c.id, c.name, c.address)} className="text-muted hover:text-ink transition-colors"><Edit size={16} /></button>
                    
                    {/* VISIBILITY TOGGLE */}
                    <button onClick={() => toggleStatus(c.id)} className="text-muted hover:text-warning transition-colors">
                      {c.status === "ACTIVE" ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                    
                    {/* DELETE BUTTON */}
                    <button onClick={() => deleteCommunity(c.id)} className="text-muted hover:text-m-red transition-colors"><Trash2 size={16} /></button>
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