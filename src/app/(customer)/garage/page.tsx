"use client";

import { useState } from "react";
import { Car, Plus, X, Check } from "lucide-react";
import { vehicleHierarchy } from "@/lib/mockData";

const savedVehicles = [
  { id: "v1", category: "SUV", brand: "Toyota", model: "Fortuner", regNumber: "TG 09 AB 1234", isDefault: true },
  { id: "v2", category: "Hatchback", brand: "Maruti Suzuki", model: "Swift", regNumber: "TG 11 CX 5678", isDefault: false },
];

export default function MyGarage() {
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedBrand, setSelectedBrand] = useState("");
  const [selectedModel, setSelectedModel] = useState("");
  const [regNumber, setRegNumber] = useState("");

  const brands = vehicleHierarchy.find(c => c.id === selectedCategory)?.brands || [];
  const models = brands.find(b => b.id === selectedBrand)?.models || [];

  const inputClasses = "w-full bg-surface-card border border-hairline text-ink p-4 text-sm font-light focus:border-m-blue-dark focus:outline-none transition-colors appearance-none";
  const labelClasses = "block text-xs font-bold uppercase tracking-machined text-muted mb-3";

  return (
    <div className="p-6 md:p-12">
      {/* Header */}
      <div className="mb-10">
        <h1 className="text-2xl md:text-3xl font-bold uppercase text-ink">My Garage</h1>
        <p className="mt-2 text-sm font-light text-body">Manage your saved vehicles</p>
      </div>

      {/* Add Vehicle Button / Form */}
      {!showAddForm ? (
        <button onClick={() => setShowAddForm(true)} className="mb-8 flex w-full items-center justify-center gap-2 border border-hairline bg-surface-card py-4 text-xs font-bold uppercase tracking-machined text-ink transition-colors hover:bg-surface-elevated">
          <Plus size={16} /> Add New Vehicle
        </button>
      ) : (
        <div className="mb-8 border border-hairline bg-surface-soft p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold uppercase text-ink">Add Vehicle</h3>
            <button onClick={() => setShowAddForm(false)} className="text-muted hover:text-ink"><X size={20} /></button>
          </div>

          <div className="mb-4">
            <label className={labelClasses}>Vehicle Category</label>
            <select value={selectedCategory} onChange={(e) => { setSelectedCategory(e.target.value); setSelectedBrand(""); setSelectedModel(""); }} className={inputClasses}>
              <option value="" disabled>Select category</option>
              {vehicleHierarchy.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
            </select>
          </div>

          {selectedCategory && (
            <div className="mb-4">
              <label className={labelClasses}>Vehicle Brand</label>
              <select value={selectedBrand} onChange={(e) => { setSelectedBrand(e.target.value); setSelectedModel(""); }} className={inputClasses}>
                <option value="" disabled>Select brand</option>
                {brands.map(brand => <option key={brand.id} value={brand.id}>{brand.name}</option>)}
              </select>
            </div>
          )}

          {selectedBrand && (
            <div className="mb-4">
              <label className={labelClasses}>Vehicle Model</label>
              <select value={selectedModel} onChange={(e) => setSelectedModel(e.target.value)} className={inputClasses}>
                <option value="" disabled>Select model</option>
                {models.map(model => <option key={model.id} value={model.id}>{model.name}</option>)}
              </select>
            </div>
          )}

          {selectedModel && (
            <div className="mb-6">
              <label className={labelClasses}>Registration Number</label>
              <input type="text" value={regNumber} onChange={(e) => setRegNumber(e.target.value)} placeholder="TG 09 AB 1234" className={inputClasses} />
            </div>
          )}

          {selectedModel && regNumber && (
            <button className="flex w-full items-center justify-center gap-2 bg-m-blue-dark py-4 text-xs font-bold uppercase tracking-machined text-ink transition-colors hover:bg-m-blue-light">
              <Check size={14} /> Save Vehicle
            </button>
          )}
        </div>
      )}

      {/* Existing Vehicles List */}
      <div className="space-y-4">
        {savedVehicles.map(v => (
          <div key={v.id} className="border border-hairline bg-surface-card p-5 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex h-10 w-10 items-center justify-center bg-surface-elevated text-muted"><Car size={20} /></div>
              <div>
                <p className="text-sm font-bold text-ink">{v.brand} {v.model}</p>
                <p className="text-xs font-light text-muted mt-1">{v.regNumber} · {v.category}</p>
              </div>
            </div>
            {v.isDefault && (
              <span className="text-[10px] font-bold uppercase tracking-machined bg-surface-elevated px-2 py-1 text-m-blue-dark">Default</span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}