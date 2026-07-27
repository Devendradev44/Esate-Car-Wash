"use client";

import { useState } from "react";
import { ArrowLeft, ArrowRight, Check, Plus, Car, MapPin } from "lucide-react";
// import { vehicleHierarchy } from "@/lib/mockData";
import vehicleHierarchy from "@/lib/mockData";

// Dummy Data
const communities = ["Prestige Shantiniketan", "Sobha Halcyon", "Brigade Gateway"];
const savedAddresses = [
  { id: "a1", community: "Prestige Shantiniketan", flat: "A-401" },
  { id: "a2", community: "Sobha Halcyon", flat: "B-1202" },
];
const savedVehicles = [
  { id: "v1", category: "SUV", brand: "Toyota", model: "Fortuner", reg: "TG 09 AB 1234" },
  { id: "v2", category: "Hatchback", brand: "Maruti Suzuki", model: "Swift", reg: "TG 11 CX 5678" },
];
const services = [
  { name: "Exterior Wash", hatchbackPrice: 250, suvPrice: 350, luxuryPrice: 600 },
  { name: "Interior & Exterior Detail", hatchbackPrice: 800, suvPrice: 1200, luxuryPrice: 2500 },
];
const timeSlots = ["08:00–10:00 AM", "10:00–12:00 PM", "12:00–02:00 PM", "02:00–04:00 PM", "04:00–06:00 PM"];

