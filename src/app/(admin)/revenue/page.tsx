"use client";
import { TrendingUp, TrendingDown, Wallet } from "lucide-react";
import { useStore } from "@/lib/store";

interface CardProps {
  title: string;
  value: number;
  icon: React.ReactNode;
  iconColor: string;
  color: string;
}

const Card = ({ title, value, icon, iconColor, color }: CardProps) => (
  <div className="border border-hairline bg-surface-card p-6">
    <div className="flex items-center gap-2 mb-4">
      <span className={iconColor}>{icon}</span>
      <p className="text-xs font-bold uppercase tracking-machined">{title}</p>
    </div>
    <p className={`text-3xl font-bold ${color}`}>₹{value.toLocaleString('en-IN')}</p>
  </div>
);

export default function RevenuePage() {

  const bookings = useStore((state) => state.bookings);
  const expenses = useStore((state) => state.expenses);


  // Calculate Mock P&L
  const revenue = bookings.filter(b => b.paymentStatus === "PAID").reduce((acc, b) => acc + b.amount, 0);
  const totalExpenses = expenses.reduce((acc, e) => acc + e.amount, 0);
  const netProfit = revenue - totalExpenses;

  return (
    <div className="p-12">
      <div className="mb-10">
        <h2 className="text-3xl font-bold uppercase tracking-normal text-ink">Revenue & P&L</h2>
        <p className="mt-2 text-sm font-light text-body">Business financial overview.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <Card title="Total Revenue" value={revenue} icon={<TrendingUp size={16} />} iconColor="text-success" color="text-success" />
        <Card title="Total Expenses" value={totalExpenses} icon={<TrendingDown size={16} />} iconColor="text-m-red" color="text-m-red" />
        <Card title="Net Profit" value={netProfit} icon={<Wallet size={16} />} iconColor={netProfit >= 0 ? "text-success" : "text-m-red"} color={netProfit >= 0 ? "text-success" : "text-m-red"} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Recent Revenue */}
        <div className="border border-hairline bg-surface-soft p-6">
          <h3 className="text-sm font-bold uppercase tracking-machined text-muted mb-4">Recent Paid Bookings</h3>
          <div className="space-y-3">
            {bookings.filter(b => b.paymentStatus === "PAID").slice(0, 5).map(b => (
              <div key={b.id} className="flex justify-between items-center border-b border-hairline pb-2">
                <div>
                  <p className="text-sm font-bold text-ink">{b.customer}</p>
                  <p className="text-xs font-light text-muted">{b.service}</p>
                </div>
                <p className="text-sm font-bold text-success">+₹{b.amount}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Expenses */}
        <div className="border border-hairline bg-surface-soft p-6">
          <h3 className="text-sm font-bold uppercase tracking-machined text-muted mb-4">Recent Expenses</h3>
          <div className="space-y-3">
            {expenses.slice(0, 5).map(e => (
              <div key={e.id} className="flex justify-between items-center border-b border-hairline pb-2">
                <div>
                  <p className="text-sm font-bold text-ink">{e.name}</p>
                  <p className="text-xs font-light text-muted">{e.category}</p>
                </div>
                <p className="text-sm font-bold text-m-red">-₹{e.amount}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
