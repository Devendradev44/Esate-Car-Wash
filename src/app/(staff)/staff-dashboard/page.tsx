"use client";

import { useState } from "react";
import { CheckCircle2, IndianRupee, X } from "lucide-react";

// Mock Data for Staff's Daily View
const todaysBookings = [
  { 
    id: "b1", time: "08:00–10:00 AM", customer: "Rahul Sharma", flat: "A-401", 
    vehicle: "Toyota Fortuner", regNumber: "TG 09 AB 1234", service: "Exterior Wash", amount: 350, status: "BOOKED"
  },
  { 
    id: "b2", time: "10:00–12:00 PM", customer: "Priya Patel", flat: "B-1202", 
    vehicle: "Hyundai Creta", regNumber: "TG 11 CX 5678", service: "Interior & Exterior Detail", amount: 1200, status: "BOOKED"
  },
  { 
    id: "b3", time: "02:00–04:00 PM", customer: "Amit Kumar", flat: "C-503", 
    vehicle: "Maruti Swift", regNumber: "TG 38 JU 8765", service: "Exterior Wash", amount: 250, status: "BOOKED"
  },
];

export default function StaffDashboard() {
  const [bookings, setBookings] = useState(todaysBookings);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [activeBooking, setActiveBooking] = useState<typeof todaysBookings[0] | null>(null);
  
  // Payment Form State
  const [paymentMethod, setPaymentMethod] = useState("CASH");
  const [amountReceived, setAmountReceived] = useState("");

  const handleCompleteBooking = () => {
    if (!activeBooking || !amountReceived) return;
    
    // Update booking status locally
    setBookings(bookings.map(b => 
      b.id === activeBooking.id ? { ...b, status: "COMPLETED" } : b
    ));

    // Close modal and reset
    setShowPaymentModal(false);
    setActiveBooking(null);
    setAmountReceived("");
  };

  const inputClasses = "w-full bg-surface-card border border-hairline text-ink p-4 text-sm font-light focus:border-m-red focus:outline-none transition-colors appearance-none";
  const labelClasses = "block text-xs font-bold uppercase tracking-machined text-muted mb-3";

  // Get today's date in DD-MM-YYYY (IST format per FDR)
  const todayIST = new Date().toLocaleDateString('en-IN', { timeZone: 'Asia/Kolkata' });

  return (
    <div className="flex min-h-screen flex-col bg-canvas pb-20">
      {/* Header */}
      <div className="border-b border-hairline bg-surface-soft p-6">
        <p className="text-xs font-bold uppercase tracking-machined text-muted">Prestige Shantiniketan</p>
        <h1 className="mt-2 text-2xl font-bold uppercase text-ink">Today's Schedule</h1>
        <p className="mt-1 text-sm font-light text-body">{todayIST}</p>
      </div>

      {/* Booking List */}
      <div className="p-6 space-y-4">
        {bookings.map(b => (
          <div key={b.id} className={`border ${b.status === "COMPLETED" ? "border-success/30 bg-surface-soft" : "border-hairline bg-surface-card"} p-5`}>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold uppercase tracking-machined text-m-red">{b.time}</span>
              {b.status === "COMPLETED" ? (
                <span className="flex items-center gap-1 text-xs font-bold uppercase tracking-machined text-success"><CheckCircle2 size={14}/> Done</span>
              ) : (
                <span className="text-xs font-bold uppercase tracking-machined text-muted">{b.status}</span>
              )}
            </div>
            
            <p className="text-lg font-bold text-ink">{b.customer} · {b.flat}</p>
            <p className="text-sm font-light text-body mt-1">{b.vehicle} ({b.regNumber})</p>
            <p className="text-sm font-light text-body-strong mt-1">{b.service} — ₹{b.amount}</p>

            {b.status === "BOOKED" && (
              <button 
                onClick={() => { setActiveBooking(b); setAmountReceived(String(b.amount)); setShowPaymentModal(true); }}
                className="mt-4 flex w-full items-center justify-center gap-2 bg-m-red py-3 text-xs font-bold uppercase tracking-machined text-ink hover:brightness-110 transition-colors"
              >
                <CheckCircle2 size={14} /> Mark Complete
              </button>
            )}
          </div>
        ))}
      </div>

      {/* ================= PAYMENT COLLECTION MODAL ================= */}
      {showPaymentModal && activeBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
          <div className="w-full max-w-sm border border-hairline bg-surface-soft p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold uppercase text-ink">Collect Payment</h3>
              <button onClick={() => setShowPaymentModal(false)} className="text-muted hover:text-ink"><X size={20} /></button>
            </div>

            <p className="text-sm font-light text-body mb-1">Customer: <span className="text-ink font-bold">{activeBooking.customer}</span></p>
            <p className="text-sm font-light text-body mb-6">Service: <span className="text-ink font-bold">{activeBooking.service}</span></p>

            <div className="mb-4">
              <label className={labelClasses}>Payment Method</label>
              <select value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)} className={inputClasses}>
                <option value="CASH">Cash</option>
                <option value="UPI">UPI</option>
              </select>
            </div>

            <div className="mb-8">
              <label className={labelClasses}>Amount Received (₹)</label>
              <input 
                type="number" 
                value={amountReceived} 
                onChange={(e) => setAmountReceived(e.target.value)} 
                className={inputClasses} 
              />
            </div>

            <button onClick={handleCompleteBooking} className="flex w-full items-center justify-center gap-2 bg-success py-4 text-xs font-bold uppercase tracking-machined text-ink hover:brightness-110">
              <IndianRupee size={14} /> Confirm & Complete
            </button>
          </div>
        </div>
      )}
    </div>
  );
}