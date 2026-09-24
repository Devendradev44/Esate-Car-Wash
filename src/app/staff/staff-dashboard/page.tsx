"use client";
import { useState } from "react";
import { CheckCircle2, MapPin, Car, XCircle } from "lucide-react";
import { useStore } from "@/lib/store";
import { ConfirmDialog } from "@/components/shared/ConfirmDialog";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default function StaffDashboard() {

  const bookings = useStore((state) => state.bookings);
  const completeBooking = useStore((state) => state.completeBooking);
  const cancelBooking = useStore((state) => state.cancelBooking);
  const [cancelId, setCancelId] = useState<string | null>(null);

  
  const formatDate = (dateString: string) => {
    if (!dateString) return "";
    const [year, month, day] = dateString.split("-");
    return `${day}-${month}-${year}`;
  };


  // Today's scheduled bookings only (matches the "Today's Schedule" header)
  const today = new Date().toISOString().slice(0, 10);
  const todaysBookings = bookings.filter(b => b.date === today);

  return (
    <div className="flex min-h-screen flex-col bg-canvas pb-24">
      <div className="border-b border-hairline bg-surface-soft p-6">
        <h1 className="text-2xl font-bold uppercase text-ink">Today&apos;s Schedule</h1>
        <p className="mt-1 text-sm font-light text-body">All Community Assignments</p>
      </div>

      <div className="flex-1 p-6 space-y-4">
        {todaysBookings.length === 0 && (
          <div className="text-center text-muted text-sm font-light mt-20">No bookings scheduled for today.</div>
        )}

        {todaysBookings.map(b => (
          <Card key={b.id} className={`gap-0 rounded-lg border p-5 ring-0 ${b.bookingStatus === "COMPLETED" ? "border-success/30 bg-success/5" : "border-hairline bg-surface-card"}`}>
            <div className="flex justify-between items-start mb-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-machined text-yellow-dark mb-1">{b.time} | {formatDate(b.date)}</p>
                <h3 className="text-lg font-bold text-ink">{b.customer}</h3>
                <p className="text-xs font-light text-muted mt-1 flex items-center gap-1"><MapPin size={12}/> {b.flat}, {b.community}</p>
              </div>
              <Badge className={`h-auto rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-machined ${
                b.bookingStatus === "COMPLETED" ? "bg-success/20 text-success" : b.bookingStatus === "CANCELLED" ? "bg-m-red/20 text-m-red" : "bg-warning/20 text-warning"
              }`}>
                {b.bookingStatus}
              </Badge>
            </div>

            <div className="space-y-2 mb-5 border-t border-hairline pt-4">
              <p className="text-sm font-light text-body flex items-center gap-2"><Car size={14} className="text-muted"/> {b.vehicle}</p>
              <p className="text-sm font-light text-body">Reg: <span className="font-bold text-ink">{b.regNumber}</span></p>
              <p className="text-sm font-light text-body">Service: <span className="font-bold text-ink">{b.service}</span></p>
              <p className="text-sm font-bold text-ink">Amount: ₹{b.amount}</p>
            </div>

            {b.bookingStatus === "BOOKED" && (
              <>
                <div className="grid grid-cols-2 gap-2 mb-2">
                  <Button 
                    onClick={() => completeBooking(b.id, "CASH")}
                    className="flex h-auto items-center justify-center gap-2 rounded-lg bg-success py-4 text-xs font-bold uppercase tracking-machined text-ink hover:bg-success hover:brightness-110"
                  >
                    <CheckCircle2 size={14} /> Cash ₹{b.amount}
                  </Button>
                  <Button 
                    onClick={() => completeBooking(b.id, "UPI")}
                    className="flex h-auto items-center justify-center gap-2 rounded-lg bg-yellow-dark py-4 text-xs font-bold uppercase tracking-machined text-ink hover:bg-yellow-light"
                  >
                    <CheckCircle2 size={14} /> UPI ₹{b.amount}
                  </Button>
                </div>
                <Button 
                  variant="outline"
                  onClick={() => setCancelId(b.id)}
                  className="flex w-full h-auto items-center justify-center gap-2 rounded-lg border border-m-red/50 bg-transparent py-3 text-xs font-bold uppercase tracking-machined text-m-red hover:bg-m-red hover:text-ink"
                >
                  <XCircle size={14} /> Cancel (No Show)
                </Button>
              </>
            )}
          </Card>
        ))}
      </div>

      <ConfirmDialog
        open={cancelId !== null}
        onOpenChange={(open) => setCancelId(open ? cancelId : null)}
        title="Cancel Booking"
        description="Are you sure you want to cancel this booking as a no-show? This will update the booking status to CANCELLED."
        confirmLabel="Cancel Booking"
        cancelLabel="Back"
        variant="destructive"
        onConfirm={() => {
          if (cancelId) cancelBooking(cancelId, "STAFF");
          setCancelId(null);
        }}
      />
    </div>
  );
}
