"use client";
import { useState, useEffect } from "react";
import { Plus, Car, Trash2, X, Edit } from "lucide-react";
import { useStore } from "@/lib/store";

export default function GaragePage() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const formatRegNumber = (value: string) => {
    return value.toUpperCase().replace(/[^A-Z0-9 ]/g, '');
  };

  const customerGarage = useStore((state) => state.customerGarage);
  const addCustomerVehicle = useStore((state) => state.addCustomerVehicle);
  const updateCustomerVehicle = useStore((state) => state.updateCustomerVehicle);
  const deleteCustomerVehicle = useStore((state) => state.deleteCustomerVehicle);
  const vehicleHierarchy = useStore((state) => state.vehicles);

  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  
  // Add State
  const [newCat, setNewCat] = useState("");
  const [newBrand, setNewBrand] = useState("");
  const [newModel, setNewModel] = useState("");
  const [newReg, setNewReg] = useState("");

  // Edit State
  const [editId, setEditId] = useState("");
  const [editReg, setEditReg] = useState("");

  if (!mounted) return null;

  const brandsForNewCat = vehicleHierarchy.find(c => c.id === newCat)?.brands || [];
  const modelsForNewBrand = brandsForNewCat.find(b => b.id === newBrand)?.models || [];

  const handleSaveVehicle = () => {
    if (!newCat || !newBrand || !newModel || !newReg) return;
    
    const catName = vehicleHierarchy.find(c => c.id === newCat)?.name || "";
    const brandName = brandsForNewCat.find(b => b.id === newBrand)?.name || "";
    const modelName = modelsForNewBrand.find(m => m.id === newModel)?.name || "";

    addCustomerVehicle({
      id: `v${Date.now()}`,
      category: catName,
      brand: brandName,
      model: modelName,
      reg: newReg,
      isDefault: false
    });

    setNewCat(""); setNewBrand(""); setNewModel(""); setNewReg("");
    setShowAddModal(false);
  };

  const openEditModal = (id: string, reg: string) => {
    setEditId(id);
    setEditReg(reg);
    setShowEditModal(true);
  };

  const handleEditSave = () => {
  const regRegex = /^[A-Z]{2}\s?\d{1,2}\s?[A-Z]{1,3}\s?\d{1,4}$/;
  if (!regRegex.test(editReg)) {
    alert("Invalid registration format. Use: AP 12 SM 1234");
    return;
  }
  updateCustomerVehicle(editId, editReg);
  setShowEditModal(false);
};

  const inputClasses = "w-full bg-surface-card border border-hairline text-ink p-4 text-sm font-light focus:border-m-blue-dark focus:outline-none transition-colors appearance-none";

  return (
    <div className="flex min-h-screen flex-col bg-canvas pb-24">
      <div className="border-b border-hairline bg-surface-soft p-6 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold uppercase text-ink">My Garage</h1>
          <p className="mt-1 text-sm font-light text-body">Manage your saved vehicles.</p>
        </div>
        <button onClick={() => setShowAddModal(true)} className="p-3 border border-m-blue-dark text-m-blue-dark hover:bg-m-blue-dark hover:text-ink transition-colors">
          <Plus size={20} />
        </button>
      </div>

      <div className="flex-1 p-6 space-y-4">
        {customerGarage.length === 0 ? (
          <div className="text-center text-muted text-sm font-light mt-20">No vehicles saved yet.</div>
        ) : (
          customerGarage.map(v => (
            <div key={v.id} className="border border-hairline bg-surface-card p-5">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-lg font-bold text-ink">{v.brand} {v.model}</p>
                  <p className="text-xs font-light text-muted mt-1">{v.reg} · {v.category}</p>
                </div>
                <div className="flex gap-3">
                  <button onClick={() => openEditModal(v.id, v.reg)} className="text-muted hover:text-ink transition-colors"><Edit size={16} /></button>
                  <button onClick={() => deleteCustomerVehicle(v.id)} className="text-muted hover:text-m-red transition-colors"><Trash2 size={16} /></button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Add Vehicle Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
          <div className="w-full max-w-md border border-hairline bg-surface-soft p-8">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-xl font-bold uppercase text-ink">Add Vehicle</h3>
              <button onClick={() => setShowAddModal(false)} className="text-muted hover:text-ink"><X size={20} /></button>
            </div>
            
            <div className="space-y-4 mb-8">
              <select value={newCat} onChange={(e) => { setNewCat(e.target.value); setNewBrand(""); setNewModel(""); }} className={inputClasses}>
                <option value="" disabled>Category</option>
                {vehicleHierarchy.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
              
              {newCat && (
                <select value={newBrand} onChange={(e) => { setNewBrand(e.target.value); setNewModel(""); }} className={inputClasses}>
                  <option value="" disabled>Brand</option>
                  {brandsForNewCat.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
                </select>
              )}

              {newBrand && (
                <select value={newModel} onChange={(e) => setNewModel(e.target.value)} className={inputClasses}>
                  <option value="" disabled>Model</option>
                  {modelsForNewBrand.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
                </select>
              )}

              {newModel && (
                <input 
                  type="text" 
                  value={newReg} 
                  onChange={(e) => setNewReg(formatRegNumber(e.target.value))} 
                  maxLength={14}
                  placeholder="AP 12 SM 1234" 
                  className={inputClasses} 
                />
              )}
            </div>

            {/* ADDED REGEX VALIDATION TO SAVE BUTTON */}
            <button 
              onClick={() => {
                const regRegex = /^[A-Z]{2}\s?\d{1,2}\s?[A-Z]{1,3}\s?\d{1,4}$/;
                if (!regRegex.test(newReg)) {
                  alert("Invalid registration format. Use: AP 12 SM 1234");
                  return;
                }
                handleSaveVehicle();
              }} 
              disabled={!newModel || !newReg} 
              className="flex w-full items-center justify-center gap-2 bg-m-blue-dark py-4 text-xs font-bold uppercase tracking-machined text-ink hover:bg-m-blue-light disabled:opacity-50"
            >
              Save Vehicle
            </button>
          </div>
        </div>
      )}

      {/* Edit Vehicle Modal */}
      {showEditModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
          <div className="w-full max-w-md border border-hairline bg-surface-soft p-8">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-xl font-bold uppercase text-ink">Edit Registration</h3>
              <button onClick={() => setShowEditModal(false)} className="text-muted hover:text-ink"><X size={20} /></button>
            </div>
            <div className="mb-8">
              <label className="block text-xs font-bold uppercase tracking-machined text-muted mb-3">Registration Number</label>
              <input 
                type="text" 
                value={editReg} 
                onChange={(e) => setEditReg(formatRegNumber(e.target.value))} 
                maxLength={14}
                className={inputClasses} 
              />   
           </div>
            <button onClick={handleEditSave} className="flex w-full items-center justify-center gap-2 bg-m-blue-dark py-4 text-xs font-bold uppercase tracking-machined text-ink hover:bg-m-blue-light">
              Save Changes
            </button>
          </div>
        </div>
      )}
    </div>
  );
}