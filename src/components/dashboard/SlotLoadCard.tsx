"use client";

import { useMemo } from "react";
import { useRouter } from "next/navigation";
import { CalendarClock, TriangleAlert } from "lucide-react";
import { getTimeSlotsForCommunity, type BookingItem } from "@/lib/store";
import { useNow } from "@/lib/useNow";
import { dateToKey, slotStart24 } from "@/lib/bookingSort";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

type CommunityLike = { id: string; name: string; slotCapacity: number; timeRange?: { start: string; end: string } };

const norm = (v: string) => v.trim().toLowerCase();

const clock12 = (hm?: string) => {
  if (!hm) return "";
  const [h, m] = hm.split(":").map(Number);
  if (isNaN(h)) return hm;
  const d = new Date();
  d.setHours(h, m || 0, 0, 0);
  return d.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
};

interface SlotLoadCardProps {
  bookings: BookingItem[];
  communities: CommunityLike[];
  dayKey: string;
  communityFilter: string;
}

export function SlotLoadCard({ bookings, communities, dayKey, communityFilter }: SlotLoadCardProps) {
  const router = useRouter();
  const now = useNow();

  const dayBookings = useMemo(
    () => bookings.filter((b) => dateToKey(b.date) === dayKey && b.bookingStatus !== "CANCELLED"),
    [bookings, dayKey]
  );

  const visibleCommunities = useMemo(() => {
    const names = new Set<string>();
    communities.forEach((c) => c.name && c.name.trim() && names.add(c.name));
    dayBookings.forEach((b) => b.community && b.community.trim() && names.add(b.community));
    return [...names].sort((a, b) => a.localeCompare(b));
  }, [communities, dayBookings]);

  const communityNamesFor = (filter: string) =>
    filter === "ALL" ? visibleCommunities : visibleCommunities.filter((n) => norm(n) === norm(filter));

  const countFor = (community: string, exactTime?: string) =>
    dayBookings.filter(
      (b) => norm(b.community) === norm(community) && (exactTime === undefined || b.time === exactTime)
    ).length;

  const capFor = (community: string) => {
    const rec = communities.find((c) => norm(c.name) === norm(community));
    return rec ? rec.slotCapacity : 10;
  };

  const bookedCountFor = (community: string) => countFor(community);

  // Services still BOOKED whose slot has passed and nobody started them — the ownership gap.
  const unassigned = useMemo(
    () =>
      dayBookings
        .filter((b) => {
          if (b.bookingStatus !== "BOOKED" || b.assignedTo) return false;
          if (communityFilter !== "ALL" && norm(b.community) !== norm(communityFilter)) return false;
          const t = slotStart24(b.time);
          if (!t) return false;
          const dt = new Date(`${b.date}T${t}`);
          return !isNaN(dt.getTime()) && now >= dt.getTime();
        })
        .sort((a, b) => a.time.localeCompare(b.time)),
    [dayBookings, communityFilter, now]
  );

  const fillCls = (count: number, cap: number) => {
    if (count === 0) return { chip: "border-hairline bg-surface-card text-muted", bar: "bg-surface-elevated", note: "text-muted" };
    if (count >= cap && cap > 0) return { chip: "border-warning/40 bg-warning/15 text-warning", bar: "bg-warning", note: "text-warning" };
    if (count > cap) return { chip: "border-m-red/40 bg-m-red/15 text-m-red", bar: "bg-m-red", note: "text-m-red" };
    return { chip: "border-success/40 bg-success/15 text-success", bar: "bg-success", note: "text-success" };
  };

  const scopeNames = communityNamesFor(communityFilter);
  const showingAll = communityFilter === "ALL";

  return (
    <Card className="mt-8 rounded-lg border border-hairline bg-surface-card ring-0">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <div>
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <CalendarClock size={16} className="text-yellow-dark" /> Today&apos;s Slot Load
          </CardTitle>
          <CardDescription>
            {showingAll
              ? "Bookings per community vs capacity today."
              : `${communityFilter} — 30-min slot occupancy vs capacity.`}
            {" "}({dayKey})
          </CardDescription>
        </div>
        <Badge variant="secondary" className="text-xs">
          {scopeNames.length} {scopeNames.length === 1 ? "community" : "communities"}
        </Badge>
      </CardHeader>

      <CardContent className="space-y-6">
        {scopeNames.length === 0 ? (
          <p className="text-sm font-light text-muted">No communities with activity on {dayKey}. Define communities on the Communities page to plan slots.</p>
        ) : showingAll ? (
          <div className="space-y-3">
            {scopeNames.map((name) => {
              const count = bookedCountFor(name);
              const cap = capFor(name);
              const cls = fillCls(count, cap);
              const pct = cap > 0 ? Math.min(100, Math.round((count / cap) * 100)) : (count > 0 ? 100 : 0);
              return (
                <div key={name} className="flex items-center gap-4">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-semibold text-foreground">{name}</p>
                      <p className={`text-xs font-bold tabular-nums ${cls.note}`}>{count}/{cap || "—"}</p>
                    </div>
                    <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-surface-elevated">
                      <div className={`h-full rounded-full ${cls.bar}`} style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                  {count > 0 && count >= cap && cap > 0 && (
                    <Badge className="h-auto rounded-full px-2 py-0.5 text-[10px] font-bold uppercase bg-warning/20 text-warning">Full</Badge>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          (() => {
            const name = scopeNames[0];
            const cap = capFor(name);
            const rec = communities.find((c) => norm(c.name) === norm(name));
            const slots = getTimeSlotsForCommunity(rec?.id);
            return (
              <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8">
                {slots.map((slot) => {
                  const count = countFor(name, slot.startTime);
                  const cls = fillCls(count, cap);
                  return (
                    <div key={slot.id} className={`flex flex-col items-center justify-center rounded-lg border px-1 py-2 ${cls.chip}`}>
                      <span className="text-[10px] font-bold uppercase tracking-machined">{clock12(slot.startTime)}</span>
                      <span className="mt-0.5 text-xs font-bold tabular-nums">{count}/{cap || "—"}</span>
                    </div>
                  );
                })}
              </div>
            );
          })()
        )}

        <div className="border-t border-hairline pt-4">
          <div className="mb-2 flex items-center justify-between">
            <p className="text-xs font-bold uppercase tracking-machined text-muted">Needs pickup</p>
            <p className="text-xs font-light text-muted">{unassigned.length} missed</p>
          </div>
          {unassigned.length === 0 ? (
            <p className="text-sm font-light text-muted">Everything scheduled so far has been picked up.</p>
          ) : (
            <div className="space-y-2">
              {unassigned.map((b) => (
                <button
                  key={b.id}
                  onClick={() => router.push("/bookings")}
                  className="flex w-full items-center justify-between gap-2 rounded-lg border border-hairline bg-surface-soft px-3 py-2 text-left transition-colors hover:border-yellow-dark/40"
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-foreground">{b.customer}</p>
                    <p className="truncate text-xs font-light text-muted">
                      {b.service} · {clock12(b.time)} · {b.community}
                    </p>
                  </div>
                  <Badge className="h-auto shrink-0 rounded-full px-2 py-0.5 text-[10px] font-bold uppercase bg-m-red/20 text-m-red">
                    <TriangleAlert size={10} className="mr-1" /> Needs pickup
                  </Badge>
                </button>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}