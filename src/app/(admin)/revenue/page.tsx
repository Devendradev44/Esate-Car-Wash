"use client";

import { useState } from "react";
import { IndianRupee, TrendingUp, TrendingDown, Scale } from "lucide-react";

// Mock aggregated data (Normally calculated from Bookings + Expenses DB queries)
const revenueData = {
  today: 1550,
  weekly: 10500,
  monthly: 42000,
  yearly: 504000,
};

const expenseData = {
  monthly: 19500, // Salaries + Rent + Materials
};

export default function RevenuePage() {
  // Calculate P&L
  const netProfit = revenueData.monthly - expenseData.monthly;
  const profitMargin = ((netProfit / revenueData.monthly) * 100).toFixed(1);

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
          <p className={labelClasses}><IndianRupee size={14} className="inline mr-2" /> Today's Revenue</p>
          <p className="text-4xl font-bold text-success">₹{revenueData.today.toLocaleString()}</p>
        </div>

        <div className={kpiClasses}>
          <p className={labelClasses}><IndianRupee size={14} className="inline mr-2" /> Monthly Revenue</p>
          <p className="text-4xl font-bold text-success">₹{revenueData.monthly.toLocaleString()}</p>
        </div>

        <div className={kpiClasses}>
          <p className={labelClasses}><TrendingDown size={14} className="inline mr-2" /> Monthly Expenses</p>
          <p className="text-4xl font-bold text-m-red">₹{expenseData.monthly.toLocaleString()}</p>
        </div>

        <div className={kpiClasses}>
          <p className={labelClasses}><Scale size={14} className="inline mr-2" /> Net Profit (MTD)</p>
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
              <td className="py-4 px-6 text-sm font-bold text-success text-right">+ {revenueData.monthly.toLocaleString()}</td>
            </tr>
            <tr className="border-b border-hairline">
              <td className="py-4 px-6 text-sm font-bold uppercase tracking-machined text-m-red">Expenses (Operational Costs)</td>
              <td className="py-4 px-6 text-sm font-bold text-m-red text-right">- {expenseData.monthly.toLocaleString()}</td>
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