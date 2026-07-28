"use client";

import { useState } from "react";
import { Search, Filter, CalendarDays, XCircle, CheckCircle2, Banknote } from "lucide-react";

// Mock Data mapping to Prisma Booking + Payment schema
const initialBookings = [
  { 
    id: "b1", bookingCode: "ECW-1001", date: "22-05-2025", time: "10:00–12:00 PM", 
    customer: "Rahul Sharma", flat: "A-401", community: "Prestige Shantiniketan",
    vehicle: "Toyota Fortuner (SUV)", regNumber: "TG 09 AB 1234", 
    service: "Exterior Wash", amount: 350, 
    bookingStatus: "BOOKED", paymentStatus: "PENDING"
  },
  { 
    id: "b2", bookingCode: "ECW-1002", date: "22-05-2025", time: "02:00–04:00 PM", 
    customer: "Priya Patel", flat: "B-1202", community: "Sobha Halcyon",
    vehicle: "Hyundai Creta (SUV)", regNumber: "TG 11 CX 5678", 
    service: "Interior Detail", amount: 1200, 
    bookingStatus: "COMPLETED", paymentStatus: "PAID"
  },
  { 
    id: "b3", bookingCode: "ECW-1003", date: "21-05-2025", time: "08:00–10:00 AM", 
    customer: "Amit Kumar", flat: "C-503", community: "Prestige Shantiniketan",
    vehicle: "Maruti Swift (Hatchback)", regNumber: "TG 38 JU 8765", 
    service: "Exterior Wash", amount: 250, 
    bookingStatus: "CANCELLED", paymentStatus: "REFUNDED"
  },
];

type BookingStatusType = "ALL" | "BOOKED" | "COMPLETED" | "CANCELLED";

export default function BookingsPage() {
  const [bookings, setBookings] = useState(initialBookings);
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

  const cancelBooking = (id: string) => {
    setBookings(bookings.map(b => 
      b.id === id ? { ...b, bookingStatus: "CANCELLED", paymentStatus: "REFUNDED" } : b
    ));
  };

  const inputClasses = "w-full bg-surface-card border border-hairline text-ink p-3 text-sm font-light focus:border-m-blue-dark focus:outline-none transition-colors appearance-none";

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