import { CalendarPlus } from "lucide-react";

export default function CustomerDashboard() {
  return (
    <div className="px-6 pt-12">
      {/* Header */}
      <div className="mb-10">
        <p className="text-sm font-bold uppercase tracking-machined text-muted">
          Welcome back
        </p>
        <h1 className="mt-2 text-3xl font-bold uppercase text-ink">
          Rahul Sharma
        </h1>
      </div>

      {/* Upcoming Booking Card */}
      <div className="mb-8 border border-hairline bg-surface-card p-6">
        <p className="text-xs font-bold uppercase tracking-machined text-muted">
          Next Booking
        </p>
        <div className="mt-4 flex items-center justify-between">
          <div>
            <p className="text-xl font-bold text-ink">Exterior Wash</p>
            <p className="mt-1 text-sm font-light text-body">
              Toyota Fortuner · TS09AB1234
            </p>
            <p className="mt-2 text-sm font-light text-body-strong">
              Tomorrow, 10:00 AM - 12:00 PM
            </p>
          </div>
          <div className="flex h-12 w-12 items-center justify-center bg-surface-elevated text-m-blue-dark">
            <CalendarPlus size={24} />
          </div>
        </div>
      </div>

      {/* Quick Book CTA */}
      <button className="flex w-full items-center justify-center bg-m-blue-dark py-4 text-sm font-bold uppercase tracking-machined text-ink transition-colors hover:bg-m-blue-light">
        Book a Service
      </button>
    </div>
  );
}