"use client";

import { useState, useEffect } from "react";
import { Search, CalendarDays, XCircle, CheckCircle2, Banknote, User, Car, Wrench } from "lucide-react";
import { useStore } from "@/lib/store";

type BookingStatusType = "ALL" | "BOOKED" | "COMPLETED" | "CANCELLED";

export default function BookingsPage() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const bookings = useStore((state) => state.bookings);
  const cancelBooking = useStore((state) => state.cancelBooking);

  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState<BookingStatusType>("ALL");

  if (!mounted) return null;

  const filteredBookings = bookings.filter(b => {
    const matchesSearch = 
      b.customer.toLowerCase().includes(searchQuery.toLowerCase()) || 
      b.bookingCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.regNumber.includes(searchQuery);
    
    const matchesFilter = activeFilter === "ALL" || b.bookingStatus === activeFilter;
    
    return matchesSearch && matchesFilter;
  });

  const inputClasses = "w-full bg-surface-card border border-hairline text-ink p-3 text-sm font-light focus:border-m-blue-dark focus:outline-none transition-colors appearance-none";

  return (
    <div className="p-6 md:p-12">
      {/* Header */}
      <div className="mb-10">
        <h2 className="text-2xl md:text-3xl font-bold uppercase tracking-normal text-ink">Booking Management</h2>
        <p className="mt-2 text-sm font-light text-body">View, filter, and manage all customer reservations.</p>
      </div>

      {/* Search & Filter Controls */}
      <div className="mb-6 flex flex-col md:flex-row gap-4">
        <div className="flex-1 flex items-center gap-3 border border-hairline bg-surface-card p-3">
          <Search size={16} className="text-muted" />
          <input type="text" placeholder="Search by Code, Name, or Reg..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className={inputClasses + " border-none bg-transparent p-0 focus:outline-none"} />
        </div>

        <div className="flex border border-hairline bg-surface-card overflow-x-auto">
          {(["ALL", "BOOKED", "COMPLETED", "CANCELLED"] as BookingStatusType[]).map(filter => (
            <button 
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`flex-1 px-4 py-3 text-xs font-bold uppercase tracking-machined transition-colors ${
                activeFilter === filter ? "bg-m-blue-dark text-ink" : "text-muted hover:text-ink"
              }`}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>

      {/* =========================================
          MOBILE VIEW: CARDS
          (Hidden on Desktop, shown on Mobile) 
          ========================================= */}
      <div className="md:hidden space-y-4">
        {filteredBookings.length === 0 ? (
          <p className="text-center text-muted text-sm font-light py-10">No bookings found.</p>
        ) : (
          filteredBookings.map(b => (
            <div key={b.id} className="border border-hairline bg-surface-card p-4">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <p className="text-sm font-bold text-m-blue-dark">{b.bookingCode}</p>
                  <p className="text-lg font-bold text-ink mt-1 flex items-center gap-2"><User size={14} className="text-muted"/> {b.customer}</p>
                  <p className="text-xs font-light text-muted">{b.flat}, {b.community}</p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-ink">₹{b.amount}</p>
                  <span className={`inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-machined mt-1 ${
                    b.bookingStatus === "BOOKED" ? "text-warning" : 
                    b.bookingStatus === "COMPLETED" ? "text-success" : "text-muted"
                  }`}>
                    {b.bookingStatus === "BOOKED" && <CalendarDays size={10}/>}
                    {b.bookingStatus === "COMPLETED" && <CheckCircle2 size={10}/>}
                    {b.bookingStatus === "CANCELLED" && <XCircle size={10}/>}
                    {b.bookingStatus}
                  </span>
                </div>
              </div>
              
              <div className="space-y-2 border-t border-hairline pt-3 mb-4 text-xs font-light text-body">
                <p className="flex items-center gap-2"><CalendarDays size={12} className="text-muted"/> {b.date} · {b.time}</p>
                <p className="flex items-center gap-2"><Car size={12} className="text-muted"/> {b.vehicle}</p>
                <p className="flex items-center gap-2"><Wrench size={12} className="text-muted"/> {b.service}</p>
                <p className="flex items-center gap-2"><Banknote size={12} className="text-muted"/> {b.paymentStatus}</p>
              </div>

              {b.bookingStatus === "BOOKED" && (
                <button 
                  onClick={() => cancelBooking(b.id, "ADMIN")} 
                  className="w-full border border-m-red/50 text-m-red py-2 text-xs font-bold uppercase tracking-machined hover:bg-m-red hover:text-ink transition-colors"
                >
                  Cancel Booking
                </button>
              )}
              {b.bookingStatus === "CANCELLED" && (
                <div className="text-right">
                  <span className="text-[10px] font-light text-muted">By: {b.cancelledBy || "N/A"}</span>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* =========================================
          DESKTOP VIEW: TABLE
          (Hidden on Mobile, shown on Desktop) 
          ========================================= */}
      <div className="hidden md:block border border-hairline overflow-x-auto">
        <table className="w-full min-w-[1000px]">
          <thead className="border-b border-hairline bg-surface-soft">
            <tr>
              <th className="py-4 px-4 text-left text-xs font-bold uppercase tracking-machined text-muted">Code</th>
              <th className="py-4 px-4 text-left text-xs font-bold uppercase tracking-machined text-muted">Date / Time</th>
              <th className="py-4 px-4 text-left text-xs font-bold uppercase tracking-machined text-muted">Customer</th>
              <th className="py-4 px-4 text-left text-xs font-bold uppercase tracking-machined text-muted">Vehicle</th>
              <th className="py-4 px-4 text-left text-xs font-bold uppercase tracking-machined text-muted">Service</th>
              <th className="py-4 px-4 text-center text-xs font-bold uppercase tracking-machined text-muted">Amount</th>
              <th className="py-4 px-4 text-center text-xs font-bold uppercase tracking-machined text-muted">Booking</th>
              <th className="py-4 px-4 text-center text-xs font-bold uppercase tracking-machined text-muted">Payment</th>
              <th className="py-4 px-4 text-right text-xs font-bold uppercase tracking-machined text-muted">Actions</th>
            </tr>
          </thead>
          
          <tbody>
            {filteredBookings.map(b => (
              <tr key={b.id} className="border-b border-hairline hover:bg-surface-card transition-colors">
                <td className="py-4 px-4 text-sm font-bold text-m-blue-dark">{b.bookingCode}</td>
                <td className="py-4 px-4">
                  <p className="text-sm font-bold text-ink">{b.date}</p>
                  <p className="text-xs font-light text-body">{b.time}</p>
                </td>
                <td className="py-4 px-4">
                  <p className="text-sm font-bold text-ink">{b.customer}</p>
                  <p className="text-xs font-light text-body">{b.flat}, {b.community}</p>
                </td>
                <td className="py-4 px-4">
                  <p className="text-sm font-bold text-ink">{b.vehicle}</p>
                  <p className="text-xs font-light text-body">{b.regNumber}</p>
                </td>
                <td className="py-4 px-4 text-sm font-light text-ink">{b.service}</td>
                <td className="py-4 px-4 text-sm font-bold text-ink text-center">₹{b.amount}</td>
                <td className="py-4 px-4 text-center">
                  <span className={`inline-flex items-center gap-1 text-xs font-bold uppercase tracking-machined ${
                    b.bookingStatus === "BOOKED" ? "text-warning" : 
                    b.bookingStatus === "COMPLETED" ? "text-success" : "text-muted"
                  }`}>
                    {b.bookingStatus === "BOOKED" && <CalendarDays size={12}/>}
                    {b.bookingStatus === "COMPLETED" && <CheckCircle2 size={12}/>}
                    {b.bookingStatus === "CANCELLED" && <XCircle size={12}/>}
                    {b.bookingStatus}
                  </span>
                </td>
                <td className="py-4 px-4 text-center">
                  <span className={`inline-flex items-center gap-1 text-xs font-bold uppercase tracking-machined ${
                    b.paymentStatus === "PAID" ? "text-success" : 
                    b.paymentStatus === "PENDING" ? "text-warning" : "text-muted"
                  }`}>
                    <Banknote size={12}/> {b.paymentStatus}
                  </span>
                </td>
                <td className="py-4 px-4 text-right">
                  {b.bookingStatus === "BOOKED" && (
                    <button 
                      onClick={() => cancelBooking(b.id, "ADMIN")} 
                      className="text-xs font-bold uppercase tracking-machined text-muted hover:text-m-red transition-colors"
                    >
                      Cancel
                    </button>
                  )}
                  {b.bookingStatus === "CANCELLED" && (
                    <div className="flex flex-col items-end gap-1">
                      <span className="text-xs font-bold uppercase tracking-machined text-m-red">Cancelled</span>
                      {b.cancelledBy && (
                        <span className="text-[10px] font-light text-muted">By: {b.cancelledBy}</span>
                      )}
                    </div>
                  )}
                  {b.bookingStatus === "COMPLETED" && (
                    <span className="text-xs font-light text-muted">—</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}