"use client";

import { useState, useRef } from "react";
import { Search, CalendarDays, XCircle, CheckCircle2, Banknote, User, Car, Wrench, Download, Upload, X } from "lucide-react";
import { useStore } from "@/lib/store";
import { toCSV, downloadCSV, parseCSV } from "@/lib/csv";

type BookingStatusType = "ALL" | "BOOKED" | "COMPLETED" | "CANCELLED";

export default function BookingsPage() {

  const bookings = useStore((state) => state.bookings);
  const cancelBooking = useStore((state) => state.cancelBooking);
  const completeBooking = useStore((state) => state.completeBooking);
  const addBooking = useStore((state) => state.addBooking);

  const [showCompleteModal, setShowCompleteModal] = useState(false);
  const [activeBookingId, setActiveBookingId] = useState("");
  const [showImportModal, setShowImportModal] = useState(false);
  const [importError, setImportError] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState<BookingStatusType>("ALL");

  const formatDate = (dateString: string) => {
    if (!dateString) return "";
    const [year, month, day] = dateString.split("-");
    return `${day}-${month}-${year}`;
  };

  const filteredBookings = bookings.filter(b => {
    const matchesSearch =
      b.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.bookingCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.regNumber.includes(searchQuery);

    const matchesFilter = activeFilter === "ALL" || b.bookingStatus === activeFilter;

    return matchesSearch && matchesFilter;
  });

  const handleExport = () => {
    const csv = toCSV(bookings, [
      { key: "bookingCode", header: "Booking Code" },
      { key: "date", header: "Date" },
      { key: "time", header: "Time" },
      { key: "customer", header: "Customer" },
      { key: "flat", header: "Flat" },
      { key: "community", header: "Community" },
      { key: "vehicle", header: "Vehicle" },
      { key: "regNumber", header: "Reg Number" },
      { key: "service", header: "Service" },
      { key: "amount", header: "Amount" },
      { key: "bookingStatus", header: "Booking Status" },
      { key: "paymentStatus", header: "Payment Status" },
      { key: "paymentMethod", header: "Payment Method" },
      { key: "cancelledBy", header: "Cancelled By" },
    ]);
    downloadCSV(`bookings_${new Date().toISOString().slice(0, 10)}.csv`, csv);
  };

  const handleImport = async (file: File) => {
    try {
      const rows = await parseCSV(file);
      if (rows.length < 2) { setImportError("CSV must have a header row and data."); return; }
      const header = rows[0].map(h => h.trim().toUpperCase());
      const required = ["BOOKING CODE", "DATE", "CUSTOMER", "COMMUNITY", "VEHICLE", "AMOUNT"];
      const missing = required.filter(r => !header.includes(r));
      if (missing.length > 0) { setImportError(`Missing columns: ${missing.join(", ")}`); return; }

      for (let i = 1; i < rows.length; i++) {
        const row = rows[i];
        const getVal = (col: string) => row[header.indexOf(col)] || "";
        const dateVal = getVal("DATE");
        if (!dateVal) continue;
        const pm = getVal("PAYMENT METHOD");
        const cb = getVal("CANCELLED BY");
        addBooking({
          id: `b${Date.now()}_${i}`,
          bookingCode: getVal("BOOKING CODE") || `BK-${i}`,
          date: dateVal,
          time: getVal("TIME") || "10:00",
          customer: getVal("CUSTOMER") || "Unknown",
          flat: getVal("FLAT") || "",
          community: getVal("COMMUNITY") || "",
          vehicle: getVal("VEHICLE") || "",
          regNumber: getVal("REG NUMBER") || "",
          service: getVal("SERVICE") || "",
          amount: Number(getVal("AMOUNT")) || 0,
          bookingStatus: ["BOOKED", "COMPLETED", "CANCELLED"].includes(getVal("BOOKING STATUS")) ? (getVal("BOOKING STATUS") as "BOOKED" | "COMPLETED" | "CANCELLED") : "BOOKED",
          paymentStatus: ["PAID", "PENDING", "REFUNDED"].includes(getVal("PAYMENT STATUS")) ? (getVal("PAYMENT STATUS") as "PAID" | "PENDING" | "REFUNDED") : "PENDING",
          paymentMethod: pm ? (pm as "CASH" | "UPI" | "ONLINE") : undefined,
          cancelledBy: cb ? (cb as "CUSTOMER" | "STAFF" | "ADMIN") : undefined,
        });
      }
      setShowImportModal(false);
      setImportError("");
    } catch {
      setImportError("Failed to parse CSV file.");
    }
  };

  const inputClasses = "w-full bg-surface-card border border-hairline text-ink p-3 text-sm font-light focus:border-yellow-dark focus:outline-none transition-colors appearance-none";

  return (
    <div className="p-6 md:p-12">
      {/* HEADER */}
      <div className="mb-10">
        <h2 className="text-2xl md:text-3xl font-bold uppercase tracking-normal text-ink">Booking Management</h2>
        <p className="mt-2 text-sm font-light text-body">View, filter, and manage all customer reservations.</p>
      </div>

      {/* SEARCH & FILTER CONTROLS */}
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
                activeFilter === filter ? "bg-yellow-dark text-ink" : "text-muted hover:text-ink"
              }`}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>

      {/* BULK ACTIONS */}
      <div className="mb-6 flex gap-3">
        <button onClick={handleExport} className="flex items-center justify-center gap-2 border border-hairline bg-surface-card px-4 py-2 text-xs font-bold uppercase tracking-machined text-body hover:text-ink hover:bg-surface-elevated transition-colors">
          <Download size={14} /> Export Bookings
        </button>
        <button onClick={() => setShowImportModal(true)} className="flex items-center justify-center gap-2 border border-hairline bg-surface-card px-4 py-2 text-xs font-bold uppercase tracking-machined text-body hover:text-ink hover:bg-surface-elevated transition-colors">
          <Upload size={14} /> Import Bookings
        </button>
      </div>

      {/* IMPORT MODAL */}
      {showImportModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
          <div className="w-full max-w-md max-h-[90vh] overflow-y-auto border border-hairline bg-surface-soft p-8">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold uppercase text-ink">Import Bookings</h3>
              <button onClick={() => { setShowImportModal(false); setImportError(""); }} className="text-muted hover:text-ink"><X size={20} /></button>
            </div>
            <div className="space-y-4">
              <p className="text-xs font-light text-muted">Upload a CSV file with columns: Booking Code, Date, Customer, Community, Vehicle, Amount (required).</p>
              <input
                type="file"
                accept=".csv"
                ref={fileRef}
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleImport(file);
                }}
                className={inputClasses + " border-none bg-transparent p-0"}
              />
              {importError && <p className="text-xs font-semibold text-red-500 bg-red-500/10 border border-red-500/20 py-2 rounded-lg text-center">{importError}</p>}
            </div>
          </div>
        </div>
      )}

      {/* MOBILE CARDS */}
      <div className="md:hidden space-y-4">
        {filteredBookings.length === 0 ? (
          <p className="text-center text-muted text-sm font-light py-10">No bookings found.</p>
        ) : (
          filteredBookings.map(b => (
            <div key={b.id} className="border border-hairline bg-surface-card p-4">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <p className="text-sm font-bold text-yellow-dark">{b.bookingCode}</p>
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
                <p className="flex items-center gap-2"><CalendarDays size={12} className="text-muted"/> {formatDate(b.date)} · {b.time}</p>
                <p className="flex items-center gap-2"><Car size={12} className="text-muted"/> {b.vehicle}</p>
                <p className="flex items-center gap-2"><Wrench size={12} className="text-muted"/> {b.service}</p>
                <p className="flex items-center gap-2"><Banknote size={12} className="text-muted"/> {b.paymentStatus}</p>
              </div>

              {b.bookingStatus === "BOOKED" && (
                <div className="flex flex-col gap-2">
                  <button
                    onClick={() => {
                      setActiveBookingId(b.id);
                      setShowCompleteModal(true);
                    }}
                    className="w-full bg-success/10 text-success border border-success/30 py-2 text-xs font-bold uppercase tracking-machined hover:bg-success hover:text-ink transition-colors"
                  >
                    Mark Complete
                  </button>
                  <button
                    onClick={() => cancelBooking(b.id, "ADMIN")}
                    className="w-full border border-m-red/50 text-m-red py-2 text-xs font-bold uppercase tracking-machined hover:bg-m-red hover:text-ink transition-colors"
                  >
                    Cancel Booking
                  </button>
                </div>
              )}
              {b.bookingStatus === "CANCELLED" && (
                <div className="text-right mt-2">
                  <span className="text-[10px] font-light text-muted">By: {b.cancelledBy || "N/A"}</span>
                </div>
              )}
              {b.bookingStatus === "COMPLETED" && (
                <div className="text-right mt-2">
                  <span className="text-[10px] font-light text-muted">Via: {b.paymentMethod || "N/A"}</span>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* DESKTOP TABLE */}
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
                <td className="py-4 px-4 text-sm font-bold text-yellow-dark">{b.bookingCode}</td>
                <td className="py-4 px-4">
                  <p className="text-sm font-bold text-ink">{formatDate(b.date)}</p>
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
                  <div className="flex flex-col items-end gap-2">
                    <button
                      onClick={() => {
                        setActiveBookingId(b.id);
                        setShowCompleteModal(true);
                      }}
                      className="text-xs font-bold uppercase tracking-machined text-success hover:underline"
                    >
                      Mark Complete
                    </button>
                    <button
                      onClick={() => cancelBooking(b.id, "ADMIN")}
                      className="text-xs font-bold uppercase tracking-machined text-muted hover:text-m-red transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                )}
                {b.bookingStatus === "CANCELLED" && (
                  <div className="flex flex-col items-end gap-1">
                    <span className="text-xs font-bold uppercase tracking-machined text-m-red">Cancelled</span>
                    {b.cancelledBy && <span className="text-[10px] font-light text-muted">By: {b.cancelledBy}</span>}
                  </div>
                )}
                {b.bookingStatus === "COMPLETED" && (
                  <div className="flex flex-col items-end gap-1">
                    <span className="text-xs font-bold uppercase tracking-machined text-success">Completed</span>
                    {b.paymentMethod && <span className="text-[10px] font-light text-muted">Via: {b.paymentMethod}</span>}
                  </div>
                )}
              </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* Complete Booking Modal */}
      {showCompleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
          <div className="w-full max-w-sm max-h-[90vh] overflow-y-auto border border-hairline bg-surface-soft p-8 text-center">
            <h3 className="text-xl font-bold uppercase text-ink mb-2">Collect Payment</h3>
            <p className="text-xs font-light text-muted mb-8">Select payment method to complete this booking.</p>
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => {
                  completeBooking(activeBookingId, "CASH");
                  setShowCompleteModal(false);
                }}
                className="bg-success py-4 text-xs font-bold uppercase tracking-machined text-ink hover:brightness-110"
              >
                Cash
              </button>
              <button
                onClick={() => {
                  completeBooking(activeBookingId, "UPI");
                  setShowCompleteModal(false);
                }}
                className="bg-yellow-dark py-4 text-xs font-bold uppercase tracking-machined text-ink hover:bg-yellow-light"
              >
                UPI
              </button>
            </div>
            <button onClick={() => setShowCompleteModal(false)} className="mt-6 text-xs font-bold uppercase tracking-machined text-muted hover:text-ink">
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
