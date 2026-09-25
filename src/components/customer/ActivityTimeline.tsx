"use client";
import { motion } from "motion/react";
import { CheckCircle2, XCircle, Clock } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export type TimelineBooking = {
  id: string;
  date: string;
  time: string;
  vehicle: string;
  service: string;
  amount: number;
  bookingStatus: "BOOKED" | "COMPLETED" | "CANCELLED";
  paymentStatus?: string;
};

function StatusBadge({ status }: { status: TimelineBooking["bookingStatus"] }) {
  const styles =
    status === "BOOKED"
      ? "bg-warning/20 text-warning"
      : status === "COMPLETED"
        ? "bg-success/20 text-success"
        : "bg-m-red/20 text-m-red";
  return (
    <Badge className={cn("h-auto rounded-full px-2.5 py-1 text-[10px] font-bold uppercase", styles)}>
      {status}
    </Badge>
  );
}

export function formatDateShort(dateString: string) {
  if (!dateString) return "";
  const d = new Date(`${dateString}T00:00:00`);
  if (isNaN(d.getTime())) return dateString;
  return d.toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short" });
}

export function ActivityTimeline({
  bookings,
  className = "",
}: {
  bookings: TimelineBooking[];
  className?: string;
}) {
  return (
    <Card className={cn("gap-0 divide-y divide-hairline overflow-hidden rounded-2xl border border-hairline bg-surface-card ring-0", className)}>
      {bookings.map((b, i) => {
        const statusIcon =
          b.bookingStatus === "COMPLETED" ? (
            <CheckCircle2 size={16} aria-hidden="true" />
          ) : b.bookingStatus === "CANCELLED" ? (
            <XCircle size={16} aria-hidden="true" />
          ) : (
            <Clock size={16} aria-hidden="true" />
          );
        return (
          <motion.div
            key={b.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25, delay: i * 0.04, ease: "easeOut" }}
            className="group flex items-center justify-between gap-4 px-5 py-3.5 transition-colors hover:bg-surface-soft/60"
          >
            <div className="flex min-w-0 items-center gap-4">
              <div
                className={cn(
                  "flex h-9 w-9 shrink-0 items-center justify-center rounded-full ring-1 ring-transparent transition-transform group-hover:scale-105",
                  b.bookingStatus === "COMPLETED"
                    ? "bg-success/15 text-success ring-success/20"
                    : b.bookingStatus === "CANCELLED"
                      ? "bg-m-red/15 text-m-red ring-m-red/20"
                      : "bg-yellow-dark/15 text-yellow-dark ring-yellow-dark/20"
                )}
              >
                {statusIcon}
              </div>
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-ink">{b.service}</p>
                <p className="mt-0.5 truncate text-xs font-light text-muted">
                  {formatDateShort(b.date)} · {b.time} · {b.vehicle}
                </p>
              </div>
            </div>
            <div className="flex shrink-0 flex-col items-end gap-1">
              <StatusBadge status={b.bookingStatus} />
              <span className="text-xs font-bold text-ink">₹{b.amount}</span>
            </div>
          </motion.div>
        );
      })}
    </Card>
  );
}