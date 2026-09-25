"use client";
import Link from "next/link";
import { motion } from "motion/react";
import { CalendarDays, Wrench } from "lucide-react";
import { useStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { ActivityTimeline } from "@/components/customer/ActivityTimeline";

const easeOut: [number, number, number, number] = [0.25, 0.1, 0.25, 1];

export default function ActivityPage() {
  const mockUser = useStore((state) => state.mockUser);
  const bookings = useStore((state) => state.bookings);

  const myBookings = bookings.filter((b) => b.customer === (mockUser?.name || "Guest"));
  const sorted = [...myBookings].sort((a, b) => (b.date + b.time).localeCompare(a.date + a.time));

  const completed = myBookings.filter((b) => b.bookingStatus === "COMPLETED").length;
  const upcoming = myBookings.filter((b) => b.bookingStatus === "BOOKED").length;

  return (
    <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35, ease: easeOut }} className="mx-auto w-full max-w-3xl px-4 py-5 md:px-8 md:py-7">
      <div className="space-y-5">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold uppercase tracking-normal text-ink">Activity</h1>
            <p className="mt-1 text-sm font-light text-body">Every booking, wash and change — all in one timeline.</p>
          </div>
          <div className="flex gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-hairline bg-surface-card px-2.5 py-1 text-[11px] font-semibold text-body">
              <CalendarDays size={12} className="text-yellow-dark" /> {upcoming} upcoming
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-hairline bg-surface-card px-2.5 py-1 text-[11px] font-semibold text-body">
              {completed} washes done
            </span>
          </div>
        </div>

        {sorted.length === 0 ? (
          <div className="flex flex-col items-center rounded-2xl border border-dashed border-hairline bg-surface-card px-6 py-10 text-center">
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-yellow-dark/10 ring-1 ring-yellow-dark/20">
              <CalendarDays size={26} className="text-yellow-dark" />
            </div>
            <p className="mb-1 text-lg font-bold text-ink">No activity yet</p>
            <p className="mb-5 max-w-xs text-sm font-light text-muted">Your bookings and their status will show up here.</p>
            <Link href="/customer/book">
              <Button className="flex items-center gap-2 rounded-xl bg-yellow-dark px-5 py-2.5 text-xs font-bold uppercase tracking-machined text-ink transition-all hover:bg-yellow-light active:scale-[0.98]">
                <Wrench size={14} /> Book Service
              </Button>
            </Link>
          </div>
        ) : (
          <ActivityTimeline bookings={sorted} />
        )}
      </div>
    </motion.div>
  );
}