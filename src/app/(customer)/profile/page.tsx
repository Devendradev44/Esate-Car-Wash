export default function CustomerProfile() {
  const inputClasses = "w-full bg-surface-card border border-hairline text-ink p-4 text-sm font-light focus:border-m-blue-dark focus:outline-none transition-colors appearance-none";

  return (
    <div className="p-6 md:p-12">
      <div className="mb-10">
        <h1 className="text-2xl md:text-3xl font-bold uppercase text-ink">My Profile</h1>
        <p className="mt-2 text-sm font-light text-body">Manage your personal information and addresses</p>
      </div>

      {/* Profile Info Form */}
      <div className="border border-hairline bg-surface-card p-6 mb-8">
        <h3 className="text-sm font-bold uppercase tracking-machined text-muted mb-6">Personal Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-xs font-bold uppercase tracking-machined text-muted mb-2">First Name</label>
            <input type="text" defaultValue="Rahul" className={inputClasses} />
          </div>
          <div>
            <label className="block text-xs font-bold uppercase tracking-machined text-muted mb-2">Last Name</label>
            <input type="text" defaultValue="Sharma" className={inputClasses} />
          </div>
          <div>
            <label className="block text-xs font-bold uppercase tracking-machined text-muted mb-2">Phone Number</label>
            <input type="tel" defaultValue="+91 98765 43210" className={inputClasses} disabled />
          </div>
          <div>
            <label className="block text-xs font-bold uppercase tracking-machined text-muted mb-2">Email (Optional)</label>
            <input type="email" placeholder="Not provided" className={inputClasses} />
          </div>
        </div>
        <button className="mt-6 bg-m-blue-dark px-6 py-3 text-xs font-bold uppercase tracking-machined text-ink hover:bg-m-blue-light transition-colors">Update Profile</button>
      </div>

      {/* Saved Addresses */}
      <div className="border border-hairline bg-surface-card p-6">
        <h3 className="text-sm font-bold uppercase tracking-machined text-muted mb-6">Saved Addresses</h3>
        <div className="space-y-4">
          <div className="border border-hairline bg-surface-soft p-4 flex justify-between items-center">
            <div>
              <p className="text-sm font-bold text-ink">A-401</p>
              <p className="text-xs font-light text-muted mt-1">Prestige Shantiniketan</p>
            </div>
            <span className="text-[10px] font-bold uppercase tracking-machined bg-surface-elevated px-2 py-1 text-m-blue-dark">Default</span>
          </div>
          <div className="border border-hairline bg-surface-soft p-4 flex justify-between items-center">
            <div>
              <p className="text-sm font-bold text-ink">B-1202</p>
              <p className="text-xs font-light text-muted mt-1">Sobha Halcyon</p>
            </div>
            <button className="text-xs font-bold uppercase tracking-machined text-muted hover:text-ink transition-colors">Set Default</button>
          </div>
        </div>
      </div>
    </div>
  );
}