export default function AdminDashboard() {
  return (
    <div className="p-12">
      {/* Page Header */}
      <div className="mb-12 border-b border-hairline pb-6">
        <h2 className="text-3xl font-bold uppercase tracking-normal text-ink">
          Dashboard
        </h2>
        <p className="mt-2 text-sm font-light text-body">
          Welcome back. Here is today&apos;s operational summary.
        </p>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
        {/* Card 1 */}
        <div className="border border-hairline bg-surface-card p-6 transition-all duration-300 hover:border-hairline-strong hover:bg-surface-soft cursor-default">
          <p className="text-xs font-bold uppercase tracking-machined text-muted">
            Today&apos;s Revenue
          </p>
          <p className="mt-4 text-4xl font-bold text-ink">₹12,450</p>
          <p className="mt-2 text-sm font-light text-body-strong">+14% vs yesterday</p>
        </div>

        {/* Card 2 */}
        <div className="border border-hairline bg-surface-card p-6 transition-all duration-300 hover:border-hairline-strong hover:bg-surface-soft cursor-default">
          <p className="text-xs font-bold uppercase tracking-machined text-muted">
            Total Bookings
          </p>
          <p className="mt-4 text-4xl font-bold text-ink">34</p>
          <p className="mt-2 text-sm font-light text-body-strong">5 pending completion</p>
        </div>

        {/* Card 3 */}
        <div className="border border-hairline bg-surface-card p-6 transition-all duration-300 hover:border-hairline-strong hover:bg-surface-soft cursor-default">
          <p className="text-xs font-bold uppercase tracking-machined text-muted">
            Active Customers
          </p>
          <p className="mt-4 text-4xl font-bold text-ink">1,204</p>
          <p className="mt-2 text-sm font-light text-body-strong">+8 new today</p>
        </div>

        {/* Card 4 */}
        <div className="border border-hairline bg-surface-card p-6 transition-all duration-300 hover:border-hairline-strong hover:bg-surface-soft cursor-default">
          <p className="text-xs font-bold uppercase tracking-machined text-muted">
            Net Profit (MTD)
          </p>
          <p className="mt-4 text-4xl font-bold text-success">₹88,200</p>
          <p className="mt-2 text-sm font-light text-body-strong">Margin: 42%</p>
        </div>
      </div>
    </div>
  );
}