"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { CalendarDays, Car, Wrench, ArrowRight } from "lucide-react";
import { useStore } from "@/lib/store";

export default function CustomerDashboard() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  
  const bookings = useStore((state) => state.bookings);

  if (!mounted) return null;

  // Filter for this mock customer
  const myBookings = bookings.filter(b => b.customer === "Rahul Sharma");
  const upcomingBookings = myBookings.filter(b => b.bookingStatus === "BOOKED");

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
                    <CalendarDays size={12} /> {b.date} · {b.time}
                  </div>
                  <div className="flex items-center gap-2 text-xs font-light text-body">
                    <Car size={12} /> {b.vehicle}
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