// import { Sidebar } from "@/components/admin/Sidebar";
// import { Header } from "@/components/admin/Header";
// import { AdminShell } from "@/components/admin/AdminShell";
// export default function AdminLayout({
//   children,
// }: {
//   children: React.ReactNode;
// }) {
//   return (
//     <AdminShell>
//       {children}
//     </AdminShell>
//   );
// }


import { AdminShell } from "@/components/admin/AdminShell";
import Hydration from "@/components/Hydration"; // Import blocker

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AdminShell>
      {/* WRAP CHILDREN SO ADMIN WAIT FOR LOCALSTORAGE */}
      <Hydration>
        {children}
      </Hydration>
    </AdminShell>
  );
}