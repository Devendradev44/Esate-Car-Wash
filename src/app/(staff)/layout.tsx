import { StaffNav } from "@/components/staff/StaffNav";

export default function StaffLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col bg-canvas">
      {/* Main Content - needs padding at bottom so it isn't hidden behind the fixed StaffNav */}
      <main className="flex-1 pb-20">
        {children}
      </main>
      
      {/* Fixed Bottom Navigation */}
      <StaffNav />
    </div>
  );
}