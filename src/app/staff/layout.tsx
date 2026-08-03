// import { StaffNav } from "@/components/staff/StaffNav";
// export default function StaffLayout({
//   children,
// }: {
//   children: React.ReactNode;
// }) {
//   return (
//     <div className="flex min-h-screen flex-col bg-canvas">
//       <main className="flex-1 pb-20">
//         {children}
//       </main>
//       <StaffNav />
//     </div>
//   );
// }

import { StaffNav } from "@/components/staff/StaffNav";

export default function StaffLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-canvas flex flex-col">
      <main className="flex-1 pb-24">
        {children}
      </main>
      <StaffNav />
    </div>
  );
}