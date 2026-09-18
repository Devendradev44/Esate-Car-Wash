"use client";
import { useState, useMemo } from "react";
import {
  CalendarDays,
  Clock,
  CheckCircle2,
  ArrowUpRight,
  ArrowDownRight,
  IndianRupee,
  Wallet,
  TrendingUp,
  Building2,
  ChevronDown,
} from "lucide-react";
import { useStore } from "@/lib/store";

type DateFilter = "TODAY" | "YESTERDAY" | "MONTH" | "YEAR" | "CUSTOM";

function getDateRange(filter: DateFilter, customDate?: string) {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  let start = today;
  let end = new Date(today.getTime() + 86400000 - 1);

  switch (filter) {
    case "TODAY":
      start = today;
      end = new Date(today.getTime() + 86400000 - 1);
      break;
    case "YESTERDAY": {
      const yesterday = new Date(today.getTime() - 86400000);
      start = yesterday;
      end = new Date(yesterday.getTime() + 86400000 - 1);
      break;
    }
    case "MONTH":
      start = new Date(now.getFullYear(), now.getMonth(), 1);
      end = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);
      break;
    case "YEAR":
      start = new Date(now.getFullYear(), 0, 1);
      end = new Date(now.getFullYear(), 11, 31, 23, 59, 59);
      break;
    case "CUSTOM":
      if (customDate) {
        start = new Date(customDate);
        end = new Date(customDate);
      }
      break;
  }
  return { start, end };
}

function isWithinRange(dateStr: string, start: Date, end: Date): boolean {
  const d = new Date(dateStr);
  return d >= start && d <= end;
}

