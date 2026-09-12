import { AuthGate } from "@/components/AuthGate";
import { StaffNav } from "@/components/staff/StaffNav";

export default function StaffLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthGate role="STAFF">
      <div className="min-h-screen bg-canvas flex flex-col">
        <main className="flex-1 pb-24">
          {children}
        </main>
        <StaffNav />
      </div>
    </AuthGate>
  );
}

