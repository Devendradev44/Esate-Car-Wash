export default function StaffProfile() {
  return (
    <div className="p-6 md:p-12">
      <div className="mb-10">
        <h1 className="text-2xl md:text-3xl font-bold uppercase text-ink">My Profile</h1>
      </div>

      <div className="border border-hairline bg-surface-card p-6">
        <h3 className="text-sm font-bold uppercase tracking-machined text-muted mb-6">Staff Information</h3>
        
        <div className="space-y-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-machined text-muted">Name</p>
            <p className="text-lg font-bold text-ink mt-1">Ramesh Kumar</p>
          </div>
          <div className="border-t border-hairline pt-4">
            <p className="text-xs font-bold uppercase tracking-machined text-muted">Assigned Community</p>
            <p className="text-sm font-bold text-m-red mt-1">Prestige Shantiniketan</p> {/* M-Red to match staff theme */}
          </div>
          <div className="border-t border-hairline pt-4">
            <p className="text-xs font-bold uppercase tracking-machined text-muted">Phone Number</p>
            <p className="text-sm font-light text-ink mt-1">+91 98765 43210</p>
          </div>
        </div>
      </div>
    </div>
  );
}