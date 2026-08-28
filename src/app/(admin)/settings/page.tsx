"use client";
import { useState, useEffect } from "react";
import { Plus, Trash2, X, Clock } from "lucide-react";
import { useStore } from "@/lib/store";

export default function AdminSettings() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  
  const timeSlots = useStore((state) => state.timeSlots);
  const addTimeSlot = useStore((state) => state.addTimeSlot);
  const deleteTimeSlot = useStore((state) => state.deleteTimeSlot);

  const [showModal, setShowModal] = useState(false);
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");

  if (!mounted) return null;

  // Convert 24hr (HH:mm) to 12hr format (e.g. "14:00" -> "2:00 PM")
  const formatTo12Hour = (time: string) => {
    const [hours, minutes] = time.split(':');
    let h = parseInt(hours, 10);
    const ampm = h >= 12 ? 'PM' : 'AM';
    h = h % 12 || 12;
    return `${h}:${minutes} ${ampm}`;
  };

  const handleSaveSlot = () => {
    if (!startTime || !endTime) return;
    const label = `${formatTo12Hour(startTime)} - ${formatTo12Hour(endTime)}`;
    addTimeSlot(label, startTime); // Pass startTime to store
    setStartTime(""); setEndTime("");
    setShowModal(false);
  };

  const inputClasses = "w-full bg-surface-card border border-hairline text-ink p-4 text-sm font-light focus:border-m-blue-dark focus:outline-none transition-colors appearance-none";
  const labelClasses = "block text-xs font-bold uppercase tracking-machined text-muted mb-3";

  return (
    <div className="p-6 md:p-12 relative">
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
          <div className="w-full max-w-md border border-hairline bg-surface-soft p-8">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-xl font-bold uppercase text-ink">Add Time Slot</h3>
              <button onClick={() => setShowModal(false)} className="text-muted hover:text-ink"><X size={20} /></button>
            </div>
            
            <div className="grid grid-cols-2 gap-4 mb-8">
              <div>
                <label className={labelClasses}>Start Time</label>
                <input 
                  type="time" 
                  value={startTime} 
                  onChange={(e) => setStartTime(e.target.value)} 
                  className={inputClasses + " [color-scheme:dark]"}
                />
              </div>
              <div>
                <label className={labelClasses}>End Time</label>
                <input 
                  type="time" 
                  value={endTime} 
                  onChange={(e) => setEndTime(e.target.value)} 
                  className={inputClasses + " [color-scheme:dark]"}
                />
              </div>
            </div>

            <button onClick={handleSaveSlot} className="flex w-full items-center justify-center gap-2 bg-m-blue-dark py-4 text-xs font-bold uppercase tracking-machined text-ink hover:bg-m-blue-light">
              Save Slot
            </button>
          </div>
        </div>
      )}

      <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-4">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold uppercase tracking-normal text-ink">Settings</h2>
          <p className="mt-2 text-sm font-light text-body">Manage global platform configuration.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Booking Time Slots */}
        <div className="border border-hairline bg-surface-card p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-sm font-bold uppercase tracking-machined text-muted">Booking Time Slots</h3>
            <button onClick={() => setShowModal(true)} className="flex items-center gap-2 bg-m-blue-dark px-4 py-2 text-xs font-bold uppercase tracking-machined text-ink hover:bg-m-blue-light transition-colors">
              <Plus size={12} /> Add Slot
            </button>
          </div>
          
          <div className="space-y-3">
            {[...timeSlots].sort((a, b) => a.startTime.localeCompare(b.startTime)).map(slot => (
              <div key={slot.id} className="flex items-center justify-between border border-hairline bg-surface-soft p-4">
                <p className="text-sm font-bold text-ink flex items-center gap-3">
                  <Clock size={14} className="text-m-blue-dark" /> 
                  {slot.label}
                </p>
                <button onClick={() => deleteTimeSlot(slot.id)} className="text-muted hover:text-m-red transition-colors">
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Admin Account Info */}
        <div className="border border-hairline bg-surface-card p-6">
          <h3 className="text-sm font-bold uppercase tracking-machined text-muted mb-6">Admin Account</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-machined text-muted mb-2">Admin Email</label>
              <input type="email" defaultValue="admin@estatecarwash.com" className="w-full bg-surface-soft border border-hairline text-ink p-4 text-sm font-light focus:border-m-blue-dark focus:outline-none" />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-machined text-muted mb-2">Change Password</label>
              <input type="password" placeholder="••••••••" className="w-full bg-surface-soft border border-hairline text-ink p-4 text-sm font-light focus:border-m-blue-dark focus:outline-none" />
            </div>
            <button className="w-full bg-m-blue-dark py-4 text-xs font-bold uppercase tracking-machined text-ink hover:bg-m-blue-light">
              Update Credentials
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}