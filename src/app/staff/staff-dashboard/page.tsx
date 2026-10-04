"use client";
import { useState } from "react";
import { motion } from "motion/react";
import { MapPin, Car, Phone, CheckCircle2, PlayCircle, XCircle, RotateCcw, Clock, Wallet, MessageCircle, Users } from "lucide-react";
import { toast } from "@/components/ui/toast";
import { useStore, type BookingItem } from "@/lib/store";
import { useNow } from "@/lib/useNow";
import { ConfirmDialog } from "@/components/shared/ConfirmDialog";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { sortByScheduledAt, slotStart24, dateToKey } from "@/lib/bookingSort";
import { NotificationBell } from "@/components/shared/NotificationBell";

type TabKey = "UPCOMING" | "IN_PROGRESS" | "COMPLETED" | "CANCELLED";

const easeOut: [number, number, number, number] = [0.25, 0.1, 0.25, 1];

const formatDate = (dateString: string) => {
  if (!dateString) return "";
  const [year, month, day] = dateString.split("-");
  return `${day}-${month}-${year}`;
};

const formatClock = (iso?: string) => {
  if (!iso) return "—";
  const d = new Date(iso);
  if (isNaN(d.getTime())) return "—";
  return d.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
};

const isPrepaid = (b: BookingItem) => b.paymentMethod === "UPI" || b.paymentMethod === "ONLINE";

const payLabel = (b: BookingItem) => (isPrepaid(b) ? `Prepaid · ${b.paymentMethod}` : "Pay by Cash");

const statusBadgeCls = (s: string) =>
  s === "COMPLETED"
    ? "bg-success/20 text-success"
    : s === "CANCELLED"
      ? "bg-m-red/20 text-m-red"
      : s === "IN_PROGRESS"
        ? "bg-warning/20 text-warning"
        : "bg-surface-elevated text-muted";

const badgeText = (s: string) => (s === "IN_PROGRESS" ? "In Progress" : s);

