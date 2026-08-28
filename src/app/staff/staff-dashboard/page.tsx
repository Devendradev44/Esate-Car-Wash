"use client";
import { useState, useEffect } from "react";
import { CheckCircle2, MapPin, Car, XCircle } from "lucide-react";
import { useStore } from "@/lib/store";

export default function StaffDashboard() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const bookings = useStore((state) => state.bookings);
  const completeBooking = useStore((state) => state.completeBooking);
  const cancelBooking = useStore((state) => state.cancelBooking);

  
  const formatDate = (dateString: string) => {
    if (!dateString) return "";
    const [year, month, day] = dateString.split("-");
    return `${day}-${month}-${year}`;
  };

  if (!mounted) return null;

  // Show all bookings so you can see the updates instantly
  const todaysBookings = bookings;

  return (
    <div className="flex min-h-screen flex-col bg-canvas pb-24">
      <div className="border-b border-hairline bg-surface-soft p-6">
        <h1 className="text-2xl font-bold uppercase text-ink">Today's Schedule</h1>
        <p className="mt-1 text-sm font-light text-body">All Community Assignments</p>
      </div>

      <div className="flex-1 p-6 space-y-4">
        {todaysBookings.length === 0 && (
          <div className="text-center text-muted text-sm font-light mt-20">No bookings scheduled for today.</div>
        )}

        {todaysBookings.map(b => (
          <div key={b.id} className={`border ${b.bookingStatus === "COMPLETED" ? "border-success/30 bg-success/5" : "border-hairline bg-surface-card"} p-5`}>
            <div className="flex justify-between items-start mb-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-machined text-m-blue-dark mb-1">{b.time} | {formatDate(b.date)}</p>
                <h3 className="text-lg font-bold text-ink">{b.customer}</h3>
                <p className="text-xs font-light text-muted mt-1 flex items-center gap-1"><MapPin size={12}/> {b.flat}, {b.community}</p>
              </div>
              <span className={`text-xs font-bold uppercase tracking-machined px-2 py-1 ${
                b.bookingStatus === "COMPLETED" ? "bg-success/20 text-success" : "bg-warning/20 text-warning"
              }`}>
                {b.bookingStatus}
              </span>
            </div>

            <div className="space-y-2 mb-5 border-t border-hairline pt-4">
              <p className="text-sm font-light text-body flex items-center gap-2"><Car size={14} className="text-muted"/> {b.vehicle}</p>
              <p className="text-sm font-light text-body">Reg: <span className="font-bold text-ink">{b.regNumber}</span></p>
              <p className="text-sm font-light text-body">Service: <span className="font-bold text-ink">{b.service}</span></p>
              <p className="text-sm font-bold text-ink">Amount: ₹{b.amount}</p>
            </div>

            {b.bookingStatus === "BOOKED" && (
              <>
                <button 
                  onClick={() => completeBooking(b.id)}
                  className="flex w-full items-center justify-center gap-2 bg-success py-4 text-xs font-bold uppercase tracking-machined text-ink hover:brightness-110 transition-colors mb-2"
                >
                  <CheckCircle2 size={14} /> Mark Complete & Collect ₹{b.amount}
                </button>
                <button 
                  onClick={() => cancelBooking(b.id, "STAFF")}
                  className="flex w-full items-center justify-center gap-2 border border-m-red/50 text-m-red py-3 text-xs font-bold uppercase tracking-machined hover:bg-m-red hover:text-ink transition-colors"
                >
                  <XCircle size={14} /> Cancel Booking (No Show)
                </button>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}