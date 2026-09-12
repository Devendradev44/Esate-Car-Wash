import { AdminShell } from "@/components/admin/AdminShell";
import { AuthGate } from "@/components/AuthGate";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthGate role="ADMIN">
      <AdminShell>{children}</AdminShell>
    </AuthGate>
  );
}

