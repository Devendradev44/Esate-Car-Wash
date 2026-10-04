"use client";

import { useRouter } from "next/navigation";
import {
  CalendarPlus,
  PlayCircle,
  CheckCircle2,
  AlarmClock,
  CalendarCheck,
  Users,
  Bell,
  Inbox,
  ChevronRight,
} from "lucide-react";
import { useStore, type BookingItem } from "@/lib/store";
import { useNow } from "@/lib/useNow";
import { dateToKey, slotStart24 } from "@/lib/bookingSort";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type FeedKind = "NEW" | "STARTED" | "COMPLETED" | "UNASSIGNED" | "MINE" | "HELPER";

interface FeedItem {
  id: string;
  kind: FeedKind;
  title: string;
  description: string;
}

const pad = (n: number) => String(n).padStart(2, "0");

const clock12 = (hm?: string) => {
  if (!hm) return "";
  const [h, m] = hm.split(":").map(Number);
  if (isNaN(h)) return hm;
  const d = new Date();
  d.setHours(h, m || 0, 0, 0);
  return d.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
};

const clockISO = (iso?: string) => {
  if (!iso) return "";
  const d = new Date(iso);
  return isNaN(d.getTime()) ? "" : d.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
};

const payNote = (b: BookingItem) =>
  b.paymentStatus === "PAID"
    ? `₹${b.amount} received · ${b.paymentMethod === "CASH" ? "cash" : b.paymentMethod === "UPI" ? "UPI" : "online"}`
    : `₹${b.amount} · awaiting payment`;

