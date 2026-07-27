"use client";

import { useState } from "react";
import { Plus, Check, MapPin, Car, Wrench, Calendar } from "lucide-react";
import { vehicleHierarchy, savedAddresses, savedVehicles, services, timeSlots } from "@/lib/mockData";

export default function BookService() {
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
  const [error, setError] = useState("");

  // Cascading Logic for New Vehicle
  const brandsForNewCat = vehicleHierarchy.find(c => c.id === newCat)?.brands || [];
  const modelsForNewBrand = brandsForNewCat.find(b => b.id === newBrand)?.models || [];

  // Dynamic Pricing Logic
  const selectedVehicleObj = savedVehicles.find(v => v.id === selectedVehicleId);
  const getPrice = (service: typeof services[0]) => {
    if (!selectedVehicleObj) return 0;
    if (selectedVehicleObj.category === "SUV") return service.suvPrice;
    if (selectedVehicleObj.category === "Luxury") return service.luxuryPrice;
    return service.hatchbackPrice;
  };

  const getTodayDate = () => {
    const today = new Date();
    return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
  };

  const inputClasses = "w-full bg-surface-card border border-hairline text-ink p-4 text-sm font-light focus:border-m-blue-dark focus:outline-none transition-colors appearance-none";
  const labelClasses = "flex items-center gap-2 text-xs font-bold uppercase tracking-machined text-muted mb-4 mt-8";
  const cardClasses = `w-full border p-4 text-left transition-colors`;

    const handleReserve = () => {
    setError(""); // clear old errors
    
    // Check if date is in the past
    if (!selectedDate) {
      setError("Please select a date.");
      return;
    }
    
    const today = new Date();
    today.setHours(0,0,0,0); // reset time to midnight for accurate comparison
    const selected = new Date(selectedDate + "T00:00:00"); // add T00:00:00 to avoid timezone offset bugs
    
    if (selected < today) {
      setError("Past dates are not allowed. Please select today or a future date.");
      return;
    }

    alert("Booking Confirmed! Redirecting to dashboard...");
  };

  return (
    <div className="flex min-h-screen flex-col bg-canvas pb-44">
      {/* Header */}
      <div className="border-b border-hairline bg-surface-soft p-6">
        <h1 className="text-2xl font-bold uppercase text-ink">Book a Service</h1>
        <p className="mt-1 text-sm font-light text-body">Fill in the details below to reserve your wash.</p>
      </div>

      <div className="flex-1 p-6 overflow-y-auto">

        {/* ================= SECTION 1: LOCATION ================= */}
        <label className={labelClasses}><MapPin size={14} /> Location</label>
        
        <div className="space-y-3 mb-4">
          {savedAddresses.map(a => (
            <button key={a.id} onClick={() => { setSelectedAddressId(a.id); setShowAddAddress(false); }}
              className={`${cardClasses} ${selectedAddressId === a.id ? "border-m-blue-dark bg-surface-elevated" : "border-hairline bg-surface-card hover:border-body"}`}>
              <p className="text-sm font-bold text-ink">{a.flat}</p>
              <p className="text-xs font-light text-muted mt-1">{a.community}</p>
            </button>
          ))}
        </div>

        {!showAddAddress ? (
          <button onClick={() => setShowAddAddress(true)} className="flex items-center gap-2 text-xs font-bold uppercase tracking-machined text-m-blue-dark hover:text-m-blue-light mb-8">
            <Plus size={14} /> Add new address
          </button>
        ) : (
          <div className="border border-hairline bg-surface-soft p-4 mb-8 space-y-3">
            <select value={newCommunity} onChange={(e) => setNewCommunity(e.target.value)} className={inputClasses}>
              <option value="" disabled>Choose community</option>
              {["Prestige Shantiniketan", "Sobha Halcyon", "Brigade Gateway"].map(c => <option key={c} value={c}>{c}</option>)}
            </select>
            <input type="text" value={newFlat} onChange={(e) => setNewFlat(e.target.value)} placeholder="Flat Number (e.g. C-503)" className={inputClasses} />
            <button onClick={() => { setSelectedAddressId("new"); setShowAddAddress(false); }} className="bg-m-blue-dark w-full py-3 text-xs font-bold uppercase tracking-machined text-ink">Save Address</button>
          </div>
        )}

        {/* ================= SECTION 2: VEHICLE ================= */}
        <label className={labelClasses}><Car size={14} /> Vehicle</label>

        <div className="space-y-3 mb-4">
          {savedVehicles.map(v => (
            <button key={v.id} onClick={() => { setSelectedVehicleId(v.id); setShowAddVehicle(false); }}
              className={`${cardClasses} ${selectedVehicleId === v.id ? "border-m-blue-dark bg-surface-elevated" : "border-hairline bg-surface-card hover:border-body"}`}>
              <p className="text-sm font-bold text-ink">{v.brand} {v.model}</p>
              <p className="text-xs font-light text-muted mt-1">{v.reg} · {v.category}</p>
            </button>
          ))}
        </div>

        {!showAddVehicle ? (
          <button onClick={() => setShowAddVehicle(true)} className="flex items-center gap-2 text-xs font-bold uppercase tracking-machined text-m-blue-dark hover:text-m-blue-light mb-8">
            <Plus size={14} /> Add new vehicle
          </button>
        ) : (
          <div className="border border-hairline bg-surface-soft p-4 mb-8 space-y-3">
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

        {/* ================= SECTION 3: SERVICE ================= */}
        <label className={labelClasses}><Wrench size={14} /> Service</label>
        
        {selectedVehicleId ? (
          <div className="space-y-3 mb-8">
            <p className="text-xs font-light text-muted">Prices for: <span className="text-ink font-bold">{selectedVehicleObj?.category || "New Vehicle"}</span></p>
            {services.map(s => (
              <button key={s.name} onClick={() => setSelectedService(s.name)}
                className={`${cardClasses} ${selectedService === s.name ? "border-m-blue-dark bg-surface-elevated" : "border-hairline bg-surface-card hover:border-body"}`}>
                <div className="flex justify-between items-center">
                  <p className="text-sm font-bold text-ink">{s.name}</p>
                  <p className="text-xs font-bold text-m-blue-dark">₹{getPrice(s)}</p>
                </div>
              </button>
            ))}
          </div>
        ) : (
          <p className="text-xs font-light text-muted mb-8">Please select a vehicle above to see available services and pricing.</p>
        )}

        {/* ================= SECTION 4: SCHEDULE ================= */}
        <label className={labelClasses}><Calendar size={14} /> Schedule</label>

        <div className="mb-4">
          <p className="text-xs font-bold uppercase tracking-machined text-muted mb-2">Date</p>
          <input type="date" value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)} min={getTodayDate()} className={inputClasses} />
        </div>

        <div className="mb-8">
          <p className="text-xs font-bold uppercase tracking-machined text-muted mb-2">Time Slot</p>
          <div className="grid grid-cols-2 gap-3">
            {timeSlots.map(t => (
              <button key={t} onClick={() => setSelectedTime(t)}
                className={`border p-3 text-center transition-colors ${selectedTime === t ? "border-m-blue-dark bg-surface-elevated" : "border-hairline bg-surface-card hover:border-body"}`}>
                <p className="text-xs font-bold text-ink">{t}</p>
              </button>
            ))}
          </div>
        </div>

      </div>

      {/* ================= FIXED BOTTOM RESERVE BUTTON ================= */}
            {/* ================= FIXED BOTTOM RESERVE BUTTON ================= */}
      <div className="fixed bottom-[70px] left-0 right-0 z-40 border-t border-hairline bg-canvas p-4">
        {/* Error Message Display */}
        {error && (
          <p className="text-xs font-bold uppercase tracking-machined text-m-red mb-3 text-center">
            {error}
          </p>
        )}
        <button 
          onClick={handleReserve}
          className="flex w-full items-center justify-center gap-2 bg-success py-5 text-sm font-bold uppercase tracking-machined text-ink transition-colors hover:brightness-110"
        >
          Reserve Service <Check size={16} />
        </button>
      </div>
    </div>
  );
}