export default function StaffDashboard() {
  const bookings = useStore((state) => state.bookings);
  const staff = useStore((state) => state.staff);
  const mockUser = useStore((state) => state.mockUser);
  const startService = useStore((state) => state.startService);
  const completeBooking = useStore((state) => state.completeBooking);
  const cancelBooking = useStore((state) => state.cancelBooking);
  const reinstateBooking = useStore((state) => state.reinstateBooking);
  const setHelpers = useStore((state) => state.setHelpers);

  const [tab, setTab] = useState<TabKey>("UPCOMING");
  const [cancelId, setCancelId] = useState<string | null>(null);
  const [reinstateId, setReinstateId] = useState<string | null>(null);
  const [completeId, setCompleteId] = useState<string | null>(null);
  const [received, setReceived] = useState<"YES" | "NO" | "">("");
  const [whatsAppBooking, setWhatsAppBooking] = useState<BookingItem | null>(null);
  const [copyLabel, setCopyLabel] = useState("Copy reschedule link");
  const [helperBookingId, setHelperBookingId] = useState<string | null>(null);
  const [helperSelection, setHelperSelection] = useState<string[]>([]);

  // Current wall-clock time, refreshed every 15s, used ONLY to gate the 60-min no-show rule.
  const now = useNow();

  const todayStr = () => {
    const d = new Date(now);
    const pad2 = (n: number) => String(n).padStart(2, "0");
    return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`;
  };

  const myStaff = staff.find(s => s.id === mockUser?.id);
  const myId = myStaff?.id ?? "";
  const myCommunities = myStaff?.communities ?? [];

  // Staff only ever sees bookings from their assigned communities, and only TODAY'S day.
  // No past or future dates — the dashboard is the day-at-a-glance view.
  const todayKey = todayStr();
  const assignedBookings = bookings.filter(b => myCommunities.includes(b.community) && dateToKey(b.date) === todayKey);

  const isMine = (b: BookingItem) => !b.assignedTo || b.assignedTo === myId || (Array.isArray(b.helperIds) && b.helperIds.includes(myId));

  const upcoming = sortByScheduledAt(assignedBookings.filter(b => b.bookingStatus === "BOOKED"), "asc");
  const inProgress = sortByScheduledAt(assignedBookings.filter(b => b.bookingStatus === "IN_PROGRESS" && isMine(b)), "asc");
  const completed = sortByScheduledAt(assignedBookings.filter(b => b.bookingStatus === "COMPLETED"), "desc");
  const cancelled = sortByScheduledAt(assignedBookings.filter(b => b.bookingStatus === "CANCELLED"), "desc");

  const counts = {
    UPCOMING: upcoming.length,
    IN_PROGRESS: inProgress.length,
    COMPLETED: completed.length,
    CANCELLED: cancelled.length,
  };

  // Cancel is only allowed once 60 minutes have passed from the scheduled slot start.
  const cancelEligible = (b: BookingItem) => {
    if (b.bookingStatus !== "BOOKED") return false;
    const t = slotStart24(b.time);
    if (!t || !b.date) return false;
    const dt = new Date(`${b.date}T${t}`);
    if (isNaN(dt.getTime())) return false;
    return now >= dt.getTime() + 60 * 60 * 1000;
  };

  const eligibleSinceLabel = (b: BookingItem) => {
    const t = slotStart24(b.time);
    if (!t || !b.date) return "";
    const dt = new Date(`${b.date}T${t}`);
    if (isNaN(dt.getTime())) return "";
    return new Date(dt.getTime() + 60 * 60 * 1000).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
  };

  const selectedBooking = (id: string | null) => (id ? bookings.find(x => x.id === id) ?? null : null);
  const cancelBookingFor = selectedBooking(cancelId);
  const completeBookingFor = selectedBooking(completeId);
  const whatsAppPhone = whatsAppBooking?.coordinator?.phone?.replace(/\D/g, "") ?? "";

  const ownerName = (id?: string) => (id ? staff.find(s => s.id === id)?.name ?? "Unknown" : "Unassigned");
  const helperOptionsFor = (b: BookingItem) =>
    staff.filter(s => s.id !== myId && s.status === "ACTIVE" && s.communities.includes(b.community));
  const helperBookingFor = helperBookingId ? bookings.find(x => x.id === helperBookingId) ?? null : null;

  const copyRescheduleLink = async () => {
    try {
      await navigator.clipboard.writeText(rescheduleLink());
      setCopyLabel("Copied!");
      setTimeout(() => setCopyLabel("Copy reschedule link"), 1500);
    } catch {
      setCopyLabel("Copy failed — copy the link manually");
    }
  };

  const rescheduleLink = () => `${typeof window !== "undefined" ? window.location.origin : ""}/customer/my-dashboard`;

  const openWhatsAppModal = (b: BookingItem) => {
    setCopyLabel("Copy reschedule link");
    setWhatsAppBooking(b);
  };

  const whatsAppMessage = (b: BookingItem) =>
    `Hi ${b.coordinator?.name || b.customer}, your ${b.service} booking (${b.bookingCode}) for ${formatDate(b.date)} at ${b.time} was cancelled. Please reschedule at a time that suits you: ${rescheduleLink()}`;

  const waLink = whatsAppBooking
    ? `https://wa.me/${whatsAppPhone}?text=${encodeURIComponent(whatsAppMessage(whatsAppBooking))}`
    : "";

  const inputBorder = "rounded-lg border border-hairline bg-surface-card";
  const labelCls = "block text-xs font-bold uppercase tracking-machined text-muted mb-2";

  return (
    <div className="flex min-h-screen flex-col bg-canvas pb-24">
      <div className="flex items-center justify-between border-b border-hairline bg-surface-soft p-6">
        <div>
          <h1 className="text-2xl font-bold uppercase text-ink">My Assignments</h1>
          <p className="mt-1 text-sm font-light text-body">
            {myCommunities.length ? myCommunities.join(" · ") : "Not assigned to a community yet"}
            <span className="mx-1.5 text-muted">·</span>
            <span className="font-semibold text-ink">Today · {formatDate(todayKey)}</span>
          </p>
        </div>
        <NotificationBell role="STAFF" />
      </div>

      <div className="flex-1 p-4 md:p-6">
        {assignedBookings.length === 0 ? (
          <div className="mt-16 text-center">
            <p className="text-sm font-light text-muted">No bookings for your assigned communities yet.</p>
          </div>
        ) : (
          <Tabs value={tab} onValueChange={(v) => setTab(v as TabKey)} className="w-full">
            <TabsList variant="line" className="mb-5 w-full h-auto flex-wrap gap-1 rounded-none border-b border-hairline pb-0">
              <TabsTrigger value="UPCOMING" className="whitespace-normal leading-tight">Upcoming ({counts.UPCOMING})</TabsTrigger>
              <TabsTrigger value="IN_PROGRESS" className="whitespace-normal leading-tight">In Progress ({counts.IN_PROGRESS})</TabsTrigger>
              <TabsTrigger value="COMPLETED" className="whitespace-normal leading-tight">Completed ({counts.COMPLETED})</TabsTrigger>
              <TabsTrigger value="CANCELLED" className="whitespace-normal leading-tight">Cancelled ({counts.CANCELLED})</TabsTrigger>
            </TabsList>

            <TabsContent value="UPCOMING">
              {upcoming.length === 0 ? (
                <p className="mt-12 text-center text-sm font-light text-muted">No upcoming bookings.</p>
              ) : (
                <div className="space-y-4">
                  {upcoming.map((b, i) => (
                    <motion.div key={b.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.28, delay: i * 0.05, ease: easeOut }}>
                      <Card className="gap-0 rounded-lg border border-hairline bg-surface-card p-5 ring-0 transition-all duration-200 hover:-translate-y-0.5 hover:border-yellow-dark/40">
                        <div className="mb-4 flex items-start justify-between gap-3">
                          <div>
                            <p className="mb-1 text-xs font-bold uppercase tracking-machined text-yellow-dark">{b.time} | {formatDate(b.date)}</p>
                            <h3 className="text-lg font-bold text-ink">{b.customer}</h3>
                            <p className="mt-1 flex items-center gap-1 text-xs font-light text-muted"><MapPin size={12} /> {b.flat}, {b.community}</p>
                          </div>
                          <Badge className={`h-auto shrink-0 rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-machined ${statusBadgeCls(b.bookingStatus)}`}>{badgeText(b.bookingStatus)}</Badge>
                        </div>

                        <div className="mb-5 space-y-2 border-t border-hairline pt-4">
                          <p className="flex items-center gap-2 text-sm font-light text-body"><Car size={14} className="text-muted" /> {b.vehicle}</p>
                          <p className="text-sm font-light text-body">Reg: <span className="font-bold text-ink">{b.regNumber}</span></p>
                          {b.coordinator && (
                            <p className="flex items-center gap-1.5 text-sm font-light text-body">
                              <Phone size={14} className="shrink-0 text-muted" />
                              {b.coordinator.type === "DRIVER" ? "Driver" : "Coordinate with"}: <span className="font-bold text-ink">{b.coordinator.name}</span>
                              {b.coordinator.phone ? <span className="ml-1 font-light text-muted">· {b.coordinator.phone}</span> : null}
                              {b.coordinator.type !== "DRIVER" && <span className="ml-1 font-light text-muted">· self drop-off</span>}
                            </p>
                          )}
                          <p className="text-sm font-light text-body">Service: <span className="font-bold text-ink">{b.service}</span></p>
                          <div className="flex flex-wrap items-center gap-2 pt-1">
                            <p className="text-sm font-bold text-ink">Amount: ₹{b.amount}</p>
                            <span className="rounded-full border border-hairline bg-surface-elevated px-2 py-0.5 text-[10px] font-bold uppercase tracking-machined text-muted"><Wallet size={10} className="mr-1 inline" />{payLabel(b)}</span>
                          </div>
                        </div>

                        <div className="grid gap-2 md:grid-cols-2">
                          <Button
                            onClick={() => {
                              startService(b.id, myId || undefined);
                              toast.add({ type: "success", title: "Service started", description: `${b.service} for ${b.customer} is now In Progress — assigned to you.` });
                            }}
                            className="flex h-auto items-center justify-center gap-2 rounded-lg bg-success py-4 text-xs font-bold uppercase tracking-machined text-ink hover:bg-success hover:brightness-110"
                          >
                            <PlayCircle size={14} /> Start Service
                          </Button>
                          <div>
                            <Button
                              variant="outline"
                              disabled={!cancelEligible(b)}
                              onClick={() => setCancelId(b.id)}
                              className="flex w-full h-auto items-center justify-center gap-2 rounded-lg border border-m-red/50 bg-transparent py-4 text-xs font-bold uppercase tracking-machined text-m-red hover:bg-m-red hover:text-ink disabled:cursor-not-allowed disabled:border-hairline disabled:bg-transparent disabled:text-muted"
                            >
                              <XCircle size={14} /> Cancel (No Show)
                            </Button>
                            {!cancelEligible(b) && (
                              <p className="mt-1.5 text-center text-[10px] font-light text-muted">
                                {eligibleSinceLabel(b) ? `Available after ${eligibleSinceLabel(b)} (60 min after slot)` : "Available 60 min after the slot"}
                              </p>
                            )}
                          </div>
                        </div>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="IN_PROGRESS">
              {inProgress.length === 0 ? (
                <p className="mt-12 text-center text-sm font-light text-muted">No services in progress.</p>
              ) : (
                <div className="space-y-4">
                  {inProgress.map((b, i) => (
                    <motion.div key={b.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.28, delay: i * 0.05, ease: easeOut }}>
                      <Card className="gap-0 rounded-lg border border-hairline bg-surface-card p-5 ring-0 transition-all duration-200 hover:-translate-y-0.5 hover:border-yellow-dark/40">
                        <div className="mb-4 flex items-start justify-between gap-3">
                          <div>
                            <p className="mb-1 text-xs font-bold uppercase tracking-machined text-yellow-dark">{b.time} | {formatDate(b.date)}</p>
                            <h3 className="text-lg font-bold text-ink">{b.customer}</h3>
                            <p className="mt-1 flex items-center gap-1 text-xs font-light text-muted"><MapPin size={12} /> {b.flat}, {b.community}</p>
                          </div>
                          <Badge className={`h-auto shrink-0 rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-machined ${statusBadgeCls(b.bookingStatus)}`}>{badgeText(b.bookingStatus)}</Badge>
                        </div>

                        <div className="mb-5 space-y-2 border-t border-hairline pt-4">
                          <p className="flex items-center gap-2 text-sm font-light text-body"><Car size={14} className="text-muted" /> {b.vehicle}</p>
                          <p className="text-sm font-light text-body">Reg: <span className="font-bold text-ink">{b.regNumber}</span></p>
                          <p className="text-sm font-light text-body">Service: <span className="font-bold text-ink">{b.service}</span></p>
                          <div className="flex flex-wrap items-center gap-2 pt-1">
                            <p className="text-sm font-bold text-ink">Amount: ₹{b.amount}</p>
                            <span className="rounded-full border border-hairline bg-surface-elevated px-2 py-0.5 text-[10px] font-bold uppercase tracking-machined text-muted"><Wallet size={10} className="mr-1 inline" />{payLabel(b)}</span>
                          </div>
                          <p className="flex items-center gap-1.5 text-xs font-light text-muted pt-1"><Clock size={13} className="text-yellow-dark" /> Started at {formatClock(b.startTime)}</p>
                          <p className="flex flex-wrap items-center gap-1.5 pt-1 text-xs font-light text-body">
                            <span>Assigned to <span className="font-bold text-ink">{ownerName(b.assignedTo)}</span></span>
                            {Array.isArray(b.helperIds) && b.helperIds.length > 0 && b.helperIds.map(h => (
                              <span key={h} className="inline-flex items-center rounded-full border border-hairline bg-surface-elevated px-2 py-0.5 text-[10px] font-bold uppercase tracking-machined text-muted">
                                <Users size={10} className="mr-1" /> Helper · {ownerName(h)}
                              </span>
                            ))}
                          </p>
                        </div>

                        <div className="grid gap-2 md:grid-cols-2">
                          <Button
                            onClick={() => {
                              setReceived(isPrepaid(b) ? "YES" : "NO");
                              setCompleteId(b.id);
                            }}
                            className="flex w-full h-auto items-center justify-center gap-2 rounded-lg bg-yellow-dark py-4 text-xs font-bold uppercase tracking-machined text-ink hover:bg-yellow-light"
                          >
                            <CheckCircle2 size={14} /> Mark as Complete
                          </Button>
                          {b.assignedTo === myId && (
                            <Button
                              variant="outline"
                              onClick={() => {
                                setHelperSelection(b.helperIds ?? []);
                                setHelperBookingId(b.id);
                              }}
                              className="flex w-full h-auto items-center justify-center gap-2 rounded-lg border border-yellow-dark/50 bg-transparent py-4 text-xs font-bold uppercase tracking-machined text-yellow-dark hover:bg-yellow-dark hover:text-ink"
                            >
                              <Users size={14} /> Add Helper
                            </Button>
                          )}
                        </div>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="COMPLETED">
              {completed.length === 0 ? (
                <p className="mt-12 text-center text-sm font-light text-muted">No completed services.</p>
              ) : (
                <div className="space-y-4">
                  {completed.map((b, i) => (
                    <motion.div key={b.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.28, delay: i * 0.05, ease: easeOut }}>
                      <Card className="gap-0 rounded-lg border border-success/30 bg-success/5 p-5 ring-0">
                        <div className="mb-4 flex items-start justify-between gap-3">
                          <div>
                            <p className="mb-1 text-xs font-bold uppercase tracking-machined text-success">{b.time} | {formatDate(b.date)}</p>
                            <h3 className="text-lg font-bold text-ink">{b.customer}</h3>
                            <p className="mt-1 flex items-center gap-1 text-xs font-light text-muted"><MapPin size={12} /> {b.flat}, {b.community}</p>
                          </div>
                          <Badge className={`h-auto shrink-0 rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-machined ${statusBadgeCls(b.bookingStatus)}`}>{badgeText(b.bookingStatus)}</Badge>
                        </div>

                        <div className="mb-5 space-y-2 border-t border-hairline pt-4">
                          <p className="flex items-center gap-2 text-sm font-light text-body"><Car size={14} className="text-muted" /> {b.vehicle} · <span className="font-bold text-ink">{b.regNumber}</span></p>
                          <p className="text-sm font-light text-body">Service: <span className="font-bold text-ink">{b.service}</span></p>
                          <div className="grid gap-2 pt-1 sm:grid-cols-3">
                            <div className="rounded-lg border border-hairline bg-surface-card px-3 py-2">
                              <p className="text-[10px] font-bold uppercase tracking-machined text-muted">Start Time</p>
                              <p className="text-sm font-bold text-ink">{formatClock(b.startTime)}</p>
                            </div>
                            <div className="rounded-lg border border-hairline bg-surface-card px-3 py-2">
                              <p className="text-[10px] font-bold uppercase tracking-machined text-muted">End Time</p>
                              <p className="text-sm font-bold text-ink">{formatClock(b.endTime)}</p>
                            </div>
                            <div className="rounded-lg border border-hairline bg-surface-card px-3 py-2">
                              <p className="text-[10px] font-bold uppercase tracking-machined text-muted">Duration</p>
                              <p className="text-sm font-bold text-yellow-dark">{b.durationMin != null ? `${b.durationMin} min` : "—"}</p>
                            </div>
                          </div>
                        </div>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="CANCELLED">
              {cancelled.length === 0 ? (
                <p className="mt-12 text-center text-sm font-light text-muted">No cancelled bookings.</p>
              ) : (
                <div className="space-y-4">
                  {cancelled.map((b, i) => (
                    <motion.div key={b.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.28, delay: i * 0.05, ease: easeOut }}>
                      <Card className="gap-0 rounded-lg border border-hairline bg-surface-card p-5 ring-0">
                        <div className="mb-4 flex items-start justify-between gap-3">
                          <div>
                            <p className="mb-1 text-xs font-bold uppercase tracking-machined text-m-red">{b.time} | {formatDate(b.date)}</p>
                            <h3 className="text-lg font-bold text-ink">{b.customer}</h3>
                            <p className="mt-1 flex items-center gap-1 text-xs font-light text-muted"><MapPin size={12} /> {b.flat}, {b.community}</p>
                          </div>
                          <Badge className={`h-auto shrink-0 rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-machined ${statusBadgeCls(b.bookingStatus)}`}>{badgeText(b.bookingStatus)}</Badge>
                        </div>

                        <div className="mb-5 space-y-2 border-t border-hairline pt-4">
                          <p className="flex items-center gap-2 text-sm font-light text-body"><Car size={14} className="text-muted" /> {b.vehicle} · <span className="font-bold text-ink">{b.regNumber}</span></p>
                          <p className="text-sm font-light text-body">Service: <span className="font-bold text-ink">{b.service}</span> · Amount: <span className="font-bold text-ink">₹{b.amount}</span></p>
                          <p className="text-xs font-light text-muted">
                            Cancelled by{" "}
                            <span className="font-bold text-ink">
                              {b.cancelledBy === "ADMIN" ? "Admin" : b.cancelledBy === "STAFF" ? "Staff" : b.cancelledBy === "CUSTOMER" ? "Customer" : "Unknown"}
                            </span>
                            {b.cancelledAt ? <> on {formatDate(b.cancelledAt.slice(0, 10))}</> : null}
                            {isPrepaid(b) ? <> · <span className="text-muted">prepaid</span></> : null}
                          </p>
                        </div>

                        <Button
                          variant="outline"
                          onClick={() => setReinstateId(b.id)}
                          className="flex w-full h-auto items-center justify-center gap-2 rounded-lg border border-yellow-dark/50 bg-transparent py-3 text-xs font-bold uppercase tracking-machined text-yellow-dark hover:bg-yellow-dark hover:text-ink"
                        >
                          <RotateCcw size={14} /> Reinstate
                        </Button>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        )}
      </div>

      {/* Cancel (no-show) confirmation — payment-type aware */}
      <ConfirmDialog
        open={cancelId !== null}
        onOpenChange={(open) => setCancelId(open ? cancelId : null)}
        title="Cancel Booking"
        description={cancelBookingFor && isPrepaid(cancelBookingFor)
          ? "This is a prepaid booking. Cancelling will mark it CANCELLED and automatically send the customer a WhatsApp reschedule link."
          : "Are you sure you want to cancel this booking as a no-show? This will update the booking status to CANCELLED."}
        confirmLabel="Cancel Booking"
        cancelLabel="Back"
        variant="destructive"
        onConfirm={() => {
          if (cancelId) {
            const bk = bookings.find(x => x.id === cancelId);
            cancelBooking(cancelId, "STAFF");
            if (bk && isPrepaid(bk)) {
              openWhatsAppModal(bk);
              toast.add({ type: "warning", title: "Booking cancelled", description: `Prepaid booking cancelled — WhatsApp reschedule link ready for ${bk.coordinator?.name || bk.customer}.` });
            } else {
              toast.add({ type: "warning", title: "Booking cancelled", description: bk ? `${bk.service} for ${bk.customer} on ${formatDate(bk.date)} marked as no-show.` : "Booking marked as no-show." });
            }
          }
          setCancelId(null);
        }}
      />

      {/* Reinstate confirmation */}
      <ConfirmDialog
        open={reinstateId !== null}
        onOpenChange={(open) => setReinstateId(open ? reinstateId : null)}
        title="Reinstate Booking"
        description="Restore this cancelled booking to Upcoming so the service can be fulfilled?"
        confirmLabel="Reinstate"
        cancelLabel="Back"
        variant="default"
        onConfirm={() => {
          if (reinstateId) {
            const bk = bookings.find(x => x.id === reinstateId);
            reinstateBooking(reinstateId);
            toast.add({ type: "success", title: "Booking reinstated", description: bk ? `${bk.service} for ${bk.customer} restored to Upcoming.` : "Booking restored." });
          }
          setReinstateId(null);
        }}
      />

      {/* WhatsApp reschedule dispatch (prepaid cancels) */}
      <Dialog open={whatsAppBooking !== null} onOpenChange={(open) => { if (!open) setWhatsAppBooking(null); }}>
        <DialogContent showCloseButton className="gap-0 rounded-2xl border border-hairline bg-surface-soft p-7 ring-0 sm:max-w-md">
          <span className="inline-flex w-fit items-center gap-1.5 rounded-full bg-warning/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-machined text-warning">
            <MessageCircle size={11} /> Reschedule link
          </span>
          <div className="mt-3 mb-6">
            <DialogTitle className="text-2xl font-bold tracking-normal text-ink">WhatsApp link dispatched</DialogTitle>
            <DialogDescription className="mt-1.5 text-sm font-light text-muted">
              A reschedule link has been generated for {whatsAppBooking?.coordinator?.name || whatsAppBooking?.customer}{" "}
              {whatsAppBooking?.coordinator?.phone ? `(owner · ${whatsAppBooking.coordinator.phone})` : ""} and will be sent to the driver/owner on WhatsApp.
            </DialogDescription>
          </div>
          <p className="mb-2 text-[10px] font-bold uppercase tracking-machined text-muted">Message preview</p>
          <div className="mb-6 max-h-40 overflow-y-auto rounded-lg border border-hairline bg-surface-card p-3 text-xs font-light leading-relaxed text-body">
            {whatsAppBooking && whatsAppMessage(whatsAppBooking)}
          </div>
          <div className="flex flex-col gap-2.5">
            <a href={waLink} target="_blank" rel="noopener noreferrer" className="flex w-full items-center justify-center gap-2 rounded-lg bg-yellow-dark py-3.5 text-xs font-bold uppercase tracking-machined text-ink hover:bg-yellow-light">
              <MessageCircle size={14} /> Open WhatsApp
            </a>
            <Button variant="outline" onClick={copyRescheduleLink} className="flex w-full items-center justify-center gap-2 rounded-lg border border-hairline bg-surface-card py-3.5 text-xs font-bold uppercase tracking-machined text-body hover:text-ink">
              {copyLabel}
            </Button>
            <Button variant="ghost" onClick={() => setWhatsAppBooking(null)} className="flex w-full items-center justify-center gap-2 rounded-lg py-3 text-xs font-bold uppercase tracking-machined text-muted hover:text-ink">
              Done
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Add/remove helper staff on an assigned service (owner only) */}
      <Dialog open={helperBookingId !== null} onOpenChange={(open) => { if (!open) setHelperBookingId(null); }}>
        <DialogContent showCloseButton className="gap-0 rounded-2xl border border-hairline bg-surface-soft p-7 ring-0 sm:max-w-md">
          <span className="inline-flex w-fit items-center gap-1.5 rounded-full bg-yellow-dark/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-machined text-yellow-dark">
            <Users size={11} /> Add helper
          </span>
          <div className="mt-3 mb-6">
            <DialogTitle className="text-2xl font-bold tracking-normal text-ink">Add a helper for this service</DialogTitle>
            <DialogDescription className="mt-1.5 text-sm font-light text-muted">
              {helperBookingFor
                ? `${helperBookingFor.service} for ${helperBookingFor.customer} · ${helperBookingFor.community}. Helpers can view and complete the service too.`
                : "Choose staff to help with this service."}
            </DialogDescription>
          </div>
          <label className={labelCls}>Helper staff</label>
          <div className="max-h-56 overflow-y-auto rounded-lg border border-hairline bg-surface-card">
            {helperBookingFor && helperOptionsFor(helperBookingFor).length === 0 ? (
              <p className="px-4 py-3 text-xs font-light text-muted">
                No other active staff are assigned to {helperBookingFor.community}. Add staff under Staff management first.
              </p>
            ) : (
              helperBookingFor && helperOptionsFor(helperBookingFor).map((s) => (
                <label key={s.id} className="flex cursor-pointer items-center gap-3 border-b border-hairline last:border-none px-4 py-3 transition-colors hover:bg-surface-elevated">
                  <Checkbox
                    checked={helperSelection.includes(s.id)}
                    onCheckedChange={(v) => setHelperSelection(prev => v === true ? (prev.includes(s.id) ? prev : [...prev, s.id]) : prev.filter(id => id !== s.id))}
                  />
                  <span className="text-sm font-semibold text-ink">{s.name}</span>
                  <span className="ml-auto text-xs font-light text-muted">{s.communities.join(", ")}</span>
                </label>
              ))
            )}
          </div>
          <p className="mt-2 text-[10px] font-light text-muted">Helpers must have access to {helperBookingFor?.community ?? "the same community"}.</p>
          <Button
            onClick={() => {
              if (helperBookingId) {
                setHelpers(helperBookingId, helperSelection);
                toast.add({ type: "success", title: "Helpers updated", description: helperSelection.length ? "These staff can now view and complete the service." : "No helpers — you are the only one assigned." });
              }
              setHelperBookingId(null);
            }}
            className="mt-6 flex w-full items-center justify-center gap-2 rounded-lg bg-yellow-dark py-4 text-xs font-bold uppercase tracking-machined text-ink hover:bg-yellow-light"
          >
            Save helpers
          </Button>
        </DialogContent>
      </Dialog>

      {/* Complete service with payment-received confirmation */}
      <Dialog open={completeId !== null} onOpenChange={(open) => { if (!open) { setCompleteId(null); setReceived(""); } }}>
        <DialogContent showCloseButton className="gap-0 rounded-2xl border border-hairline bg-surface-soft p-7 ring-0 sm:max-w-md">
          <span className="inline-flex w-fit items-center gap-1.5 rounded-full bg-success/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-machined text-success">
            <CheckCircle2 size={11} /> Complete service
          </span>
          <div className="mt-3 mb-6">
            <DialogTitle className="text-2xl font-bold tracking-normal text-ink">Mark service complete</DialogTitle>
            <DialogDescription className="mt-1.5 text-sm font-light text-muted">
              {completeBookingFor
                ? `${completeBookingFor.service} for ${completeBookingFor.customer} · Reg ${completeBookingFor.regNumber} · ₹${completeBookingFor.amount}. Starting time was ${formatClock(completeBookingFor.startTime)}.`
                : "Confirm the completed service below."}
            </DialogDescription>
          </div>
          <label className={labelCls}>Payment received</label>
          <div className="mb-2">
            <Select value={received} onValueChange={(v) => setReceived((v || "") as "YES" | "NO" | "")}>
              <SelectTrigger className={inputBorder}>
                <SelectValue placeholder="Select payment status">
                  {(val: string) => (val === "YES" ? "Yes — payment received" : val === "NO" ? "No — payment pending" : null)}
                </SelectValue>
              </SelectTrigger>
              <SelectContent style={{ maxHeight: "min(16rem, 55vh)" }}>
                <SelectItem value="YES">Yes — payment received</SelectItem>
                <SelectItem value="NO">No — payment pending</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <p className="mb-6 text-[10px] font-light text-muted">
            {completeBookingFor && isPrepaid(completeBookingFor)
              ? "This booking was paid online, so it is prefilled as received."
              : "Cash booking — select Yes once you receive the payment."}
          </p>
          <Button
            disabled={received !== "YES"}
            onClick={() => {
              if (completeId && completeBookingFor) {
                completeBooking(completeId, completeBookingFor.paymentMethod ?? "CASH", received === "YES");
                toast.add({
                  type: received === "YES" ? "success" : "warning",
                  title: "Service completed",
                  description: received === "YES"
                    ? `₹${completeBookingFor.amount} received (${completeBookingFor.paymentMethod ?? "CASH"}). ${completeBookingFor.customer}'s booking is Completed.`
                    : `${completeBookingFor.customer}'s booking completed — payment pending.`,
                });
              }
              setCompleteId(null);
              setReceived("");
            }}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-yellow-dark py-4 text-xs font-bold uppercase tracking-machined text-ink hover:bg-yellow-light disabled:cursor-not-allowed disabled:bg-surface-elevated disabled:text-muted"
          >
            Confirm & Complete
          </Button>
        </DialogContent>
      </Dialog>
    </div>
  );
}