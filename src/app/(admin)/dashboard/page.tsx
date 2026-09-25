"use client";

import { useState, useMemo } from "react";
import {
  CalendarDays,
  Clock,
  CheckCircle2,
  XCircle,
  ArrowUpRight,
  ArrowDownRight,
  ArrowDownLeft,
  IndianRupee,
  Wallet,
  TrendingUp,
  TrendingDown,
  Smartphone,
  Banknote,
} from "lucide-react";
import { useStore } from "@/lib/store";
import { PageHeader } from "@/components/layout/PageHeader";
import { StatCard } from "@/components/shared/StatCard";
import { EmptyState } from "@/components/shared/EmptyState";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Toolbar } from "@/components/layout/Toolbar";
import { FilterBar } from "@/components/layout/FilterBar";
import { PageContainer } from "@/components/layout/PageContainer";
import { SectionHeader } from "@/components/layout/SectionHeader";

type DateFilter = "TODAY" | "YESTERDAY" | "MONTH" | "YEAR" | "CUSTOM";

const pad = (n: number) => String(n).padStart(2, "0");

// Normalize any stored booking date into a comparable "YYYY-MM-DD" key.
// Handles "2026-09-24", "2026-09-24T10:00", "24/09/2026", "9/24/2026", etc.
function toDateKey(value: string): string {
  if (!value) return "";
  const v = value.trim();
  const iso = v.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (iso) return `${iso[1]}-${iso[2]}-${iso[3]}`;
  const parts = v.match(/^(\d{1,2})[/-](\d{1,2})[/-](\d{4})/);
  if (parts) {
    const a = Number(parts[1]);
    const b = Number(parts[2]);
    if (a <= 31 && b <= 12) return `${parts[3]}-${pad(b)}-${pad(a)}`;
    if (a <= 12 && b <= 31) return `${parts[3]}-${pad(a)}-${pad(b)}`;
  }
  const d = new Date(v);
  return isNaN(d.getTime()) ? v : `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

function dateToKey(d: Date) {
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

// Booking communities may carry stray whitespace/case — compare normalized.
const norm = (v: string) => v.trim().toLowerCase();

const matchesCommunityFilter = (b: { community: string }, communityFilter: string) =>
  communityFilter === "ALL" || norm(b.community) === norm(communityFilter);

// Company-wide (no community) expenses count for every community filter; community expenses count only for their own.
const matchesExpenseFilter = (e: { community?: string }, communityFilter: string) =>
  communityFilter === "ALL" || !e.community || norm(e.community) === norm(communityFilter);

function getDateRange(filter: DateFilter, customDate?: string) {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  let startKey = dateToKey(today);
  let endKey = startKey;

  switch (filter) {
    case "YESTERDAY":
      startKey = dateToKey(new Date(today.getTime() - 86400000));
      endKey = startKey;
      break;
    case "MONTH":
      startKey = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-01`;
      endKey = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate())}`;
      break;
    case "YEAR":
      startKey = `${now.getFullYear()}-01-01`;
      endKey = `${now.getFullYear()}-12-31`;
      break;
    case "CUSTOM":
      if (customDate) {
        startKey = toDateKey(customDate);
        endKey = startKey;
      }
      break;
  }
  return { startKey, endKey };
}

function isWithinRange(dateStr: string, startKey: string, endKey: string): boolean {
  const dk = toDateKey(dateStr);
  return dk.length === 10 && dk >= startKey && dk <= endKey;
}

export default function AdminDashboard() {
  const bookings = useStore((state) => state.bookings);
  const expenses = useStore((state) => state.expenses);
  const communities = useStore((state) => state.communities);

  const [dateFilter, setDateFilter] = useState<DateFilter>("TODAY");
  const [customDate, setCustomDate] = useState("");
  const [communityFilter, setCommunityFilter] = useState("ALL");

  const { startKey, endKey } = useMemo(
    () => getDateRange(dateFilter, customDate || undefined),
    [dateFilter, customDate]
  );

  const filteredBookings = useMemo(() => {
    return bookings.filter((b) => {
      if (!isWithinRange(b.date, startKey, endKey)) return false;
      if (!matchesCommunityFilter(b, communityFilter)) return false;
      return true;
    });
  }, [bookings, startKey, endKey, communityFilter]);

  const kpis = useMemo(() => {
    const today = new Date();
    const todayLocalStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;

    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayLocalStr = `${yesterday.getFullYear()}-${String(yesterday.getMonth() + 1).padStart(2, '0')}-${String(yesterday.getDate()).padStart(2, '0')}`;

    const pct = (num: number, den: number) => den <= 0 ? (num > 0 ? 100 : 0) : Math.round(((num - den) / den) * 100);
    const share = (num: number, den: number) => den <= 0 ? 0 : Math.round((num / den) * 100);
    
    const todayBookings = bookings.filter(
      (b) => toDateKey(b.date) === todayLocalStr && matchesCommunityFilter(b, communityFilter)
    ).length;
    const yesterdayBookings = bookings.filter(
      (b) => toDateKey(b.date) === yesterdayLocalStr && b.bookingStatus === "BOOKED" && matchesCommunityFilter(b, communityFilter)
    ).length;
    const inProgress = filteredBookings.filter((b) => b.bookingStatus === "BOOKED").length;
    const completed = filteredBookings.filter((b) => b.bookingStatus === "COMPLETED").length;
    const cancelled = filteredBookings.filter((b) => b.bookingStatus === "CANCELLED").length;
  const upcoming = bookings.filter(
      (b) =>
        toDateKey(b.date) > todayLocalStr &&
        b.bookingStatus === "BOOKED" &&
        matchesCommunityFilter(b, communityFilter)
    ).length;
  const todayRevenue = bookings
      .filter(
        (b) =>
          toDateKey(b.date) === todayLocalStr &&
          b.paymentStatus === "PAID" &&
          matchesCommunityFilter(b, communityFilter)
      )
      .reduce((sum, b) => sum + b.amount, 0);
    const yesterdayRevenue = bookings
      .filter(
        (b) =>
          toDateKey(b.date) === yesterdayLocalStr &&
          b.paymentStatus === "PAID" &&
          matchesCommunityFilter(b, communityFilter)
      )
      .reduce((sum, b) => sum + b.amount, 0);
    const todayExpense = expenses
      .filter((e) => toDateKey(e.date) === todayLocalStr && matchesExpenseFilter(e, communityFilter))
      .reduce((sum, e) => sum + e.amount, 0);
    const yesterdayExpense = expenses
      .filter((e) => toDateKey(e.date) === yesterdayLocalStr && matchesExpenseFilter(e, communityFilter))
      .reduce((sum, e) => sum + e.amount, 0);
    const todayUpi = bookings
      .filter(
        (b) =>
          toDateKey(b.date) === todayLocalStr &&
          b.paymentStatus === "PAID" &&
          b.paymentMethod === "UPI" &&
          matchesCommunityFilter(b, communityFilter)
      )
      .reduce((sum, b) => sum + b.amount, 0);
    const todayCash = bookings
      .filter(
        (b) =>
          toDateKey(b.date) === todayLocalStr &&
          b.paymentStatus === "PAID" &&
          b.paymentMethod === "CASH" &&
          matchesCommunityFilter(b, communityFilter)
      )
      .reduce((sum, b) => sum + b.amount, 0);
    const totalRevenue = bookings
      .filter((b) => b.paymentStatus === "PAID" && matchesCommunityFilter(b, communityFilter))
      .reduce((sum, b) => sum + b.amount, 0);
    const totalExpense = expenses.filter((e) => matchesExpenseFilter(e, communityFilter)).reduce((sum, e) => sum + e.amount, 0);
    const netProfit = totalRevenue - totalExpense;

    return [
      { title: "Upcoming", value: upcoming, icon: ArrowUpRight },
      { title: "In Progress", value: inProgress, icon: Clock, trend: filteredBookings.length > 0 ? { value: share(inProgress, filteredBookings.length), label: "of filtered" } : undefined },
      { title: "Completed", value: completed, icon: CheckCircle2, trend: filteredBookings.length > 0 ? { value: share(completed, filteredBookings.length), label: "of filtered" } : undefined },
      { title: "Cancelled", value: cancelled, icon: XCircle, trend: filteredBookings.length > 0 ? { value: share(cancelled, filteredBookings.length), label: "of filtered" } : undefined },
      { title: "Today's Bookings", value: todayBookings, icon: CalendarDays, trend: { value: pct(todayBookings, yesterdayBookings), label: "vs yesterday" } },
      { title: "Today's Revenue", value: `Rs.${todayRevenue.toLocaleString("en-IN")}`, icon: IndianRupee, trend: { value: pct(todayRevenue, yesterdayRevenue), label: "vs yesterday" } },
      { title: "Today's Expense", value: `Rs.${todayExpense.toLocaleString("en-IN")}`, icon: ArrowDownRight, trend: { value: pct(todayExpense, yesterdayExpense), label: "vs yesterday" } },
      { title: "Total Revenue", value: `Rs.${totalRevenue.toLocaleString("en-IN")}`, icon: Wallet },
      { title: "Total Expense", value: `Rs.${totalExpense.toLocaleString("en-IN")}`, icon: ArrowDownLeft },
      { title: "Net Profit", value: `Rs.${netProfit.toLocaleString("en-IN")}`, icon: netProfit >= 0 ? TrendingUp : TrendingDown, trend: { value: share(netProfit, totalRevenue), label: "margin" } },
      { title: "Today's Payment UPI", value: `Rs.${todayUpi.toLocaleString("en-IN")}`, icon: Smartphone },
      { title: "Today's Payment Cash", value: `Rs.${todayCash.toLocaleString("en-IN")}`, icon: Banknote },
    ];
  }, [bookings, expenses, filteredBookings, communityFilter]);

  const recentBookings = useMemo(() => {
    return [...filteredBookings]
      .sort((a, b) => toDateKey(b.date).localeCompare(toDateKey(a.date)))
      .slice(0, 5);
  }, [filteredBookings]);

  const communityOptions = useMemo(() => {
    const names = new Set<string>();
    communities.forEach((c) => {
      if (c.name && c.name.trim() && c.name !== "Unknown") names.add(c.name);
    });
    bookings.forEach((b) => {
      if (b.community && b.community.trim() && b.community !== "Unknown") names.add(b.community);
    });
    return [...names].sort((a, b) => a.localeCompare(b));
  }, [communities, bookings]);

  const filterOptions: { key: DateFilter; label: string }[] = [
    { key: "TODAY", label: "Today" },
    { key: "YESTERDAY", label: "Yesterday" },
    { key: "MONTH", label: "Month" },
    { key: "YEAR", label: "Year" },
    { key: "CUSTOM", label: "Date Filter" },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground">
      <PageContainer padding="lg" maxWidth="7xl">
        <PageHeader
          title="Dashboard"
          description="Business overview and key metrics."
        />

        <Toolbar>
          <FilterBar>
            <Select value={dateFilter} onValueChange={(v) => setDateFilter(v as DateFilter)}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Select Date Filter" />
              </SelectTrigger>
              <SelectContent>
                {filterOptions.map((f) => (
                  <SelectItem key={f.key} value={f.key}>
                    {f.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {dateFilter === "CUSTOM" && (
              <Input
                type="date"
                value={customDate}
                onChange={(e) => setCustomDate(e.target.value)}
                className="w-full h-8 sm:w-48 rounded-lg border border-hairline bg-surface-card px-3 text-sm font-light text-ink focus:border-yellow-dark focus:outline-none"
              />
            )}

            <Select value={communityFilter} onValueChange={(v) => setCommunityFilter(v || "ALL")}>
              <SelectTrigger className="w-full sm:w-56">
                <SelectValue placeholder="All Communities" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All Communities</SelectItem>
                {communityOptions.map((name) => (
                  <SelectItem key={name} value={name}>{name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FilterBar>
        </Toolbar>

        <SectionHeader title="Key Performance Indicators" description="Today's and overall business metrics." />

        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {kpis.map((kpi) => (
            <StatCard key={kpi.title} title={kpi.title} value={kpi.value} icon={kpi.icon} trend={kpi.trend} />
          ))}
        </div>

        <Card className="mt-8">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
            <div>
              <CardTitle className="text-lg font-semibold">Recent Bookings</CardTitle>
              <CardDescription>
                {communityFilter === "ALL"
                  ? "Latest 5 bookings across all communities."
                  : `Latest 5 bookings in ${communityFilter}.`}{" "}
                ({startKey === endKey ? startKey : `${startKey} to ${endKey}`})
              </CardDescription>
            </div>
            <Badge variant="secondary" className="text-xs">
              {recentBookings.length} records
            </Badge>
          </CardHeader>
          <CardContent>
            {recentBookings.length === 0 ? (
              <EmptyState
                icon={CalendarDays}
                title={bookings.length === 0 ? "No bookings yet" : "No bookings in this view"}
                description={
                  bookings.length === 0
                    ? "Bookings will appear here once they are created."
                    : "No bookings match the selected community and date range. Try a wider range (Month / Year) or All Communities."
                }
              />
            ) : (
              <div className="divide-y divide-border">
                {recentBookings.map((b) => (
                  <div key={b.id} className="flex items-center justify-between py-3.5 transition-colors hover:bg-muted-bg/40">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-foreground">{b.customer}</p>
                      <p className="truncate text-xs text-muted-foreground">
                        {b.service} · {b.vehicle}
                      </p>
                    </div>
                    <div className="ml-4 text-right">
                      <p className="text-sm font-bold text-foreground">Rs.{b.amount}</p>
                      <div className="mt-1 flex items-center justify-end gap-1.5">
                        <Badge
                          className={`h-auto rounded-full px-2.5 py-1 text-[10px] font-bold uppercase ${
                            b.bookingStatus === "BOOKED" ? "bg-warning/20 text-warning" :
                            b.bookingStatus === "COMPLETED" ? "bg-success/20 text-success" :
                            "bg-m-red/20 text-m-red"
                          }`}
                        >
                          {b.bookingStatus}
                        </Badge>
                        <Badge
                          variant={b.paymentStatus === "PAID" ? "default" : "secondary"}
                          className="text-[10px] font-semibold uppercase"
                        >
                          {b.paymentStatus}
                        </Badge>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </PageContainer>
    </div>
  );
}
