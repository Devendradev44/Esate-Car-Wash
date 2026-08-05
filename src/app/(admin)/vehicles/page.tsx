"use client";
import { useState, useEffect } from "react";
import { Plus, ChevronDown, ChevronRight, Trash2, Edit, X } from "lucide-react";
import { useStore } from "@/lib/store";

const POPULAR_BRANDS = [
  "Maruti Suzuki", "Hyundai", "Tata", "Mahindra", "Toyota", "Honda", "Kia", 
  "Volkswagen", "Skoda", "Nissan", "BMW", "Mercedes-Benz", "Audi", "Renault", "Porsche"
];

export default function VehiclesPage() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const hierarchy = useStore((state) => state.vehicles);
  const addVehicleCategory = useStore((state) => state.addVehicleCategory);
  const addVehicleBrand = useStore((state) => state.addVehicleBrand);
  const addVehicleModel = useStore((state) => state.addVehicleModel);
  const deleteVehicleCategory = useStore((state) => state.deleteVehicleCategory);
  const deleteVehicleBrand = useStore((state) => state.deleteVehicleBrand);
  const deleteVehicleModel = useStore((state) => state.deleteVehicleModel);
  const updateVehicleCategory = useStore((state) => state.updateVehicleCategory);
  const updateVehicleBrand = useStore((state) => state.updateVehicleBrand);
  const updateVehicleModel = useStore((state) => state.updateVehicleModel);

  const [isOpen, setIsOpen] = useState<Record<string, boolean>>({});
  
  // Add Modal State
  const [showAddModal, setShowAddModal] = useState(false);
  const [addLevel, setAddLevel] = useState("CATEGORY");
  const [newName, setNewName] = useState("");
  const [selectedParentCat, setSelectedParentCat] = useState("");
  const [selectedParentBrand, setSelectedParentBrand] = useState("");

  // Edit Modal State (Unified for all 3 levels)
  const [showEditModal, setShowEditModal] = useState(false);
  const [editLevel, setEditLevel] = useState<"CATEGORY" | "BRAND" | "MODEL">("CATEGORY");
  const [editName, setEditName] = useState("");
  const [editIds, setEditIds] = useState<{ catId?: string, brandId?: string, modelId?: string }>({});

  if (!mounted) return null;

  // --- ADD LOGIC ---
  const handleAddItem = () => {
    if (!newName.trim()) return;
    if (addLevel === "CATEGORY") {
      addVehicleCategory({ id: `cat_${Date.now()}`, name: newName, brands: [] });
    } else if (addLevel === "BRAND" && selectedParentCat) {
      addVehicleBrand(selectedParentCat, { id: `brand_${Date.now()}`, name: newName, models: [] });
    } else if (addLevel === "MODEL" && selectedParentCat && selectedParentBrand) {
      addVehicleModel(selectedParentCat, selectedParentBrand, { id: `model_${Date.now()}`, name: newName });
    }
    setNewName(""); setSelectedParentCat(""); setSelectedParentBrand(""); setShowAddModal(false);
  };

  // --- EDIT LOGIC ---
  const openEditModal = (level: "CATEGORY" | "BRAND" | "MODEL", name: string, ids: { catId?: string, brandId?: string, modelId?: string }) => {
    setEditLevel(level);
    setEditName(name);
    setEditIds(ids);
    setShowEditModal(true);
  };

  const handleEditSave = () => {
    if (!editName.trim()) return;
    if (editLevel === "CATEGORY" && editIds.catId) {
      updateVehicleCategory(editIds.catId, editName);
    } else if (editLevel === "BRAND" && editIds.catId && editIds.brandId) {
      updateVehicleBrand(editIds.catId, editIds.brandId, editName);
    } else if (editLevel === "MODEL" && editIds.catId && editIds.brandId && editIds.modelId) {
      updateVehicleModel(editIds.catId, editIds.brandId, editIds.modelId, editName);
    }
    setShowEditModal(false);
  };

  const inputClasses = "w-full bg-surface-card border border-hairline text-ink p-4 text-sm font-light focus:border-m-blue-dark focus:outline-none transition-colors appearance-none";
  const labelClasses = "block text-xs font-bold uppercase tracking-machined text-muted mb-3";

  return (
    <div className="p-12 relative">
      {/* ADD MODAL */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
          <div className="w-full max-w-md border border-hairline bg-surface-soft p-8">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-xl font-bold uppercase text-ink">Add Vehicle Item</h3>
              <button onClick={() => setShowAddModal(false)} className="text-muted hover:text-ink"><X size={20} /></button>
            </div>
            {/* ... Add Modal Inputs (Same as you have right now) ... */}
            <div className="mb-4">
              <label className={labelClasses}>What are you adding?</label>
              <select value={addLevel} onChange={(e) => { setAddLevel(e.target.value); setNewName(""); setSelectedParentCat(""); setSelectedParentBrand(""); }} className={inputClasses}>
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
                      {[...new Set([...POPULAR_BRANDS, ...hierarchy.find(c => c.id === selectedParentCat)?.brands.map(b => b.name) || []])].sort().map(b => (
                        <option key={b} value={b}>{b}</option>
                      ))}
                    </select>
                  </div>
                )}
              </>
            )}

            <div className="mb-8">
              <label className={labelClasses}>Name</label>
              <input type="text" value={newName} onChange={(e) => setNewName(e.target.value)} placeholder="e.g. Fortuner" className={inputClasses} />
            </div>
            <button onClick={handleAddItem} className="flex w-full items-center justify-center gap-2 bg-m-blue-dark py-4 text-xs font-bold uppercase tracking-machined text-ink hover:bg-m-blue-light">Save Item</button>
          </div>
        </div>
      )}

      {/* EDIT MODAL */}
      {showEditModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
          <div className="w-full max-w-md border border-hairline bg-surface-soft p-8">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-xl font-bold uppercase text-ink">Edit {editLevel}</h3>
              <button onClick={() => setShowEditModal(false)} className="text-muted hover:text-ink"><X size={20} /></button>
            </div>
            <div className="mb-8">
              <label className={labelClasses}>Name</label>
              <input type="text" value={editName} onChange={(e) => setEditName(e.target.value)} className={inputClasses} />
            </div>
            <button onClick={handleEditSave} className="flex w-full items-center justify-center gap-2 bg-m-blue-dark py-4 text-xs font-bold uppercase tracking-machined text-ink hover:bg-m-blue-light">Save Changes</button>
          </div>
        </div>
      )}

      {/* Header & Actions */}
      <div className="flex items-center justify-between mb-10">
        <div>
          <h2 className="text-3xl font-bold uppercase tracking-normal text-ink">Vehicle Master</h2>
          <p className="mt-2 text-sm font-light text-body">Manage the 3-tier Category → Brand → Model hierarchy.</p>
        </div>
        <button onClick={() => setShowAddModal(true)} className="flex items-center gap-2 bg-m-blue-dark px-6 py-3 text-xs font-bold uppercase tracking-machined text-ink hover:bg-m-blue-light transition-colors">
          <Plus size={14} /> Add Item
        </button>
      </div>

      {/* Hierarchy Tree */}
      <div className="border border-hairline bg-surface-card">
        {hierarchy.map(cat => (
          <div key={cat.id} className="border-b border-hairline">
            {/* CATEGORY LEVEL */}
            <div className="w-full flex items-center justify-between p-6 hover:bg-surface-elevated transition-colors cursor-pointer" onClick={() => setIsOpen(prev => ({ ...prev, [cat.id]: !prev[cat.id] }))}>
              <div className="flex items-center gap-3">
                {isOpen[cat.id] ? <ChevronDown size={16} className="text-ink" /> : <ChevronRight size={16} className="text-muted" />}
                <p className="text-lg font-bold uppercase text-ink">{cat.name}</p>
              </div>
              <div className="flex gap-3">
                <button onClick={(e) => { e.stopPropagation(); openEditModal("CATEGORY", cat.name, { catId: cat.id }); }} className="text-muted hover:text-ink transition-colors"><Edit size={16} /></button>
                <button onClick={(e) => { e.stopPropagation(); deleteVehicleCategory(cat.id); }} className="text-muted hover:text-m-red transition-colors"><Trash2 size={16} /></button>
              </div>
            </div>

            {/* BRAND LEVEL */}
            {isOpen[cat.id] && (
              <div className="border-t border-hairline bg-surface-soft pl-12 min-h-[40px] flex items-center">
                {cat.brands.length === 0 ? (
                  <p className="text-xs font-light text-muted py-4">No brands added yet.</p>
                ) : (
                  <div className="w-full">
                    {cat.brands.map(brand => (
                      <div key={brand.id} className="border-t border-hairline bg-surface-soft">
                        <div className="flex items-center justify-between p-4">
                          <p className="text-sm font-bold text-ink">{brand.name}</p>
                          <div className="flex gap-3">
                            <button onClick={() => openEditModal("BRAND", brand.name, { catId: cat.id, brandId: brand.id })} className="text-muted hover:text-ink transition-colors"><Edit size={14} /></button>
                            <button onClick={() => deleteVehicleBrand(cat.id, brand.id)} className="text-muted hover:text-m-red transition-colors"><Trash2 size={14} /></button>
                          </div>
                        </div>

                        {/* MODEL LEVEL */}
                        {brand.models.map(model => (
                          <div key={model.id} className="border-t border-hairline bg-surface-soft pl-24">
                            <div className="flex items-center justify-between p-3">
                              <p className="text-xs font-light text-body">{model.name}</p>
                              <div className="flex gap-3">
                                <button onClick={() => openEditModal("MODEL", model.name, { catId: cat.id, brandId: brand.id, modelId: model.id })} className="text-muted hover:text-ink transition-colors"><Edit size={12} /></button>
                                <button onClick={() => deleteVehicleModel(cat.id, brand.id, model.id)} className="text-muted hover:text-m-red transition-colors"><Trash2 size={12} /></button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}