"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { motion } from "motion/react";
import {
  CalendarDays,
  Car,
  Wrench,
  User,
  ArrowRight,
  XCircle,
  Clock,
  MapPin,
  Sparkles,
  CheckCircle2,
  Pencil,
  Trash2,
  Activity,
} from "lucide-react";
import { useStore } from "@/lib/store";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { ConfirmDialog } from "@/components/shared/ConfirmDialog";
import { DashboardCardSkeleton, ListSkeleton } from "@/components/animations";
import { ActivityTimeline, formatDateShort } from "@/components/customer/ActivityTimeline";

const easeOut: [number, number, number, number] = [0.25, 0.1, 0.25, 1];

const stagger = {
  hidden: { opacity: 0, y: 14 },
  show: (i: number) => ({ opacity: 1, y: 0, transition: { duration: 0.32, delay: i * 0.06, ease: easeOut } }),
};

export default function CustomerDashboard() {
  const mockUser = useStore((state) => state.mockUser);
  const bookings = useStore((state) => state.bookings);
  const customerGarage = useStore((state) => state.customerGarage);
  const cancelBooking = useStore((state) => state.cancelBooking);
  const rescheduleBooking = useStore((state) => state.rescheduleBooking);
  const deleteCustomerVehicle = useStore((state) => state.deleteCustomerVehicle);
  const allTimeSlots = useStore((state) => state.timeSlots);

  const [ready, setReady] = useState(false);
  const [cancelModal, setCancelModal] = useState<{ booking: typeof bookings[0] | null; mode: "confirm" | "reschedule" }>({ booking: null, mode: "confirm" });
  const [rescheduleDate, setRescheduleDate] = useState("");
  const [rescheduleTime, setRescheduleTime] = useState("");
  const [deleteVehicle, setDeleteVehicle] = useState<(typeof customerGarage)[number] | null>(null);

  useEffect(() => {
    const t = setTimeout(() => setReady(true), 450);
    return () => clearTimeout(t);
  }, []);

  const firstName = mockUser?.name?.split(" ")[0] || "";
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good Morning" : hour < 17 ? "Good Afternoon" : "Good Evening";

  const getTodayDate = () => {
    const today = new Date();
    return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;
  };

  const myBookings = bookings.filter((b) => b.customer === (mockUser?.name || "Guest"));
  const upcomingBookings = myBookings.filter((b) => b.bookingStatus === "BOOKED").sort((a, b) => a.date.localeCompare(b.date) || a.time.localeCompare(b.time));
  const nextUpcoming = upcomingBookings[0] || null;
  const pastBookings = myBookings.filter((b) => b.bookingStatus !== "BOOKED");
  const recentActivity = [...upcomingBookings, ...pastBookings]
    .sort((a, b) => (b.date + b.time).localeCompare(a.date + a.time))
    .slice(0, 6);

  const totalBookings = myBookings.length;
  const completedWashes = pastBookings.filter((b) => b.bookingStatus === "COMPLETED").length;

  const statusBadge = (b: typeof bookings[0]) => {
    const styles = b.bookingStatus === "BOOKED"
      ? "bg-warning/20 text-warning"
      : b.bookingStatus === "COMPLETED"
        ? "bg-success/20 text-success"
        : "bg-m-red/20 text-m-red";
    return <Badge className={`h-auto rounded-full px-2.5 py-1 text-[10px] font-bold uppercase ${styles}`}>{b.bookingStatus}</Badge>;
  };

  const handleConfirmCancel = () => {
    if (cancelModal.booking) {
      cancelBooking(cancelModal.booking.id, "CUSTOMER");
      toast.warning("Booking cancelled", {
        description: `Your ${cancelModal.booking.service} on ${formatDateShort(cancelModal.booking.date)} has been cancelled.`,
      });
    }
    setCancelModal({ booking: null, mode: "confirm" });
  };

  const handleReschedule = () => {
    if (cancelModal.booking && rescheduleDate && rescheduleTime) {
      rescheduleBooking(cancelModal.booking.id, rescheduleDate, rescheduleTime);
      toast.success("Booking rescheduled", {
        description: `Moved to ${formatDateShort(rescheduleDate)} · ${rescheduleTime}.`,
      });
      setCancelModal({ booking: null, mode: "confirm" });
    }
  };

  const handleDeleteVehicle = () => {
    if (deleteVehicle) {
      deleteCustomerVehicle(deleteVehicle.id);
      toast.warning("Vehicle removed", { description: `${deleteVehicle.brand} ${deleteVehicle.model} removed from your garage.` });
    }
    setDeleteVehicle(null);
  };

  const timeSlotOptions = allTimeSlots
    .filter((slot) => {
      if (rescheduleDate === getTodayDate()) {
        const slotEndTime = new Date(`${rescheduleDate}T${slot.endTime}`);
        if (slotEndTime < new Date()) return false;
      }
      return true;
    })
    .sort((a, b) => a.startTime.localeCompare(b.startTime));

  const quickActions = [
    { href: "/customer/book", label: "Book Service", sub: "Schedule a wash", icon: Wrench },
    { href: "/customer/garage", label: "Garage", sub: `${customerGarage.length} vehicles`, icon: Car },
    { href: "/customer/activity", label: "Bookings", sub: `${totalBookings} bookings`, icon: Activity },
    { href: "/customer/profile", label: "Profile", sub: "Account settings", icon: User },
  ];

  return (
    <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35, ease: easeOut }} className="mx-auto w-full max-w-5xl px-4 py-5 md:px-8 md:py-7">
      <div className="space-y-5">
        {/* ================= HERO ================= */}
        {!ready ? (
          <div className="overflow-hidden rounded-2xl border border-hairline bg-surface-card p-5">
            <DashboardCardSkeleton className="border-0 bg-transparent p-0" />
          </div>
        ) : (
          <motion.div
            variants={stagger}
            initial="hidden"
            animate="show"
            custom={0}
            className="relative overflow-hidden rounded-2xl border border-hairline bg-gradient-to-br from-yellow-dark/15 via-surface-soft to-surface-card p-5 md:p-6"
          >
            <div className="pointer-events-none absolute -top-12 -right-12 h-36 w-36 rounded-full bg-yellow-dark/10 blur-2xl" />
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div className="min-w-0">
                <p className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.2em] text-yellow-dark">
                  <Sparkles size={12} /> {greeting}
                </p>
                <h1 className="mt-1 text-xl font-bold tracking-tight text-ink md:text-2xl">
                  Welcome back, {firstName}
                  <span className="text-yellow-dark">.</span>
                </h1>
                <p className="mt-1 max-w-md text-sm font-light text-body">
                  Your car, your community, your schedule — everything for a spotless ride in one place.
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-hairline bg-surface-card px-2.5 py-1 text-[11px] font-semibold text-body">
                    <Car size={12} className="text-yellow-dark" /> {customerGarage.length} vehicles
                  </span>
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-hairline bg-surface-card px-2.5 py-1 text-[11px] font-semibold text-body">
                    <CalendarDays size={12} className="text-yellow-dark" /> {upcomingBookings.length} upcoming
                  </span>
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-hairline bg-surface-card px-2.5 py-1 text-[11px] font-semibold text-body">
                    <CheckCircle2 size={12} className="text-yellow-dark" /> {completedWashes} washes done
                  </span>
                </div>
              </div>
              <Link href="/customer/book" className="shrink-0">
                <Button className="group flex h-auto items-center gap-2 rounded-xl bg-yellow-dark px-5 py-2.5 text-xs font-bold uppercase tracking-machined text-ink shadow-md shadow-yellow-dark/20 transition-all hover:bg-yellow-light active:scale-[0.98]">
                  <Wrench size={15} /> Book Service <ArrowRight size={15} className="transition-transform group-hover:translate-x-0.5" />
                </Button>
              </Link>
            </div>
          </motion.div>
        )}

        {/* ================= QUICK ACTIONS ================= */}
        {!ready ? (
          <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
            {[0, 1, 2, 3].map((i) => (
              <div key={i} className="rounded-xl border border-hairline bg-surface-card p-4">
                <DashboardCardSkeleton className="border-0 bg-transparent p-0" />
              </div>
            ))}
          </div>
        ) : (
          <motion.div variants={stagger} initial="hidden" animate="show" custom={1} className="grid grid-cols-2 gap-3 md:grid-cols-4">
            {quickActions.map((item) => {
              const Icon = item.icon;
              return (
                <motion.div key={item.label} whileHover={{ y: -3 }} whileTap={{ scale: 0.98 }} transition={{ duration: 0.2 }}>
                  <Link href={item.href} className="flex h-full flex-col rounded-xl border border-hairline bg-surface-card p-4 transition-colors hover:border-yellow-dark/40">
                    <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-yellow-dark/10 ring-1 ring-yellow-dark/20">
                      <Icon size={18} className="text-yellow-dark" />
                    </div>
                    <p className="text-sm font-semibold text-ink">{item.label}</p>
                    <p className="mt-0.5 text-xs font-light text-muted">{item.sub}</p>
                  </Link>
                </motion.div>
              );
            })}
          </motion.div>
        )}

        {/* ================= UPCOMING BOOKING + GARAGE ================= */}
        {!ready ? (
          <div className="grid gap-5 md:grid-cols-5">
            <div className="md:col-span-3"><CardSkeletonWrap /></div>
            <div className="md:col-span-2"><CardSkeletonWrap /></div>
          </div>
        ) : (
          <motion.div variants={stagger} initial="hidden" animate="show" custom={2} className="grid gap-5 md:grid-cols-5">
            {/* Upcoming booking */}
            <div className="md:col-span-3">
              <div className="mb-2.5 flex items-center justify-between">
                <h2 className="text-xs font-bold uppercase tracking-machined text-muted">Next Wash</h2>
                <Link href="/customer/book" className="inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-machined text-yellow-dark hover:text-yellow-light transition-colors">
                  Book more <ArrowRight size={12} />
                </Link>
              </div>
              {!nextUpcoming ? (
                <div className="flex flex-col items-center rounded-2xl border border-dashed border-hairline bg-surface-card px-6 py-8 text-center">
                  <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-yellow-dark/10 ring-1 ring-yellow-dark/20">
                    <CalendarDays size={22} className="text-yellow-dark" />
                  </div>
                  <p className="mb-1 text-base font-bold text-ink">No wash scheduled</p>
                  <p className="mb-4 max-w-xs text-sm font-light text-muted">Reserve your next wash in a few taps — we&apos;ll come to you.</p>
                  <Link href="/customer/book">
                    <Button className="flex items-center gap-2 rounded-xl bg-yellow-dark px-5 py-2.5 text-xs font-bold uppercase tracking-machined text-ink transition-all hover:bg-yellow-light active:scale-[0.98]">
                      <Wrench size={14} /> Book Service
                    </Button>
                  </Link>
                </div>
              ) : (
                <div className="overflow-hidden rounded-2xl border border-hairline bg-surface-card">
                  <div className="flex items-center justify-between gap-3 border-b border-hairline px-5 py-3.5">
                    <div className="min-w-0">
                      <p className="truncate text-base font-bold text-ink">{nextUpcoming.service}</p>
                      <p className="mt-0.5 text-xs font-light text-body">{formatDateShort(nextUpcoming.date)} · {nextUpcoming.time}</p>
                    </div>
                    {statusBadge(nextUpcoming)}
                  </div>
                  <div className="grid grid-cols-2 gap-x-4 gap-y-3 px-5 py-4">
                    <div className="flex items-center gap-2 text-xs font-light text-body">
                      <Car size={14} className="shrink-0 text-muted" /> {nextUpcoming.vehicle}
                    </div>
                    <div className="flex items-center gap-2 text-xs font-light text-body">
                      <MapPin size={14} className="shrink-0 text-muted" /> {nextUpcoming.community}{nextUpcoming.flat ? ` · ${nextUpcoming.flat}` : ""}
                    </div>
                    <div className="flex items-center gap-2 text-xs font-light text-body">
                      <Clock size={14} className="shrink-0 text-muted" /> {nextUpcoming.time}
                    </div>
                    <div className="flex items-center gap-2 text-xs font-light text-body">
                      <span className="font-bold text-ink">₹{nextUpcoming.amount}</span>
                      <span className="text-muted">· {nextUpcoming.paymentStatus}</span>
                    </div>
                  </div>
                  <div className="flex gap-3 border-t border-hairline px-5 py-3.5">
                    <Button
                      variant="outline"
                      onClick={() => { setRescheduleDate(""); setRescheduleTime(""); setCancelModal({ booking: nextUpcoming, mode: "reschedule" }); }}
                      className="flex-1 h-auto rounded-xl border border-hairline py-2.5 text-xs font-bold uppercase tracking-machined text-body transition-colors hover:bg-surface-elevated hover:text-body"
                    >
                      Reschedule
                    </Button>
                    <Button
                      onClick={() => setCancelModal({ booking: nextUpcoming, mode: "confirm" })}
                      className="flex-1 h-auto rounded-xl bg-m-red/15 py-2.5 text-xs font-bold uppercase tracking-machined text-m-red transition-colors hover:bg-m-red hover:text-ink active:scale-[0.98]"
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              )}
            </div>

            {/* Garage preview */}
            <div className="md:col-span-2">
              <div className="mb-2.5 flex items-center justify-between">
                <h2 className="text-xs font-bold uppercase tracking-machined text-muted">Garage</h2>
                <Link href="/customer/garage" className="inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-machined text-yellow-dark hover:text-yellow-light transition-colors">
                  Manage <ArrowRight size={12} />
                </Link>
              </div>
              {customerGarage.length === 0 ? (
                <div className="flex flex-col items-center rounded-2xl border border-dashed border-hairline bg-surface-card px-6 py-8 text-center">
                  <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-yellow-dark/10 ring-1 ring-yellow-dark/20">
                    <Car size={22} className="text-yellow-dark" />
                  </div>
                  <p className="mb-1 text-base font-bold text-ink">No vehicles yet</p>
                  <p className="mb-4 text-sm font-light text-muted">Save a vehicle to speed up booking.</p>
                  <Link href="/customer/garage">
                    <Button variant="outline" className="h-auto rounded-xl border border-hairline px-5 py-2.5 text-xs font-bold uppercase tracking-machined text-ink transition-colors hover:bg-surface-elevated">
                      Add Vehicle
                    </Button>
                  </Link>
                </div>
              ) : (
                <div className="space-y-2.5">
                  {customerGarage.slice(0, 3).map((v) => (
                    <div key={v.id} className="flex items-center gap-3 rounded-xl border border-hairline bg-surface-card px-3.5 py-2.5 transition-colors hover:border-yellow-dark/40">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-yellow-dark/10 ring-1 ring-yellow-dark/20">
                        <Car size={15} className="text-yellow-dark" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-1.5">
                          <p className="truncate text-sm font-semibold text-ink">{v.brand} {v.model}</p>
                          {v.isDefault && (
                            <Badge variant="secondary" className="shrink-0 rounded-full bg-yellow-dark/15 px-2 py-0.5 text-[9px] font-bold uppercase tracking-machined text-yellow-dark">Primary</Badge>
                          )}
                        </div>
                        <p className="truncate font-mono text-[11px] tracking-wider text-muted">{v.reg} · {v.category}</p>
                      </div>
                      <div className="flex shrink-0 items-center gap-0.5">
                        <Link href="/customer/garage" aria-label={`Edit ${v.brand} ${v.model}`} className="rounded-lg p-1.5 text-muted transition-colors hover:bg-surface-elevated hover:text-ink">
                          <Pencil size={14} />
                        </Link>
                        <button
                          type="button"
                          onClick={() => setDeleteVehicle(v)}
                          aria-label={`Delete ${v.brand} ${v.model}`}
                          className="rounded-lg p-1.5 text-muted transition-colors hover:bg-m-red/10 hover:text-m-red"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  ))}
                  {customerGarage.length > 3 && (
                    <p className="pt-0.5 text-center text-[11px] font-semibold text-muted">+{customerGarage.length - 3} more in your garage</p>
                  )}
                </div>
              )}
            </div>
          </motion.div>
        )}

        {/* ================= RECENT ACTIVITY ================= */}
        <motion.div variants={stagger} initial="hidden" animate="show" custom={3}>
          <div className="mb-2.5 flex items-center justify-between">
            <h2 className="text-xs font-bold uppercase tracking-machined text-muted">Recent Activity</h2>
            <Link href="/customer/activity" className="inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-machined text-yellow-dark hover:text-yellow-light transition-colors">
              View all ({totalBookings}) <ArrowRight size={12} />
            </Link>
          </div>
          {!ready ? (
            <ListSkeleton items={3} />
          ) : recentActivity.length === 0 ? (
            <div className="flex flex-col items-center rounded-2xl border border-dashed border-hairline bg-surface-card px-6 py-8 text-center">
              <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-yellow-dark/10 ring-1 ring-yellow-dark/20">
                <CalendarDays size={22} className="text-yellow-dark" />
              </div>
              <p className="mb-1 text-base font-bold text-ink">No activity yet</p>
              <p className="mb-4 max-w-xs text-sm font-light text-muted">Your bookings and their status will show up here.</p>
              <Link href="/customer/book">
                <Button className="flex items-center gap-2 rounded-xl bg-yellow-dark px-5 py-2.5 text-xs font-bold uppercase tracking-machined text-ink transition-all hover:bg-yellow-light active:scale-[0.98]">
                  <Wrench size={14} /> Make your first booking
                </Button>
              </Link>
            </div>
          ) : (
            <ActivityTimeline bookings={recentActivity} />
          )}
        </motion.div>
      </div>

      {/* ================= CANCEL / RESCHEDULE ================= */}
      <Dialog open={!!cancelModal.booking} onOpenChange={(open) => { if (!open) setCancelModal({ booking: null, mode: "confirm" }); }}>
        <DialogContent showCloseButton className="max-h-[90vh] gap-0 overflow-y-auto rounded-2xl border border-hairline bg-surface-soft p-6 ring-0 sm:max-w-[520px]">
          {cancelModal.booking && (cancelModal.mode === "confirm" ? (
            <div>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-m-red/15 px-3 py-1 text-[10px] font-bold uppercase tracking-machined text-m-red"><XCircle size={11} /> Cancel booking</span>
              <div className="mt-3 mb-6">
                <DialogTitle className="text-xl font-bold tracking-normal text-ink">Cancel this booking?</DialogTitle>
                <DialogDescription className="mt-1.5 text-sm font-light text-muted">
                  You&apos;re cancelling <strong className="font-semibold text-ink">{cancelModal.booking.service}</strong> on {formatDateShort(cancelModal.booking.date)} · {cancelModal.booking.time}.
                </DialogDescription>
              </div>
              <div className="flex flex-col-reverse gap-2.5 sm:flex-row sm:justify-end">
                <Button
                  variant="outline"
                  onClick={() => { setRescheduleDate(""); setRescheduleTime(""); setCancelModal(prev => ({ ...prev, mode: "reschedule" })); }}
                  className="h-auto rounded-xl border border-hairline py-3 text-sm font-bold text-body transition-colors hover:bg-surface-elevated hover:text-body"
                >
                  Reschedule Instead
                </Button>
                <Button
                  onClick={handleConfirmCancel}
                  className="h-auto rounded-xl bg-m-red py-3 text-sm font-bold text-ink transition-colors hover:bg-m-red/80 active:scale-[0.98]"
                >
                  Confirm Cancel
                </Button>
              </div>
            </div>
          ) : (
            <div>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-yellow-dark/15 px-3 py-1 text-[10px] font-bold uppercase tracking-machined text-yellow-dark"><CalendarDays size={11} /> Reschedule</span>
              <div className="mt-3 mb-6">
                <DialogTitle className="text-xl font-bold tracking-normal text-ink">Pick a new time</DialogTitle>
                <DialogDescription className="mt-1.5 text-sm font-light text-muted">
                  Moving <strong className="font-semibold text-ink">{cancelModal.booking.service}</strong> to a new slot that suits you.
                </DialogDescription>
              </div>
              <div className="space-y-5">
                <div>
                  <Label htmlFor="rs-date" className="mb-2 block text-[11px] font-bold uppercase tracking-machined text-muted">
                    Date <span className="text-m-red" aria-hidden="true">*</span>
                  </Label>
                  <Input
                    id="rs-date"
                    type="date"
                    value={rescheduleDate}
                    onChange={(e) => { setRescheduleDate(e.target.value); setRescheduleTime(""); }}
                    min={getTodayDate()}
                    aria-required
                    className="w-full h-auto rounded-xl border border-hairline bg-surface-card p-3.5 text-sm font-light text-ink transition-colors focus:border-yellow-dark focus:outline-none [color-scheme:dark]"
                  />
                </div>
                <div>
                  <Label className="mb-2 block text-[11px] font-bold uppercase tracking-machined text-muted">
                    Time Slot <span className="text-m-red" aria-hidden="true">*</span>
                  </Label>
                  <Select value={rescheduleTime || null} onValueChange={(v) => setRescheduleTime(v || "")}>
                    <SelectTrigger className="w-full h-auto! rounded-xl border border-hairline bg-surface-card p-3.5 text-sm font-light text-ink transition-colors focus:border-yellow-dark focus:outline-none">
                      <SelectValue placeholder="Select time" />
                    </SelectTrigger>
                    <SelectContent>
                      {timeSlotOptions.map(slot => (
                        <SelectItem key={slot.id} value={slot.label}>{slot.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="mt-7 flex flex-col-reverse gap-2.5 sm:flex-row sm:justify-end">
                <Button
                  variant="outline"
                  onClick={() => setCancelModal(prev => ({ ...prev, mode: "confirm" }))}
                  className="h-auto rounded-xl border border-hairline py-3 text-sm font-bold text-body transition-colors hover:bg-surface-elevated hover:text-body"
                >
                  Back
                </Button>
                <Button
                  onClick={handleReschedule}
                  disabled={!rescheduleDate || !rescheduleTime}
                  className="h-auto rounded-xl bg-yellow-dark py-3 text-sm font-bold text-ink transition-all hover:bg-yellow-light disabled:cursor-not-allowed disabled:opacity-50 active:scale-[0.98]"
                >
                  Confirm Reschedule
                </Button>
              </div>
            </div>
          ))}
        </DialogContent>
      </Dialog>

      {/* ================= DELETE VEHICLE (garage preview) ================= */}
      <ConfirmDialog
        open={deleteVehicle !== null}
        onOpenChange={(open) => setDeleteVehicle(open ? deleteVehicle : null)}
        title="Remove Vehicle"
        description={deleteVehicle ? `Are you sure you want to remove ${deleteVehicle.brand} ${deleteVehicle.model} from your garage?` : ""}
        confirmLabel="Remove"
        cancelLabel="Cancel"
        variant="destructive"
        onConfirm={handleDeleteVehicle}
      />
    </motion.div>
  );
}

function CardSkeletonWrap() {
  return <div className="rounded-2xl border border-hairline bg-surface-card p-5"><DashboardCardSkeleton className="border-0 bg-transparent p-0" /></div>;
}