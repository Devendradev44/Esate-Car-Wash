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
      <div className="flex-1 pb-20">
        {children}
      </div>
      <StaffNav />
    </div>
  );
}