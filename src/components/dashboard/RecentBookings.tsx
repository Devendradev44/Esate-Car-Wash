"use client";

import { Badge } from "@/components/ui/badge";

interface BookingData {
  id: string;
  customer: string;
  service: string;
  date: string;
  time: string;
  status: string;
  amount: number;
  vehicle?: string;
  community?: string;
}

interface RecentBookingProps {
  booking: BookingData;
  className?: string;
}

function formatTime(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
}

function getStatusColor(status: string): string {
  switch (status) {
    case "BOOKED": return "bg-blue-500";
    case "COMPLETED": return "bg-green-500";
    case "CANCELLED": return "bg-red-500";
    default: return "bg-gray-500";
  }
}

function getStatusLabel(status: string): string {
  switch (status) {
    case "BOOKED": return "Booked";
    case "COMPLETED": return "Completed";
    case "CANCELLED": return "Cancelled";
    default: return status;
  }
}

export function RecentBooking({ booking }: RecentBookingProps) {
  return (
    <div className="flex items-center justify-between py-3.5 transition-colors hover:bg-muted-bg/40 border-b last:border-b-0">
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-3">
          <div className={`w-2 h-2 rounded-full ${getStatusColor(booking.status)}`} />
          <p className="truncate text-sm font-semibold text-foreground">
            {booking.customer}
          </p>
          <Badge variant="secondary" className="text-[10px] hidden sm:inline-block">
            {booking.service}
          </Badge>
        </div>
        <p className="truncate text-xs text-muted-foreground mt-1">
          {booking.service} Â· {booking.vehicle || "N/A"}
        </p>
      </div>
      <div className="ml-4 text-right space-y-1">
        <p className="text-sm font-bold text-foreground">Rs.{booking.amount}</p>
        <div className="flex items-center gap-2 justify-end">
          <Badge 
            variant={booking.status === "COMPLETED" ? "default" : "secondary"}
            className="text-[10px] font-semibold uppercase"
          >
            {getStatusLabel(booking.status)}
          </Badge>
          <span className="text-xs text-muted-foreground hidden md:inline">
            {formatTime(booking.date)}
          </span>
        </div>
      </div>
    </div>
  );
}

export function RecentBookings({ 
  bookings, 
  className 
}: { 
  bookings: BookingData[]; 
  className?: string; 
}) {
  return (
    <div className={className}>
      <div className="divide-y divide-border">
        {bookings.map((booking) => (
          <RecentBooking key={booking.id} booking={booking} />
        ))}
      </div>
    </div>
  );
}
