"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { CalendarDays, IndianRupee, Building2, Users, ArrowRight } from "lucide-react";
import { useStore } from "@/lib/store";

export default function AdminDashboard() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const bookings = useStore((state) => state.bookings);
  const communities = useStore((state) => state.communities);
  const expenses = useStore((state) => state.expenses);
  const staff = useStore((state) => state.staff);

  if (!mounted) return null;

  // Calculate Live KPIs
  const totalRevenue = bookings.filter(b => b.paymentStatus === "PAID").reduce((sum, b) => sum + b.amount, 0);
  const activeBookings = bookings.filter(b => b.bookingStatus === "BOOKED").length;
  const activeCommunities = communities.filter(c => c.status === "ACTIVE").length;

  const recentBookings = bookings.slice(0, 5);

  const kpiCards = [
    { title: "Total Revenue", value: `₹${totalRevenue.toLocaleString('en-IN')}`, icon: IndianRupee, color: "text-success", link: "/revenue" },
    { title: "Active Bookings", value: activeBookings, icon: CalendarDays, color: "text-m-blue-dark", link: "/bookings" },
    { title: "Communities", value: activeCommunities, icon: Building2, color: "text-ink", link: "/communities" },
    { title: "Staff Members", value: staff.length, icon: Users, color: "text-ink", link: "/staff" },
  ];

  return (
    <div className="p-12">
      <div className="mb-10">
        <h2 className="text-3xl font-bold uppercase tracking-normal text-ink">Dashboard</h2>
        <p className="mt-2 text-sm font-light text-body">Business overview and recent activity.</p>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {kpiCards.map((kpi) => (
          <Link href={kpi.link} key={kpi.title} className="border border-hairline bg-surface-card p-6 hover:bg-surface-elevated transition-colors block">
            <div className="flex items-center gap-2 text-muted mb-4">
              <kpi.icon size={16} />
              <p className="text-xs font-bold uppercase tracking-machined">{kpi.title}</p>
            </div>
            <p className={`text-3xl font-bold ${kpi.color}`}>{kpi.value}</p>
          </Link>
        ))}
      </div>

      {/* Recent Bookings */}
      <div className="border border-hairline bg-surface-card p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-sm font-bold uppercase tracking-machined text-muted">Recent Bookings</h3>
          <Link href="/bookings" className="flex items-center gap-1 text-xs font-bold uppercase tracking-machined text-m-blue-dark hover:text-m-blue-light">
            View All <ArrowRight size={12} />
          </Link>
        </div>
        
        <div className="space-y-3">
          {recentBookings.length === 0 ? (
            <p className="text-sm font-light text-muted text-center py-4">No bookings yet.</p>
          ) : (
            recentBookings.map(b => (
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