export default function AdminDashboard() {
  const bookings = useStore((state) => state.bookings);
  const expenses = useStore((state) => state.expenses);
  const communities = useStore((state) => state.communities);

  const [dateFilter, setDateFilter] = useState<DateFilter>("TODAY");
  const [customDate, setCustomDate] = useState("");
  const [communityFilter, setCommunityFilter] = useState("ALL");

  const { start, end } = useMemo(
    () => getDateRange(dateFilter, customDate || undefined),
    [dateFilter, customDate]
  );

  const filteredBookings = useMemo(() => {
    return bookings.filter((b) => {
      if (!isWithinRange(b.date, start, end)) return false;
      if (communityFilter !== "ALL" && b.community !== communityFilter) return false;
      return true;
    });
  }, [bookings, start, end, communityFilter]);

  const kpis = useMemo(() => {
    const todayStr = new Date().toISOString().slice(0, 10);
    const todayBookings = bookings.filter(
      (b) => b.date === todayStr && (communityFilter === "ALL" || b.community === communityFilter)
    ).length;
    const inProgress = filteredBookings.filter((b) => b.bookingStatus === "BOOKED").length;
    const completed = filteredBookings.filter((b) => b.bookingStatus === "COMPLETED").length;
    const upcoming = bookings.filter(
      (b) =>
        b.date > todayStr &&
        b.bookingStatus === "BOOKED" &&
        (communityFilter === "ALL" || b.community === communityFilter)
    ).length;
    const todayRevenue = bookings
      .filter(
        (b) =>
          b.date === todayStr &&
          b.paymentStatus === "PAID" &&
          (communityFilter === "ALL" || b.community === communityFilter)
      )
      .reduce((sum, b) => sum + b.amount, 0);
    const todayExpense = expenses
      .filter((e) => e.date === todayStr)
      .reduce((sum, e) => sum + e.amount, 0);
    const monthlyExpense = expenses
      .filter((e) => {
        const d = new Date(e.date);
        const now = new Date();
        return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
      })
      .reduce((sum, e) => sum + e.amount, 0);
    const totalRevenue = bookings
      .filter((b) => b.paymentStatus === "PAID")
      .reduce((sum, b) => sum + b.amount, 0);
    const totalExpense = expenses.reduce((sum, e) => sum + e.amount, 0);
    const netProfit = totalRevenue - totalExpense;

    return [
      { title: "Today's Bookings", value: todayBookings, icon: CalendarDays, iconColor: "text-yellow-dark", color: "text-ink" },
      { title: "In Progress", value: inProgress, icon: Clock, iconColor: "text-warning", color: "text-ink" },
      { title: "Completed", value: completed, icon: CheckCircle2, iconColor: "text-success", color: "text-ink" },
      { title: "Upcoming", value: upcoming, icon: ArrowUpRight, iconColor: "text-ink", color: "text-ink" },
      { title: "Today's Revenue", value: `₹${todayRevenue.toLocaleString('en-IN')}`, icon: IndianRupee, iconColor: "text-success", color: "text-success" },
      { title: "Today's Expense", value: `₹${todayExpense.toLocaleString('en-IN')}`, icon: ArrowDownRight, iconColor: "text-m-red", color: "text-m-red" },
      { title: "Monthly Expense", value: `₹${monthlyExpense.toLocaleString('en-IN')}`, icon: TrendingUp, iconColor: "text-muted", color: "text-ink" },
      { title: "Total Revenue", value: `₹${totalRevenue.toLocaleString('en-IN')}`, icon: Wallet, iconColor: "text-success", color: "text-success" },
      { title: "Net Profit", value: `₹${netProfit.toLocaleString('en-IN')}`, icon: Wallet, iconColor: netProfit >= 0 ? "text-success" : "text-m-red", color: netProfit >= 0 ? "text-success" : "text-m-red" },
    ];
  }, [bookings, expenses, filteredBookings, communityFilter]);

  const recentBookings = useMemo(() => {
    return [...bookings]
      .sort((a, b) => b.date.localeCompare(a.date))
      .slice(0, 5);
  }, [bookings]);

  return (
    <div className="p-6 md:p-12">
      <div className="mb-8">
        <h2 className="text-3xl font-bold uppercase tracking-normal text-ink">Dashboard</h2>
        <p className="mt-2 text-sm font-light text-body">Business overview and key metrics.</p>
      </div>

      {/* FILTER BAR */}
      <div className="mb-8 flex flex-col md:flex-row gap-4 items-start md:items-center">
        <div className="flex flex-wrap gap-2">
          {([
            { key: "TODAY", label: "Today" },
            { key: "YESTERDAY", label: "Yesterday" },
            { key: "MONTH", label: "Month" },
            { key: "YEAR", label: "Year" },
            { key: "CUSTOM", label: "Date Filter" },
          ] as { key: DateFilter; label: string }[]).map((f) => (
            <button
              key={f.key}
              onClick={() => setDateFilter(f.key)}
              className={`px-4 py-2 text-xs font-bold uppercase tracking-machined border transition-colors ${
                dateFilter === f.key
                  ? "bg-yellow-dark text-ink border-yellow-dark"
                  : "bg-surface-card text-muted border-hairline hover:text-ink hover:border-muted"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {dateFilter === "CUSTOM" && (
          <input
            type="date"
            value={customDate}
            onChange={(e) => setCustomDate(e.target.value)}
            className="bg-surface-card border border-hairline text-ink p-2 text-sm font-light focus:border-yellow-dark focus:outline-none rounded-lg"
          />
        )}

        <div className="flex items-center gap-2 ml-auto">
          <Building2 size={14} className="text-muted" />
          <select
            value={communityFilter}
            onChange={(e) => setCommunityFilter(e.target.value)}
            className="bg-surface-card border border-hairline text-ink p-2 text-sm font-light focus:border-yellow-dark focus:outline-none rounded-lg appearance-none cursor-pointer"
          >
            <option value="ALL">All Communities</option>
            {communities.map((c) => (
              <option key={c.id} value={c.name}>
                {c.name}
              </option>
            ))}
          </select>
          <ChevronDown size={14} className="text-muted -ml-3 pointer-events-none" />
        </div>
      </div>

      {/* KPI GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-4 mb-10">
        {kpis.map((kpi) => (
          <div key={kpi.title} className="border border-hairline bg-surface-card p-6 hover:bg-surface-elevated transition-colors">
            <div className="flex items-center gap-2 mb-4">
              <kpi.icon size={16} className={kpi.iconColor} />
              <p className="text-xs font-bold uppercase tracking-machined text-muted">{kpi.title}</p>
            </div>
            <p className={`text-2xl md:text-3xl font-bold ${kpi.color}`}>{kpi.value}</p>
          </div>
        ))}
      </div>

      {/* RECENT BOOKINGS */}
      <div className="border border-hairline bg-surface-card p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-sm font-bold uppercase tracking-machined text-muted">Recent Bookings</h3>
        </div>
        <div className="space-y-3">
          {recentBookings.length === 0 ? (
            <p className="text-sm font-light text-muted text-center py-4">No bookings yet.</p>
          ) : (
            recentBookings.map((b) => (
              <div key={b.id} className="flex justify-between items-center border-b border-hairline pb-3 last:border-none last:pb-0">
                <div>
                  <p className="text-sm font-bold text-ink">{b.customer}</p>
                  <p className="text-xs font-light text-muted">{b.service} · {b.vehicle}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-ink">₹{b.amount}</p>
                  <p className={`text-xs font-bold uppercase tracking-machined ${b.paymentStatus === "PAID" ? "text-success" : "text-warning"}`}>{b.paymentStatus}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
