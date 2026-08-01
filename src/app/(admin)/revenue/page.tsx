"use client";

import { useStore } from "@/lib/store"; // IMPORT STORE!
import { IndianRupee, TrendingUp, TrendingDown, Scale } from "lucide-react";

export default function RevenuePage() {
  // READ FROM GLOBAL STORE
  const bookings = useStore((state) => state.bookings);
  const expenses = useStore((state) => state.expenses);

  // --- DYNAMIC FINANCIAL CALCULATIONS ---
  // Calculate Revenue: Sum of PAID bookings
  const totalRevenue = bookings
    .filter(b => b.paymentStatus === "PAID")
    .reduce((sum, b) => sum + b.amount, 0);

  // Calculate Expenses: Sum of all expenses
  const totalExpenses = expenses
    .reduce((sum, e) => sum + e.amount, 0);

  // Calculate Net Profit
  const netProfit = totalRevenue - totalExpenses;
  
  // Calculate Profit Margin (Handle division by zero)
  const profitMargin = totalRevenue > 0 ? ((netProfit / totalRevenue) * 100).toFixed(1) : "0.0";

  const kpiClasses = "border border-hairline bg-surface-card p-6";
  const labelClasses = "text-xs font-bold uppercase tracking-machined text-muted mb-4";

  return (
    <div className="p-12">
      {/* Header */}
      <div className="mb-10">
        <h2 className="text-3xl font-bold uppercase tracking-normal text-ink">Revenue & P&L</h2>
        <p className="mt-2 text-sm font-light text-body">Financial overview based on bookings and operational expenses.</p>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        
        {/* Revenue Cards */}
        <div className={kpiClasses}>
          <p className={labelClasses}><IndianRupee size={14} className="inline mr-2" /> Total Revenue (Paid)</p>
          <p className="text-4xl font-bold text-success">₹{totalRevenue.toLocaleString()}</p>
          <p className="mt-2 text-xs font-bold uppercase tracking-machined text-muted">From {bookings.filter(b => b.paymentStatus === "PAID").length} paid bookings</p>
        </div>

        <div className={kpiClasses}>
          <p className={labelClasses}><IndianRupee size={14} className="inline mr-2" /> Pending Revenue</p>
          <p className="text-4xl font-bold text-warning">₹{bookings.filter(b => b.paymentStatus === "PENDING").reduce((sum, b) => sum + b.amount, 0).toLocaleString()}</p>
          <p className="mt-2 text-xs font-bold uppercase tracking-machined text-muted">From {bookings.filter(b => b.paymentStatus === "PENDING").length} pending bookings</p>
        </div>

        <div className={kpiClasses}>
          <p className={labelClasses}><TrendingDown size={14} className="inline mr-2" /> Total Expenses</p>
          <p className="text-4xl font-bold text-m-red">₹{totalExpenses.toLocaleString()}</p>
          <p className="mt-2 text-xs font-bold uppercase tracking-machined text-muted">From {expenses.length} expense entries</p>
        </div>

        <div className={kpiClasses}>
          <p className={labelClasses}><Scale size={14} className="inline mr-2" /> Net Profit / Loss</p>
          <p className={`text-4xl font-bold ${netProfit >= 0 ? "text-success" : "text-m-red"}`}>₹{netProfit.toLocaleString()}</p>
          <p className="mt-2 text-xs font-bold uppercase tracking-machined text-muted">Margin: {profitMargin}%</p>
        </div>
      </div>

      {/* Simple P&L Statement Table */}
      <div className="border border-hairline overflow-x-auto">
        <table className="w-full">
          <thead className="border-b border-hairline bg-surface-soft">
            <tr>
              <th className="py-4 px-6 text-left text-xs font-bold uppercase tracking-machined text-muted">Category</th>
              <th className="py-4 px-6 text-right text-xs font-bold uppercase tracking-machined text-muted">Amount (₹)</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-hairline bg-surface-card">
              <td className="py-4 px-6 text-sm font-bold uppercase tracking-machined text-success">Revenue (Completed Bookings)</td>
              <td className="py-4 px-6 text-sm font-bold text-success text-right">+ {totalRevenue.toLocaleString()}</td>
            </tr>
            <tr className="border-b border-hairline">
              <td className="py-4 px-6 text-sm font-bold uppercase tracking-machined text-m-red">Expenses (Operational Costs)</td>
              <td className="py-4 px-6 text-sm font-bold text-m-red text-right">- {totalExpenses.toLocaleString()}</td>
            </tr>
            <tr className="bg-surface-elevated">
              <td className="py-6 px-6 text-base font-bold uppercase tracking-machined text-ink">Net Profit / Loss</td>
              <td className={`py-6 px-6 text-base font-bold text-right ${netProfit >= 0 ? "text-success" : "text-m-red"}`}>₹{netProfit.toLocaleString()}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}