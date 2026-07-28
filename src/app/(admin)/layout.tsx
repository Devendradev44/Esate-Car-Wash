import { Sidebar } from "@/components/admin/Sidebar";
import { Header } from "@/components/admin/Header";
import { AdminShell } from "@/components/admin/AdminShell";
export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AdminShell>
      {children}
    </AdminShell>
    // <div className="flex h-screen bg-canvas">
    //   {/* Sidebar - Fixed on the left */}
    //   <Sidebar />
      
    //   {/* Main Content Area - Flex column for Header + Page */}
    //   <div className="flex flex-1 flex-col overflow-hidden">
    //     <Header />
    //     <main className="flex-1 overflow-y-auto">
    //       {children}
    //     </main>
    //   </div>
    // </div>
  );
}