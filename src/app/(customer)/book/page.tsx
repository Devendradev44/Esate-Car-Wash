"use client";

import { useState } from "react";
import { ArrowLeft, ArrowRight, Check } from "lucide-react";

// Dummy Data for the MVP (We will replace this with Mock API calls later)
const communities = ["Prestige Shantiniketan", "Sobha Halcyon", "Brigade Gateway"];
const vehicles = [
  { id: "1", name: "Toyota Fortuner (SUV)", reg: "TS09AB1234" },
  { id: "2", name: "Honda City (Sedan)", reg: "KA01MG5678" },
];
const services = [
  { name: "Exterior Wash", price: 350 },
  { name: "Interior & Exterior Detail", price: 1200 },
];
const timeSlots = ["08:00–10:00 AM", "10:00–12:00 PM", "12:00–02:00 PM", "02:00–04:00 PM", "04:00–06:00 PM"];

export default function BookService() {
  const [step, setStep] = useState(1);
  const totalSteps = 6;

  // Form State
  const [selectedCommunity, setSelectedCommunity] = useState("");
  const [flatNumber, setFlatNumber] = useState("");
  const [selectedVehicle, setSelectedVehicle] = useState("");
  const [selectedService, setSelectedService] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");

  const handleNext = () => {
    if (step < totalSteps) setStep(step + 1);
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  // BMW M Form Input Classes
  const inputClasses = "w-full bg-surface-card border border-hairline text-ink p-4 text-sm font-light focus:border-m-blue-dark focus:outline-none transition-colors";
  const labelClasses = "block text-xs font-bold uppercase tracking-machined text-muted mb-3";

  return (
    <div className="flex min-h-screen flex-col bg-canvas pb-24">
      {/* Top Progress Bar & Header */}
      <div className="border-b border-hairline bg-surface-soft p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold uppercase text-ink">Book Service</h2>
          <span className="text-xs font-bold uppercase tracking-machined text-muted">
            Step {step}/{totalSteps}
          </span>
        </div>
        <div className="w-full h-1 bg-surface-elevated">
          <div 
            className="h-full bg-m-blue-dark transition-all duration-500"
            style={{ width: `${(step / totalSteps) * 100}%` }}
          />
        </div>
      </div>

      {/* Step Content Area */}
      <div className="flex-1 p-6">
        
        {/* Step 1: Community */}
        {step === 1 && (
          <div>
            <label className={labelClasses}>Select Community</label>
            <select 
              value={selectedCommunity} 
              onChange={(e) => setSelectedCommunity(e.target.value)}
              className={inputClasses}
            >
              <option value="" disabled>Choose your community</option>
              {communities.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
        )}

        {/* Step 2: Flat Number */}
        {step === 2 && (
          <div>
            <label className={labelClasses}>Flat Number</label>
            <input 
              type="text" 
              value={flatNumber}
              onChange={(e) => setFlatNumber(e.target.value)}
              placeholder="e.g. A-401"
              className={inputClasses}
            />
          </div>
        )}

        {/* Step 3: Vehicle */}
        {step === 3 && (
          <div>
            <label className={labelClasses}>Select Vehicle</label>
            <div className="space-y-3">
              {vehicles.map(v => (
                <button 
                  key={v.id}
                  onClick={() => setSelectedVehicle(v.id)}
                  className={`w-full border p-4 text-left transition-colors ${
                    selectedVehicle === v.id 
                      ? "border-m-blue-dark bg-surface-elevated" 
                      : "border-hairline bg-surface-card hover:border-body"
                  }`}
                >
                  <p className="text-sm font-bold text-ink">{v.name}</p>
                  <p className="text-xs font-light text-muted mt-1">{v.reg}</p>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 4: Service */}
        {step === 4 && (
          <div>
            <label className={labelClasses}>Select Service</label>
            <div className="space-y-3">
              {services.map(s => (
                <button 
                  key={s.name}
                  onClick={() => setSelectedService(s.name)}
                  className={`w-full border p-4 text-left transition-colors ${
                    selectedService === s.name 
                      ? "border-m-blue-dark bg-surface-elevated" 
                      : "border-hairline bg-surface-card hover:border-body"
                  }`}
                >
                  <p className="text-sm font-bold text-ink">{s.name}</p>
                  <p className="text-xs font-bold text-m-blue-dark mt-1">₹{s.price}</p>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 5: Date */}
        {step === 5 && (
          <div>
            <label className={labelClasses}>Select Date</label>
            <input 
              type="date" 
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className={inputClasses}
            />
          </div>
        )}

        {/* Step 6: Time Slot */}
        {step === 6 && (
          <div>
            <label className={labelClasses}>Select Time Slot</label>
            <div className="grid grid-cols-2 gap-3">
              {timeSlots.map(t => (
                <button 
                  key={t}
                  onClick={() => setSelectedTime(t)}
                  className={`border p-3 text-center transition-colors ${
                    selectedTime === t 
                      ? "border-m-blue-dark bg-surface-elevated" 
                      : "border-hairline bg-surface-card hover:border-body"
                  }`}
                >
                  <p className="text-xs font-bold text-ink">{t}</p>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Bottom Navigation Buttons */}
      <div className="fixed bottom-16 left-0 right-0 border-t border-hairline bg-canvas p-4 flex gap-4">
        {step > 1 && (
          <button 
            onClick={handleBack}
            className="flex-1 flex items-center justify-center gap-2 border border-hairline bg-surface-card py-4 text-xs font-bold uppercase tracking-machined text-ink transition-colors hover:bg-surface-elevated"
          >
            <ArrowLeft size={14} /> Back
          </button>
        )}
        
        {step < totalSteps ? (
          <button 
            onClick={handleNext}
            className="flex-1 flex items-center justify-center gap-2 bg-m-blue-dark py-4 text-xs font-bold uppercase tracking-machined text-ink transition-colors hover:bg-m-blue-light"
          >
            Next <ArrowRight size={14} />
          </button>
        ) : (
          <button 
            onClick={() => alert("Booking Confirmed! (We will build the confirmation screen next)")}
            className="flex-1 flex items-center justify-center gap-2 bg-success py-4 text-xs font-bold uppercase tracking-machined text-ink transition-colors"
          >
            Reserve <Check size={14} />
          </button>
        )}
      </div>
    </div>
  );
}