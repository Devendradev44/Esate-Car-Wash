"use client";
import { useState, useEffect } from "react";
import { Plus, Search, Edit, Trash2, X, Wrench } from "lucide-react";
import { useStore } from "@/lib/store";

const vehicleCategories = ["Hatchback", "Sedan", "SUV", "Luxury"];

export default function ServicesPage() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const services = useStore((state) => state.services);
  const addService = useStore((state) => state.addService);
  const updateService = useStore((state) => state.updateService);
  const deleteService = useStore((state) => state.deleteService);

  const [searchQuery, setSearchQuery] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentId, setCurrentId] = useState("");
  
  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");
  const [pricing, setPricing] = useState<Record<string, string>>({
    Hatchback: "", Sedan: "", SUV: "", Luxury: ""
  });

  if (!mounted) return null;

  const filteredServices = services.filter(s => 
    s.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const openAddModal = () => {
    setIsEditing(false);
    setName(""); setDesc("");
    setPricing({ Hatchback: "", Sedan: "", SUV: "", Luxury: "" });
    setShowModal(true);
  };

  const openEditModal = (id: string, n: string, d: string, p: Record<string, number>) => {
    setIsEditing(true);
    setCurrentId(id);
    setName(n); setDesc(d);
    const stringPricing: Record<string, string> = {};
    vehicleCategories.forEach(cat => stringPricing[cat] = p[cat]?.toString() || "");
    setPricing(stringPricing);
    setShowModal(true);
  };

  const handlePricingChange = (category: string, value: string) => {
    setPricing(prev => ({ ...prev, [category]: value }));
  };

  const handleSaveService = () => {
    if (!name) return;
    const numericPricing: Record<string, number> = {};
    for (const [cat, priceStr] of Object.entries(pricing)) {
      numericPricing[cat] = Number(priceStr) || 0;
    }

    if (isEditing) {
      updateService(currentId, name, desc, numericPricing);
    } else {
      addService({ id: `s${Date.now()}`, name, description: desc, pricing: numericPricing });
    }
    setName(""); setDesc("");
    setPricing({ Hatchback: "", Sedan: "", SUV: "", Luxury: "" });
    setShowModal(false);
  };

  const inputClasses = "w-full bg-surface-card border border-hairline text-ink p-4 text-sm font-light focus:border-m-blue-dark focus:outline-none transition-colors appearance-none";
  const labelClasses = "block text-xs font-bold uppercase tracking-machined text-muted mb-3";

  return (
    <div className="p-6 md:p-12 relative">
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 overflow-y-auto py-10 p-4">
          <div className="w-full max-w-lg border border-hairline bg-surface-soft p-8">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-xl font-bold uppercase text-ink">{isEditing ? "Edit Service" : "Add Service & Pricing"}</h3>
              <button onClick={() => setShowModal(false)} className="text-muted hover:text-ink"><X size={20} /></button>
            </div>
            
            <div className="mb-6">
              <label className={labelClasses}>Service Name</label>
              <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Premium Wash" className={inputClasses} />
            </div>
            <div className="mb-8">
              <label className={labelClasses}>Description</label>
              <input type="text" value={desc} onChange={(e) => setDesc(e.target.value)} placeholder="e.g. Deep interior detailing" className={inputClasses} />
            </div>

            <label className={labelClasses}>Pricing by Vehicle Category (₹)</label>
            <div className="grid grid-cols-2 gap-4 mb-8">
              {vehicleCategories.map(cat => (
                <div key={cat} className="border border-hairline bg-surface-card p-4">
                  <p className="text-xs font-bold uppercase tracking-machined text-ink mb-2">{cat}</p>
                  <input type="number" min="0" value={pricing[cat]} onChange={(e) => handlePricingChange(cat, e.target.value)} placeholder="0" className={inputClasses + " text-center"} />
                </div>
              ))}
            </div>

            <button onClick={handleSaveService} className="flex w-full items-center justify-center gap-2 bg-m-blue-dark py-4 text-xs font-bold uppercase tracking-machined text-ink hover:bg-m-blue-light">
              {isEditing ? "Save Changes" : "Save Service"}
            </button>
          </div>
        </div>
      )}

      <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-4">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold uppercase tracking-normal text-ink">Services & Pricing</h2>
          <p className="mt-2 text-sm font-light text-body">Define services and their category-specific prices.</p>
        </div>
        <button onClick={openAddModal} className="flex items-center justify-center gap-2 bg-m-blue-dark px-6 py-3 text-xs font-bold uppercase tracking-machined text-ink hover:bg-m-blue-light transition-colors">
          <Plus size={14} /> Add Service
        </button>
      </div>

      <div className="mb-6 flex items-center gap-3 border border-hairline bg-surface-card p-3">
        <Search size={16} className="text-muted" />
        <input type="text" placeholder="Search services..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className={inputClasses + " border-none bg-transparent p-0 focus:outline-none"} />
      </div>

      {/* MOBILE CARDS */}
      <div className="md:hidden space-y-4">
        {filteredServices.map(s => (
          <div key={s.id} className="border border-hairline bg-surface-card p-4">
            <div className="flex justify-between items-start mb-3">
              <div>
                <p className="text-lg font-bold text-ink flex items-center gap-2"><Wrench size={14} className="text-muted" /> {s.name}</p>
                <p className="text-xs font-light text-muted mt-1">{s.description}</p>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => openEditModal(s.id, s.name, s.description, s.pricing)} className="text-muted hover:text-ink transition-colors"><Edit size={16} /></button>
                <button onClick={() => deleteService(s.id)} className="text-muted hover:text-m-red transition-colors"><Trash2 size={16} /></button>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2 border-t border-hairline pt-3">
              {vehicleCategories.map(cat => (
                <div key={cat} className="flex justify-between items-center">
                  <span className="text-[10px] font-bold uppercase tracking-machined text-muted">{cat}</span>
                  <span className="text-xs font-bold text-m-blue-dark">₹{s.pricing[cat] || 0}</span>
                </div>
              ))}
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
              <th className="py-4 px-6 text-left text-xs font-bold uppercase tracking-machined text-muted">Desc</th>
              {vehicleCategories.map(cat => (
                <th key={cat} className="py-4 px-6 text-center text-xs font-bold uppercase tracking-machined text-muted">{cat} Price</th>
              ))}
              <th className="py-4 px-6 text-right text-xs font-bold uppercase tracking-machined text-muted">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredServices.map(s => (
              <tr key={s.id} className="border-b border-hairline last:border-none hover:bg-surface-elevated transition-colors">
                <td className="py-4 px-6 text-sm font-bold text-ink">{s.name}</td>
                <td className="py-4 px-6 text-sm font-light text-body">{s.description}</td>
                {vehicleCategories.map(cat => (
                  <td key={cat} className="py-4 px-6 text-sm font-bold text-m-blue-dark text-center">₹{s.pricing[cat] || 0}</td>
                ))}
                <td className="py-4 px-6 text-right">
                  <div className="flex items-center justify-end gap-3">
                    <button onClick={() => openEditModal(s.id, s.name, s.description, s.pricing)} className="text-muted hover:text-ink transition-colors"><Edit size={16} /></button>
                    <button onClick={() => deleteService(s.id)} className="text-muted hover:text-m-red transition-colors"><Trash2 size={16} /></button>
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