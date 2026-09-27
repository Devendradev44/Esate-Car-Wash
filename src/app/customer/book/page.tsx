"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Plus, Check, MapPin, Car, Wrench, Calendar, Users } from "lucide-react";
import { useStore, getTimeSlotsForCommunity } from "@/lib/store";
import { toast } from "sonner"; 
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";

export default function BookService() {
  const router = useRouter();
  const mockUser = useStore((state) => state.mockUser);

  // Read global data from Zustand Store
  const allCommunities = useStore((state) => state.communities);
  const activeCommunities = allCommunities.filter(c => c.status === "ACTIVE");
  const vehicleHierarchy = useStore((state) => state.vehicles);
  const services = useStore((state) => state.services);
  const addBooking = useStore((state) => state.addBooking); 
  const savedAddresses = useStore((state) => state.addresses).filter((a) => a.ownerId === mockUser?.id);
  const addAddress = useStore((state) => state.addAddress);
  const savedVehicles = useStore((state) => state.customerGarage).filter((v) => v.ownerId === mockUser?.id);
  const addCustomerVehicle = useStore((state) => state.addCustomerVehicle);
  const savedDrivers = useStore((state) => state.drivers).filter((d) => d.ownerId === mockUser?.id);
  const timeSlots = useStore((state) => state.timeSlots);
  const bookings = useStore((state) => state.bookings);

  // Local UI State
  const [error, setError] = useState("");
  const [showAddAddress, setShowAddAddress] = useState(false);
  const [newCommunity, setNewCommunity] = useState("");
  const [newFlat, setNewFlat] = useState("");
  const [selectedCommunity, setSelectedCommunity] = useState(() => {
    const comms = [...new Set(useStore.getState().addresses.filter((a) => a.ownerId === mockUser?.id).map(a => a.community).filter(Boolean))];
    return comms.length === 1 ? comms[0] : "";
  });
  const [selectedFlat, setSelectedFlat] = useState(() => {
    const addrs = useStore.getState().addresses.filter((a) => a.ownerId === mockUser?.id);
    const comms = [...new Set(addrs.map(a => a.community).filter(Boolean))];
    if (comms.length !== 1) return "";
    const flats = addrs.filter(a => a.community === comms[0]).map(a => a.flat);
    return flats.length === 1 ? flats[0] : "";
  });

  const [selectedVehicleId, setSelectedVehicleId] = useState(() => {
    const garage = useStore.getState().customerGarage.filter((v) => v.ownerId === mockUser?.id);
    return garage.length === 1 ? garage[0].id : "";
  });
  const [showAddVehicle, setShowAddVehicle] = useState(false);
  const [newCat, setNewCat] = useState("");
  const [newBrand, setNewBrand] = useState("");
  const [newModel, setNewModel] = useState("");
  const [newReg, setNewReg] = useState("");

  const [selectedService, setSelectedService] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");

  // Coordinate with: "MYSELF" or a saved driver id (default Myself)
  const [coordinator, setCoordinator] = useState("MYSELF");

  

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

  // Flat number validation - allows alphanumeric formats like W-3, G-9, A-101 (max 6 chars)
  const isValidFlatNumber = (flat: string) => {
    const cleanFlat = flat.replace(/-/g, "");
    return /^[A-Za-z0-9]{1,6}$/.test(cleanFlat) && flat.length <= 6;
  };

  // CAPACITY & PAST TIME LOGIC
  const selectedCommunityName = selectedCommunity;
  const selectedCommunityObj = allCommunities.find(c => c.name === selectedCommunityName);
  const slotCapacity = selectedCommunityObj?.slotCapacity || 1;
  const scheduleTimeSlots = selectedCommunityObj ? getTimeSlotsForCommunity(selectedCommunityObj.id) : timeSlots;

  // Community availability & discount logic
  const selectedCommunitySettings = selectedCommunityObj?.serviceSettings || [];
  const communitySettingFor = (serviceName: string) =>
    selectedCommunityObj
      ? (selectedCommunitySettings.find(st => st.serviceName === serviceName) || { enabled: true, discountPct: 0 })
      : { enabled: true, discountPct: 0 };
  const getDiscountPct = (serviceName: string) => Math.max(0, Math.min(100, communitySettingFor(serviceName).discountPct || 0));
  const getFinalPrice = (service: typeof services[0]) => {
    const base = getPrice(service);
    const pct = getDiscountPct(service.name);
    return pct > 0 ? Math.round(base * (1 - pct / 100)) : base;
  };
  const isServiceVisibleToCommunity = (serviceName: string) =>
    !selectedCommunityObj || communitySettingFor(serviceName).enabled !== false;

  // ----- Derived address options -----
  const addressCommunities = [...new Set(savedAddresses.map(a => a.community).filter(Boolean))];
  const flatOptions = selectedCommunity
    ? savedAddresses.filter(a => a.community === selectedCommunity).map(a => a.flat)
    : [];

  // ----- Services visible to the selected community -----
  const visibleServices = services.filter(s => s.active !== false && isServiceVisibleToCommunity(s.name));
  const selectedServiceObj = services.find(s => s.name === selectedService);
  const summaryTotal = selectedServiceObj && selectedVehicleObj ? getFinalPrice(selectedServiceObj) : 0;

  // ----- Coordinate with -----
  const myselfLabel = `${mockUser?.name || "Myself"}${mockUser?.phone ? ` · ${mockUser.phone}` : ""}`;
  const selectedDriver = savedDrivers.find(d => d.id === coordinator) || null;
  const coordinatorLabel = coordinator === "MYSELF" || !selectedDriver ? myselfLabel : `${selectedDriver.name} · ${selectedDriver.phone}`;

  // Helper to convert 12-hour to 24-hour for comparison
  const convertTo24Hour = (time12h: string) => {
    const [time, modifier] = time12h.split(" ");
    const [hours, minutes] = time.split(":");
    let h = hours;
    if (h === "12") h = "00";
    if (modifier === "PM") h = String(parseInt(h, 10) + 12);
    return `${h.padStart(2, '0')}:${minutes.padStart(2, '0')}`;
  };

  const isSlotPast = (slotLabel: string) => {
    if (selectedDate !== getTodayDate()) return false;
    const endTimeStr = slotLabel.split(" - ")[1]?.trim() || slotLabel.split("–")[1]?.trim();
    if (!endTimeStr) return false;
    const slotEndTime = new Date(`${getTodayDate()}T${convertTo24Hour(endTimeStr)}`);
    return slotEndTime < new Date();
  };

  const isSlotDisabled = (slotLabel: string) => {
    const bookedCount = bookings.filter(b => 
      b.date === selectedDate && 
      b.time === slotLabel && 
      b.community === selectedCommunityName &&
      b.bookingStatus === "BOOKED"
    ).length;

    return bookedCount >= slotCapacity;
  };

  const availableTimeSlots = [...scheduleTimeSlots]
    .sort((a, b) => a.startTime.localeCompare(b.startTime))
    .filter(t => !isSlotPast(t.label));

  const inputClasses = "w-full h-auto bg-surface-card border border-hairline text-ink p-4 text-sm font-light focus:border-yellow-dark focus:outline-none transition-colors appearance-none";
  const glassInput = "w-full h-auto rounded-xl border border-white/10 bg-white/[0.05] backdrop-blur-md px-4 py-3.5 text-sm font-semibold text-ink placeholder:text-muted focus:border-yellow-dark/60 focus:ring-2 focus:ring-yellow-dark/20 transition-all appearance-none";
  const labelClasses = "flex items-center gap-2 text-xs font-bold uppercase tracking-machined text-muted mb-4 mt-8";
  const fieldLabelClasses = "block text-[11px] font-bold uppercase tracking-machined text-muted mb-2.5";
  const stepClasses = "inline-flex items-center gap-1.5 rounded-full bg-yellow-dark/10 px-3 py-1 text-[10px] font-bold uppercase tracking-machined text-yellow-dark";
  const dialogInputClasses = "w-full h-auto rounded-xl border border-hairline bg-surface-card px-4 py-4 text-sm font-light text-ink placeholder:text-muted focus:border-yellow-dark focus:outline-none focus:ring-2 focus:ring-yellow-dark/20 transition-all appearance-none";

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

    if (!selectedCommunity || !selectedFlat) { setError("Please add your address first."); return; }

    const serviceObj = services.find(s => s.name === selectedService);
    if (!serviceObj) { setError("Please select a service."); return; }

    if (!selectedTime) {
      setError(selectedDate === getTodayDate() && availableTimeSlots.length === 0 ? "No available slots for today." : "Please select a time slot.");
      return;
    }

    const addressObj =
      savedAddresses.find(a => a.community === selectedCommunity && a.flat === selectedFlat) ||
      { community: selectedCommunity, flat: selectedFlat };
    const vehicleObj = savedVehicles.find(v => v.id === selectedVehicleId) || { 
      category: currentCategory, 
      brand: brandsForNewCat.find(b => b.name === newBrand)?.name || "", 
      model: modelsForNewBrand.find(m => m.name === newModel)?.name || "", 
      reg: newReg 
    };

    const coordinatorData =
      coordinator === "MYSELF" || !selectedDriver
        ? { type: "SELF" as const, name: mockUser?.name || "Guest", phone: mockUser?.phone || "" }
        : { type: "DRIVER" as const, name: selectedDriver.name, phone: selectedDriver.phone };

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
      amount: getFinalPrice(serviceObj),
      bookingStatus: "BOOKED",
      paymentStatus: "PENDING",
      coordinator: coordinatorData
    });

    toast.success("Booking created", {
      description: `Your ${serviceObj.name} for ${vehicleObj.brand} ${vehicleObj.model} is booked on ${selectedDate} at ${selectedTime}.`,
    });

    router.push("/customer/my-dashboard");
  };

  return (
    <div className="flex min-h-screen flex-col bg-canvas">
      <div className="border-b border-hairline bg-surface-soft p-6 md:px-8">
        <h1 className="text-2xl font-bold uppercase text-ink">Book a Service</h1>
        <p className="mt-1 text-sm font-light text-body">Fill in the details below to reserve your wash.</p>
      </div>

      <div className="relative mx-auto w-full max-w-3xl flex-1 overflow-hidden rounded-2xl border border-white/10 bg-white/[0.04] backdrop-blur-xl px-5 py-6 md:px-8">
        <div aria-hidden className="pointer-events-none absolute -right-24 -top-32 h-72 w-72 rounded-full bg-yellow-dark/10 blur-3xl" />
        <div aria-hidden className="pointer-events-none absolute -bottom-40 -left-24 h-72 w-72 rounded-full bg-yellow-dark/5 blur-3xl" />

        {/* ================= SECTION 1: COMMUNITY & FLAT (auto-select) ================= */}
        <Label className={labelClasses}><MapPin size={14} /> Address</Label>

        {savedAddresses.length === 0 ? (
          <div className="mb-8">
            <p className="rounded-xl border border-dashed border-hairline bg-white/[0.03] px-4 py-3.5 text-sm font-light text-muted">
              No saved address yet — add one so we can come to you.
            </p>
            <Button variant="ghost" onClick={() => setShowAddAddress(true)} className="mt-2 flex h-auto items-center gap-2 rounded-lg text-xs font-bold uppercase tracking-machined text-yellow-dark hover:bg-transparent hover:text-yellow-light">
              <Plus size={14} /> Add new address
            </Button>
          </div>
        ) : (
          <div className="mb-3">
            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <Label className={fieldLabelClasses}>Community</Label>
                {addressCommunities.length > 1 ? (
                  <Select
                    value={selectedCommunity}
                    onValueChange={(v) => {
                      setSelectedCommunity(v || "");
                      const flats = savedAddresses.filter(a => a.community === v).map(a => a.flat);
                      if (flats.length === 1) setSelectedFlat(flats[0]);
                      else setSelectedFlat("");
                    }}
                  >
                    <SelectTrigger className={glassInput}>
                      <SelectValue placeholder="Select Community" />
                    </SelectTrigger>
                    <SelectContent>
                      {addressCommunities.map(c => (
                        <SelectItem key={c} value={c}>{c}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                ) : (
                  <div className="flex h-auto items-center gap-2 rounded-xl border border-hairline bg-white/[0.04] px-4 py-3.5 text-sm font-semibold text-ink">
                    <MapPin size={15} className="shrink-0 text-yellow-dark" /> {addressCommunities[0] || "—"}
                  </div>
                )}
              </div>
              <div>
                <Label className={fieldLabelClasses}>Flat</Label>
                {selectedCommunity && flatOptions.length > 1 ? (
                  <Select value={selectedFlat} onValueChange={(v) => setSelectedFlat(v || "")}>
                    <SelectTrigger className={glassInput}>
                      <SelectValue placeholder="Select Flat" />
                    </SelectTrigger>
                    <SelectContent>
                      {flatOptions.map(f => (
                        <SelectItem key={f} value={f}>{f}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                ) : (
                  <div className="flex h-auto items-center gap-2 rounded-xl border border-hairline bg-white/[0.04] px-4 py-3.5 text-sm font-semibold text-ink">
                    <MapPin size={15} className="shrink-0 text-yellow-dark" />
                    {selectedFlat ||
                      (selectedCommunity ? (
                        <span className="font-light text-muted">Choose a flat</span>
                      ) : (
                        <span className="font-light text-muted">Select a community first</span>
                      ))}
                  </div>
                )}
              </div>
            </div>
            <Button variant="ghost" onClick={() => setShowAddAddress(true)} className="mt-2 flex h-auto items-center gap-2 rounded-lg text-xs font-bold uppercase tracking-machined text-yellow-dark hover:bg-transparent hover:text-yellow-light">
              <Plus size={14} /> Add new address
            </Button>
          </div>
        )}

        <Dialog open={showAddAddress} onOpenChange={setShowAddAddress}>
          <DialogContent showCloseButton className="max-h-[92vh] overflow-y-auto gap-0 rounded-2xl border border-hairline bg-surface-soft p-8 ring-0 sm:max-w-[480px]">
            <span className={stepClasses}><MapPin size={11} /> Add address</span>
            <div className="mt-3 mb-8">
              <DialogTitle className="text-2xl font-bold tracking-normal text-ink">Where should we wash?</DialogTitle>
              <DialogDescription className="mt-1.5 text-sm font-light text-muted">
                Tell us your community and flat so we can come to you.
              </DialogDescription>
            </div>
            <div className="space-y-6">
              <div>
                <Label className={fieldLabelClasses}>Community</Label>
                <Select value={newCommunity} onValueChange={(v) => setNewCommunity(v || "")}>
                  <SelectTrigger className={dialogInputClasses}>
                    <SelectValue placeholder="Choose community" />
                  </SelectTrigger>
                  <SelectContent>
                    {activeCommunities.map(c => (
                      <SelectItem key={c.name} value={c.name}>{c.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className={fieldLabelClasses}>Flat Number</Label>
                <Input
                  type="text"
                  value={newFlat}
                  onChange={(e) => {
                    const val = e.target.value.toUpperCase();
                    if (val.length <= 6) setNewFlat(val);
                  }}
                  placeholder="e.g. B-39, E-3, A-101"
                  className={`${dialogInputClasses} max-w-[40%]`}
                  maxLength={6}
                />
                <p className="mt-2 text-xs font-light text-muted">Use format like &quot;M-3&quot; or &quot;A-101&quot;.</p>
              </div>
            </div>
            <Button
              onClick={() => {
                if (!newCommunity || !newFlat) return;
                if (!isValidFlatNumber(newFlat)) {
                  setError("Invalid flat number. Use format like S-39, G-9, A-101 (max 6 chars, alphanumeric only)");
                  return;
                }
                const newAddr = { id: `a${Date.now()}`, community: newCommunity, flat: newFlat };
                addAddress(newAddr);
                setSelectedCommunity(newCommunity);
                setSelectedFlat(newFlat);
                setShowAddAddress(false);
              }}
              className="mt-8 flex h-auto w-full items-center justify-center gap-2 rounded-xl bg-yellow-dark py-4 text-xs font-bold uppercase tracking-machined text-ink hover:bg-yellow-light transition-all"
            >
              Save Address
            </Button>
          </DialogContent>
        </Dialog>

        {/* ================= COORDINATE WITH ================= */}
        <Label className={labelClasses}><Users size={14} /> Coordinate with</Label>

        <div className="space-y-3 mb-8">
          {savedDrivers.length > 0 ? (
            <Select value={coordinator} onValueChange={(v) => setCoordinator(v || "MYSELF")}>
              <SelectTrigger className={glassInput}>
                <SelectValue placeholder="Myself">
                  {(val: string) => {
                    if (val === "MYSELF" || !val) return myselfLabel;
                    const d = savedDrivers.find(x => x.id === val);
                    return d ? `${d.name} · ${d.phone}` : null;
                  }}
                </SelectValue>
              </SelectTrigger>
              <SelectContent style={{ maxHeight: "min(17rem, 60vh)" }}>
                <SelectItem value="MYSELF" label={`Myself · ${mockUser?.name || ""}`}>
                  <span>Myself</span>
                  <span className="font-light text-muted-foreground"> · {mockUser?.name || "You'll drop the car"}{mockUser?.phone ? ` · ${mockUser.phone}` : ""}</span>
                </SelectItem>
                {savedDrivers.map(d => (
                  <SelectItem key={d.id} value={d.id} label={`${d.name} · ${d.phone}`}>
                    <span>{d.name}</span>
                    <span className="font-light text-muted-foreground"> · {d.phone}</span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          ) : (
            <div className="flex h-auto items-center gap-2 rounded-xl border border-hairline bg-white/[0.04] px-4 py-3.5 text-sm font-semibold text-ink">
              <Users size={15} className="shrink-0 text-yellow-dark" /> {myselfLabel}
            </div>
          )}
          <Link href="/customer/drivers" className="flex h-auto items-center gap-2 rounded-lg text-xs font-bold uppercase tracking-machined text-yellow-dark hover:text-yellow-light">
            <Plus size={14} /> Add new driver
          </Link>
        </div>

        {/* ================= SECTION 2: VEHICLE ================= */}
        <Label className={labelClasses}><Car size={14} /> Vehicle</Label>

        <div className="space-y-3 mb-4">
          {savedVehicles.length > 0 ? (
            <Select value={selectedVehicleId} onValueChange={(v) => setSelectedVehicleId(v || "")}>
              <SelectTrigger className={glassInput}>
                <SelectValue placeholder="Select Vehicle">
                  {(val: string) => {
                    const v = savedVehicles.find(x => x.id === val);
                    return v ? `${v.brand} ${v.model} — ${v.reg} · ${v.category}` : null;
                  }}
                </SelectValue>
              </SelectTrigger>
              <SelectContent style={{ maxHeight: "min(17rem, 60vh)" }}>
                {savedVehicles.map(v => (
                  <SelectItem
                    key={v.id}
                    value={v.id}
                    label={`${v.brand} ${v.model} — ${v.reg} · ${v.category}`}
                  >
                    <span>{v.brand} {v.model}</span>
                    <span className="font-light text-muted-foreground"> · {v.reg} · {v.category}</span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          ) : (
            <p className="rounded-xl border border-dashed border-hairline bg-white/[0.03] px-4 py-3.5 text-sm font-light text-muted">
              No vehicles yet — add one to book.
            </p>
          )}
          <Button variant="ghost" onClick={() => setShowAddVehicle(true)} className="flex h-auto items-center gap-2 rounded-lg text-xs font-bold uppercase tracking-machined text-yellow-dark hover:bg-transparent hover:text-yellow-light">
            <Plus size={14} /> Add new vehicle
          </Button>
        </div>

        <Dialog open={showAddVehicle} onOpenChange={setShowAddVehicle}>
          <DialogContent showCloseButton className="max-h-[92vh] overflow-y-auto gap-0 rounded-2xl border border-hairline bg-surface-soft p-8 ring-0 sm:max-w-[520px]">
            <span className={stepClasses}><Plus size={11} /> Add vehicle</span>
            <div className="mt-3 mb-8">
              <DialogTitle className="text-2xl font-bold tracking-normal text-ink">Tell us what you drive</DialogTitle>
              <DialogDescription className="mt-1.5 text-sm font-light text-muted">
                Pick your vehicle details and registration number. Pricing adapts automatically.
              </DialogDescription>
            </div>

            <div className="space-y-6">
              <div>
                <Label className={fieldLabelClasses}>Vehicle Category <span className="text-m-red" aria-hidden="true">*</span></Label>
                <Select value={newCat} onValueChange={(v) => { setNewCat(v || ""); setNewBrand(""); setNewModel(""); }}>
                  <SelectTrigger className={dialogInputClasses}>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {vehicleHierarchy.map(c => (
                      <SelectItem key={c.name} value={c.name}>{c.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className={fieldLabelClasses}>Brand <span className="text-m-red" aria-hidden="true">*</span></Label>
                <Select value={newBrand} onValueChange={(v) => { setNewBrand(v || ""); setNewModel(""); }}>
                  <SelectTrigger className={dialogInputClasses}>
                    <SelectValue placeholder="Select brand" />
                  </SelectTrigger>
                  <SelectContent>
                    {brandsForNewCat.map(b => (
                      <SelectItem key={b.name} value={b.name}>{b.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className={fieldLabelClasses}>Model <span className="text-m-red" aria-hidden="true">*</span></Label>
                <Select value={newModel} onValueChange={(v) => setNewModel(v || "")}>
                  <SelectTrigger className={dialogInputClasses}>
                    <SelectValue placeholder="Select model" />
                  </SelectTrigger>
                  <SelectContent>
                    {modelsForNewBrand.map(m => (
                      <SelectItem key={m.name} value={m.name}>{m.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className={fieldLabelClasses}>Registration Number <span className="text-m-red" aria-hidden="true">*</span></Label>
                <Input
                  type="text"
                  value={newReg}
                  onChange={handleRegChange}
                  placeholder="AP 12 SM 1234"
                  maxLength={14}
                  aria-required
                  aria-describedby="book-reg-helper"
                  className={`${dialogInputClasses} font-mono tracking-wider`}
                />
                <p id="book-reg-helper" className="mt-2 text-xs font-light text-muted">Format: &quot;AP 12 SM 1234&quot; — upper case letters and numbers only.</p>
              </div>
            </div>

            <Button onClick={() => {
              const regRegex = /^[A-Z]{2}\s?\d{1,2}\s?[A-Z]{1,3}\s?\d{1,4}$/;
              if (!newCat || !newBrand || !newModel) {
                setError("Please select category, brand and model.");
                return;
              }
              if (!regRegex.test(newReg)) {
                setError("Invalid reg format. Use: AP 12 SM 1234");
                return;
              }
              setError("");

              const newVeh = {
                id: `v${crypto.randomUUID()}`,
                category: newCat,
                brand: newBrand,
                model: newModel,
                reg: newReg,
                isDefault: savedVehicles.length === 0,
              };
              addCustomerVehicle(newVeh);
              setSelectedVehicleId(newVeh.id);
              setNewCat(""); setNewBrand(""); setNewModel(""); setNewReg("");
              setShowAddVehicle(false);
              toast.success("Vehicle added", { description: `${newBrand} ${newModel} saved to your garage.` });
            }} className="mt-8 flex h-auto w-full items-center justify-center gap-2 rounded-xl bg-yellow-dark py-4 text-xs font-bold uppercase tracking-machined text-ink hover:bg-yellow-light transition-all">
              Save Vehicle
            </Button>
          </DialogContent>
        </Dialog>

        {/* ================= SECTION 3: SERVICE ================= */}
        <Label className={labelClasses}><Wrench size={14} /> Service</Label>

        {selectedVehicleId ? (
          <div className="space-y-3 mb-8">
            <p className="text-xs font-light text-muted">Prices for: <span className="text-ink font-bold">{currentCategory || "New Vehicle"}</span>
              {selectedCommunityObj ? <span className="ml-1 text-muted">· {selectedCommunityObj.name}</span> : null}
            </p>
            {visibleServices.length > 0 ? (
              <>
                <Select value={selectedService} onValueChange={(v) => v && setSelectedService(v)}>
                  <SelectTrigger className={glassInput}>
                    <SelectValue placeholder="Select Service" />
                  </SelectTrigger>
                  <SelectContent style={{ maxHeight: "min(17rem, 60vh)" }}>
                    {visibleServices.map(s => {
                      const base = getPrice(s);
                      const pct = getDiscountPct(s.name);
                      const final = getFinalPrice(s);
                      return (
                        <SelectItem key={s.id} value={s.name} label={`${s.name} — ₹${final}`}>
                          <span className="flex min-w-0 items-center gap-2">
                            <span className="min-w-0 truncate">{s.name}</span>
                            <span className="ml-auto shrink-0 font-bold">{pct > 0 && base > 0 ? <><s className="mr-1 font-light text-muted-foreground">₹{base}</s><span className="text-success">{pct}% off</span></> : `₹${final}`}</span>
                          </span>
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
                {selectedServiceObj && getDiscountPct(selectedServiceObj.name) > 0 && (
                  <p className="text-xs font-light text-success">{getDiscountPct(selectedServiceObj.name)}% off applied to {selectedService}.</p>
                )}
              </>
            ) : (
              <p className="rounded-xl border border-dashed border-hairline bg-white/[0.03] px-4 py-3.5 text-sm font-light text-muted">
                {selectedCommunityObj
                  ? <>No services are currently available in <span className="text-ink font-bold">{selectedCommunityObj.name}</span>. Please try another community or check back later.</>
                  : "No services are currently available. Please check back later."}
              </p>
            )}
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
          {availableTimeSlots.length === 0 ? (
            <p data-testid="no-slots-today" className="rounded-xl border border-dashed border-hairline bg-white/[0.03] px-4 py-3.5 text-sm font-light text-muted">
              No available slots for today.
            </p>
          ) : (
            <Select value={selectedTime} onValueChange={(v) => v && setSelectedTime(v)}>
              <SelectTrigger className={glassInput}>
                <SelectValue placeholder="Select Time Slot" />
              </SelectTrigger>
              <SelectContent style={{ maxHeight: "min(17rem, 60vh)" }}>
                {availableTimeSlots.map(t => {
                  const isFull = isSlotDisabled(t.label);
                  return (
                    <SelectItem key={t.id} value={t.label} label={`${t.label}${isFull ? " — Fully Booked" : ""}`} disabled={isFull}>
                      <span className="flex w-full items-center justify-between gap-3">
                        <span>{t.label}</span>
                        {isFull && <span className="text-[10px] font-bold uppercase tracking-machined text-m-red">Full</span>}
                      </span>
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
          )}
        </div>

        {/* ================= BOOKING SUMMARY ================= */}
        <div className="mb-8 mt-8 rounded-xl border border-white/10 bg-white/[0.03] p-4">
          <p className="mb-3 text-xs font-bold uppercase tracking-machined text-muted">Booking Summary</p>
          <dl className="space-y-1.5 text-sm">
            <div className="flex items-start justify-between gap-4">
              <dt className="font-light text-muted">Service</dt>
              <dd className="text-right font-semibold text-ink">{selectedService || "—"}</dd>
            </div>
            <div className="flex items-start justify-between gap-4">
              <dt className="font-light text-muted">Vehicle</dt>
              <dd className="text-right font-semibold text-ink">{selectedVehicleObj ? `${selectedVehicleObj.brand} ${selectedVehicleObj.model}` : "—"}</dd>
            </div>
            <div className="flex items-start justify-between gap-4">
              <dt className="font-light text-muted">Address</dt>
              <dd className="text-right font-semibold text-ink">{selectedCommunity ? `${selectedFlat || "—"} · ${selectedCommunity}` : "—"}</dd>
            </div>
            <div className="flex items-start justify-between gap-4">
              <dt className="font-light text-muted">Coordinate with</dt>
              <dd className="text-right font-semibold text-ink">{coordinatorLabel}</dd>
            </div>
            <div className="flex items-start justify-between gap-4">
              <dt className="font-light text-muted">Date & Time</dt>
              <dd className="text-right font-semibold text-ink">{selectedDate ? `${selectedDate} ${selectedTime ? `· ${selectedTime}` : ""}` : "—"}</dd>
            </div>
            <div className="mt-2 flex items-center justify-between gap-4 border-t border-white/10 pt-2">
              <dt className="font-light text-muted">Total</dt>
              <dd className="text-right font-bold text-yellow-dark">{summaryTotal > 0 ? `₹${summaryTotal}` : "—"}</dd>
            </div>
          </dl>
        </div>

        {/* ================= RESERVE ACTION ================= */}
        {error && (
          <p className="text-xs font-bold uppercase tracking-machined text-m-red mb-3 text-center">
            {error}
          </p>
        )}
        <Button
          onClick={handleReserve}
          className="flex w-full h-auto items-center justify-center gap-2 rounded-xl bg-success py-4 text-sm font-bold uppercase tracking-machined text-ink transition-colors hover:bg-success hover:brightness-110"
        >
          Reserve Service <Check size={16} />
        </Button>
      </div>
    </div>
  );
}
