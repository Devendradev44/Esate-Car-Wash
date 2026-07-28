import { CalendarPlus, Car, CreditCard } from "lucide-react";

export default function CustomerDashboard() {
  return (
    <div className="p-6 md:p-12">
      {/* Header */}
      <div className="mb-10">
        <p className="text-sm font-bold uppercase tracking-machined text-muted">
          Welcome back
        </p>
        <h1 className="mt-2 text-3xl font-bold uppercase text-ink">
          Rahul Sharma
        </h1>
      </div>

      {/* Responsive Grid: 1 column on mobile, 2 columns on tablet, 3 on desktop */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        
        {/* Upcoming Booking Card */}
        <div className="border border-hairline bg-surface-card p-6 md:col-span-2 lg:col-span-2">
          <p className="text-xs font-bold uppercase tracking-machined text-muted">
            Next Booking
          </p>
          <div className="mt-4 flex items-center justify-between">
            <div>
              <p className="text-xl font-bold text-ink">Exterior Wash</p>
              <p className="mt-1 text-sm font-light text-body">
                Toyota Fortuner · TG09AB1234
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

        {/* Quick Stats Card */}
        <div className="border border-hairline bg-surface-card p-6">
          <p className="text-xs font-bold uppercase tracking-machined text-muted">Account</p>
          <div className="mt-4 space-y-4">
            <div className="flex items-center gap-3">
              <Car size={16} className="text-muted" />
              <p className="text-sm font-light text-body-strong">2 Vehicles</p>
            </div>
            <div className="flex items-center gap-3">
              <CreditCard size={16} className="text-muted" />
              <p className="text-sm font-light text-body-strong">₹1,550 Spent</p>
            </div>
          </div>
        </div>

        {/* Quick Book CTA */}
        <div className="md:col-span-2 lg:col-span-3">
          <button className="flex w-full items-center justify-center bg-m-blue-dark py-4 text-sm font-bold uppercase tracking-machined text-ink transition-colors hover:bg-m-blue-light">
            Book a Service
          </button>
        </div>
      </div>
    </div>
  );
}