"use client";
import { useState, useEffect } from "react";
import { Plus, MapPin, Trash2, X, Edit } from "lucide-react";
import { useStore } from "@/lib/store";

export default function AddressesPage() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const addresses = useStore((state) => state.addresses);
  const communities = useStore((state) => state.communities);
  const addAddress = useStore((state) => state.addAddress);
  const updateAddress = useStore((state) => state.updateAddress);
  const deleteAddress = useStore((state) => state.deleteAddress);

  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentId, setCurrentId] = useState("");
  
  const [community, setCommunity] = useState("");
  const [flat, setFlat] = useState("");

  if (!mounted) return null;

  const openAddModal = () => {
    setIsEditing(false);
    setCommunity(""); setFlat("");
    setShowModal(true);
  };

  const openEditModal = (id: string, c: string, f: string) => {
    setIsEditing(true);
    setCurrentId(id);
    setCommunity(c); setFlat(f);
    setShowModal(true);
  };

  const handleSaveAddress = () => {
    if (!community || !flat) return;
    
    if (isEditing) {
      updateAddress(currentId, community, flat);
    } else {
      addAddress({
        id: `a${Date.now()}`,
        community,
        flat
      });
    }

    setCommunity(""); setFlat("");
    setShowModal(false);
  };

  const inputClasses = "w-full bg-surface-card border border-hairline text-ink p-4 text-sm font-light focus:border-m-blue-dark focus:outline-none transition-colors appearance-none";

  // You will need to add updateAddress and deleteAddress to your store.ts for this to work!
  // addAddress: (newAddress) => set((state) => ({ addresses: [...state.addresses, newAddress] })),
  // updateAddress: (id, community, flat) => set((state) => ({ addresses: state.addresses.map(a => a.id === id ? { ...a, community, flat } : a) })),
  // deleteAddress: (id) => set((state) => ({ addresses: state.addresses.filter(a => a.id !== id) })),

  return (
    <div className="flex min-h-screen flex-col bg-canvas pb-24">
      <div className="border-b border-hairline bg-surface-soft p-6 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold uppercase text-ink">My Addresses</h1>
          <p className="mt-1 text-sm font-light text-body">Manage your saved locations.</p>
        </div>
        <button onClick={openAddModal} className="p-3 border border-m-blue-dark text-m-blue-dark hover:bg-m-blue-dark hover:text-ink transition-colors">
          <Plus size={20} />
        </button>
      </div>

      <div className="flex-1 p-6 space-y-4">
        {addresses.length === 0 ? (
          <div className="text-center text-muted text-sm font-light mt-20">No addresses saved yet.</div>
        ) : (
          addresses.map(a => (
            <div key={a.id} className="border border-hairline bg-surface-card p-5">
              <div className="flex justify-between items-start">
                <div className="flex items-start gap-3">
                  <MapPin size={20} className="text-m-blue-dark mt-1" />
                  <div>
                    <p className="text-lg font-bold text-ink">{a.flat}</p>
                    <p className="text-xs font-light text-muted mt-1">{a.community}</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <button onClick={() => openEditModal(a.id, a.community, a.flat)} className="text-muted hover:text-ink transition-colors"><Edit size={16} /></button>
                  <button onClick={() => deleteAddress(a.id)} className="text-muted hover:text-m-red transition-colors"><Trash2 size={16} /></button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
          <div className="w-full max-w-md border border-hairline bg-surface-soft p-8">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-xl font-bold uppercase text-ink">{isEditing ? "Edit Address" : "Add Address"}</h3>
              <button onClick={() => setShowModal(false)} className="text-muted hover:text-ink"><X size={20} /></button>
            </div>
            
            <div className="mb-4">
              <label className="block text-xs font-bold uppercase tracking-machined text-muted mb-3">Community</label>
              <select value={community} onChange={(e) => setCommunity(e.target.value)} className={inputClasses}>
                <option value="" disabled>Select community</option>
                {communities.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
              </select>
            </div>
            <div className="mb-8">
              <label className="block text-xs font-bold uppercase tracking-machined text-muted mb-3">Flat Number</label>
              <input type="text" value={flat} onChange={(e) => setFlat(e.target.value)} placeholder="e.g. C-503" className={inputClasses} />
            </div>

            <button onClick={handleSaveAddress} className="flex w-full items-center justify-center gap-2 bg-m-blue-dark py-4 text-xs font-bold uppercase tracking-machined text-ink hover:bg-m-blue-light">
              {isEditing ? "Save Changes" : "Save Address"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}