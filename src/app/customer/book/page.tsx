"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Check, MapPin, Car, Wrench, Calendar } from "lucide-react";
import { useStore, getTimeSlotsForCommunity } from "@/lib/store"; 
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";

export default function BookService() {
  const router = useRouter();
  const mockUser = useStore((state) => state.mockUser);

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
  const timeSlots = useStore((state) => state.timeSlots);
  const bookings = useStore((state) => state.bookings);

  // Local UI State
  const [error, setError] = useState("");
  const [selectedAddressId, setSelectedAddressId] = useState("");
  const [showAddAddress, setShowAddAddress] = useState(false);
  const [newCommunity, setNewCommunity] = useState("");
  const [newFlat, setNewFlat] = useState("");
  const [selectedCommunity, setSelectedCommunity] = useState("");
  const [selectedFlat, setSelectedFlat] = useState("");

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
  const brandsForNewCat = vehicleHierarchy.find(c => c.name === newCat)?.brands || [];
  const modelsForNewBrand = brandsForNewCat.find(b => b.name === newBrand)?.models || [];

  // Dynamic Pricing Logic - Bulletproof version
  const selectedVehicleObj = savedVehicles.find(v => v.id === selectedVehicleId);
  const currentCategory = selectedVehicleObj?.category || vehicleHierarchy.find(c => c.name === newCat)?.name || "";

  const getPrice = (service: typeof services[0]) => {
    if (!currentCategory) return 0;
    return service.pricing[currentCategory] || 0;
  };

  const getTodayDate = () => {
    const today = new Date();
    return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
  };

  // Flat number validation - allows alphanumeric formats like M-39, M39, A-101 (max 6 chars)
  const isValidFlatNumber = (flat: string) => {
    const cleanFlat = flat.replace(/-/g, "");
    return /^[A-Za-z0-9]{1,6}$/.test(cleanFlat) && flat.length <= 6;
  };

  // CAPACITY & PAST TIME LOGIC
  const selectedCommunityName = savedAddresses.find(a => a.id === selectedAddressId)?.community || newCommunity;
  const selectedCommunityObj = allCommunities.find(c => c.name === selectedCommunityName);
  const slotCapacity = selectedCommunityObj?.slotCapacity || 1;
  const scheduleTimeSlots = selectedCommunityObj ? getTimeSlotsForCommunity(selectedCommunityObj.id) : timeSlots;

  const isSlotDisabled = (slotLabel: string) => {
    // 1. Check past time
    if (selectedDate === getTodayDate()) {
      const endTimeStr = slotLabel.split(" - ")[1]?.trim() || slotLabel.split("–")[1]?.trim();
      if (endTimeStr) {
        const slotEndTime = new Date(`${getTodayDate()}T${convertTo24Hour(endTimeStr)}`);
        if (slotEndTime < new Date()) return true;
      }
    }

    // 2. Check capacity
    const bookedCount = bookings.filter(b => 
      b.date === selectedDate && 
      b.time === slotLabel && 
      b.community === selectedCommunityName &&
      b.bookingStatus === "BOOKED"
    ).length;

    return bookedCount >= slotCapacity;
  };

  // Helper to convert 12-hour to 24-hour for comparison
  const convertTo24Hour = (time12h: string) => {
    const [time, modifier] = time12h.split(" ");
    const [hours, minutes] = time.split(":");
    let h = hours;
    if (h === "12") h = "00";
    if (modifier === "PM") h = String(parseInt(h, 10) + 12);
    return `${h.padStart(2, '0')}:${minutes.padStart(2, '0')}`;
  };

  const inputClasses = "w-full h-auto bg-surface-card border border-hairline text-ink p-4 text-sm font-light focus:border-yellow-dark focus:outline-none transition-colors appearance-none";
  const labelClasses = "flex items-center gap-2 text-xs font-bold uppercase tracking-machined text-muted mb-4 mt-8";
  const cardClasses = "w-full h-auto rounded-none border p-4 text-left transition-colors";

  const formatRegNumber = (value: string) => {
    return value.toUpperCase().replace(/[^A-Z0-9 ]/g, '');
  };

  const handleRegChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewReg(formatRegNumber(e.target.value));
  };  

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
      id: `b${crypto.randomUUID()}`,
      bookingCode: `BK-${1001 + useStore.getState().bookings.length}`,
      date: selectedDate,
      time: selectedTime,
      customer: mockUser?.name || "Guest", 
      flat: addressObj.flat || "Unknown",
      community: addressObj.community || "Unknown",
      vehicle: `${vehicleObj.brand} ${vehicleObj.model} (${vehicleObj.category})`,
      regNumber: vehicleObj.reg || "Unknown",
      service: serviceObj.name,
      amount: getPrice(serviceObj),
      bookingStatus: "BOOKED",
      paymentStatus: "PENDING"
    });

    router.push("/customer/my-dashboard");
  };

  return (
    <div className="flex min-h-screen flex-col bg-canvas pb-44 md:pb-32">
      <div className="border-b border-hairline bg-surface-soft p-6">
        <h1 className="text-2xl font-bold uppercase text-ink">Book a Service</h1>
        <p className="mt-1 text-sm font-light text-body">Fill in the details below to reserve your wash.</p>
      </div>

      <div className="flex-1 p-6 overflow-y-auto">

        {/* ================= SECTION 1: COMMUNITY & FLAT ================= */}
        <Label className={labelClasses}><MapPin size={14} /> Community & Flat</Label>
        
        {/* Community Dropdown */}
        <Select value={selectedCommunity} onValueChange={(v) => { setSelectedCommunity(v || ""); setSelectedFlat(""); setSelectedAddressId(""); }}>
          <SelectTrigger className={inputClasses}>
            <SelectValue placeholder="Select Community" />
          </SelectTrigger>
          <SelectContent>
            {activeCommunities.map(c => (
              <SelectItem key={c.name} value={c.name}>{c.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Flat Dropdown - shows flats for selected community */}
        {selectedCommunity && (
          <Select value={selectedFlat} onValueChange={(v) => { setSelectedFlat(v || ""); setSelectedAddressId(""); }}>
            <SelectTrigger className={inputClasses}>
              <SelectValue placeholder="Select Flat" />
            </SelectTrigger>
            <SelectContent>
              {savedAddresses.filter(a => a.community === selectedCommunity).map(a => (
                <SelectItem key={a.flat} value={a.flat}>{a.flat}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}

        {/* Add new address */}
        {!showAddAddress ? (
          <Button variant="ghost" onClick={() => setShowAddAddress(true)} className="flex h-auto items-center gap-2 rounded-none mb-8 text-xs font-bold uppercase tracking-machined text-yellow-dark hover:bg-transparent hover:text-yellow-light">
            <Plus size={14} /> Add new address
          </Button>
        ) : (
          <Card className="gap-0 space-y-3 rounded-none border border-hairline bg-surface-soft p-4 mb-8 ring-0">
            <Select value={newCommunity} onValueChange={(v) => setNewCommunity(v || "")}>
              <SelectTrigger className={inputClasses}>
                <SelectValue placeholder="Choose community" />
              </SelectTrigger>
              <SelectContent>
                {activeCommunities.map(c => (
                  <SelectItem key={c.name} value={c.name}>{c.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Input 
              type="text" 
              value={newFlat} 
              onChange={(e) => {
                const val = e.target.value.toUpperCase();
                if (val.length <= 6) setNewFlat(val);
              }} 
              placeholder="Flat Number (e.g. M-39, M39, A-101)"
              className={inputClasses}
              maxLength={6}
            />
            <Button
              onClick={() => {
                if (!newCommunity || !newFlat) return;
                if (!isValidFlatNumber(newFlat)) {
                  setError("Invalid flat number. Use format like M-39, M39, A-101 (max 6 chars, alphanumeric only)");
                  return;
                }
                const newAddr = { id: `a${Date.now()}`, community: newCommunity, flat: newFlat };
                addAddress(newAddr);
                setSelectedAddressId(newAddr.id);
                setShowAddAddress(false);
              }}
              className="w-full h-auto rounded-none bg-yellow-dark py-3 text-xs font-bold uppercase tracking-machined text-ink hover:bg-yellow-light"
            >
              Save Address
            </Button>
          </Card>
        )}

        {/* ================= SECTION 2: VEHICLE ================= */}
        <Label className={labelClasses}><Car size={14} /> Vehicle</Label>

        <div className="space-y-3 mb-4">
          {savedVehicles.map(v => (
            <Button key={v.id} variant="outline" onClick={() => { setSelectedVehicleId(v.id); setShowAddVehicle(false); }}
              className={`${cardClasses} ${selectedVehicleId === v.id ? "border-yellow-dark bg-surface-elevated hover:bg-surface-elevated" : "border-hairline bg-surface-card hover:border-body hover:bg-surface-card"}`}>
              <p className="text-sm font-bold text-ink">{v.brand} {v.model}</p>
              <p className="text-xs font-light text-muted mt-1">{v.reg} · {v.category}</p>
            </Button>
          ))}
        </div>

        {!showAddVehicle ? (
          <Button variant="ghost" onClick={() => setShowAddVehicle(true)} className="flex h-auto items-center gap-2 rounded-none mb-8 text-xs font-bold uppercase tracking-machined text-yellow-dark hover:bg-transparent hover:text-yellow-light">
            <Plus size={14} /> Add new vehicle
          </Button>
        ) : (
          <Card className="gap-0 space-y-3 rounded-none border border-hairline bg-surface-soft p-4 mb-8 ring-0">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <Select value={newCat} onValueChange={(v) => { setNewCat(v || ""); setNewBrand(""); setNewModel(""); }}>
                <SelectTrigger className={inputClasses}>
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  {vehicleHierarchy.map(c => (
                    <SelectItem key={c.name} value={c.name}>{c.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {newCat && (
                <Select value={newBrand} onValueChange={(v) => { setNewBrand(v || ""); setNewModel(""); }}>
                  <SelectTrigger className={inputClasses}>
                    <SelectValue placeholder="Brand" />
                  </SelectTrigger>
                  <SelectContent>
                    {brandsForNewCat.map(b => (
                      <SelectItem key={b.name} value={b.name}>{b.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}

              {newBrand && (
                <Select value={newModel} onValueChange={(v) => setNewModel(v || "")}>
                  <SelectTrigger className={inputClasses}>
                    <SelectValue placeholder="Model" />
                  </SelectTrigger>
                  <SelectContent>
                    {modelsForNewBrand.map(m => (
                      <SelectItem key={m.name} value={m.name}>{m.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
              <Input 
                type="text" 
                value={newReg} 
                onChange={handleRegChange} 
                placeholder="AP 12 SM 1234" 
                maxLength={14}
                className={inputClasses} 
              />
            </div>
            <Button onClick={() => { 
              const regRegex = /^[A-Z]{2}\s?\d{1,2}\s?[A-Z]{1,3}\s?\d{1,4}$/;
              if (!regRegex.test(newReg)) {
                setError("Invalid reg format. Use: AP 12 SM 1234");
                return;
              }
              setError("");
              
              const newVeh = { 
                id: `v${Date.now()}`, 
                category: newCat, 
                brand: newBrand, 
                model: newModel, 
                reg: newReg, 
                isDefault: false 
              };
              addCustomerVehicle(newVeh);
              setSelectedVehicleId(newVeh.id); 
              setShowAddVehicle(false); 
            }} className="w-full h-auto rounded-none bg-yellow-dark py-3 text-xs font-bold uppercase tracking-machined text-ink hover:bg-yellow-light">Save Vehicle</Button>
          </Card>
        )}

        {/* ================= SECTION 3: SERVICE ================= */}
        <Label className={labelClasses}><Wrench size={14} /> Service</Label>
        
        {selectedVehicleId ? (
          <div className="space-y-3 mb-8">
            <p className="text-xs font-light text-muted">Prices for: <span className="text-ink font-bold">{currentCategory || "New Vehicle"}</span></p>
            {services.map(s => (
              <Button key={s.id} variant="outline" onClick={() => setSelectedService(s.name)}
                className={`${cardClasses} ${selectedService === s.name ? "border-yellow-dark bg-surface-elevated hover:bg-surface-elevated" : "border-hairline bg-surface-card hover:border-body hover:bg-surface-card"}`}>
                <div className="flex justify-between items-center w-full">
                  <p className="text-sm font-bold text-ink">{s.name}</p>
                  <p className="text-xs font-bold text-yellow-dark">₹{getPrice(s)}</p>
                </div>
              </Button>
            ))}
          </div>
        ) : (
          <p className="text-xs font-light text-muted mb-8">Please select a vehicle above to see available services and pricing.</p>
        )}

        {/* ================= SECTION 4: SCHEDULE ================= */}
        <Label className={labelClasses}><Calendar size={14} /> Schedule</Label>

        <div className="mb-4">
          <p className="text-xs font-bold uppercase tracking-machined text-muted mb-2">Date</p>
          <Input 
            type="date" 
            value={selectedDate} 
            onChange={(e) => setSelectedDate(e.target.value)} 
            min={getTodayDate()} 
            max={`${new Date().getFullYear() + 1}-12-31`}
            className={inputClasses + " [color-scheme:dark]"} 
          />
        </div>

        <div className="mb-8">
          <p className="text-xs font-bold uppercase tracking-machined text-muted mb-2">Time Slot</p>
          <div className="grid grid-cols-2 gap-3">
            {[...scheduleTimeSlots].sort((a, b) => a.startTime.localeCompare(b.startTime)).map(t => {
              const isFull = isSlotDisabled(t.label);
              return (
                <Button 
                  key={t.id} 
                  variant="outline"
                  onClick={() => setSelectedTime(t.label)}
                  disabled={isFull} 
                  className={`h-auto rounded-none border p-3 text-center transition-colors ${
                    selectedTime === t.label ? "border-yellow-dark bg-surface-elevated hover:bg-surface-elevated" : "border-hairline bg-surface-card hover:border-body hover:bg-surface-card"
                  } ${isFull ? "cursor-not-allowed disabled:opacity-30 hover:border-hairline" : ""}`}
                >
                  <p className="text-xs font-bold text-ink">{t.label}</p>
                  {isFull && <p className="text-[9px] text-m-red mt-1">Fully Booked</p>}
                </Button>
              );
            })}
          </div>
        </div>

      </div>

      {/* ================= FIXED BOTTOM RESERVE BUTTON ================= */}
      <div className="fixed bottom-[60px] md:bottom-0 left-0 right-0 z-40 border-t border-hairline bg-canvas p-4 ">
        {error && (
          <p className="text-xs font-bold uppercase tracking-machined text-m-red mb-3 text-center">
            {error}
          </p>
        )}
        <Button 
          onClick={handleReserve}
          className="flex w-full h-auto items-center justify-center gap-2 rounded-none bg-success py-5 text-sm font-bold uppercase tracking-machined text-ink transition-colors hover:bg-success hover:brightness-110"
        >
          Reserve Service <Check size={16} />
        </Button>
      </div>
    </div>
  );
}
