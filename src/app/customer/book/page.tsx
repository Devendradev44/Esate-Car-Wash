"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Plus, Check, MapPin, Car, Wrench, Calendar } from "lucide-react";
import { useStore } from "@/lib/store"; 

export default function BookService() {
  // --- HYDRATION FIX ---
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const router = useRouter();

  // Read global data from Zustand Store
  const allCommunities = useStore((state) => state.communities);
  const activeCommunities = allCommunities.filter(c => c.status === "ACTIVE");
  const vehicleHierarchy = useStore((state) => state.vehicles);
  const services = useStore((state) => state.services);
  const addBooking = useStore((state) => state.addBooking); 
  const savedAddresses = useStore((state) => state.addresses);
  const addAddress = useStore((state) => state.addAddress);
  const savedVehicles = useStore((state) => state.customerGarage);
  const addCustomerVehicle = useStore((state) => state.addCustomerVehicle);

  const timeSlots = ["08:00–10:00 AM", "10:00–12:00 PM", "12:00–02:00 PM", "02:00–04:00 PM", "04:00–06:00 PM"];

  // Local UI State
  const [error, setError] = useState("");
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

  // Dynamic Pricing Logic - Bulletproof version
  const selectedVehicleObj = savedVehicles.find(v => v.id === selectedVehicleId);
  const currentCategory = selectedVehicleObj?.category || vehicleHierarchy.find(c => c.id === newCat)?.name || "";

  const getPrice = (service: typeof services[0]) => {
    if (!currentCategory) return 0;
    return service.pricing[currentCategory] || 0;
  };

  const getTodayDate = () => {
    const today = new Date();
    return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
  };

  const inputClasses = "w-full bg-surface-card border border-hairline text-ink p-4 text-sm font-light focus:border-m-blue-dark focus:outline-none transition-colors appearance-none";
  const labelClasses = "flex items-center gap-2 text-xs font-bold uppercase tracking-machined text-muted mb-4 mt-8";
  const cardClasses = "w-full border p-4 text-left transition-colors";

  const handleReserve = () => {
    setError("");
    
    if (!selectedDate) { setError("Please select a date."); return; }
    const today = new Date(); today.setHours(0,0,0,0);
    const selected = new Date(selectedDate + "T00:00:00");
    if (selected < today) { setError("Past dates are not allowed. Please select today or a future date."); return; }

    const serviceObj = services.find(s => s.name === selectedService);
    if (!serviceObj) { setError("Please select a service."); return; }

    const addressObj = savedAddresses.find(a => a.id === selectedAddressId) || { community: newCommunity, flat: newFlat };
    const vehicleObj = savedVehicles.find(v => v.id === selectedVehicleId) || { 
      category: currentCategory, 
      brand: brandsForNewCat.find(b => b.id === newBrand)?.name || "", 
      model: modelsForNewBrand.find(m => m.id === newModel)?.name || "", 
      reg: newReg 
    };

    addBooking({
      id: `b${Date.now()}`,
      bookingCode: `ECW-${1000 + useStore.getState().bookings.length + 1}`,
      date: selectedDate,
      time: selectedTime,
      customer: "Rahul Sharma",
      flat: addressObj.flat || "Unknown",
      community: addressObj.community || "Unknown",
      vehicle: `${vehicleObj.brand} ${vehicleObj.model} (${vehicleObj.category})`,
      regNumber: vehicleObj.reg || "Unknown",
      service: serviceObj.name,
      amount: getPrice(serviceObj),
      bookingStatus: "BOOKED",
      paymentStatus: "PENDING"
    });

    // alert(`Booking Confirmed!\n\nVehicle: ${vehicleObj.brand} ${vehicleObj.model}\nService: ${serviceObj.name}\nAmount: ₹${getPrice(serviceObj)}\nTime: ${selectedTime}`);
    router.push("/customer/my-dashboard");
  };

  // Prevent render until mounted on client to avoid hydration mismatch
  if (!mounted) return null;

  return (
    <div className="flex min-h-screen flex-col bg-canvas pb-44">
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
              {activeCommunities.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
            </select>
            <input type="text" value={newFlat} onChange={(e) => setNewFlat(e.target.value)} placeholder="Flat Number (e.g. C-503)" className={inputClasses} />
            <button onClick={() => { 
              if (!newCommunity || !newFlat) return;
              const newAddr = { id: `a${Date.now()}`, community: newCommunity, flat: newFlat };
              addAddress(newAddr);
              setSelectedAddressId(newAddr.id); 
              setShowAddAddress(false); 
            }} className="bg-m-blue-dark w-full py-3 text-xs font-bold uppercase tracking-machined text-ink">Save Address</button>
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
              <button onClick={() => { 
                const catName = vehicleHierarchy.find(c => c.id === newCat)?.name || "";
                const brandName = brandsForNewCat.find(b => b.id === newBrand)?.name || "";
                const modelName = modelsForNewBrand.find(m => m.id === newModel)?.name || "";
                
                const newVeh = { 
                  id: `v${Date.now()}`, 
                  category: catName, 
                  brand: brandName, 
                  model: modelName, 
                  reg: newReg, 
                  isDefault: false 
                };
                addCustomerVehicle(newVeh);
                setSelectedVehicleId(newVeh.id); 
                setShowAddVehicle(false); 
              }} className="bg-m-blue-dark w-full py-3 text-xs font-bold uppercase tracking-machined text-ink">Save Vehicle</button>
            )}
          </div>
        )}

        {/* ================= SECTION 3: SERVICE ================= */}
        <label className={labelClasses}><Wrench size={14} /> Service</label>
        
        {selectedVehicleId ? (
          <div className="space-y-3 mb-8">
            <p className="text-xs font-light text-muted">Prices for: <span className="text-ink font-bold">{currentCategory || "New Vehicle"}</span></p>
            {services.map(s => (
              <button key={s.id} onClick={() => setSelectedService(s.name)}
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
      <div className="fixed bottom-[70px] left-0 right-0 z-40 border-t border-hairline bg-canvas p-4">
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