export function NotificationBell({ role }: { role: "ADMIN" | "STAFF" }) {
  const router = useRouter();
  const now = useNow();
  const bookings = useStore((state) => state.bookings);
  const staff = useStore((state) => state.staff);
  const mockUser = useStore((state) => state.mockUser);

  const today = new Date(now);
  const todayKey = `${today.getFullYear()}-${pad(today.getMonth() + 1)}-${pad(today.getDate())}`;

  const myId = staff.find((s) => s.id === mockUser?.id)?.id ?? "";
  const myCommunities = staff.find((s) => s.id === myId)?.communities ?? [];
  const staffName = (id?: string) => (id ? staff.find((s) => s.id === id)?.name ?? "Staff" : "Staff");

  const todays = bookings.filter((b) => dateToKey(b.date) === todayKey);

  const items: FeedItem[] = [];

  if (role === "ADMIN") {
    todays
      .filter((b) => b.bookingStatus === "BOOKED" && !b.assignedTo)
      .forEach((b) => {
        const t = slotStart24(b.time);
        if (!t) return;
        const dt = new Date(`${b.date}T${t}`);
        if (isNaN(dt.getTime()) || now < dt.getTime()) return;
        items.push({
          id: `u_${b.id}`,
          kind: "UNASSIGNED",
          title: `${b.customer} — nobody picked up`,
          description: `${b.service} · slot ${clock12(b.time)} passed · ${b.community}`,
        });
      });

    [...todays]
      .filter((b) => b.bookingStatus === "BOOKED")
      .sort((a, b) => b.time.localeCompare(a.time))
      .forEach((b) => {
        items.push({
          id: `n_${b.id}`,
          kind: "NEW",
          title: `${b.customer} booked ${b.service}`,
          description: `Today at ${clock12(b.time)} · ${b.community}`,
        });
      });

    [...todays]
      .filter((b) => b.bookingStatus === "IN_PROGRESS" && b.startTime)
      .sort((a, b) => (b.startTime ?? "").localeCompare(a.startTime ?? ""))
      .forEach((b) => {
        items.push({
          id: `s_${b.id}`,
          kind: "STARTED",
          title: `${staffName(b.assignedTo)} started ${b.service} for ${b.customer}`,
          description: `In progress · started ${clockISO(b.startTime)}`,
        });
      });

    [...todays]
      .filter((b) => b.bookingStatus === "COMPLETED" && b.endTime)
      .sort((a, b) => (b.endTime ?? "").localeCompare(a.endTime ?? ""))
      .forEach((b) => {
        items.push({
          id: `c_${b.id}`,
          kind: "COMPLETED",
          title: `${staffName(b.assignedTo)} completed ${b.service} for ${b.customer}`,
          description: payNote(b),
        });
      });
  } else {
    todays
      .filter((b) => myCommunities.includes(b.community) && b.assignedTo === myId && b.bookingStatus === "BOOKED")
      .sort((a, b) => a.time.localeCompare(b.time))
      .forEach((b) => {
        items.push({
          id: `m_${b.id}`,
          kind: "MINE",
          title: `${b.service} for ${b.customer} · today ${clock12(b.time)}`,
          description: `Your pickup · ${b.community}`,
        });
      });

    todays
      .filter(
        (b) =>
          myCommunities.includes(b.community) &&
          b.bookingStatus === "IN_PROGRESS" &&
          Array.isArray(b.helperIds) &&
          b.helperIds.includes(myId) &&
          b.assignedTo !== myId
      )
      .forEach((b) => {
        items.push({
          id: `h_${b.id}`,
          kind: "HELPER",
          title: `You're a helper on ${b.service} for ${b.customer}`,
          description: `In progress now · ${b.community}`,
        });
      });
  }

  const shown = items.slice(0, 8);
  const overflow = items.length - shown.length;

  const iconFor = (kind: FeedKind) => {
    const cls = "mt-0.5 h-4 w-4 shrink-0";
    switch (kind) {
      case "UNASSIGNED": return <AlarmClock className={`${cls} text-m-red`} />;
      case "STARTED": return <PlayCircle className={`${cls} text-warning`} />;
      case "COMPLETED": return <CheckCircle2 className={`${cls} text-success`} />;
      case "MINE": return <CalendarCheck className={`${cls} text-yellow-dark`} />;
      case "HELPER": return <Users className={`${cls} text-warning`} />;
      default: return <CalendarPlus className={`${cls} text-yellow-dark`} />;
    }
  };

  const goTo = () => {
    router.push(role === "ADMIN" ? "/bookings" : "/staff/staff-dashboard");
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button variant="ghost" size="icon" className="relative rounded-full" aria-label="Notifications">
            <Bell size={20} />
            {items.length > 0 && (
              <span className="absolute -top-0.5 -right-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-m-red px-1 text-[10px] font-bold text-white">
                {items.length > 99 ? "99+" : items.length}
              </span>
            )}
          </Button>
        }
      />
      <DropdownMenuContent align="end" className="w-80">
        <DropdownMenuGroup>
          <DropdownMenuLabel className="font-medium">
            <div className="flex items-center justify-between space-y-0">
              <p className="text-sm font-medium text-foreground">Notifications</p>
              <p className="text-xs text-muted-foreground">{items.length} new</p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
        </DropdownMenuGroup>
        {shown.length === 0 ? (
          <DropdownMenuItem className="cursor-default py-6" onClick={goTo}>
            <div className="mx-auto flex flex-col items-center gap-2 text-center">
              <Inbox size={18} className="text-muted" />
              <p className="text-xs font-light text-muted">You&apos;re all caught up.</p>
            </div>
          </DropdownMenuItem>
        ) : (
          shown.map((item) => (
            <DropdownMenuItem key={item.id} className="items-start gap-3 py-2 pr-2" onClick={goTo}>
              <span className="pt-0.5">{iconFor(item.kind)}</span>
              <span className="flex min-w-0 flex-col gap-0.5">
                <span className="text-xs font-semibold text-foreground">{item.title}</span>
                <span className="text-[11px] text-muted-foreground">{item.description}</span>
              </span>
            </DropdownMenuItem>
          ))
        )}
        {overflow > 0 && (
          <DropdownMenuItem className="cursor-default justify-center py-1.5 text-[11px] text-muted-foreground">
            +{overflow} more from today
          </DropdownMenuItem>
        )}
        <DropdownMenuSeparator />
        <DropdownMenuItem className="justify-between font-medium" onClick={goTo}>
          {role === "ADMIN" ? "View all bookings" : "Go to my dashboard"}
          <ChevronRight size={14} className="text-muted" />
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}