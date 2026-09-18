"use client";
import Link from "next/link";
import { CalendarDays, Car, Wrench, ArrowRight, XCircle } from "lucide-react";
import { useState } from "react";
import { useStore, getTimeSlotsForCommunity } from "@/lib/store";

export default function CustomerDashboard() {
  const mockUser = useStore((state) => state.mockUser);
  const bookings = useStore((state) => state.bookings);
  const cancelBooking = useStore((state) => state.cancelBooking);
  const rescheduleBooking = useStore((state) => state.rescheduleBooking);
  const allTimeSlots = useStore((state) => state.timeSlots);

  const [cancelModal, setCancelModal] = useState<{ booking: typeof bookings[0] | null; mode: 'confirm' | 'reschedule' }>({ booking: null, mode: 'confirm' });
  const [rescheduleDate, setRescheduleDate] = useState("");
  const [rescheduleTime, setRescheduleTime] = useState("");

  const formatDate = (dateString: string) => {
    if (!dateString) return "";
    const [year, month, day] = dateString.split("-");
    return `${day}-${month}-${year}`;
  };

  const getTodayDate = () => {
    const today = new Date();
    return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
  };

  const myBookings = bookings.filter(b => b.customer === (mockUser?.name || "Guest"));
  const upcomingBookings = myBookings.filter(b => b.bookingStatus === "BOOKED");
  const pastBookings = myBookings.filter(b => b.bookingStatus !== "BOOKED");
  const communityContextId = upcomingBookings.length > 0
    ? (() => {
        const cName = upcomingBookings[0]?.community;
        return useStore.getState().communities.find(c => c.name === cName)?.id;
      })()
    : undefined;
  const allTimeSlotsStore = communityContextId
    ? getTimeSlotsForCommunity(communityContextId)
    : allTimeSlots;

  const openCancelModal = (booking: typeof bookings[0]) => {
    setCancelModal({ booking, mode: 'confirm' });
  };

  const handleConfirmCancel = () => {
    if (cancelModal.booking) {
      cancelBooking(cancelModal.booking.id, "CUSTOMER");
    }
    setCancelModal({ booking: null, mode: 'confirm' });
  };

  const handleShowReschedule = () => {
    setCancelModal(prev => ({ ...prev, mode: 'reschedule' }));
  };

  const handleReschedule = () => {
    if (cancelModal.booking && rescheduleDate && rescheduleTime) {
      rescheduleBooking(cancelModal.booking.id, rescheduleDate, rescheduleTime);
      setCancelModal({ booking: null, mode: 'confirm' });
    }
  };

  const availableSlotsForDate = (date: string) => {
    if (!date) return [];
    return allTimeSlots.filter(slot => {
      if (date === getTodayDate()) {
        const slotEndTime = new Date(`${date}T${slot.endTime}`);
        if (slotEndTime < new Date()) return false;
      }
      return true;
    });
  };

  return (
    <div className="flex min-h-screen flex-col bg-canvas pb-24">
      <div className="border-b border-hairline bg-surface-soft p-6">
        <h1 className="text-2xl font-bold uppercase text-ink">My Dashboard</h1>
        <p className="mt-1 text-sm font-light text-body">Welcome back, {mockUser?.name || "Guest"}.</p>
      </div>

      <div className="flex-1 p-6 space-y-8">
        
        {/* Quick Action Button */}
        <Link href="/customer/book" className="flex items-center justify-between border border-yellow-dark bg-surface-card p-6 hover:bg-surface-elevated transition-colors">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-yellow-dark/20 text-yellow-dark"><Wrench size={20} /></div>
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
                  
                  {/* CANCEL BUTTON WITH CONFIRMATION MODAL */}
                  <button 
                    onClick={() => setCancelModal({ booking: b, mode: 'confirm' })}
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
                <div key={b.id} className="border border-hairline bg-surface-card p-5 opacity-80">
                  <div className="flex justify-between mb-2">
                    <p className="text-sm font-bold text-ink">{b.service}</p>
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

        {/* Cancel/Reschedule Modal */}
        {cancelModal.booking && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
            <div className="w-full max-w-md max-h-[90vh] overflow-y-auto border border-hairline bg-surface-soft p-6 rounded-lg">
              {cancelModal.mode === 'confirm' ? (
                <div className="space-y-4">
                  <h3 className="text-xl font-bold text-ink">Cancel Booking?</h3>
                  <p className="text-sm text-body">
                    Are you sure you want to cancel your <strong className="text-ink">{cancelModal.booking.service}</strong> booking?
                  </p>
                  <p className="text-xs text-muted">
                    {formatDate(cancelModal.booking.date)} · {cancelModal.booking.time} · {cancelModal.booking.vehicle}
                  </p>
                  <div className="flex gap-3">
                    <button 
                      onClick={() => setCancelModal(prev => ({ ...prev, mode: 'reschedule' }))}
                      className="flex-1 bg-yellow-dark py-3 text-sm font-bold text-black hover:bg-yellow-light transition-colors rounded-lg"
                    >
                      Reschedule
                    </button>
                    <button 
                      onClick={handleConfirmCancel}
                      className="flex-1 bg-m-red py-3 text-sm font-bold text-ink hover:bg-m-red/80 transition-colors rounded-lg"
                    >
                      Cancel Booking
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <h3 className="text-xl font-bold text-ink">Reschedule Booking</h3>
                  <p className="text-sm text-body">Select new date and time</p>
                  
                  <div>
                    <label className="block text-xs font-bold text-muted mb-2">Date</label>
                    <input
                      type="date"
                      value={rescheduleDate}
                      onChange={(e) => setRescheduleDate(e.target.value)}
                      min={getTodayDate()}
                      className="w-full bg-surface-card border border-hairline text-ink p-3 text-sm font-light focus:border-yellow-dark focus:outline-none rounded-lg"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-xs font-bold text-muted mb-2">Time Slot</label>
                    <select
                      value={rescheduleTime}
                      onChange={(e) => setRescheduleTime(e.target.value)}
                      className="w-full bg-surface-card border border-hairline text-ink p-3 text-sm font-light focus:border-yellow-dark focus:outline-none rounded-lg"
                    >
                      <option value="">Select time</option>
                      {allTimeSlots.filter(slot => {
                        if (rescheduleDate === getTodayDate()) {
                          const slotEndTime = new Date(`${rescheduleDate}T${slot.endTime}`);
                          if (slotEndTime < new Date()) return false;
                        }
                        return true;
                      }).map(slot => (
                        <option key={slot.id} value={slot.label}>{slot.label}</option>
                      ))}
                    </select>
                  </div>

                  <div className="flex gap-3">
                    <button 
                      onClick={() => setCancelModal(prev => ({ ...prev, mode: 'confirm' }))}
                      className="flex-1 border border-hairline py-3 text-sm font-bold text-body hover:bg-surface-elevated transition-colors rounded-lg"
                    >
                      Back
                    </button>
                    <button 
                      onClick={handleReschedule}
                      disabled={!rescheduleDate || !rescheduleTime}
                      className="flex-1 bg-yellow-dark py-3 text-sm font-bold text-black hover:bg-yellow-light transition-colors rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Confirm Reschedule
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}