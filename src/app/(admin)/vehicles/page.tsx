"use client";

import { useState } from "react";
import { Plus, ChevronDown, ChevronRight, Trash2, Edit, X } from "lucide-react";

// Mock Data mapped to Prisma 3-tier hierarchy
const initialHierarchy = [
  { 
    id: "cat_suv", name: "SUV", isOpen: false,
    brands: [
      { id: "brand_toyota", name: "Toyota", models: [{ id: "model_fortuner", name: "Fortuner" }] },
      { id: "brand_hyundai", name: "Hyundai", models: [{ id: "model_creta", name: "Creta" }] },
    ]
  },
  { 
    id: "cat_hatchback", name: "Hatchback", isOpen: false,
    brands: [
      { id: "brand_maruti", name: "Maruti Suzuki", models: [{ id: "model_swift", name: "Swift" }, { id: "model_baleno", name: "Baleno" }] },
    ]
  },
  { 
    id: "cat_luxury", name: "Luxury", isOpen: false,
    brands: [
      { id: "brand_bmw", name: "BMW", models: [{ id: "model_3series", name: "3 Series" }] },
    ]
  },
];

export default function VehiclesPage() {
  const [hierarchy, setHierarchy] = useState(initialHierarchy);
  const [showModal, setShowModal] = useState(false);
  
  // Form State
  const [addLevel, setAddLevel] = useState("CATEGORY"); // CATEGORY | BRAND | MODEL
  const [newName, setNewName] = useState("");
  const [selectedParentCat, setSelectedParentCat] = useState("");
  const [selectedParentBrand, setSelectedParentBrand] = useState("");

  const toggleCategory = (catId: string) => {
    setHierarchy(hierarchy.map(c => c.id === catId ? { ...c, isOpen: !c.isOpen } : c));
  };

  const handleAddItem = () => {
    if (!newName) return;

    if (addLevel === "CATEGORY") {
      const newCat = { id: `cat_${Date.now()}`, name: newName, isOpen: false, brands: [] };
      setHierarchy([...hierarchy, newCat]);
    } 
    else if (addLevel === "BRAND" && selectedParentCat) {
      const newBrand = { id: `brand_${Date.now()}`, name: newName, models: [] };
      setHierarchy(hierarchy.map(c => c.id === selectedParentCat ? { ...c, brands: [...c.brands, newBrand] } : c));
    }
    else if (addLevel === "MODEL" && selectedParentBrand) {
      const newModel = { id: `model_${Date.now()}`, name: newName };
      setHierarchy(hierarchy.map(c => 
        c.brands.some(b => b.id === selectedParentBrand) 
          ? { ...c, brands: c.brands.map(b => b.id === selectedParentBrand ? { ...b, models: [...b.models, newModel] } : b) } 
          : c
      ));
    }

    setNewName(""); setSelectedParentCat(""); setSelectedParentBrand(""); setShowModal(false);
  };

  const inputClasses = "w-full bg-surface-card border border-hairline text-ink p-4 text-sm font-light focus:border-m-blue-dark focus:outline-none transition-colors appearance-none";
  const labelClasses = "block text-xs font-bold uppercase tracking-machined text-muted mb-3";

  return (
    <div className="p-12 relative">
      {/* Add Item Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80">
          <div className="w-full max-w-md border border-hairline bg-surface-soft p-8 mx-4">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-xl font-bold uppercase text-ink">Add Vehicle Item</h3>
              <button onClick={() => setShowModal(false)} className="text-muted hover:text-ink"><X size={20} /></button>
            </div>

            <div className="mb-4">
              <label className={labelClasses}>What are you adding?</label>
              <select value={addLevel} onChange={(e) => setAddLevel(e.target.value)} className={inputClasses}>
                <option value="CATEGORY">Category (e.g. SUV)</option>
                <option value="BRAND">Brand (e.g. Toyota)</option>
                <option value="MODEL">Model (e.g. Fortuner)</option>
              </select>
            </div>

            {addLevel === "BRAND" && (
              <div className="mb-4">
                <label className={labelClasses}>Under which Category?</label>
                <select value={selectedParentCat} onChange={(e) => setSelectedParentCat(e.target.value)} className={inputClasses}>
                  <option value="" disabled>Select category</option>
                  {hierarchy.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
            )}

            {addLevel === "MODEL" && (
              <>
                <div className="mb-4">
                  <label className={labelClasses}>Under which Category?</label>
                  <select value={selectedParentCat} onChange={(e) => { setSelectedParentCat(e.target.value); setSelectedParentBrand(""); }} className={inputClasses}>
                    <option value="" disabled>Select category</option>
                    {hierarchy.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>
                {selectedParentCat && (
                  <div className="mb-4">
                    <label className={labelClasses}>Under which Brand?</label>
                    <select value={selectedParentBrand} onChange={(e) => setSelectedParentBrand(e.target.value)} className={inputClasses}>
                      <option value="" disabled>Select brand</option>
                      {hierarchy.find(c => c.id === selectedParentCat)?.brands.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
                    </select>
                  </div>
                )}
              </>
            )}

            <div className="mb-8">
              <label className={labelClasses}>Name</label>
              <input type="text" value={newName} onChange={(e) => setNewName(e.target.value)} placeholder="e.g. Fortuner" className={inputClasses} />
            </div>

            <button onClick={handleAddItem} className="flex w-full items-center justify-center gap-2 bg-m-blue-dark py-4 text-xs font-bold uppercase tracking-machined text-ink hover:bg-m-blue-light">
              Save Item
            </button>
          </div>
        </div>
      )}

      {/* Header & Actions */}
      <div className="flex items-center justify-between mb-10">
        <div>
          <h2 className="text-3xl font-bold uppercase tracking-normal text-ink">Vehicle Master</h2>
          <p className="mt-2 text-sm font-light text-body">Manage the 3-tier Category → Brand → Model hierarchy.</p>
        </div>
        <button onClick={() => setShowModal(true)} className="flex items-center gap-2 bg-m-blue-dark px-6 py-3 text-xs font-bold uppercase tracking-machined text-ink hover:bg-m-blue-light transition-colors">
          <Plus size={14} /> Add Item
        </button>
      </div>

      {/* Hierarchy Tree */}
      <div className="border border-hairline bg-surface-card">
        {hierarchy.map(cat => (
          <div key={cat.id} className="border-b border-hairline">
            {/* CATEGORY LEVEL - FIXED: Outer wrapper is a <div>, not a <button> */}
            <div className="w-full flex items-center justify-between p-6 hover:bg-surface-elevated transition-colors">
              
              {/* Left side: The clickable toggle button */}
              <button onClick={() => toggleCategory(cat.id)} className="flex items-center gap-3 flex-1 text-left">
                {cat.isOpen ? <ChevronDown size={16} className="text-ink" /> : <ChevronRight size={16} className="text-muted" />}
                <p className="text-lg font-bold uppercase text-ink">{cat.name}</p>
              </button>
              
              {/* Right side: Separate action buttons (NOT nested inside the toggle button) */}
              <div className="flex gap-3 ml-4">
                <button className="text-muted hover:text-ink transition-colors"><Edit size={16} /></button>
                <button className="text-muted hover:text-m-red transition-colors"><Trash2 size={16} /></button>
              </div>
            </div>

            {/* BRAND LEVEL (Expandable) */}
            {cat.isOpen && cat.brands.map(brand => (
              <div key={brand.id} className="border-t border-hairline bg-surface-soft pl-12">
                <div className="flex items-center justify-between p-4">
                  <p className="text-sm font-bold text-ink">{brand.name}</p>
                  <div className="flex gap-3">
                    <button className="text-muted hover:text-ink transition-colors"><Edit size={14} /></button>
                    <button className="text-muted hover:text-m-red transition-colors"><Trash2 size={14} /></button>
                  </div>
                </div>

                {/* MODEL LEVEL (Nested under Brand) */}
                {brand.models.map(model => (
                  <div key={model.id} className="border-t border-hairline bg-surface-soft pl-24">
                    <div className="flex items-center justify-between p-3">
                      <p className="text-xs font-light text-body">{model.name}</p>
                      <div className="flex gap-3">
                        <button className="text-muted hover:text-ink transition-colors"><Edit size={12} /></button>
                        <button className="text-muted hover:text-m-red transition-colors"><Trash2 size={12} /></button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}