export default function BookService() {
  const [step, setStep] = useState(1);
  const totalSteps = 6;

  // Form State
  const [selectedAddressId, setSelectedAddressId] = useState("");
  const [showAddAddress, setShowAddAddress] = useState(false);
  const [newCommunity, setNewCommunity] = useState("");
  const [newFlat, setNewFlat] = useState("");

  const [selectedVehicleId, setSelectedVehicleId] = useState("");
  const [showAddVehicle, setShowAddVehicle] = useState(false);
  const [newCat, setNewCat] = useState("");
  const [newBrand, setNewBrand] = useState("");
  const [newModel, setNewModel] = useState("");
  const [newReg, setNewReg] = useState("");

  const [selectedService, setSelectedService] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");

  // Cascading Logic for New Vehicle
  const brandsForNewCat = vehicleHierarchy.find(c => c.id === newCat)?.brands || [];
  const modelsForNewBrand = brandsForNewCat.find(b => b.id === newBrand)?.models || [];

  // Dynamic Pricing Logic (Schema requirement!)
  const selectedVehicleObj = savedVehicles.find(v => v.id === selectedVehicleId);
  const getPrice = (service: typeof services[0]) => {
    if (!selectedVehicleObj) return 0;
    if (selectedVehicleObj.category === "SUV") return service.suvPrice;
    if (selectedVehicleObj.category === "Luxury") return service.luxuryPrice;
    return service.hatchbackPrice; // default hatchback/sedan
  };

  const getTodayDate = () => {
    const today = new Date();
    return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
  };

  const inputClasses = "w-full bg-surface-card border border-hairline text-ink p-4 text-sm font-light focus:border-m-blue-dark focus:outline-none transition-colors appearance-none";
  const labelClasses = "block text-xs font-bold uppercase tracking-machined text-muted mb-3";

  return (
    <div className="flex min-h-screen flex-col bg-canvas pb-24">
      {/* Top Progress Bar */}
      <div className="border-b border-hairline bg-surface-soft p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold uppercase text-ink">Book Service</h2>
          <span className="text-xs font-bold uppercase tracking-machined text-muted">Step {step}/{totalSteps}</span>
        </div>
        <div className="w-full h-1 bg-surface-elevated">
          <div className="h-full bg-m-blue-dark transition-all duration-500" style={{ width: `${(step / totalSteps) * 100}%` }} />
        </div>
      </div>

      {/* Step Content */}
      <div className="flex-1 p-6 overflow-y-auto">

        {/* STEP 1: Community (Simplified for flow) */}
        {step === 1 && (
          <div>
            <label className={labelClasses}>Select Community</label>
            <select value={newCommunity} onChange={(e) => setNewCommunity(e.target.value)} className={inputClasses}>
              <option value="" disabled>Choose community</option>
              {communities.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
        )}

        {/* STEP 2: Address (Inline Add) */}
        {step === 2 && (
          <div>
            <label className={labelClasses}>Select Flat / Address</label>
            <div className="space-y-3 mb-4">
              {savedAddresses.map(a => (
                <button key={a.id} onClick={() => { setSelectedAddressId(a.id); setShowAddAddress(false); }}
                  className={`w-full border p-4 text-left transition-colors ${selectedAddressId === a.id ? "border-m-blue-dark bg-surface-elevated" : "border-hairline bg-surface-card hover:border-body"}`}>
                  <p className="text-sm font-bold text-ink">{a.flat}</p>
                  <p className="text-xs font-light text-muted mt-1">{a.community}</p>
                </button>
              ))}
            </div>
            
            {/* Inline Add Address */}
            {!showAddAddress ? (
              <button onClick={() => setShowAddAddress(true)} className="flex items-center gap-2 text-xs font-bold uppercase tracking-machined text-m-blue-dark hover:text-m-blue-light">
                <Plus size={14} /> Add new address
              </button>
            ) : (
              <div className="border border-hairline bg-surface-soft p-4 mt-2">
                <input type="text" value={newFlat} onChange={(e) => setNewFlat(e.target.value)} placeholder="Flat Number (e.g. C-503)" className={inputClasses + " mb-3"} />
                <button onClick={() => { setSelectedAddressId("new"); setShowAddAddress(false); }} className="bg-m-blue-dark w-full py-3 text-xs font-bold uppercase tracking-machined text-ink">Save Address</button>
              </div>
            )}
          </div>
        )}

        {/* STEP 3: Vehicle (Inline Add with Cascading Dropdowns!) */}
        {step === 3 && (
          <div>
            <label className={labelClasses}>Select Vehicle</label>
            <div className="space-y-3 mb-4">
              {savedVehicles.map(v => (
                <button key={v.id} onClick={() => { setSelectedVehicleId(v.id); setShowAddVehicle(false); }}
                  className={`w-full border p-4 text-left transition-colors ${selectedVehicleId === v.id ? "border-m-blue-dark bg-surface-elevated" : "border-hairline bg-surface-card hover:border-body"}`}>
                  <p className="text-sm font-bold text-ink">{v.brand} {v.model}</p>
                  <p className="text-xs font-light text-muted mt-1">{v.reg} · {v.category}</p>
                </button>
              ))}
            </div>

            {/* Inline Add Vehicle (Cascading) */}
            {!showAddVehicle ? (
              <button onClick={() => setShowAddVehicle(true)} className="flex items-center gap-2 text-xs font-bold uppercase tracking-machined text-m-blue-dark hover:text-m-blue-light">
                <Plus size={14} /> Add new vehicle
              </button>
            ) : (
              <div className="border border-hairline bg-surface-soft p-4 mt-2 space-y-3">
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
                  <input type="text" value={newReg} onChange={(e) => setNewReg(e.target.value)} placeholder="TG 09 AB 1234" className={inputClasses} />
                )}

                {newModel && newReg && (
                  <button onClick={() => { setSelectedVehicleId("new"); setShowAddVehicle(false); }} className="bg-m-blue-dark w-full py-3 text-xs font-bold uppercase tracking-machined text-ink">Save Vehicle</button>
                )}
              </div>
            )}
          </div>
        )}

        {/* STEP 4: Service (DYNAMIC PRICING based on Schema!) */}
        {step === 4 && (
          <div>
            <label className={labelClasses}>Select Service</label>
            <p className="text-xs font-light text-muted mb-4">Prices based on your selected vehicle category: <span className="text-ink font-bold">{selectedVehicleObj?.category || "Unknown"}</span></p>
            <div className="space-y-3">
              {services.map(s => (
                <button key={s.name} onClick={() => setSelectedService(s.name)}
                  className={`w-full border p-4 text-left transition-colors ${selectedService === s.name ? "border-m-blue-dark bg-surface-elevated" : "border-hairline bg-surface-card hover:border-body"}`}>
                  <p className="text-sm font-bold text-ink">{s.name}</p>
                  <p className="text-xs font-bold text-m-blue-dark mt-1">₹{getPrice(s)}</p>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* STEP 5: Date */}
        {step === 5 && (
          <div>
            <label className={labelClasses}>Select Date</label>
            <input type="date" value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)} min={getTodayDate()} className={inputClasses} />
          </div>
        )}

        {/* STEP 6: Time */}
        {step === 6 && (
          <div>
            <label className={labelClasses}>Select Time Slot</label>
            <div className="grid grid-cols-2 gap-3">
              {timeSlots.map(t => (
                <button key={t} onClick={() => setSelectedTime(t)}
                  className={`border p-3 text-center transition-colors ${selectedTime === t ? "border-m-blue-dark bg-surface-elevated" : "border-hairline bg-surface-card hover:border-body"}`}>
                  <p className="text-xs font-bold text-ink">{t}</p>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-16 left-0 right-0 border-t border-hairline bg-canvas p-4 flex gap-4">
        {step > 1 && (
          <button onClick={() => setStep(step - 1)} className="flex-1 flex items-center justify-center gap-2 border border-hairline bg-surface-card py-4 text-xs font-bold uppercase tracking-machined text-ink hover:bg-surface-elevated">
            <ArrowLeft size={14} /> Back
          </button>
        )}
        
        {step < totalSteps ? (
          <button onClick={() => setStep(step + 1)} className="flex-1 flex items-center justify-center gap-2 bg-m-blue-dark py-4 text-xs font-bold uppercase tracking-machined text-ink hover:bg-m-blue-light">
            Next <ArrowRight size={14} />
          </button>
        ) : (
          <button onClick={() => alert("Booking Confirmed!")} className="flex-1 flex items-center justify-center gap-2 bg-success py-4 text-xs font-bold uppercase tracking-machined text-ink">
            Reserve <Check size={14} />
          </button>
        )}
      </div>
    </div>
  );
}