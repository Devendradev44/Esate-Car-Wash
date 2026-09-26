"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { History, CalendarDays, Car, CheckCircle2, Wrench } from "lucide-react";
import { useStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ListSkeleton } from "@/components/animations";
import { ActivityTimeline } from "@/components/customer/ActivityTimeline";

const easeOut: [number, number, number, number] = [0.25, 0.1, 0.25, 1];

type Filter = "ALL" | "BOOKED" | "COMPLETED" | "CANCELLED";

export default function BookingHistoryPage() {
  const mockUser = useStore((state) => state.mockUser);
  const bookings = useStore((state) => state.bookings);

  const [ready, setReady] = useState(false);
  const [tab, setTab] = useState<Filter>("ALL");

  useEffect(() => {
    const t = setTimeout(() => setReady(true), 450);
    return () => clearTimeout(t);
  }, []);

  const myBookings = bookings.filter((b) => b.customer === (mockUser?.name || "Guest"));
  const counts = {
    ALL: myBookings.length,
    BOOKED: myBookings.filter((b) => b.bookingStatus === "BOOKED").length,
    COMPLETED: myBookings.filter((b) => b.bookingStatus === "COMPLETED").length,
    CANCELLED: myBookings.filter((b) => b.bookingStatus === "CANCELLED").length,
  };

  const sortedBookings = [...myBookings].sort((a, b) => (b.date + b.time).localeCompare(a.date + a.time));
  const filteredBookings = tab === "ALL" ? sortedBookings : sortedBookings.filter((b) => b.bookingStatus === tab);
  const washesDone = counts.COMPLETED;

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: easeOut }}
      className="mx-auto w-full max-w-3xl px-4 py-5 md:px-8 md:py-7"
    >
      <div className="mb-6">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-yellow-dark/10 ring-1 ring-yellow-dark/20">
            <History size={20} className="text-yellow-dark" />
          </div>
          <div>
            <h1 className="text-2xl font-bold uppercase tracking-normal text-ink">Booking History</h1>
            <p className="mt-0.5 text-sm font-light text-body">Every wash, every status — all in one place.</p>
          </div>
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-hairline bg-surface-card px-2.5 py-1 text-[11px] font-semibold text-body">
            <CalendarDays size={12} className="text-yellow-dark" /> {counts.ALL} total
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-hairline bg-surface-card px-2.5 py-1 text-[11px] font-semibold text-body">
            <Car size={12} className="text-yellow-dark" /> {counts.BOOKED} upcoming
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-hairline bg-surface-card px-2.5 py-1 text-[11px] font-semibold text-body">
            <CheckCircle2 size={12} className="text-yellow-dark" /> {washesDone} washes done
          </span>
        </div>
      </div>

      {!ready ? (
        <ListSkeleton items={4} />
      ) : myBookings.length === 0 ? (
        <div className="flex flex-col items-center rounded-2xl border border-dashed border-hairline bg-surface-card px-6 py-12 text-center">
          <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-yellow-dark/10 ring-1 ring-yellow-dark/20">
            <History size={22} className="text-yellow-dark" />
          </div>
          <p className="mb-1 text-base font-bold text-ink">No bookings yet</p>
          <p className="mb-4 max-w-xs text-sm font-light text-muted">Once you book a wash, its history and status will appear here.</p>
          <Link href="/customer/book">
            <Button className="flex items-center gap-2 rounded-xl bg-yellow-dark px-5 py-2.5 text-xs font-bold uppercase tracking-machined text-ink transition-all hover:bg-yellow-light active:scale-[0.98]">
              <Wrench size={14} /> Book your first wash
            </Button>
          </Link>
        </div>
      ) : (
        <Tabs value={tab} onValueChange={(v) => setTab(v as Filter)} className="w-full">
          <TabsList variant="line" className="mb-4 w-full h-auto flex-wrap gap-1 rounded-none border-b border-hairline pb-0">
            <TabsTrigger value="ALL" className="whitespace-normal leading-tight">All ({counts.ALL})</TabsTrigger>
            <TabsTrigger value="BOOKED" className="whitespace-normal leading-tight">Booked ({counts.BOOKED})</TabsTrigger>
            <TabsTrigger value="COMPLETED" className="whitespace-normal leading-tight">Completed ({counts.COMPLETED})</TabsTrigger>
            <TabsTrigger value="CANCELLED" className="whitespace-normal leading-tight">Cancelled ({counts.CANCELLED})</TabsTrigger>
          </TabsList>
          {(["ALL", "BOOKED", "COMPLETED", "CANCELLED"] as Filter[]).map((f) => (
            <TabsContent key={f} value={f}>
              {filteredBookings.length === 0 ? (
                <div className="flex flex-col items-center rounded-2xl border border-dashed border-hairline bg-surface-card px-6 py-10 text-center">
                  <p className="mb-1 text-base font-bold text-ink">No {f === "ALL" ? "bookings" : f.toLowerCase()} here</p>
                  <p className="max-w-xs text-sm font-light text-muted">
                    {f === "CANCELLED" ? "Cancelled bookings will show up on this tab." : f === "BOOKED" ? "Your scheduled washes will show up here." : f === "COMPLETED" ? "Completed washes will show up here." : "Nothing matches this filter yet."}
                  </p>
                </div>
              ) : (
                <ActivityTimeline bookings={filteredBookings} />
              )}
            </TabsContent>
          ))}
        </Tabs>
      )}
    </motion.div>
  );
}