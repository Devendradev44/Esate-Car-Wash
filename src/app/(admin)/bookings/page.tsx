"use client";

import { useState } from "react";
import { Search, CalendarDays, XCircle, CheckCircle2, Banknote } from "lucide-react";
import { useStore } from "@/lib/store"; // IMPORT THE STORE!

type BookingStatusType = "ALL" | "BOOKED" | "COMPLETED" | "CANCELLED";

export default function BookingsPage() {
  // READ FROM GLOBAL STORE!
  const bookings = useStore((state) => state.bookings);
  const cancelBooking = useStore((state) => state.cancelBooking);

  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState<BookingStatusType>("ALL");

  const filteredBookings = bookings.filter(b => {
    const matchesSearch = 
      b.customer.toLowerCase().includes(searchQuery.toLowerCase()) || 
      b.bookingCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.regNumber.includes(searchQuery);
    
    const matchesFilter = activeFilter === "ALL" || b.bookingStatus === activeFilter;
    
    return matchesSearch && matchesFilter;
  });

  // Use the global store action instead of local state
  const handleCancelBooking = (id: string) => {
    cancelBooking(id);
  };

  const inputClasses = "w-full bg-surface-card border border-hairline text-ink p-3 text-sm font-light focus:border-m-blue-dark focus:outline-none transition-colors appearance-none";

  // ... (Leave the rest of the JSX exactly as it is! Just make sure the table maps over `filteredBookings` and uses `handleCancelBooking`)
  return (
    <div className="p-12">
      {/* Header */}
      <div className="mb-10">
        <h2 className="text-3xl font-bold uppercase tracking-normal text-ink">Booking Management</h2>
        <p className="mt-2 text-sm font-light text-body">View, filter, and manage all customer reservations.</p>
      </div>

      {/* Search & Filter Controls */}
      <div className="mb-6 flex flex-col md:flex-row gap-4">
        {/* Search Bar */}
        <div className="flex-1 flex items-center gap-3 border border-hairline bg-surface-card p-3">
          <Search size={16} className="text-muted" />
          <input type="text" placeholder="Search by Code, Name, or Reg Number..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className={inputClasses + " border-none bg-transparent p-0 focus:outline-none"} />
        </div>

        {/* Status Filter Tabs (BMW M Style) */}
        <div className="flex border border-hairline bg-surface-card">
          {(["ALL", "BOOKED", "COMPLETED", "CANCELLED"] as BookingStatusType[]).map(filter => (
            <button 
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`px-4 py-3 text-xs font-bold uppercase tracking-machined transition-colors ${
                activeFilter === filter ? "bg-m-blue-dark text-ink" : "text-muted hover:text-ink"
              }`}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>

      {/* Data Table */}
      <div className="border border-hairline overflow-x-auto">
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
                    <button onClick={() => cancelBooking(b.id)} className="text-xs font-bold uppercase tracking-machined text-muted hover:text-m-red transition-colors">
                      Cancel
                    </button>
                  )}
                  {b.bookingStatus === "CANCELLED" && (
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