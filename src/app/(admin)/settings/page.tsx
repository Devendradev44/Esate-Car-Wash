"use client";

import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";

const initialSlots = [
  { id: "ts1", label: "08:00–10:00 AM", start: "08:00", end: "10:00", sort: 1 },
  { id: "ts2", label: "10:00–12:00 PM", start: "10:00", end: "12:00", sort: 2 },
  { id: "ts3", label: "02:00–04:00 PM", start: "14:00", end: "16:00", sort: 3 },
];

export default function SettingsPage() {
  const [slots, setSlots] = useState(initialSlots);

  const inputClasses = "w-full bg-surface-card border border-hairline text-ink p-4 text-sm font-light focus:border-m-blue-dark focus:outline-none transition-colors appearance-none";
  const labelClasses = "block text-xs font-bold uppercase tracking-machined text-muted mb-3";

  return (
    <div className="p-12">
      <div className="mb-10">
        <h2 className="text-3xl font-bold uppercase tracking-normal text-ink">Settings</h2>
        <p className="mt-2 text-sm font-light text-body">Manage global platform configurations.</p>
      </div>

      {/* Time Slots Management */}
      <div className="border border-hairline bg-surface-card p-6 mb-8">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-sm font-bold uppercase tracking-machined text-muted">Booking Time Slots</h3>
          <button className="flex items-center gap-2 bg-m-blue-dark px-4 py-2 text-xs font-bold uppercase tracking-machined text-ink hover:bg-m-blue-light transition-colors">
            <Plus size={14} /> Add Slot
          </button>
        </div>

        <div className="space-y-4">
          {slots.map(slot => (
            <div key={slot.id} className="flex items-center gap-4 border border-hairline bg-surface-soft p-4">
              <div className="flex-1">
                <p className="text-sm font-bold text-ink">{slot.label}</p>
                <p className="text-xs font-light text-muted">{slot.start} - {slot.end}</p>
              </div>
              <button className="text-muted hover:text-m-red transition-colors"><Trash2 size={16} /></button>
            </div>
          ))}
        </div>
      </div>

      {/* Admin Account */}
      <div className="border border-hairline bg-surface-card p-6">
        <h3 className="text-sm font-bold uppercase tracking-machined text-muted mb-6">Admin Account</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className={labelClasses}>Email</label>
            <input type="email" defaultValue="admin@estatecarwash.com" className={inputClasses} />
          </div>
          <div>
            <label className={labelClasses}>Password</label>
            <input type="password" defaultValue="securepassword123" className={inputClasses} />
          </div>
        </div>
        <button className="mt-6 bg-m-blue-dark px-6 py-3 text-xs font-bold uppercase tracking-machined text-ink hover:bg-m-blue-light transition-colors">Update Account</button>
      </div>
    </div>
  );
}