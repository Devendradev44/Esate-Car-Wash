"use client";

import { useState } from "react";
import { Plus, Search, Edit, Trash2, X } from "lucide-react";

// 1. Define a strict Type so TypeScript knows exactly what shape the data is
type ServiceItem = {
  id: string;
  name: string;
  description: string;
  pricing: Record<string, number>; // This tells TS pricing can have any string key with a number value
};

// 2. Use the Type explicitly here
const initialServices: ServiceItem[] = [
  { 
    id: "s1", name: "Exterior Wash", description: "Basic exterior foam wash", 
    pricing: { Hatchback: 250, Sedan: 300, SUV: 350, Luxury: 600 } 
  },
  { 
    id: "s2", name: "Interior & Exterior Detail", description: "Deep clean inside and out", 
    pricing: { Hatchback: 800, Sedan: 1000, SUV: 1200, Luxury: 2500 } 
  },
];

const vehicleCategories = ["Hatchback", "Sedan", "SUV", "Luxury"];

export default function ServicesPage() {
  // 3. Apply the type to the state
  const [services, setServices] = useState<ServiceItem[]>(initialServices);
  const [searchQuery, setSearchQuery] = useState("");
  const [showModal, setShowModal] = useState(false);
  
  // Form State for New Service (Prices are strings for the input, converted later)
  const [newName, setNewName] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const [newPricing, setNewPricing] = useState<Record<string, string>>({
    Hatchback: "", Sedan: "", SUV: "", Luxury: ""
  });

  const filteredServices = services.filter(s => 
    s.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handlePricingChange = (category: string, value: string) => {
    setNewPricing(prev => ({ ...prev, [category]: value }));
  };

  // 4. Fix the Add function to properly convert strings to numbers and match the Type
  const handleAddService = () => {
    if (!newName) return;
    
    // Convert string inputs to numbers for the data table
    const numericPricing: Record<string, number> = {};
    for (const [cat, priceStr] of Object.entries(newPricing)) {
      numericPricing[cat] = Number(priceStr) || 0; // Default to 0 if left blank
    }

    const newService: ServiceItem = {
      id: `s${Date.now()}`,
      name: newName,
      description: newDesc,
      pricing: numericPricing
    };

    setServices([newService, ...services]);
    // Reset form
    setNewName("");
    setNewDesc("");
    setNewPricing({ Hatchback: "", Sedan: "", SUV: "", Luxury: "" });
    setShowModal(false);
  };


  const inputClasses = "w-full bg-surface-card border border-hairline text-ink p-4 text-sm font-light focus:border-m-blue-dark focus:outline-none transition-colors appearance-none";
  const labelClasses = "block text-xs font-bold uppercase tracking-machined text-muted mb-3";

  return (
    <div className="p-12 relative">
      {/* Add Service Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 overflow-y-auto py-10">
          <div className="w-full max-w-lg border border-hairline bg-surface-soft p-8 mx-4">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-xl font-bold uppercase text-ink">Add Service & Pricing</h3>
              <button onClick={() => setShowModal(false)} className="text-muted hover:text-ink"><X size={20} /></button>
            </div>
            
            <div className="mb-6">
              <label className={labelClasses}>Service Name</label>
              <input type="text" value={newName} onChange={(e) => setNewName(e.target.value)} placeholder="e.g. Premium Wash" className={inputClasses} />
            </div>
            
            <div className="mb-8">
              <label className={labelClasses}>Description</label>
              <input type="text" value={newDesc} onChange={(e) => setNewDesc(e.target.value)} placeholder="e.g. Deep interior detailing" className={inputClasses} />
            </div>

            {/* The Pricing Matrix (Crucial for Schema alignment!) */}
            <label className={labelClasses}>Pricing by Vehicle Category (₹)</label>
            <div className="grid grid-cols-2 gap-4 mb-8">
              {vehicleCategories.map(cat => (
                <div key={cat} className="border border-hairline bg-surface-card p-4">
                  <p className="text-xs font-bold uppercase tracking-machined text-ink mb-2">{cat}</p>
                  <input 
                    type="number" 
                    min="0"
                    value={newPricing[cat]} 
                    onChange={(e) => handlePricingChange(cat, e.target.value)} 
                    placeholder="0" 
                    className={inputClasses + " text-center"} 
                  />
                </div>
              ))}
            </div>

            <button onClick={handleAddService} className="flex w-full items-center justify-center gap-2 bg-m-blue-dark py-4 text-xs font-bold uppercase tracking-machined text-ink hover:bg-m-blue-light">
              Save Service
            </button>
          </div>
        </div>
      )}

      {/* Header & Actions */}
      <div className="flex items-center justify-between mb-10">
        <div>
          <h2 className="text-3xl font-bold uppercase tracking-normal text-ink">Services & Pricing</h2>
          <p className="mt-2 text-sm font-light text-body">Define services and their category-specific prices.</p>
        </div>
        <button onClick={() => setShowModal(true)} className="flex items-center gap-2 bg-m-blue-dark px-6 py-3 text-xs font-bold uppercase tracking-machined text-ink hover:bg-m-blue-light transition-colors">
          <Plus size={14} /> Add Service
        </button>
      </div>

      {/* Search Bar */}
      <div className="mb-6 flex items-center gap-3 border border-hairline bg-surface-card p-3">
        <Search size={16} className="text-muted" />
        <input type="text" placeholder="Search services..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className={inputClasses + " border-none bg-transparent p-0 focus:outline-none"} />
      </div>

      {/* Data Table */}
      <div className="border border-hairline overflow-x-auto">
        <table className="w-full min-w-[800px]">
          <thead className="border-b border-hairline bg-surface-soft">
            <tr>
              <th className="py-4 px-6 text-left text-xs font-bold uppercase tracking-machined text-muted">Name</th>
              <th className="py-4 px-6 text-left text-xs font-bold uppercase tracking-machined text-muted">Desc</th>
              {/* Dynamically generate category columns */}
              {vehicleCategories.map(cat => (
                <th key={cat} className="py-4 px-6 text-center text-xs font-bold uppercase tracking-machined text-muted">{cat} Price</th>
              ))}
              <th className="py-4 px-6 text-right text-xs font-bold uppercase tracking-machined text-muted">Actions</th>
            </tr>
          </thead>
          
          <tbody>
            {filteredServices.map(s => (
              <tr key={s.id} className="border-b border-hairline hover:bg-surface-card transition-colors">
                <td className="py-4 px-6 text-sm font-bold text-ink">{s.name}</td>
                <td className="py-4 px-6 text-sm font-light text-body">{s.description}</td>
                {/* Render the prices in the matrix */}
                {vehicleCategories.map(cat => (
                  <td key={cat} className="py-4 px-6 text-sm font-bold text-m-blue-dark text-center">₹{s.pricing[cat]}</td>
                ))}
                <td className="py-4 px-6 text-right">
                  <div className="flex items-center justify-end gap-3">
                    <button className="text-muted hover:text-ink transition-colors"><Edit size={16} /></button>
                    <button className="text-muted hover:text-m-red transition-colors"><Trash2 size={16} /></button>
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