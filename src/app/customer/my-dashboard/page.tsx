"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { CalendarDays, Car, Wrench, ArrowRight, XCircle } from "lucide-react";
import { useStore } from "@/lib/store";

export default function CustomerDashboard() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  
  const bookings = useStore((state) => state.bookings);
  const cancelBooking = useStore((state) => state.cancelBooking);

  const formatDate = (dateString: string) => {
    if (!dateString) return "";
    const [year, month, day] = dateString.split("-");
    return `${day}-${month}-${year}`;
  };

  if (!mounted) return null;

  const myBookings = bookings.filter(b => b.customer === "Rahul Sharma");
  const upcomingBookings = myBookings.filter(b => b.bookingStatus === "BOOKED");
  const pastBookings = myBookings.filter(b => b.bookingStatus !== "BOOKED");
  

  return (

    <div className="flex min-h-screen flex-col bg-canvas pb-24">
      <div className="border-b border-hairline bg-surface-soft p-6">
        <h1 className="text-2xl font-bold uppercase text-ink">My Dashboard</h1>
        <p className="mt-1 text-sm font-light text-body">Welcome back, Rahul.</p>
      </div>

      <div className="flex-1 p-6 space-y-8">
        
        {/* Quick Action Button */}
        <Link href="/customer/book" className="flex items-center justify-between border border-m-blue-dark bg-surface-card p-6 hover:bg-surface-elevated transition-colors">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-m-blue-dark/20 text-m-blue-dark"><Wrench size={20} /></div>
            <div>
              <p className="text-lg font-bold text-ink">Book a Service</p>
              <p className="text-xs font-light text-muted">Schedule your next car wash</p>
            </div>
          </div>
          <ArrowRight className="text-muted" />
        </Link>

        {/* Upcoming Bookings */}
        <div>
          <h2 className="text-xs font-bold uppercase tracking-machined text-muted mb-4">Upcoming Bookings</h2>
          {upcomingBookings.length === 0 ? (
            <div className="border border-hairline p-6 text-center">
              <p className="text-sm font-light text-muted">No upcoming bookings.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {upcomingBookings.map(b => (
                <div key={b.id} className="border border-hairline bg-surface-card p-5">
                  <div className="flex justify-between mb-2">
                    <p className="text-sm font-bold text-ink">{b.service}</p>
                    <span className="text-xs font-bold text-warning uppercase">{b.bookingStatus}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs font-light text-muted mb-3">
                    <CalendarDays size={12} /> {formatDate(b.date)} · {b.time}
                  </div>
                  <div className="flex items-center gap-2 text-xs font-light text-body mb-4">
                    <Car size={12} /> {b.vehicle}
                  </div>
                  
                  {/* CANCEL BUTTON */}
                  <button 
                    onClick={() => cancelBooking(b.id, "CUSTOMER")}
                    className="flex w-full items-center justify-center gap-2 border border-m-red/50 text-m-red py-3 text-xs font-bold uppercase tracking-machined hover:bg-m-red hover:text-ink transition-colors"
                  >
                    <XCircle size={14} /> Cancel Booking
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Booking History (Completed / Cancelled) */}
        <div className="mt-8">
          <h2 className="text-xs font-bold uppercase tracking-machined text-muted mb-4">Booking History</h2>
          {pastBookings.length === 0 ? (
            <div className="border border-hairline p-6 text-center">
              <p className="text-sm font-light text-muted">No past bookings.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {pastBookings.map(b => (
                // CHANGED: Removed red border, just using standard card with slight opacity
                <div key={b.id} className="border border-hairline bg-surface-card p-5 opacity-80">
                  <div className="flex justify-between mb-2">
                    <p className="text-sm font-bold text-ink">{b.service}</p>
                    {/* CHANGED: Only the badge is red, not the whole card */}
                    <span className={`text-xs font-bold uppercase ${b.bookingStatus === "COMPLETED" ? "text-success" : "text-m-red"}`}>
                      {b.bookingStatus}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-xs font-light text-muted mb-3">
                    <CalendarDays size={12} /> {formatDate(b.date)} · {b.time}
                  </div>
                  <div className="flex items-center justify-between text-xs font-light text-body">
                    <span className="flex items-center gap-2"><Car size={12} /> {b.vehicle}</span>
                    <span className={`font-bold ${b.paymentStatus === "PAID" ? "text-success" : "text-muted"}`}>{b.paymentStatus}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}