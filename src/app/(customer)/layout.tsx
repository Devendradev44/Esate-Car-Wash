import { BottomNav } from "@/components/customer/BottomNav";

export default function CustomerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col bg-canvas">
      {/* Main Content - needs padding at the bottom so it isn't hidden behind the fixed BottomNav */}
      <main className="flex-1 pb-20">
        {children}
      </main>
      
      {/* Fixed Bottom Navigation */}
      <BottomNav />
    </div>
  );
}